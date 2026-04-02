import type PlayerState from '../../interfaces/PlayerState';
import type { EmbeddedMpvState, EmbeddedMpvTrack } from '../../interfaces/EmbeddedMpv';
import { externalPlayerAPI } from '../api/externalPlayer';
import { EXIT_EMBEDDED_PLAYBACK_EVENT } from './playbackRoutes';

const OVERLAY_ID = 'stremio-enhanced-embedded-overlay';
const STYLE_ID = 'stremio-enhanced-embedded-overlay-style';
const ACTIVE_ATTR = 'data-embedded-mpv-active';
const OVERLAY_STATE_ATTR = 'data-overlay-state';

let overlayRoot: HTMLDivElement | null = null;
let unsubscribeFromState: (() => void) | null = null;
let playbackContext: PlayerState | null = null;
let playbackState: EmbeddedMpvState | null = null;
let controlsBound = false;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getTitleBarOffset(): number {
    const titleBar = document.querySelector('.title-bar') as HTMLElement | null;
    return titleBar?.offsetHeight ?? 0;
}

function formatTime(seconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    return [hours, minutes, remainingSeconds]
        .map((value, index) => (index === 0 ? String(value) : String(value).padStart(2, '0')))
        .join(':');
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

function buildTrackOptions(
    tracks: EmbeddedMpvTrack[],
    currentTrackId: number | null,
    allowOff: boolean,
    emptyLabel: string,
): string {
    const options: string[] = [];

    if (allowOff) {
        const selected = currentTrackId == null ? 'selected' : '';
        options.push(`<option value="off" ${selected}>Off</option>`);
    }

    if (tracks.length === 0) {
        const selectedValue = allowOff ? 'off' : '';
        options.push(`<option value="${selectedValue}" selected>${escapeHtml(emptyLabel)}</option>`);
        return options.join('');
    }

    for (const track of tracks) {
        const selected = track.id === currentTrackId ? 'selected' : '';
        const suffix = track.language ? ` (${escapeHtml(track.language)})` : '';
        options.push(`<option value="${track.id}" ${selected}>${escapeHtml(track.label)}${suffix}</option>`);
    }

    return options.join('');
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

        body[${ACTIVE_ATTR}="true"] > :not(#${OVERLAY_ID}):not(script):not(style) {
            visibility: hidden !important;
            pointer-events: none !important;
            background: transparent !important;
        }

        body[${ACTIVE_ATTR}="true"] > :not(#${OVERLAY_ID}):not(script):not(style) * {
            visibility: hidden !important;
            pointer-events: none !important;
            background: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
        }

        body[${ACTIVE_ATTR}="true"] .route-container:last-child,
        body[${ACTIVE_ATTR}="true"] .route-container:last-child .route-content {
            background: transparent !important;
        }

        body[${ACTIVE_ATTR}="true"] .route-container:last-child .route-content > :not(.title-bar) {
            visibility: hidden !important;
            pointer-events: none !important;
        }

        body[${ACTIVE_ATTR}="true"] .route-container:last-child .route-content > :not(.title-bar) * {
            visibility: hidden !important;
            pointer-events: none !important;
            background: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
        }

        body[${ACTIVE_ATTR}="true"] video {
            visibility: hidden !important;
            pointer-events: none !important;
        }

        #${OVERLAY_ID} {
            position: fixed;
            inset: 0;
            z-index: 2147483646;
            pointer-events: none;
            font-family: "Segoe UI", sans-serif;
            color: #f5f5f5;
        }

        #${OVERLAY_ID} .embedded-shell {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 12px 14px 16px;
            background: none;
            transition: background 160ms ease;
        }

        #${OVERLAY_ID}[${OVERLAY_STATE_ATTR}="loading"] .embedded-shell {
            background:
                radial-gradient(circle at top, rgba(34, 44, 58, 0.45), transparent 40%),
                rgba(7, 10, 14, 0.94);
        }

        #${OVERLAY_ID} .embedded-top,
        #${OVERLAY_ID} .embedded-controls,
        #${OVERLAY_ID} .embedded-meta,
        #${OVERLAY_ID} button,
        #${OVERLAY_ID} select,
        #${OVERLAY_ID} input[type="range"] {
            pointer-events: auto;
        }

        #${OVERLAY_ID} .embedded-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        #${OVERLAY_ID} .embedded-badge,
        #${OVERLAY_ID} .embedded-top button,
        #${OVERLAY_ID} .embedded-controls,
        #${OVERLAY_ID} .embedded-meta {
            background: rgba(12, 17, 24, 0.44);
            backdrop-filter: blur(18px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
        }

        #${OVERLAY_ID} .embedded-badge {
            display: inline-flex;
            align-items: center;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: rgba(255, 255, 255, 0.78);
        }

        #${OVERLAY_ID} .embedded-top button {
            border: 0;
            border-radius: 999px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            color: #f8f8f8;
        }

        #${OVERLAY_ID} .embedded-meta {
            align-self: flex-start;
            max-width: min(46vw, 520px);
            padding: 10px 12px;
            border-radius: 16px;
            margin-top: auto;
            margin-bottom: 10px;
        }

        #${OVERLAY_ID} .embedded-title {
            margin: 0 0 4px;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.2;
        }

        #${OVERLAY_ID} .embedded-subtitle,
        #${OVERLAY_ID} .embedded-status {
            margin: 0;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        #${OVERLAY_ID} .embedded-controls {
            display: grid;
            gap: 10px;
            padding: 12px 14px;
            border-radius: 18px;
        }

        #${OVERLAY_ID} .embedded-timeline {
            width: 100%;
            accent-color: #ffffff;
        }

        #${OVERLAY_ID} .embedded-time-row,
        #${OVERLAY_ID} .embedded-button-row,
        #${OVERLAY_ID} .embedded-track-row {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        #${OVERLAY_ID} .embedded-time-row {
            justify-content: space-between;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.72);
        }

        #${OVERLAY_ID} .embedded-button-row button {
            border: 0;
            border-radius: 999px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.14);
            color: #ffffff;
        }

        #${OVERLAY_ID} .embedded-button-row button[data-primary="true"] {
            background: rgba(255, 255, 255, 0.22);
        }

        #${OVERLAY_ID} select {
            min-width: 170px;
            padding: 8px 10px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(10, 14, 20, 0.72);
            color: #f8f8f8;
        }

        #${OVERLAY_ID} .embedded-volume {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 180px;
        }

        #${OVERLAY_ID} .embedded-volume span,
        #${OVERLAY_ID} .embedded-track-row span {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.72);
        }

        @media (max-width: 720px) {
            #${OVERLAY_ID} .embedded-shell {
                padding: 10px 10px 14px;
            }

            #${OVERLAY_ID} .embedded-meta {
                max-width: calc(100vw - 20px);
            }

            #${OVERLAY_ID} .embedded-track-row select,
            #${OVERLAY_ID} .embedded-volume {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);
}

function bindControls(): void {
    if (!overlayRoot || controlsBound) {
        return;
    }

    controlsBound = true;

    overlayRoot.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        const actionTarget = target?.closest<HTMLElement>('[data-action]');
        const action = actionTarget?.dataset.action;

        switch (action) {
            case 'play-pause':
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'toggle-pause' });
                break;
            case 'back':
                window.dispatchEvent(new CustomEvent(EXIT_EMBEDDED_PLAYBACK_EVENT));
                break;
            case 'fullscreen':
                void externalPlayerAPI.sendEmbeddedMpvCommand({ command: 'set-fullscreen', value: !Boolean(playbackState?.fullscreen) });
                break;
            default:
                break;
        }
    });

    overlayRoot.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement | HTMLSelectElement | null;
        const action = target?.dataset.action;

        switch (action) {
            case 'seek':
                void externalPlayerAPI.sendEmbeddedMpvCommand({
                    command: 'seek',
                    value: Number((target as HTMLInputElement).value),
                    mode: 'absolute',
                });
                break;
            case 'volume':
                void externalPlayerAPI.sendEmbeddedMpvCommand({
                    command: 'set-volume',
                    value: Number((target as HTMLInputElement).value),
                });
                break;
            case 'audio-track':
                if ((target as HTMLSelectElement).value) {
                    void externalPlayerAPI.sendEmbeddedMpvCommand({
                        command: 'set-audio-track',
                        value: Number((target as HTMLSelectElement).value),
                    });
                }
                break;
            case 'subtitle-track':
                void externalPlayerAPI.sendEmbeddedMpvCommand({
                    command: 'set-subtitle-track',
                    value: (target as HTMLSelectElement).value === 'off' ? null : Number((target as HTMLSelectElement).value),
                });
                break;
            default:
                break;
        }
    });
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
            <div class="embedded-top">
                <div class="embedded-badge">Embedded MPV</div>
                <button type="button" data-action="back">Back</button>
            </div>
            <div class="embedded-meta">
                <h1 class="embedded-title"></h1>
                <p class="embedded-subtitle"></p>
                <p class="embedded-status"></p>
            </div>
            <div class="embedded-controls">
                <input class="embedded-timeline" data-action="seek" type="range" min="0" max="1" step="1" value="0" />
                <div class="embedded-time-row">
                    <span data-role="current-time">0:00:00</span>
                    <span data-role="duration">0:00:00</span>
                </div>
                <div class="embedded-button-row">
                    <button type="button" data-primary="true" data-action="play-pause">Pause</button>
                    <button type="button" data-action="fullscreen">Fullscreen</button>
                    <div class="embedded-volume">
                        <span>Volume</span>
                        <input data-action="volume" type="range" min="0" max="100" step="1" value="100" />
                    </div>
                </div>
                <div class="embedded-track-row">
                    <span>Audio</span>
                    <select data-action="audio-track"></select>
                    <span>Subs</span>
                    <select data-action="subtitle-track"></select>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlayRoot);
    bindControls();
    return overlayRoot;
}

function syncOverlay(): void {
    if (!overlayRoot) {
        return;
    }

    const overlayState = !playbackState || playbackState.loading || !playbackState.active ? 'loading' : 'active';
    overlayRoot.setAttribute(OVERLAY_STATE_ATTR, overlayState);

    const shell = overlayRoot.querySelector('.embedded-shell') as HTMLElement | null;
    const title = overlayRoot.querySelector('.embedded-title') as HTMLElement | null;
    const subtitle = overlayRoot.querySelector('.embedded-subtitle') as HTMLElement | null;
    const status = overlayRoot.querySelector('.embedded-status') as HTMLElement | null;
    const playPauseButton = overlayRoot.querySelector('[data-action="play-pause"]') as HTMLButtonElement | null;
    const fullscreenButton = overlayRoot.querySelector('[data-action="fullscreen"]') as HTMLButtonElement | null;
    const seekInput = overlayRoot.querySelector('[data-action="seek"]') as HTMLInputElement | null;
    const volumeInput = overlayRoot.querySelector('[data-action="volume"]') as HTMLInputElement | null;
    const audioSelect = overlayRoot.querySelector('[data-action="audio-track"]') as HTMLSelectElement | null;
    const subtitleSelect = overlayRoot.querySelector('[data-action="subtitle-track"]') as HTMLSelectElement | null;
    const currentTime = overlayRoot.querySelector('[data-role="current-time"]') as HTMLElement | null;
    const duration = overlayRoot.querySelector('[data-role="duration"]') as HTMLElement | null;

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

    if (playPauseButton) {
        playPauseButton.textContent = playbackState?.paused ? 'Play' : 'Pause';
    }

    if (fullscreenButton) {
        fullscreenButton.textContent = playbackState?.fullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }

    if (seekInput) {
        const seekMax = Math.max(playbackState?.duration ?? 0, 0);
        const seekValue = Math.min(playbackState?.timePos ?? 0, seekMax);
        seekInput.max = String(seekMax || 1);
        seekInput.value = String(seekValue);
    }

    if (volumeInput) {
        volumeInput.value = String(Math.round(playbackState?.volume ?? 100));
    }

    if (currentTime) {
        currentTime.textContent = formatTime(playbackState?.timePos ?? 0);
    }

    if (duration) {
        duration.textContent = formatTime(playbackState?.duration ?? 0);
    }

    if (audioSelect) {
        audioSelect.innerHTML = buildTrackOptions(
            playbackState?.audioTracks ?? [],
            playbackState?.currentAudioTrackId ?? null,
            false,
            'No audio tracks',
        );
    }

    if (subtitleSelect) {
        subtitleSelect.innerHTML = buildTrackOptions(
            playbackState?.subtitleTracks ?? [],
            playbackState?.currentSubtitleTrackId ?? null,
            true,
            'No subtitles',
        );
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
    ensureStateSubscription();
    overlayRoot?.setAttribute(OVERLAY_STATE_ATTR, 'loading');
    syncOverlay();
}

export function deactivateEmbeddedOverlay(): void {
    document.documentElement.removeAttribute(ACTIVE_ATTR);
    document.body.removeAttribute(ACTIVE_ATTR);
    playbackContext = null;
    playbackState = null;

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

export function getEmbeddedPlaybackState(): EmbeddedMpvState | null {
    return playbackState;
}