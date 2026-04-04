// Bridges Stremio Web's normal HTML5 player UI to the embedded MPV player.
// It makes the page think a regular video element exists, forwards user controls to MPV,
// and feeds MPV state back into the page so the native player route still works.
import { STORAGE_KEYS } from '../../constants';
import type { EmbeddedMpvState } from '../../interfaces/EmbeddedMpv';
import { isEmbeddedMpvPlaybackMode } from '../../interfaces/ExternalPlayerTypes';
import { getLogger } from '../../utils/logger';
import { externalPlayerAPI } from '../api/externalPlayer';
import { EXIT_EMBEDDED_PLAYBACK_EVENT, isNativePlayerRouteHash } from './playbackRoutes';

const logger = getLogger('EmbeddedNativePlayerBridge');
// Private page-world bridge contract used only inside this file.
// These event and flag names are local identifiers shared between the preload code
// and the injected script created by ensurePageMediaPatch(); they are not upstream Stremio constants.
const PAGE_PATCH_STATE_EVENT = '__stremioEnhancedEmbeddedMpvState';
const PAGE_PATCH_COMMAND_EVENT = '__stremioEnhancedEmbeddedMpvCommand';
const PAGE_PATCH_INSTALL_KEY = '__stremioEnhancedEmbeddedMpvPatchInstalled';
const PAGE_PATCH_SCRIPT_ID = 'stremio-enhanced-embedded-mpv-page-patch';
const BRIDGE_SURFACE_STYLE_ID = 'stremio-enhanced-embedded-mpv-surface-style';
const BRIDGE_SURFACE_ACTIVE_ATTR = 'data-stremio-enhanced-embedded-mpv-active';
const BRIDGE_CONTROL_SURFACE_ATTR = 'data-stremio-enhanced-embedded-mpv-control-surface';
const BRIDGE_AUDIO_MENU_ATTR = 'data-stremio-enhanced-embedded-mpv-audio-menu';
const BRIDGE_AUDIO_OPTION_ATTR = 'data-stremio-enhanced-embedded-mpv-audio-option';
const BRIDGE_AUDIO_SELECTED_ATTR = 'data-stremio-enhanced-embedded-mpv-audio-selected';
const DEFAULT_SEEK_STEP_SECONDS = 10;
// Mirror the standard HTMLMediaElement readyState/networkState numeric constants so the
// injected fake video reports browser-like values back to Stremio Web.
const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_ENOUGH_DATA = 4;
const NETWORK_EMPTY = 0;
const NETWORK_IDLE = 1;
const NETWORK_LOADING = 2;
// DOM selectors and label keywords are based on Stremio Web player chrome rather than MPV.
// In practice they come from the native player route UI such as HorizontalNavBar,
// ControlBar, SideDrawerButton / SideDrawer close control, and next-video controls.
// They are fallback heuristics for DOM interception when the page still renders Stremio's UI.
const INTERACTIVE_CONTROL_SELECTOR = 'button, [role="button"], input[type="range"], [role="slider"]';
const SIDE_DRAWER_CONTROL_SELECTOR = '[class*="side-drawer-button"], [class*="side-drawer"] [class*="close-button"]';
const CONTROL_SURFACE_SELECTOR = [
    INTERACTIVE_CONTROL_SELECTOR,
    '.title-bar',
    '[aria-label]',
    '[title]',
    SIDE_DRAWER_CONTROL_SELECTOR,
].join(', ');
const EXIT_CONTROL_SELECTOR = '#back-btn, .back-button-container-lDB1N, [class*="back-button-container-"]';
const CLICKABLE_CONTROL_SELECTOR = `${INTERACTIVE_CONTROL_SELECTOR}, a[href], ${EXIT_CONTROL_SELECTOR}`;
const AUDIO_MENU_SELECTOR = '[class*="audio-menu"], [data-testid*="audio-menu"]';
const MENU_LAYER_SELECTOR = '[role="dialog"], [class*="menu-layer"], [class*="side-drawer"]';
const AUDIO_MENU_OPTION_SELECTOR = [
    'button',
    '[role="button"]',
    '[role="menuitem"]',
    '[aria-selected]',
    '[aria-checked]',
    '[data-id]',
    '[data-index]',
    '[data-value]',
    'li',
].join(', ');
const SEEK_CONTROL_KEYWORDS = ['seek', 'progress', 'timeline', 'scrub', 'position', 'playback'];
const VOLUME_CONTROL_KEYWORDS = ['volume'];
const PLAY_KEYWORDS = ['play'];
const PAUSE_KEYWORDS = ['pause'];
const EXIT_KEYWORDS = ['back', 'go back'];
const EXIT_PREFIX_KEYWORDS = ['back to'];
const FORWARD_KEYWORDS = ['forward', 'ahead', 'next', 'skip'];
const BACKWARD_KEYWORDS = ['rewind', 'backward', 'back', 'previous', 'replay'];
const SKIP_CONTENT_KEYWORDS = ['intro', 'opening', 'credits', 'recap', 'outro'];
const FULLSCREEN_KEYWORDS = ['fullscreen', 'enter fullscreen', 'exit fullscreen'];
const PREFERRED_AUDIO_SETTING_KEY = 'audioLanguage';
const EMBEDDED_TRACK_ID_PREFIX = 'EMBEDDED_';
const PLAYER_AUDIO_TRACK_SYNC_EVENT_PREFIX = '__stremioEnhancedEmbeddedMpvPlayerAudioSync';

type SliderMetrics = {
    value: number;
    min: number;
    max: number;
};

type EmbeddedMpvAudioTrack = EmbeddedMpvState['audioTracks'][number];

type ControlAction =
    | { type: 'play' }
    | { type: 'pause' }
    | { type: 'exit' }
    | { type: 'next-video' }
    | { type: 'seek'; value: number; mode: 'relative' | 'absolute' }
    | { type: 'volume'; value: number }
    | { type: 'audio-track'; value: number | null }
    | { type: 'fullscreen'; value: boolean };

type VideoStyleSnapshot = {
    display: string;
    opacity: string;
    pointerEvents: string;
    background: string;
    backgroundColor: string;
    backgroundImage: string;
    visibility: string;
    boxShadow: string;
    backdropFilter: string;
    filter: string;
};

type BridgedSurfaceElement = {
    element: HTMLElement;
    style: VideoStyleSnapshot;
};

let bridgePrepared = false;
let currentState: EmbeddedMpvState | null = null;
let stateSubscription: (() => void) | null = null;
let domObserver: MutationObserver | null = null;
let bridgedVideo: HTMLVideoElement | null = null;
let bridgedSurfaceElements: BridgedSurfaceElement[] = [];
let clickInterceptor: ((event: MouseEvent) => void) | null = null;
let sliderInterceptor: ((event: Event) => void) | null = null;
let keyboardInterceptor: ((event: KeyboardEvent) => void) | null = null;
let pageCommandListenerInstalled = false;
let muted = false;
let lastNonZeroVolume = 100;
let forceEnded = false;
let lastAppliedPreferredAudioSignature: string | null = null;
let pendingAudioTrackId: number | null = null;
let lastSeenAudioTracks: EmbeddedMpvState['audioTracks'] | null = null;
let cachedDisplayNames: Intl.DisplayNames | null = null;
let lastSyncedPlayerAudioTrackId: string | null | undefined;
let pendingPlayerAudioTrackSyncId: string | null = null;
let nextPlayerAudioTrackSyncSequence = 0;

// Installs the CSS that hides the page's native video surface and leaves bridge-managed controls visible.
function ensureBridgeSurfaceStyle(): void {
    if (document.getElementById(BRIDGE_SURFACE_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = BRIDGE_SURFACE_STYLE_ID;
    style.textContent = `
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"],
        body[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child .route-content,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child .route-content > *,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child *::before,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child *::after {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            filter: none !important;
            text-shadow: none !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child *,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child *::before,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child *::after {
            visibility: hidden !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child [${BRIDGE_CONTROL_SURFACE_ATTR}="true"],
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child [${BRIDGE_CONTROL_SURFACE_ATTR}="true"] *,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child .title-bar,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child .title-bar * {
            visibility: visible !important;
            pointer-events: auto !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child video,
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child canvas {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            background: transparent !important;
            background-color: transparent !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child [aria-busy="true"],
        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] .route-container:last-child [role="progressbar"] {
            display: none !important;
            visibility: hidden !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] [${BRIDGE_AUDIO_MENU_ATTR}="true"] [${BRIDGE_AUDIO_OPTION_ATTR}="true"] [class*="icon"] {
            display: none !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] [${BRIDGE_AUDIO_MENU_ATTR}="true"] [${BRIDGE_AUDIO_OPTION_ATTR}="true"].selected:not([${BRIDGE_AUDIO_SELECTED_ATTR}="true"]) {
            background-color: transparent !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] [${BRIDGE_AUDIO_MENU_ATTR}="true"] [${BRIDGE_AUDIO_OPTION_ATTR}="true"][${BRIDGE_AUDIO_SELECTED_ATTR}="true"] {
            background-color: var(--overlay-color, rgba(255, 255, 255, 0.14)) !important;
        }

        html[${BRIDGE_SURFACE_ACTIVE_ATTR}="true"] [${BRIDGE_AUDIO_MENU_ATTR}="true"] [${BRIDGE_AUDIO_OPTION_ATTR}="true"][${BRIDGE_AUDIO_SELECTED_ATTR}="true"]::after {
            content: '';
            flex: none;
            width: 0.5rem;
            height: 0.5rem;
            margin-left: auto;
            border-radius: 100%;
            background-color: var(--secondary-accent-color, #1dd760);
        }
    `;

    (document.head ?? document.documentElement).appendChild(style);
}

function updateBridgeSurfaceState(): void {
    const active = bridgePrepared && isBridgeEnabledForCurrentRoute() && Boolean(currentState?.active);
    ensureBridgeSurfaceStyle();
    document.documentElement.setAttribute(BRIDGE_SURFACE_ACTIVE_ATTR, active ? 'true' : 'false');
    document.body?.setAttribute(BRIDGE_SURFACE_ACTIVE_ATTR, active ? 'true' : 'false');
}

function clearControlSurfaceMarkers(): void {
    const routeRoot = document.querySelector('.route-container:last-child');
    if (!(routeRoot instanceof HTMLElement)) {
        return;
    }

    for (const element of routeRoot.querySelectorAll<HTMLElement>(`[${BRIDGE_CONTROL_SURFACE_ATTR}="true"]`)) {
        element.removeAttribute(BRIDGE_CONTROL_SURFACE_ATTR);
    }
}

function markControlSurfaceElements(): void {
    const routeRoot = document.querySelector('.route-container:last-child');
    if (!(routeRoot instanceof HTMLElement)) {
        return;
    }

    clearControlSurfaceMarkers();

    const controlSelectors = CONTROL_SURFACE_SELECTOR;

    for (const candidate of routeRoot.querySelectorAll<HTMLElement>(controlSelectors)) {
        if (!(candidate instanceof HTMLElement)) {
            continue;
        }

        const isControl = candidate.matches(INTERACTIVE_CONTROL_SELECTOR)
            || candidate.closest(INTERACTIVE_CONTROL_SELECTOR) !== null
            || candidate.closest('.title-bar') !== null
            || candidate.matches(SIDE_DRAWER_CONTROL_SELECTOR);
        const hasControlDescendant = candidate.querySelector(INTERACTIVE_CONTROL_SELECTOR) !== null;
        const label = getElementLabel(candidate);
        const looksControlLike = hasKeyword(label, SEEK_CONTROL_KEYWORDS)
            || hasKeyword(label, VOLUME_CONTROL_KEYWORDS)
            || hasKeyword(label, PLAY_KEYWORDS)
            || hasKeyword(label, PAUSE_KEYWORDS)
            || hasKeyword(label, FORWARD_KEYWORDS)
            || hasKeyword(label, BACKWARD_KEYWORDS)
            || hasKeyword(label, FULLSCREEN_KEYWORDS);

        if (!isControl && !hasControlDescendant && !looksControlLike) {
            continue;
        }

        let current: HTMLElement | null = candidate;
        while (current && current !== routeRoot) {
            current.setAttribute(BRIDGE_CONTROL_SURFACE_ATTR, 'true');
            current = current.parentElement;
        }
    }

    routeRoot.setAttribute(BRIDGE_CONTROL_SURFACE_ATTR, 'true');
}

function isBridgeEnabledForCurrentRoute(): boolean {
    return isEmbeddedMpvPlaybackMode(localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE)) && isNativePlayerRouteHash();
}

function normalizeText(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getProfileSettings(): Record<string, unknown> | null {
    try {
        const rawProfile = localStorage.getItem('profile');
        if (!rawProfile) {
            return null;
        }

        const profile = JSON.parse(rawProfile) as { settings?: Record<string, unknown> };
        return profile && typeof profile === 'object' && profile.settings && typeof profile.settings === 'object'
            ? profile.settings
            : null;
    } catch {
        return null;
    }
}

function getPreferredAudioPreference(): string | null {
    const settings = getProfileSettings();
    if (!settings) {
        return null;
    }

    const value = settings[PREFERRED_AUDIO_SETTING_KEY];
    return typeof value === 'string' && normalizeText(value) ? value : null;
}

function getLanguageDisplayNames(): Intl.DisplayNames | null {
    if (cachedDisplayNames === null && typeof Intl.DisplayNames === 'function') {
        try {
            cachedDisplayNames = new Intl.DisplayNames(['en'], { type: 'language' });
        } catch {
            // Ignore missing language display support.
        }
    }

    return cachedDisplayNames;
}

function collectLanguageIdentifiers(value: string | null | undefined): Set<string> {
    const identifiers = new Set<string>();
    const addIdentifier = (candidate: string | null | undefined): void => {
        const normalizedCandidate = normalizeText(candidate);
        if (!normalizedCandidate) {
            return;
        }

        identifiers.add(normalizedCandidate);
    };

    const normalizedValue = normalizeText(value);
    if (!normalizedValue) {
        return identifiers;
    }

    addIdentifier(normalizedValue);
    addIdentifier(normalizedValue.split(/[-_]/)[0]);

    if (typeof Intl.getCanonicalLocales === 'function') {
        try {
            for (const locale of Intl.getCanonicalLocales(String(value).replace(/_/g, '-'))) {
                addIdentifier(locale);
                addIdentifier(locale.split('-')[0]);
            }
        } catch {
            // Ignore invalid locale identifiers.
        }
    }

    const displayNames = getLanguageDisplayNames();
    if (displayNames) {
        for (const identifier of Array.from(identifiers)) {
            try {
                addIdentifier(displayNames.of(identifier));
            } catch {
                // Ignore values that are not valid language identifiers.
            }
        }
    }

    return identifiers;
}

function hasSharedLanguageIdentifier(left: string | null | undefined, right: string | null | undefined): boolean {
    const leftIdentifiers = collectLanguageIdentifiers(left);
    if (leftIdentifiers.size === 0) {
        return false;
    }

    const rightIdentifiers = collectLanguageIdentifiers(right);
    for (const identifier of leftIdentifiers) {
        if (rightIdentifiers.has(identifier)) {
            return true;
        }
    }

    return false;
}

function findMatchingAudioTrack(matchText: string, tracks: EmbeddedMpvAudioTrack[]): EmbeddedMpvAudioTrack | null {
    const normalizedMatchText = normalizeText(matchText);
    if (!normalizedMatchText) {
        return null;
    }

    for (const track of tracks) {
        if (normalizeText(track.label) === normalizedMatchText) {
            return track;
        }
    }

    for (const track of tracks) {
        if (hasSharedLanguageIdentifier(matchText, track.language)) {
            return track;
        }
    }

    return null;
}

function buildAudioTrackSignature(state: EmbeddedMpvState, preference: string | null): string {
    const tracksSignature = state.audioTracks
        .map((track) => `${track.id}:${normalizeText(track.language)}:${normalizeText(track.label)}`)
        .join('|');

    return `${state.title}|${tracksSignature}|${normalizeText(preference)}`;
}

function resolveEffectiveAudioTrackId(state: EmbeddedMpvState | null): number | null {
    if (pendingAudioTrackId !== null) {
        return pendingAudioTrackId;
    }

    return state?.currentAudioTrackId ?? null;
}

function findAudioTrackIndexById(trackId: number | null | undefined, state: EmbeddedMpvState | null): number | null {
    if (typeof trackId !== 'number' || !Number.isInteger(trackId) || !state?.audioTracks.length) {
        return null;
    }

    const trackIndex = state.audioTracks.findIndex((track) => track.id === trackId);
    return trackIndex >= 0 ? trackIndex : null;
}

function toEmbeddedTrackId(trackIndex: number | null | undefined): string | null {
    return typeof trackIndex === 'number' && Number.isInteger(trackIndex) && trackIndex >= 0
        ? `${EMBEDDED_TRACK_ID_PREFIX}${trackIndex}`
        : null;
}

function parseAudioTrackIdReference(value: string | null | undefined): number | null | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return undefined;
    }

    const embeddedMatch = trimmedValue.match(/^embedded_(\d+)$/i);
    if (embeddedMatch) {
        const embeddedTrackId = Number(embeddedMatch[1]);
        return Number.isInteger(embeddedTrackId)
            ? embeddedTrackId
            : undefined;
    }

    const numericValue = Number(trimmedValue);
    return Number.isInteger(numericValue)
        ? numericValue
        : undefined;
}

function coerceAudioTrackCommandValue(value: unknown): number | null | undefined {
    if (value === null) {
        return null;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return undefined;
    }

    if (/^embedded_/i.test(trimmedValue)) {
        const trackIndex = parseAudioTrackIdReference(trimmedValue);
        return typeof trackIndex === 'number'
            ? currentState?.audioTracks[trackIndex]?.id
            : undefined;
    }

    return parseAudioTrackIdReference(trimmedValue);
}

function dispatchPlayerAudioTrackSync(trackId: string | null): Promise<boolean> {
    return new Promise((resolve) => {
        nextPlayerAudioTrackSyncSequence += 1;
        const resultEventName = `${PLAYER_AUDIO_TRACK_SYNC_EVENT_PREFIX}_${nextPlayerAudioTrackSyncSequence}`;
        const script = document.createElement('script');

        const handleResult = (event: Event): void => {
            script.remove();
            const detail = (event as CustomEvent<{ success?: boolean }>).detail;
            resolve(Boolean(detail?.success));
        };

        window.addEventListener(resultEventName, handleResult, { once: true });
        script.textContent = `(async () => {
            const emitResult = (success) => {
                window.dispatchEvent(new CustomEvent(${JSON.stringify(resultEventName)}, { detail: { success } }));
            };

            try {
                const services = window.services;
                const transport = services && services.core && services.core.transport;
                if (!transport || typeof transport.getState !== 'function' || typeof transport.dispatch !== 'function') {
                    emitResult(false);
                    return;
                }

                const player = await transport.getState('player');
                const streamState = player && typeof player === 'object' && player.streamState && typeof player.streamState === 'object'
                    ? player.streamState
                    : {};
                const currentAudioTrackId = streamState && streamState.audioTrack && typeof streamState.audioTrack === 'object' && typeof streamState.audioTrack.id === 'string'
                    ? streamState.audioTrack.id
                    : null;

                if (currentAudioTrackId === ${JSON.stringify(trackId)}) {
                    emitResult(true);
                    return;
                }

                await transport.dispatch({
                    action: 'Player',
                    args: {
                        action: 'StreamStateChanged',
                        args: {
                            state: {
                                ...streamState,
                                audioTrack: ${trackId === null ? 'null' : `{ id: ${JSON.stringify(trackId)} }`},
                            },
                        },
                    },
                }, 'player');

                emitResult(true);
            } catch {
                emitResult(false);
            }
        })();`;

        (document.head ?? document.documentElement).appendChild(script);
    });
}

function syncPlayerAudioTrackState(trackId: number | null): void {
    if (!bridgePrepared || !isBridgeEnabledForCurrentRoute() || !currentState?.active) {
        return;
    }

    const embeddedTrackId = toEmbeddedTrackId(findAudioTrackIndexById(trackId, currentState));
    if (!embeddedTrackId) {
        return;
    }

    if (lastSyncedPlayerAudioTrackId === embeddedTrackId || pendingPlayerAudioTrackSyncId === embeddedTrackId) {
        return;
    }

    pendingPlayerAudioTrackSyncId = embeddedTrackId;
    void dispatchPlayerAudioTrackSync(embeddedTrackId).then((success) => {
        if (pendingPlayerAudioTrackSyncId !== embeddedTrackId) {
            return;
        }

        pendingPlayerAudioTrackSyncId = null;
        if (success) {
            lastSyncedPlayerAudioTrackId = embeddedTrackId;
        }
    });
}

function resetPlayerAudioTrackStateForPreferredAudio(): void {
    if (!bridgePrepared || !isBridgeEnabledForCurrentRoute() || !getPreferredAudioPreference()) {
        return;
    }

    if (lastSyncedPlayerAudioTrackId === null && pendingPlayerAudioTrackSyncId === null) {
        return;
    }

    pendingPlayerAudioTrackSyncId = null;
    void dispatchPlayerAudioTrackSync(null).then((success) => {
        if (pendingPlayerAudioTrackSyncId !== null) {
            return;
        }

        if (success) {
            lastSyncedPlayerAudioTrackId = null;
        }
    });
}

function reconcilePendingAudioTrackSelection(state: EmbeddedMpvState | null): void {
    if (pendingAudioTrackId === null) {
        return;
    }

    if (!state?.active || state.loading || state.audioTracks.length === 0) {
        return;
    }

    const pendingTrackStillExists = state.audioTracks.some((track) => track.id === pendingAudioTrackId);
    const pendingTrackSelected = state.currentAudioTrackId === pendingAudioTrackId
        || state.audioTracks.some((track) => track.id === pendingAudioTrackId && track.selected);

    if (!pendingTrackStillExists || pendingTrackSelected) {
        setPendingAudioTrackSelection(null);
    }
}

function setPendingAudioTrackSelection(trackId: number | null): void {
    pendingAudioTrackId = trackId;
}

function maybeApplyPreferredAudioTrack(state: EmbeddedMpvState | null): void {
    if (!state?.active || !state.connected || state.loading || state.audioTracks.length === 0) {
        lastAppliedPreferredAudioSignature = null;
        return;
    }

    const preference = getPreferredAudioPreference();
    const signature = buildAudioTrackSignature(state, preference);
    if (signature === lastAppliedPreferredAudioSignature) {
        return;
    }

    lastAppliedPreferredAudioSignature = signature;
    if (!preference) {
        return;
    }

    const preferredTrack = findMatchingAudioTrack(preference, state.audioTracks);
    if (!preferredTrack || preferredTrack.id === state.currentAudioTrackId) {
        return;
    }

    logger.info(`Selecting preferred embedded audio track "${preferredTrack.label}" for preference "${preference}"`);
    setPendingAudioTrackSelection(preferredTrack.id);
    void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-audio-track', value: preferredTrack.id });
}

function getElementLabel(element: Element, includeParentContext: boolean = true): string {
    const node = element as HTMLElement;
    const tokens = [
        node.getAttribute('aria-label'),
        node.getAttribute('title'),
        node.getAttribute('name'),
        node.getAttribute('data-action'),
        node.getAttribute('data-testid'),
        node.getAttribute('aria-valuetext'),
        node.textContent,
        node.innerText,
    ];

    const labelledBy = node.getAttribute('aria-labelledby');
    if (labelledBy) {
        for (const id of labelledBy.split(/\s+/)) {
            const labelNode = document.getElementById(id);
            if (labelNode?.textContent) {
                tokens.push(labelNode.textContent);
            }
        }
    }

    const parent = node.parentElement;
    if (includeParentContext && parent) {
        tokens.push(parent.getAttribute('aria-label'));
        const parentText = parent.textContent;
        if (parentText && parentText.length < 120) {
            tokens.push(parentText);
        }
    }

    return normalizeText(tokens.filter((token): token is string => Boolean(token)).join(' '));
}

function hasKeyword(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
}

function isAudioMenuSelectionElement(element: HTMLElement): boolean {
    if (element.closest(AUDIO_MENU_SELECTOR)) {
        return true;
    }

    const menuLayer = element.closest<HTMLElement>(MENU_LAYER_SELECTOR);
    if (!menuLayer) {
        return false;
    }

    const menuLayerLabel = getElementLabel(menuLayer, false);
    if (menuLayerLabel.includes('audio')) {
        return true;
    }

    const audioMarker = menuLayer.querySelector<HTMLElement>('[aria-label*="audio" i], [title*="audio" i], [data-testid*="audio" i]');
    return Boolean(audioMarker && getElementLabel(audioMarker, false).includes('audio'));
}

function resolveAudioMenuOptionElement(element: HTMLElement, menuRoot: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element;

    while (current && current !== menuRoot) {
        if (current.matches(AUDIO_MENU_OPTION_SELECTOR)) {
            return current;
        }

        const label = getElementLabel(current, false);
        if (label && current.parentElement === menuRoot) {
            return current;
        }

        current = current.parentElement;
    }

    return null;
}

function resolveAudioTrackReference(value: string | null | undefined): EmbeddedMpvAudioTrack | null {
    if (!currentState?.audioTracks.length || typeof value !== 'string') {
        return null;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    if (/^embedded_/i.test(trimmedValue)) {
        const trackIndex = parseAudioTrackIdReference(trimmedValue);
        return typeof trackIndex === 'number'
            ? currentState.audioTracks[trackIndex] ?? null
            : null;
    }

    const referencedTrackId = parseAudioTrackIdReference(trimmedValue);
    if (typeof referencedTrackId === 'number') {
        const directTrack = currentState.audioTracks.find((track) => track.id === referencedTrackId);
        if (directTrack) {
            return directTrack;
        }
    }

    const numericValue = Number(trimmedValue);
    if (!Number.isFinite(numericValue)) {
        return null;
    }

    const directTrack = currentState.audioTracks.find((track) => track.id === numericValue);
    if (directTrack) {
        return directTrack;
    }

    return Number.isInteger(numericValue)
        ? currentState.audioTracks[numericValue] ?? null
        : null;
}

function findAudioTrackByMenuMetadata(element: HTMLElement): EmbeddedMpvAudioTrack | null {
    const attributeValues = [
        element.getAttribute('data-id'),
        element.getAttribute('data-index'),
        element.getAttribute('data-value'),
        element.getAttribute('value'),
        element.getAttribute('aria-controls'),
        element.getAttribute('for'),
    ];

    for (const value of Object.values(element.dataset)) {
        attributeValues.push(typeof value === 'string' ? value : null);
    }

    for (const value of attributeValues) {
        const track = resolveAudioTrackReference(value);
        if (track) {
            return track;
        }
    }

    return null;
}

function isAudioMenuOptionCandidate(element: HTMLElement, menuRoot: HTMLElement): boolean {
    if (element === menuRoot || !menuRoot.contains(element)) {
        return false;
    }

    if (findAudioTrackByMenuMetadata(element)) {
        return true;
    }

    const label = getElementLabel(element, false);
    if (!label) {
        return false;
    }

    if (label === 'audio' || label === 'audio tracks' || label === 'audio track') {
        return false;
    }

    if (label.includes('close') || label.includes('back')) {
        return false;
    }

    return true;
}

function getAudioMenuOptionElements(menuRoot: HTMLElement): HTMLElement[] {
    const options: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();
    const candidates = menuRoot.querySelectorAll<HTMLElement>(AUDIO_MENU_OPTION_SELECTOR);

    for (const candidate of candidates) {
        const option = resolveAudioMenuOptionElement(candidate, menuRoot);
        if (!option || seen.has(option) || !isAudioMenuOptionCandidate(option, menuRoot)) {
            continue;
        }

        seen.add(option);
        options.push(option);
    }

    if (options.length > 0) {
        return options;
    }

    for (const candidate of Array.from(menuRoot.children)) {
        if (!(candidate instanceof HTMLElement) || seen.has(candidate) || !isAudioMenuOptionCandidate(candidate, menuRoot)) {
            continue;
        }

        seen.add(candidate);
        options.push(candidate);
    }

    return options;
}

function clearAudioMenuSelectionMarkers(): void {
    const scope = document.querySelector('.route-container:last-child') ?? document;

    for (const element of scope.querySelectorAll<HTMLElement>(`[${BRIDGE_AUDIO_MENU_ATTR}="true"]`)) {
        element.removeAttribute(BRIDGE_AUDIO_MENU_ATTR);
    }

    for (const element of scope.querySelectorAll<HTMLElement>(`[${BRIDGE_AUDIO_OPTION_ATTR}="true"]`)) {
        element.removeAttribute(BRIDGE_AUDIO_OPTION_ATTR);
        element.removeAttribute(BRIDGE_AUDIO_SELECTED_ATTR);
    }
}

function syncAudioMenuSelection(): void {
    clearAudioMenuSelectionMarkers();

    if (!bridgePrepared || !isBridgeEnabledForCurrentRoute() || !currentState?.active) {
        return;
    }

    const effectiveTrackIndex = findAudioTrackIndexById(resolveEffectiveAudioTrackId(currentState), currentState);
    if (effectiveTrackIndex === null) {
        return;
    }

    for (const menuRoot of document.querySelectorAll<HTMLElement>(AUDIO_MENU_SELECTOR)) {
        const options = Array.from(menuRoot.querySelectorAll<HTMLElement>('button[data-id]'));
        if (options.length === 0) {
            continue;
        }

        const effectiveTrackId = toEmbeddedTrackId(effectiveTrackIndex);
        const activeOption = effectiveTrackId
            ? options.find((option) => option.getAttribute('data-id') === effectiveTrackId) ?? null
            : null;
        if (!activeOption) {
            continue;
        }

        menuRoot.setAttribute(BRIDGE_AUDIO_MENU_ATTR, 'true');
        for (const option of options) {
            option.setAttribute(BRIDGE_AUDIO_OPTION_ATTR, 'true');
            if (option === activeOption) {
                option.setAttribute(BRIDGE_AUDIO_SELECTED_ATTR, 'true');
            }
        }
    }
}

function getAudioTrackAction(element: HTMLElement): ControlAction | null {
    if (!currentState?.audioTracks.length || !isAudioMenuSelectionElement(element)) {
        return null;
    }

    const menuRoot = element.closest<HTMLElement>(AUDIO_MENU_SELECTOR)
        ?? element.closest<HTMLElement>(MENU_LAYER_SELECTOR);
    if (!menuRoot) {
        return null;
    }

    const optionElement = resolveAudioMenuOptionElement(element, menuRoot);
    if (optionElement) {
        const metadataTrack = findAudioTrackByMenuMetadata(optionElement);
        const indexedTrack = (() => {
            const options = getAudioMenuOptionElements(menuRoot);
            const optionIndex = options.indexOf(optionElement);
            return optionIndex >= 0 ? currentState.audioTracks[optionIndex] ?? null : null;
        })();

        const popupTrack = metadataTrack ?? indexedTrack;
        if (popupTrack) {
            return popupTrack.id === currentState.currentAudioTrackId
                ? null
                : { type: 'audio-track', value: popupTrack.id };
        }
    }

    let current: HTMLElement | null = element;

    while (current && current !== menuRoot) {
        const label = getElementLabel(current, false);
        if (label) {
            const matchingTrack = findMatchingAudioTrack(label, currentState.audioTracks);
            if (matchingTrack) {
                if (matchingTrack.id === currentState.currentAudioTrackId) {
                    return null;
                }

                return { type: 'audio-track', value: matchingTrack.id };
            }
        }

        current = current.parentElement;
    }

    return null;
}

function parseSeekSeconds(text: string): number {
    const secondMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:sec|secs|second|seconds|s)\b/);
    if (secondMatch) {
        return Number(secondMatch[1]);
    }

    const minuteMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:min|mins|minute|minutes|m)\b/);
    if (minuteMatch) {
        return Number(minuteMatch[1]) * 60;
    }

    const standaloneNumber = text.match(/\b(\d{1,3})\b/);
    if (standaloneNumber) {
        return Number(standaloneNumber[1]);
    }

    return DEFAULT_SEEK_STEP_SECONDS;
}

function readSliderMetrics(element: HTMLElement): SliderMetrics | null {
    if (element instanceof HTMLInputElement && element.type === 'range') {
        const value = Number(element.value);
        const min = Number(element.min || '0');
        const max = Number(element.max || '100');
        if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
            return null;
        }

        return { value, min, max };
    }

    if (element.getAttribute('role') === 'slider') {
        const value = Number(element.getAttribute('aria-valuenow'));
        const min = Number(element.getAttribute('aria-valuemin') ?? '0');
        const max = Number(element.getAttribute('aria-valuemax') ?? '100');
        if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
            return null;
        }

        return { value, min, max };
    }

    return null;
}

// Stremio sliders are not consistent: some expose absolute seconds, others expose a normalized range.
function getSliderTargetTime(metrics: SliderMetrics): number | null {
    const duration = currentState?.duration ?? 0;
    const span = metrics.max - metrics.min;
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(span) || span <= 0) {
        return null;
    }

    if (Math.abs(metrics.max - duration) <= Math.max(5, duration * 0.05) && metrics.min === 0) {
        return Math.max(0, Math.min(duration, metrics.value));
    }

    const ratio = Math.max(0, Math.min(1, (metrics.value - metrics.min) / span));
    return duration * ratio;
}

function getSliderVolume(metrics: SliderMetrics): number | null {
    const span = metrics.max - metrics.min;
    if (!Number.isFinite(span) || span <= 0) {
        return null;
    }

    if (metrics.max <= 1 && metrics.min >= 0) {
        return Math.round(Math.max(0, Math.min(1, metrics.value)) * 100);
    }

    if (metrics.max === 100 && metrics.min === 0) {
        return Math.round(Math.max(0, Math.min(100, metrics.value)));
    }

    const ratio = Math.max(0, Math.min(1, (metrics.value - metrics.min) / span));
    return Math.round(ratio * 100);
}

// Forward-like labels can mean three different things in Stremio's UI: seek, skip-intro/credits, or next video.
function getControlAction(element: HTMLElement): ControlAction | null {
    if (element.matches(EXIT_CONTROL_SELECTOR) || element.closest(EXIT_CONTROL_SELECTOR)) {
        return { type: 'exit' };
    }

    const label = getElementLabel(element, false);
    if (!label) {
        return null;
    }

    if (hasKeyword(label, PAUSE_KEYWORDS)) {
        return { type: 'pause' };
    }

    if (hasKeyword(label, PLAY_KEYWORDS)) {
        return { type: 'play' };
    }

    if (
        !element.closest('.title-bar')
        && !label.includes('seek')
        && !label.includes('rewind')
        && !label.includes('replay')
        && (EXIT_KEYWORDS.includes(label) || EXIT_PREFIX_KEYWORDS.some((keyword) => label.startsWith(`${keyword} `)))
    ) {
        return { type: 'exit' };
    }

    if (hasKeyword(label, FORWARD_KEYWORDS)) {
        if (label.includes('forward') || label.includes('ahead') || hasKeyword(label, SEEK_CONTROL_KEYWORDS) || /\d/.test(label)) {
            return { type: 'seek', value: parseSeekSeconds(label), mode: 'relative' };
        }

        if (hasKeyword(label, SKIP_CONTENT_KEYWORDS)) {
            return null;
        }

        return { type: 'next-video' };
    }

    if ((label.includes('seek') && hasKeyword(label, BACKWARD_KEYWORDS)) || label.includes('rewind') || label.includes('replay')) {
        return { type: 'seek', value: -parseSeekSeconds(label), mode: 'relative' };
    }

    return null;
}

function getSliderAction(element: HTMLElement): ControlAction | null {
    const metrics = readSliderMetrics(element);
    if (!metrics) {
        return null;
    }

    const label = getElementLabel(element, false);
    if (hasKeyword(label, VOLUME_CONTROL_KEYWORDS)) {
        const volume = getSliderVolume(metrics);
        return volume == null ? null : { type: 'volume', value: volume };
    }

    const targetTime = getSliderTargetTime(metrics);
    if (targetTime == null) {
        return null;
    }

    if (hasKeyword(label, SEEK_CONTROL_KEYWORDS) || !hasKeyword(label, VOLUME_CONTROL_KEYWORDS)) {
        return { type: 'seek', value: targetTime, mode: 'absolute' };
    }

    return null;
}

function triggerVideoEndedForAutoAdvance(): void {
    forceEnded = true;
    syncBridgeState();
    void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'stop' });
}

function executeControlAction(action: ControlAction): void {
    switch (action.type) {
        case 'play':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'play' });
            break;
        case 'pause':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'pause' });
            break;
        case 'exit':
            window.dispatchEvent(new CustomEvent(EXIT_EMBEDDED_PLAYBACK_EVENT));
            break;
        case 'next-video':
            triggerVideoEndedForAutoAdvance();
            break;
        case 'seek':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'seek', value: action.value, mode: action.mode });
            break;
        case 'volume':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-volume', value: action.value });
            break;
        case 'audio-track':
            setPendingAudioTrackSelection(action.value);
            syncBridgeState();
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-audio-track', value: action.value });
            break;
        case 'fullscreen':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-fullscreen', value: action.value });
            break;
        default:
            break;
    }
}

function shouldHandleInteractions(): boolean {
    return bridgePrepared && isBridgeEnabledForCurrentRoute() && Boolean(currentState?.active) && Boolean(currentState?.connected);
}

function shouldIgnoreKeyboardTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || target.isContentEditable;
}

function hasShortcutModifier(event: KeyboardEvent): boolean {
    return event.altKey || event.ctrlKey || event.metaKey;
}

function getApproxVideoDimensions(): { videoWidth: number; videoHeight: number } {
    const video = document.querySelector('video');
    if (video instanceof HTMLVideoElement) {
        const width = video.clientWidth || video.videoWidth || window.innerWidth || 1280;
        const height = video.clientHeight || video.videoHeight || window.innerHeight || 720;
        return {
            videoWidth: Math.max(1, Math.round(width)),
            videoHeight: Math.max(1, Math.round(height)),
        };
    }

    return {
        videoWidth: Math.max(1, Math.round(window.innerWidth || 1280)),
        videoHeight: Math.max(1, Math.round(window.innerHeight || 720)),
    };
}

function buildPagePatchState(state: EmbeddedMpvState | null) {
    const fileLoaded = Boolean(
        state?.active && (
            (state.connected && !state.loading)
            || (state.duration ?? 0) > 0
            || (state.timePos ?? 0) > 0
        ),
    );
    const dimensions = getApproxVideoDimensions();
    const effectiveAudioTrackId = resolveEffectiveAudioTrackId(state);
    const effectiveAudioTrackIndex = findAudioTrackIndexById(effectiveAudioTrackId, state);

    return {
        active: Boolean(state?.active && (state?.connected || state?.loading) && isBridgeEnabledForCurrentRoute()),
        fileLoaded,
        fullscreen: Boolean(state?.fullscreen),
        currentTime: state?.timePos ?? 0,
        duration: state?.duration ?? 0,
        paused: state?.paused ?? true,
        playbackRate: Math.max(0.1, state?.speed ?? 1),
        volume: Math.max(0, Math.min(1, (state?.volume ?? 100) / 100)),
        muted: muted || (state?.volume ?? 0) <= 0,
        readyState: fileLoaded ? HAVE_ENOUGH_DATA : (state?.active ? HAVE_METADATA : HAVE_NOTHING),
        networkState: fileLoaded ? NETWORK_IDLE : (state?.active ? NETWORK_LOADING : NETWORK_EMPTY),
        ended: Boolean(state?.eofReached) || forceEnded,
        videoWidth: dimensions.videoWidth,
        videoHeight: dimensions.videoHeight,
        audioTracks: (state?.audioTracks ?? []).map((track, index) => ({
            id: toEmbeddedTrackId(index) ?? String(index),
            label: track.label,
            language: track.language,
            enabled: effectiveAudioTrackIndex !== null
                ? index === effectiveAudioTrackIndex
                : Boolean(track.selected),
        })),
        currentAudioTrackId: toEmbeddedTrackId(effectiveAudioTrackIndex),
    };
}

// Translate MPV state into the subset of HTMLMediaElement state that the Stremio page expects to read.
function dispatchPagePatchState(payload: ReturnType<typeof buildPagePatchState>): void {
    const script = document.createElement('script');
    script.textContent = `window.dispatchEvent(new CustomEvent(${JSON.stringify(PAGE_PATCH_STATE_EVENT)}, { detail: ${JSON.stringify(payload)} }));`;
    (document.head ?? document.documentElement).appendChild(script);
    script.remove();
}

function handlePagePatchCommand(action: string, value: unknown): void {
    if (!isBridgeEnabledForCurrentRoute()) {
        return;
    }

    switch (action) {
        case 'play':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'play' });
            break;
        case 'pause':
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'pause' });
            break;
        case 'seek':
            if (typeof value === 'number' && Number.isFinite(value)) {
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'seek', value, mode: 'absolute' });
            }
            break;
        case 'set-playback-rate':
            if (typeof value === 'number' && Number.isFinite(value)) {
                void externalPlayerAPI.sendEmbeddedMpvCommand({
                    command: 'set-speed',
                    value: Math.max(0.1, Math.min(4, value)),
                });
            }
            break;
        case 'set-volume':
            if (typeof value === 'number' && Number.isFinite(value)) {
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-volume', value: Math.round(Math.max(0, Math.min(1, value)) * 100) });
            }
            break;
        case 'set-audio-track': {
            const nextTrackId = coerceAudioTrackCommandValue(value);

            if (nextTrackId === null) {
                setPendingAudioTrackSelection(null);
                syncBridgeState();
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-audio-track', value: null });
                break;
            }

            if (typeof nextTrackId === 'number' && Number.isFinite(nextTrackId)) {
                setPendingAudioTrackSelection(nextTrackId);
                syncBridgeState();
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-audio-track', value: nextTrackId });
            }
            break;
        }
        case 'set-muted':
            if (typeof value === 'boolean') {
                muted = value;
                const nextVolume = value ? 0 : lastNonZeroVolume;
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-volume', value: nextVolume });
            }
            break;
        case 'set-fullscreen':
            if (typeof value === 'boolean') {
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-fullscreen', value });
            }
            break;
        default:
            break;
    }
}

function ensurePagePatchCommandListener(): void {
    if (pageCommandListenerInstalled) {
        return;
    }

    pageCommandListenerInstalled = true;
    window.addEventListener(PAGE_PATCH_COMMAND_EVENT, (event: Event) => {
        const detail = (event as CustomEvent<{ action?: string; value?: unknown }>).detail;
        if (!detail?.action) {
            return;
        }

        handlePagePatchCommand(detail.action, detail.value);
    });
}

// This patch must run in the page world so Stremio reads the overridden media APIs from the same JS realm it uses.
function ensurePageMediaPatch(): void {
    ensurePagePatchCommandListener();

    if ((window as typeof window & Record<string, unknown>)[PAGE_PATCH_INSTALL_KEY]) {
        return;
    }

    const script = document.createElement('script');
    script.id = PAGE_PATCH_SCRIPT_ID;
    script.textContent = `(() => {
        const installKey = ${JSON.stringify(PAGE_PATCH_INSTALL_KEY)};
        if (window[installKey]) {
            return;
        }

        window[installKey] = true;

        const stateEventName = ${JSON.stringify(PAGE_PATCH_STATE_EVENT)};
        const commandEventName = ${JSON.stringify(PAGE_PATCH_COMMAND_EVENT)};
        const state = {
            active: false,
            fileLoaded: false,
            fullscreen: false,
            currentTime: 0,
            duration: 0,
            paused: true,
            playbackRate: 1,
            volume: 1,
            muted: false,
            readyState: 0,
            networkState: 0,
            ended: false,
            videoWidth: 1,
            videoHeight: 1,
            audioTracks: [],
            currentAudioTrackId: null,
        };
        const stashedSrcs = new WeakMap();
        const audioTrackLists = new WeakMap();
        const readiedVideos = new WeakSet();
        const silencedVideos = new WeakSet();
        let fullscreenElementRef = null;

        const getVideo = () => {
            const video = document.querySelector('video');
            return video instanceof HTMLVideoElement ? video : null;
        };

        const isPatchedVideo = (element) => element instanceof HTMLVideoElement && state.active && location.hash.startsWith('#/player');
        const isPatchedFullscreenContext = () => state.active && location.hash.startsWith('#/player');

        const dispatchCommand = (action, value) => {
            window.dispatchEvent(new CustomEvent(commandEventName, { detail: { action, value } }));
        };

        const emitFullscreenChange = () => {
            document.dispatchEvent(new Event('fullscreenchange'));
            window.dispatchEvent(new Event('fullscreenchange'));
        };

        const createGrantedPermissionStatus = (name) => ({
            name,
            state: 'granted',
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent() { return true; },
        });

        const emit = (type, video = getVideo()) => {
            if (!video) {
                return;
            }

            video.dispatchEvent(new Event(type));
        };

        const emitReadiness = (video = getVideo()) => {
            if (!video) {
                return;
            }

            emit('loadstart', video);
            emit('durationchange', video);
            emit('loadedmetadata', video);
            emit('loadeddata', video);
            emit('canplay', video);
            emit('canplaythrough', video);

            if (!state.paused) {
                emit('play', video);
                emit('playing', video);
            }

            readiedVideos.add(video);
        };

        const findOverlayRoot = (element) => {
            let current = element;
            while (current && current instanceof HTMLElement) {
                const style = window.getComputedStyle(current);
                if (current.getAttribute('role') === 'dialog' || style.position === 'fixed' || style.position === 'absolute' || style.position === 'sticky') {
                    return current;
                }

                current = current.parentElement;
            }

            return element instanceof HTMLElement ? element : null;
        };

        const isLargeOverlayCandidate = (element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            const playerMenuSelector = '[role="dialog"], [class*="menu-layer"], [class*="subtitles-menu"], [class*="audio-menu"], [class*="speed-menu"], [class*="statistics-menu"], [class*="side-drawer"]';

            if (element === document.body || element === document.documentElement) {
                return false;
            }

            if (element.matches(playerMenuSelector) || element.querySelector(playerMenuSelector)) {
                return false;
            }

            if (element.closest('.title-bar')) {
                return false;
            }

            if (element.querySelector('video, canvas, button, input, select, textarea, [role="button"], [role="slider"]')) {
                return false;
            }

            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') {
                return false;
            }

            const rect = element.getBoundingClientRect();
            if (rect.width < window.innerWidth * 0.35 || rect.height < window.innerHeight * 0.2) {
                return false;
            }

            const hasOverlayChrome = style.backdropFilter !== 'none'
                || style.backgroundColor !== 'rgba(0, 0, 0, 0)'
                || style.backgroundImage !== 'none'
                || Number(style.zIndex || '0') > 0;

            return hasOverlayChrome;
        };

        const hideElement = (element) => {
            if (!(element instanceof HTMLElement)) {
                return;
            }

            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('visibility', 'hidden', 'important');
            element.style.setProperty('pointer-events', 'none', 'important');
            element.style.setProperty('opacity', '0', 'important');
        };

        const hideNativeLoadingUi = () => {
            if (!state.active || !state.fileLoaded) {
                return;
            }

            const routeRoot = document.querySelector('.route-container:last-child') || document.body;
            if (!routeRoot) {
                return;
            }

            const candidates = routeRoot.querySelectorAll('*');
            for (const candidate of candidates) {
                if (!(candidate instanceof HTMLElement)) {
                    continue;
                }

                const text = (candidate.textContent || '').trim().toLowerCase();
                const matchesText = text === 'loading'
                    || text === 'loading...'
                    || text.includes('player failed to load')
                    || text.includes('loading player')
                    || text.includes('buffering');
                const matchesBusy = candidate.getAttribute('aria-busy') === 'true' || candidate.getAttribute('role') === 'progressbar';

                if (matchesText || matchesBusy) {
                    const overlayRoot = findOverlayRoot(candidate);
                    if (overlayRoot && !overlayRoot.querySelector('video')) {
                        hideElement(overlayRoot);
                    }
                    continue;
                }

                if (isLargeOverlayCandidate(candidate)) {
                    hideElement(candidate);
                }
            }
        };

        const playDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play');
        const pauseDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause');
        const loadDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'load');
        const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        const srcObjectDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject');
        const audioTracksDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'audioTracks')
            || Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'audioTracks');
        const currentTimeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
        const durationDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'duration');
        const pausedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'paused');
        const playbackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
        const defaultPlaybackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'defaultPlaybackRate');
        const volumeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
        const mutedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted');
        const readyStateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'readyState');
        const networkStateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'networkState');
        const endedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'ended');
        const bufferedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'buffered');
        const seekableDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'seekable');
        const playedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'played');
        const errorDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'error');
        const videoWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'videoWidth');
        const videoHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'videoHeight');
        const requestFullscreenDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'requestFullscreen');
        const exitFullscreenDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'exitFullscreen');
        const fullscreenElementDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'fullscreenElement');
        const fullscreenEnabledDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'fullscreenEnabled');
        const permissionsQuery = navigator.permissions && typeof navigator.permissions.query === 'function'
            ? navigator.permissions.query.bind(navigator.permissions)
            : null;

        const originalPlay = playDescriptor && typeof playDescriptor.value === 'function' ? playDescriptor.value : HTMLMediaElement.prototype.play;
        const originalPause = pauseDescriptor && typeof pauseDescriptor.value === 'function' ? pauseDescriptor.value : HTMLMediaElement.prototype.pause;
        const originalLoad = loadDescriptor && typeof loadDescriptor.value === 'function' ? loadDescriptor.value : HTMLMediaElement.prototype.load;
        const originalRequestFullscreen = requestFullscreenDescriptor && typeof requestFullscreenDescriptor.value === 'function'
            ? requestFullscreenDescriptor.value
            : Element.prototype.requestFullscreen;
        const originalExitFullscreen = exitFullscreenDescriptor && typeof exitFullscreenDescriptor.value === 'function'
            ? exitFullscreenDescriptor.value
            : Document.prototype.exitFullscreen;

        const makeRanges = (ranges) => ({
            length: ranges.length,
            start: (index) => ranges[index][0],
            end: (index) => ranges[index][1],
        });

        const getAudioTrackSignature = (tracks = []) => tracks
            .map((track) => [track.id, track.label || '', track.language || '', track.enabled ? '1' : '0'].join(':'))
            .join('|');

        const createPatchedAudioTrack = (track) => {
            const audioTrack = {};
            const isActive = () => Boolean(track.enabled);
            const activate = (value) => { if (value) dispatchCommand('set-audio-track', track.id); };

            Object.defineProperties(audioTrack, {
                id: {
                    configurable: true,
                    enumerable: true,
                    value: String(track.id),
                },
                label: {
                    configurable: true,
                    enumerable: true,
                    value: track.label || track.language || ('Audio ' + track.id),
                },
                language: {
                    configurable: true,
                    enumerable: true,
                    value: track.language || '',
                },
                kind: {
                    configurable: true,
                    enumerable: true,
                    value: 'main',
                },
                enabled: {
                    configurable: true,
                    enumerable: true,
                    get: isActive,
                    set: activate,
                },
                selected: {
                    configurable: true,
                    enumerable: true,
                    get: isActive,
                    set: activate,
                },
            });

            return audioTrack;
        };

        const createAudioTrackList = () => {
            const emitter = document.createDocumentFragment();
            const trackList = [];

            trackList.onchange = null;
            trackList.item = (index) => trackList[index] || null;
            trackList.getTrackById = (id) => trackList.find((track) => String(track.id) === String(id)) || null;
            trackList.addEventListener = emitter.addEventListener.bind(emitter);
            trackList.removeEventListener = emitter.removeEventListener.bind(emitter);
            trackList.dispatchEvent = emitter.dispatchEvent.bind(emitter);

            return {
                trackList,
                setTracks: (tracks) => {
                    trackList.length = 0;
                    trackList.push(...tracks.map((track) => createPatchedAudioTrack(track)));
                },
                emitChange: () => {
                    const changeEvent = new Event('change');
                    trackList.dispatchEvent(changeEvent);
                    if (typeof trackList.onchange === 'function') {
                        trackList.onchange.call(trackList, changeEvent);
                    }
                },
            };
        };

        const ensureAudioTrackList = (video) => {
            let entry = audioTrackLists.get(video);
            if (!entry) {
                entry = createAudioTrackList();
                entry.setTracks(state.audioTracks);
                audioTrackLists.set(video, entry);
            }

            return entry;
        };

        const refreshAudioTrackList = (video = getVideo(), emitChange = false) => {
            if (!video) {
                return;
            }

            const entry = ensureAudioTrackList(video);
            entry.setTracks(state.audioTracks);

            if (emitChange) {
                entry.emitChange();
            }
        };

        const silenceNativeVideo = (video) => {
            if (!video || silencedVideos.has(video)) {
                return;
            }

            silencedVideos.add(video);
            try { originalPause.call(video); } catch {}
            try { mutedDescriptor && mutedDescriptor.set && mutedDescriptor.set.call(video, true); } catch {}
            try { volumeDescriptor && volumeDescriptor.set && volumeDescriptor.set.call(video, 0); } catch {}
            try { video.removeAttribute('autoplay'); } catch {}
            try { video.preload = 'none'; } catch {}
        };

        const patchAccessor = (target, key, descriptor, getter, setter) => {
            if (!descriptor || !descriptor.get) {
                return;
            }

            Object.defineProperty(target, key, {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (isPatchedVideo(this)) {
                        return getter();
                    }

                    return descriptor.get.call(this);
                },
                set: function(value) {
                    if (isPatchedVideo(this)) {
                        if (setter) {
                            setter(value);
                        }
                        return;
                    }

                    descriptor.set && descriptor.set.call(this, value);
                },
            });
        };

        HTMLMediaElement.prototype.play = function() {
            if (isPatchedVideo(this)) {
                dispatchCommand('play');
                return Promise.resolve();
            }

            return originalPlay.call(this);
        };

        HTMLMediaElement.prototype.pause = function() {
            if (isPatchedVideo(this)) {
                dispatchCommand('pause');
                return;
            }

            originalPause.call(this);
        };

        HTMLMediaElement.prototype.load = function() {
            if (isPatchedVideo(this)) {
                return;
            }

            originalLoad.call(this);
        };

        Element.prototype.requestFullscreen = function() {
            if (isPatchedFullscreenContext()) {
                fullscreenElementRef = this instanceof Element ? this : (getVideo() || document.documentElement);
                state.fullscreen = true;
                emitFullscreenChange();
                dispatchCommand('set-fullscreen', true);
                return Promise.resolve();
            }

            return originalRequestFullscreen.call(this);
        };

        Document.prototype.exitFullscreen = function() {
            if (isPatchedFullscreenContext()) {
                fullscreenElementRef = null;
                state.fullscreen = false;
                emitFullscreenChange();
                dispatchCommand('set-fullscreen', false);
                return Promise.resolve();
            }

            return originalExitFullscreen.call(this);
        };

        if (fullscreenElementDescriptor && fullscreenElementDescriptor.get) {
            Object.defineProperty(Document.prototype, 'fullscreenElement', {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (isPatchedFullscreenContext()) {
                        return state.fullscreen ? (fullscreenElementRef || getVideo() || document.documentElement) : null;
                    }

                    return fullscreenElementDescriptor.get.call(this);
                },
            });
        }

        if (fullscreenEnabledDescriptor && fullscreenEnabledDescriptor.get) {
            Object.defineProperty(Document.prototype, 'fullscreenEnabled', {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (isPatchedFullscreenContext()) {
                        return true;
                    }

                    return fullscreenEnabledDescriptor.get.call(this);
                },
            });
        }

        if (permissionsQuery) {
            navigator.permissions.query = function(permissionDesc) {
                const permissionName = permissionDesc && typeof permissionDesc === 'object' && 'name' in permissionDesc
                    ? String(permissionDesc.name)
                    : '';

                if (isPatchedFullscreenContext() && (permissionName === 'fullscreen' || permissionName === 'window-management')) {
                    return Promise.resolve(createGrantedPermissionStatus(permissionName));
                }

                return permissionsQuery(permissionDesc);
            };
        }

        if (srcDescriptor && srcDescriptor.get) {
            Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (isPatchedVideo(this)) {
                        return stashedSrcs.get(this) || '';
                    }

                    return srcDescriptor.get.call(this);
                },
                set: function(value) {
                    if (isPatchedVideo(this)) {
                        stashedSrcs.set(this, value);
                        return;
                    }

                    srcDescriptor.set && srcDescriptor.set.call(this, value);
                },
            });
        }

        if (srcObjectDescriptor) {
            Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (isPatchedVideo(this)) {
                        return null;
                    }

                    return srcObjectDescriptor.get ? srcObjectDescriptor.get.call(this) : null;
                },
                set: function(value) {
                    if (isPatchedVideo(this)) {
                        return;
                    }

                    srcObjectDescriptor.set && srcObjectDescriptor.set.call(this, value);
                },
            });
        }

        Object.defineProperty(HTMLMediaElement.prototype, 'audioTracks', {
            configurable: true,
            enumerable: true,
            get: function() {
                if (isPatchedVideo(this)) {
                    return ensureAudioTrackList(this).trackList;
                }

                if (audioTracksDescriptor && audioTracksDescriptor.get) {
                    return audioTracksDescriptor.get.call(this);
                }

                return [];
            },
        });

        patchAccessor(HTMLMediaElement.prototype, 'currentTime', currentTimeDescriptor, () => state.currentTime, (value) => {
            if (typeof value === 'number' && Number.isFinite(value)) {
                dispatchCommand('seek', value);
            }
        });
        patchAccessor(HTMLMediaElement.prototype, 'duration', durationDescriptor, () => state.duration);
        patchAccessor(HTMLMediaElement.prototype, 'paused', pausedDescriptor, () => state.paused);
        patchAccessor(HTMLMediaElement.prototype, 'playbackRate', playbackRateDescriptor, () => state.playbackRate, (value) => {
            if (typeof value === 'number' && Number.isFinite(value)) {
                dispatchCommand('set-playback-rate', value);
            }
        });
        patchAccessor(HTMLMediaElement.prototype, 'defaultPlaybackRate', defaultPlaybackRateDescriptor, () => state.playbackRate, (value) => {
            if (typeof value === 'number' && Number.isFinite(value)) {
                dispatchCommand('set-playback-rate', value);
            }
        });
        patchAccessor(HTMLMediaElement.prototype, 'volume', volumeDescriptor, () => state.volume, (value) => {
            if (typeof value === 'number' && Number.isFinite(value)) {
                dispatchCommand('set-volume', value);
            }
        });
        patchAccessor(HTMLMediaElement.prototype, 'muted', mutedDescriptor, () => state.muted, (value) => {
            if (typeof value === 'boolean') {
                dispatchCommand('set-muted', value);
            }
        });
        patchAccessor(HTMLMediaElement.prototype, 'readyState', readyStateDescriptor, () => state.readyState);
        patchAccessor(HTMLMediaElement.prototype, 'networkState', networkStateDescriptor, () => state.networkState);
        patchAccessor(HTMLMediaElement.prototype, 'ended', endedDescriptor, () => state.ended);
        patchAccessor(HTMLMediaElement.prototype, 'buffered', bufferedDescriptor, () => state.duration > 0 ? makeRanges([[0, state.duration]]) : makeRanges([]));
        patchAccessor(HTMLMediaElement.prototype, 'seekable', seekableDescriptor, () => state.duration > 0 ? makeRanges([[0, state.duration]]) : makeRanges([]));
        patchAccessor(HTMLMediaElement.prototype, 'played', playedDescriptor, () => state.currentTime > 0 ? makeRanges([[0, state.currentTime]]) : makeRanges([]));
        patchAccessor(HTMLMediaElement.prototype, 'error', errorDescriptor, () => null);
        patchAccessor(HTMLVideoElement.prototype, 'videoWidth', videoWidthDescriptor, () => state.videoWidth);
        patchAccessor(HTMLVideoElement.prototype, 'videoHeight', videoHeightDescriptor, () => state.videoHeight);

        document.addEventListener('error', (event) => {
            if (event.target instanceof HTMLVideoElement && isPatchedVideo(event.target)) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }, true);

        document.addEventListener('fullscreenerror', (event) => {
            if (isPatchedFullscreenContext()) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }, true);

        const refreshPatchedVideo = (emitAudioTrackChange = false) => {
            const video = getVideo();
            if (!video || !state.active) {
                return;
            }

            silenceNativeVideo(video);
            refreshAudioTrackList(video, emitAudioTrackChange);

            if (state.fileLoaded && !readiedVideos.has(video)) {
                emitReadiness(video);
            }

            hideNativeLoadingUi();
        };

        const domObserver = new MutationObserver(() => {
            refreshPatchedVideo();
        });
        domObserver.observe(document.documentElement, { childList: true, subtree: true });

        window.addEventListener(stateEventName, (event) => {
            const detail = event.detail || {};
            const wasLoaded = state.fileLoaded;
            const wasPaused = state.paused;
            const previousDuration = state.duration;
            const previousTime = state.currentTime;
            const previousPlaybackRate = state.playbackRate;
            const previousVolume = state.volume;
            const previousEnded = state.ended;
            const previousFullscreen = state.fullscreen;
            const previousAudioTracksSignature = getAudioTrackSignature(state.audioTracks);
            const previousCurrentAudioTrackId = state.currentAudioTrackId;

            Object.assign(state, detail);

            if (!state.active) {
                return;
            }

            const audioTracksChanged = previousAudioTracksSignature !== getAudioTrackSignature(state.audioTracks);
            const audioTrackSelectionChanged = previousCurrentAudioTrackId !== state.currentAudioTrackId;

            refreshPatchedVideo(audioTracksChanged || audioTrackSelectionChanged);

            if (!wasLoaded && state.fileLoaded) {
                emitReadiness();
                hideNativeLoadingUi();
                return;
            }

            if (detail.duration !== undefined && previousDuration !== state.duration) {
                emit('durationchange');
            }

            if (detail.currentTime !== undefined && previousTime !== state.currentTime) {
                emit('timeupdate');
            }

            if (detail.playbackRate !== undefined && previousPlaybackRate !== state.playbackRate) {
                emit('ratechange');
            }

            if ((detail.volume !== undefined && previousVolume !== state.volume) || detail.muted !== undefined) {
                emit('volumechange');
            }

            if (detail.paused !== undefined && wasPaused !== state.paused) {
                if (state.paused) {
                    emit('pause');
                } else {
                    emit('play');
                    emit('playing');
                }
            }

            if (!previousEnded && state.ended) {
                emit('ended');
            }

            if (detail.fullscreen !== undefined && previousFullscreen !== state.fullscreen) {
                if (state.fullscreen) {
                    fullscreenElementRef = fullscreenElementRef || getVideo() || document.documentElement;
                } else {
                    fullscreenElementRef = null;
                }
                emitFullscreenChange();
            }
        });

        console.log('[EmbeddedNativePlayerBridge] Page media patch installed');
    })();`;

    (document.head ?? document.documentElement).appendChild(script);
    script.remove();
    (window as typeof window & Record<string, unknown>)[PAGE_PATCH_INSTALL_KEY] = true;
}

// Hide the native web video but keep enough surrounding surfaces visible for Stremio's player chrome to still render naturally.
function applyVideoVisibilityPatch(video: HTMLVideoElement): void {
    if (bridgedVideo === video && bridgedSurfaceElements.length > 0) {
        return;
    }

    restoreVideoVisibilityPatch();

    const routeRoot = document.querySelector('.route-container:last-child');
    const routeContent = routeRoot?.querySelector('.route-content');
    const surfaceElements: HTMLElement[] = [];
    const seenElements = new Set<HTMLElement>();
    const addSurfaceElement = (element: HTMLElement | null | undefined) => {
        if (!element || seenElements.has(element)) {
            return;
        }

        seenElements.add(element);
        surfaceElements.push(element);
    };
    const isInteractiveSurface = (element: HTMLElement): boolean => {
        return element.matches('button, input, select, textarea, [role="button"], [role="slider"], [role="dialog"]');
    };
    const hasVisibleBackdrop = (style: CSSStyleDeclaration): boolean => {
        const backgroundColor = style.backgroundColor.replace(/\s+/g, '').toLowerCase();
        const transparentBackground = backgroundColor === 'transparent'
            || backgroundColor === 'rgba(0,0,0,0)'
            || backgroundColor === 'hsla(0,0%,0%,0)';

        return !transparentBackground
            || style.backgroundImage !== 'none'
            || style.boxShadow !== 'none'
            || style.backdropFilter !== 'none'
            || style.filter !== 'none';
    };

    addSurfaceElement(document.documentElement);
    addSurfaceElement(document.body);
    if (routeRoot instanceof HTMLElement) {
        addSurfaceElement(routeRoot);
    }
    if (routeContent instanceof HTMLElement) {
        addSurfaceElement(routeContent);
    }

    let current: HTMLElement | null = video;
    while (current) {
        addSurfaceElement(current);
        if (routeRoot instanceof HTMLElement && current === routeRoot) {
            break;
        }
        current = current.parentElement;
    }

    if (routeRoot instanceof HTMLElement) {
        for (const candidate of routeRoot.querySelectorAll<HTMLElement>('*')) {
            if (!(candidate instanceof HTMLElement)) {
                continue;
            }

            if (candidate.closest('.title-bar')) {
                continue;
            }

            if (isInteractiveSurface(candidate)) {
                continue;
            }

            const rect = candidate.getBoundingClientRect();
            if (rect.width < window.innerWidth * 0.2 || rect.height < window.innerHeight * 0.08) {
                continue;
            }

            const style = window.getComputedStyle(candidate);
            if (!hasVisibleBackdrop(style)) {
                continue;
            }

            addSurfaceElement(candidate);
        }
    }

    bridgedVideo = video;
    bridgedSurfaceElements = surfaceElements.map((element) => ({
        element,
        style: {
            display: element.style.display,
            opacity: element.style.opacity,
            pointerEvents: element.style.pointerEvents,
            background: element.style.background,
            backgroundColor: element.style.backgroundColor,
            backgroundImage: element.style.backgroundImage,
            visibility: element.style.visibility,
            boxShadow: element.style.boxShadow,
            backdropFilter: element.style.backdropFilter,
            filter: element.style.filter,
        },
    }));

    for (const element of surfaceElements) {
        element.style.background = 'transparent';
        element.style.backgroundColor = 'transparent';
        element.style.backgroundImage = 'none';
        element.style.boxShadow = 'none';
        element.style.backdropFilter = 'none';
        element.style.filter = 'none';
    }

    video.style.display = 'none';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.background = 'transparent';
    video.style.backgroundColor = 'transparent';
    video.style.backgroundImage = 'none';
    video.style.visibility = 'hidden';
}

function restoreVideoVisibilityPatch(): void {
    for (const { element, style } of bridgedSurfaceElements) {
        element.style.display = style.display;
        element.style.opacity = style.opacity;
        element.style.pointerEvents = style.pointerEvents;
        element.style.background = style.background;
        element.style.backgroundColor = style.backgroundColor;
        element.style.backgroundImage = style.backgroundImage;
        element.style.visibility = style.visibility;
        element.style.boxShadow = style.boxShadow;
        element.style.backdropFilter = style.backdropFilter;
        element.style.filter = style.filter;
    }

    bridgedVideo = null;
    bridgedSurfaceElements = [];
}

function refreshVideoVisibility(): void {
    if (!bridgePrepared || !isBridgeEnabledForCurrentRoute() || !currentState?.active) {
        restoreVideoVisibilityPatch();
        clearControlSurfaceMarkers();
        clearAudioMenuSelectionMarkers();
        updateBridgeSurfaceState();
        return;
    }

    updateBridgeSurfaceState();
    markControlSurfaceElements();
    const video = document.querySelector('video');
    if (video instanceof HTMLVideoElement) {
        applyVideoVisibilityPatch(video);
    }

    syncAudioMenuSelection();
}

function ensureDomObserver(): void {
    if (domObserver || !document.body) {
        return;
    }

    domObserver = new MutationObserver(() => {
        refreshVideoVisibility();
        if (bridgePrepared) {
            dispatchPagePatchState(buildPagePatchState(currentState));
        }
    });

    domObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function syncBridgeState(): void {
    dispatchPagePatchState(buildPagePatchState(currentState));
    syncPlayerAudioTrackState(resolveEffectiveAudioTrackId(currentState));
    updateBridgeSurfaceState();
    refreshVideoVisibility();
}

function ensureStateSubscription(): void {
    if (stateSubscription) {
        return;
    }

    stateSubscription = externalPlayerAPI.onEmbeddedMpvState((state) => {
        currentState = state;
        reconcilePendingAudioTrackSelection(state);
        if ((state.volume ?? 0) > 0) {
            lastNonZeroVolume = Math.round(state.volume);
        }
        if (state.audioTracks !== lastSeenAudioTracks) {
            lastSeenAudioTracks = state.audioTracks;
            maybeApplyPreferredAudioTrack(state);
        }
        syncBridgeState();
    });
}

function installControlInterceptors(): void {
    if (clickInterceptor || sliderInterceptor || keyboardInterceptor) {
        return;
    }

    clickInterceptor = (event: MouseEvent) => {
        if (!shouldHandleInteractions()) {
            return;
        }

        const rawTarget = event.target instanceof HTMLElement
            ? event.target
            : null;
        if (rawTarget) {
            const audioTrackAction = getAudioTrackAction(rawTarget);
            if (audioTrackAction) {
                executeControlAction(audioTrackAction);
                return;
            }
        }

        const target = event.target instanceof Element
            ? event.target.closest<HTMLElement>(CLICKABLE_CONTROL_SELECTOR)
            : null;
        if (!target) {
            return;
        }

        const action = getControlAction(target) ?? getSliderAction(target);
        if (!action) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        executeControlAction(action);
    };

    sliderInterceptor = (event: Event) => {
        if (!shouldHandleInteractions()) {
            return;
        }

        const target = event.target instanceof Element
            ? event.target.closest<HTMLElement>('input[type="range"], [role="slider"]')
            : null;
        if (!target) {
            return;
        }

        const action = getSliderAction(target);
        if (!action) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        executeControlAction(action);
    };

    keyboardInterceptor = (event: KeyboardEvent) => {
        if (!shouldHandleInteractions() || shouldIgnoreKeyboardTarget(event.target) || hasShortcutModifier(event)) {
            return;
        }

        if (event.key.toLowerCase() === 'f') {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            void externalPlayerAPI.sendEmbeddedMpvCommand({
                command: 'set-fullscreen',
                value: !Boolean(currentState?.fullscreen),
            });
            return;
        }

        if (event.key === 'Escape' && currentState?.fullscreen) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            void externalPlayerAPI.sendEmbeddedMpvCommand({
                command: 'set-fullscreen',
                value: false,
            });
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            window.dispatchEvent(new CustomEvent(EXIT_EMBEDDED_PLAYBACK_EVENT));
            return;
        }

        if (event.key === ' ') {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'toggle-pause' });
            return;
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            void externalPlayerAPI.sendEmbeddedMpvCommand({
                command: 'seek',
                value: DEFAULT_SEEK_STEP_SECONDS * direction,
                mode: 'relative',
            });
        }
    };

    document.addEventListener('click', clickInterceptor, true);
    document.addEventListener('input', sliderInterceptor, true);
    document.addEventListener('change', sliderInterceptor, true);
    document.addEventListener('keydown', keyboardInterceptor, true);
}

function uninstallControlInterceptors(): void {
    if (clickInterceptor) {
        document.removeEventListener('click', clickInterceptor, true);
        clickInterceptor = null;
    }

    if (sliderInterceptor) {
        document.removeEventListener('input', sliderInterceptor, true);
        document.removeEventListener('change', sliderInterceptor, true);
        sliderInterceptor = null;
    }

    if (keyboardInterceptor) {
        document.removeEventListener('keydown', keyboardInterceptor, true);
        keyboardInterceptor = null;
    }
}

function prepareEmbeddedNativePlayerBridge(): void {
    bridgePrepared = true;
    ensureBridgeSurfaceStyle();
    ensurePageMediaPatch();
    ensureStateSubscription();
    ensureDomObserver();
    installControlInterceptors();
    resetPlayerAudioTrackStateForPreferredAudio();
    syncBridgeState();
}

export function activateEmbeddedNativePlayerBridge(): void {
    forceEnded = false;
    lastAppliedPreferredAudioSignature = null;
    pendingAudioTrackId = null;
    lastSeenAudioTracks = null;
    lastSyncedPlayerAudioTrackId = undefined;
    pendingPlayerAudioTrackSyncId = null;
    prepareEmbeddedNativePlayerBridge();
    logger.info('Embedded native player bridge activated');
}

export function deactivateEmbeddedNativePlayerBridge(): void {
    bridgePrepared = false;
    currentState = null;
    muted = false;
    forceEnded = false;
    lastAppliedPreferredAudioSignature = null;
    pendingAudioTrackId = null;
    lastSeenAudioTracks = null;
    lastSyncedPlayerAudioTrackId = undefined;
    pendingPlayerAudioTrackSyncId = null;
    dispatchPagePatchState(buildPagePatchState(null));
    clearControlSurfaceMarkers();
    clearAudioMenuSelectionMarkers();
    updateBridgeSurfaceState();
    restoreVideoVisibilityPatch();
    uninstallControlInterceptors();

    if (domObserver) {
        domObserver.disconnect();
        domObserver = null;
    }

    if (stateSubscription) {
        stateSubscription();
        stateSubscription = null;
    }
}
