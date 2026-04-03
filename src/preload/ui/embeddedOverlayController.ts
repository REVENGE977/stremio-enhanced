import type PlayerState from '../../interfaces/PlayerState';
import type { EmbeddedMpvState } from '../../interfaces/EmbeddedMpv';
import { externalPlayerAPI } from '../api/externalPlayer';
import { isEmbeddedShellRouteHash } from './playbackRoutes';

const OVERLAY_ID = 'stremio-enhanced-embedded-overlay';
const STYLE_ID = 'stremio-enhanced-embedded-overlay-style';
const ACTIVE_ATTR = 'data-embedded-mpv-active';
const OVERLAY_STATE_ATTR = 'data-overlay-state';

let overlayRoot: HTMLDivElement | null = null;
let unsubscribeFromState: (() => void) | null = null;
let playbackContext: PlayerState | null = null;
let playbackState: EmbeddedMpvState | null = null;
let controlsBound = false;
let keyboardHandler: ((e: KeyboardEvent) => void) | null = null;

function getTitleBarOffset(): number {
    const titleBar = document.querySelector('.title-bar') as HTMLElement | null;
    return titleBar?.offsetHeight ?? 0;
}

function getSeriesLabel(): string {
    if (!playbackContext) {
        return '';
    }

    if (!playbackContext.seriesInfoDetails || playbackContext.metaDetails.type !== 'series') {
        return playbackContext.metaDetails.type === 'movie' ? 'Movie' : '';
    }

    const { season, episode } = playbackContext.seriesInfoDetails;
    const isKitsu = playbackContext.metaDetails.id.startsWith('kitsu:');
    return isKitsu ? `Episode ${episode}` : `S${season} E${episode}`;
}

function getSeekDuration(shift: boolean): number {
    try {
        const profile = JSON.parse(localStorage.getItem('profile') ?? '{}');
        const ms = shift
            ? (profile?.settings?.seekShortTimeDuration ?? 5000)
            : (profile?.settings?.seekTimeDuration ?? 15000);
        return ms / 1000;
    } catch {
        return shift ? 5 : 15;
    }
}

function getStatusLabel(): string {
    if (!playbackState) {
        return 'Preparing embedded player...';
    }

    if (playbackState.error) {
        return playbackState.error;
    }

    if (playbackState.loading) {
        return 'Loading stream...';
    }

    if (playbackState.eofReached) {
        return 'Playback finished';
    }

    return playbackState.paused ? 'Paused' : 'Playing';
}

function ensureStyle(): void {
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        html[${ACTIVE_ATTR}="true"],
        body[${ACTIVE_ATTR}="true"] {
            background: transparent !important;
        }

        #${OVERLAY_ID} {
            position: fixed;
            inset: 0;
            z-index: 2147483646;
            pointer-events: none;
            font-family: "Segoe UI", sans-serif;
            color: #f5f5f5;
        }

        #${OVERLAY_ID}[${OVERLAY_STATE_ATTR}="active"] {
            display: none;
        }

        #${OVERLAY_ID} .embedded-shell {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            padding: 12px 14px 16px;
            background: none;
            transition: background 160ms ease, opacity 160ms ease;
        }

        #${OVERLAY_ID}[${OVERLAY_STATE_ATTR}="active"] .embedded-shell {
            opacity: 0;
        }

        #${OVERLAY_ID} .embedded-meta {
            pointer-events: none;
            background: rgba(12, 17, 24, 0.44);
            backdrop-filter: blur(18px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
            max-width: min(32vw, 420px);
            padding: 10px 12px;
            border-radius: 16px;
            opacity: 0;
            transform: translateY(8px);
            transition: opacity 160ms ease, transform 160ms ease;
        }

        #${OVERLAY_ID}[${OVERLAY_STATE_ATTR}="loading"] .embedded-meta,
        #${OVERLAY_ID}[${OVERLAY_STATE_ATTR}="error"] .embedded-meta {
            opacity: 1;
            transform: translateY(0);
        }

        #${OVERLAY_ID} .embedded-title {
            margin: 0 0 4px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            line-height: 1.2;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.74);
        }

        #${OVERLAY_ID} .embedded-subtitle,
        #${OVERLAY_ID} .embedded-status {
            margin: 0;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 720px) {
            #${OVERLAY_ID} .embedded-shell {
                padding: 10px 10px 14px;
            }

            #${OVERLAY_ID} .embedded-meta {
                max-width: calc(100vw - 20px);
            }
        }
    `;

    document.head.appendChild(style);
}

function bindControls(): void {
    if (!overlayRoot || controlsBound || !isEmbeddedShellRouteHash()) {
        return;
    }

    controlsBound = true;

    keyboardHandler = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const duration = getSeekDuration(event.shiftKey);
            void externalPlayerAPI.sendEmbeddedMpvCommand({
                command: 'seek',
                value: direction * duration,
                mode: 'relative',
            });
        } else if (event.key === ' ') {
            event.preventDefault();
            void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'toggle-pause' });
        }
    };
    document.addEventListener('keydown', keyboardHandler);
}

function ensureRoot(): HTMLDivElement {
    if (overlayRoot) {
        return overlayRoot;
    }

    overlayRoot = document.createElement('div');
    overlayRoot.id = OVERLAY_ID;
    overlayRoot.setAttribute(OVERLAY_STATE_ATTR, 'loading');
    overlayRoot.innerHTML = `
        <div class="embedded-shell">
            <div class="embedded-meta">
                <h1 class="embedded-title"></h1>
                <p class="embedded-subtitle"></p>
                <p class="embedded-status"></p>
            </div>
        </div>
    `;

    document.body.appendChild(overlayRoot);
    return overlayRoot;
}

function syncOverlay(): void {
    if (!overlayRoot) {
        return;
    }

    const overlayState = playbackState?.error
        ? 'error'
        : (playbackState?.connected ? 'active' : (!playbackState || playbackState.loading || !playbackState.active ? 'loading' : 'active'));
    overlayRoot.setAttribute(OVERLAY_STATE_ATTR, overlayState);

    const shell = overlayRoot.querySelector('.embedded-shell') as HTMLElement | null;
    const title = overlayRoot.querySelector('.embedded-title') as HTMLElement | null;
    const subtitle = overlayRoot.querySelector('.embedded-subtitle') as HTMLElement | null;
    const status = overlayRoot.querySelector('.embedded-status') as HTMLElement | null;

    if (shell) {
        shell.style.paddingTop = `${12 + getTitleBarOffset()}px`;
    }

    if (title) {
        title.textContent = playbackContext?.metaDetails.name ?? playbackState?.title ?? 'Embedded MPV';
    }

    if (subtitle) {
        subtitle.textContent = getSeriesLabel();
    }

    if (status) {
        status.textContent = getStatusLabel();
    }
}

function ensureStateSubscription(): void {
    if (unsubscribeFromState) {
        return;
    }

    unsubscribeFromState = externalPlayerAPI.onEmbeddedMpvState((state) => {
        playbackState = state;
        if (!state.active && !state.loading) {
            deactivateEmbeddedOverlay();
            return;
        }

        syncOverlay();
    });
}

export function activateEmbeddedOverlay(context: PlayerState): void {
    playbackContext = context;
    prepareEmbeddedOverlay();
    document.documentElement.setAttribute(ACTIVE_ATTR, 'true');
    document.body.setAttribute(ACTIVE_ATTR, 'true');
    syncOverlay();
}

export function prepareEmbeddedOverlay(): void {
    ensureStyle();
    ensureRoot();
    bindControls();
    ensureStateSubscription();
    overlayRoot?.setAttribute(OVERLAY_STATE_ATTR, 'loading');
    syncOverlay();
}

export function updateEmbeddedOverlayState(state: EmbeddedMpvState): void {
    playbackState = state;
    syncOverlay();
}

export function deactivateEmbeddedOverlay(): void {
    document.documentElement.removeAttribute(ACTIVE_ATTR);
    document.body.removeAttribute(ACTIVE_ATTR);
    playbackContext = null;
    playbackState = null;

    if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
        keyboardHandler = null;
    }

    if (unsubscribeFromState) {
        unsubscribeFromState();
        unsubscribeFromState = null;
    }

    overlayRoot?.remove();
    overlayRoot = null;
    controlsBound = false;
}

export function getEmbeddedPlaybackContext(): PlayerState | null {
    return playbackContext;
}
