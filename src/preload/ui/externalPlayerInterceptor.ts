import { STORAGE_KEYS, PLAYER_PATH_STORAGE_KEY } from '../../constants';
import { externalPlayerAPI } from '../api/externalPlayer';
import {
    isEmbeddedMpvPlaybackMode,
    isExternalPlayerMode,
    type ExternalPlayer,
    type PlaybackMode,
} from '../../interfaces/ExternalPlayerTypes';
import type PlayerState from '../../interfaces/PlayerState';
import PlaybackState from '../../utils/PlaybackState';
import Helpers from '../../utils/Helpers';
import { getLogger } from '../../utils/logger';
import {
    activateEmbeddedOverlay,
    deactivateEmbeddedOverlay,
    prepareEmbeddedOverlay,
    updateEmbeddedOverlayState,
} from './embeddedOverlayController';
import {
    activateEmbeddedNativePlayerBridge,
    deactivateEmbeddedNativePlayerBridge,
} from './embeddedNativePlayerBridge';
import {
    EXIT_EMBEDDED_PLAYBACK_EVENT,
    isEmbeddedShellRouteHash,
    isManagedPlaybackRouteHash,
    isNativePlayerRouteHash,
    NATIVE_PLAYER_ROUTE_PREFIX,
} from './playbackRoutes';

const logger = getLogger("PlaybackModeInterceptor");
const ROUTE_EXIT_STOP_DELAY_MS = 1500;
const EARLY_LAUNCH_POLL_MS = 100;
const EARLY_LAUNCH_TIMEOUT_MS = 4000;
const PLAYER_ROUTE_INTENT_EVENT = 'stremio-enhanced-player-route-intent';

let isLaunching = false;
let activeEmbeddedStreamUrl: string | null = null;
let streamMonitorId: number | null = null;
let stopTimerId: number | null = null;
let earlyLaunchPollId: number | null = null;
let earlyLaunchTimeoutId: number | null = null;
let hasPendingPlayerRouteIntent = false;
let routeIntentHooksInstalled = false;
let pendingEmbeddedPlayerState: PlayerState | null = null;
let lastNonPlaybackHash = location.hash && !isManagedPlaybackRouteHash(location.hash) ? location.hash : '#/';
let routeObserverInstalled = false;
let lastRouteObserverEnabled: boolean | null = null;

function getPlaybackMode(): PlaybackMode {
    return (localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE) ?? 'disabled') as PlaybackMode;
}

function shouldUseEmbeddedOverlay(): boolean {
    return isEmbeddedShellRouteHash();
}

function navigateToLastNonPlaybackRoute(): void {
    const targetHash = lastNonPlaybackHash || '#/';
    if (location.hash === targetHash) {
        return;
    }

    location.replace(`${location.href.split('#')[0]}${targetHash}`);
}

function setPlayerRouteIntentObserverEnabled(enabled: boolean): void {
    if (lastRouteObserverEnabled === enabled) {
        return;
    }

    lastRouteObserverEnabled = enabled;

    if (routeObserverInstalled) {
        const toggle = document.createElement('script');
        toggle.textContent = `(() => {
            const s = window['__stremioEnhancedPlaybackRouteObserver'];
            if (s) {
                s.enabled = ${enabled ? 'true' : 'false'};
                if (s.enabled && window.location.hash.startsWith(${JSON.stringify(NATIVE_PLAYER_ROUTE_PREFIX)})) {
                    s.hashHandler();
                }
            }
        })();`;
        (document.head ?? document.documentElement).appendChild(toggle);
        toggle.remove();
        return;
    }

    const script = document.createElement('script');
    script.textContent = `
        (() => {
            const stateKey = '__stremioEnhancedPlaybackRouteObserver';
            const nativePrefix = ${JSON.stringify(NATIVE_PLAYER_ROUTE_PREFIX)};
            const eventName = ${JSON.stringify(PLAYER_ROUTE_INTENT_EVENT)};
            const isPlayerRouteUrl = (value) => {
                try {
                    return new URL(value, window.location.href).hash.startsWith(nativePrefix);
                } catch {
                    return typeof value === 'string' && value.startsWith(nativePrefix);
                }
            };

            const interceptPlayerRoute = (value) => {
                if (value == null || !state.enabled) {
                    return null;
                }

                if (isPlayerRouteUrl(value)) {
                    const raw = typeof value === 'string' ? value : String(value);
                    window.dispatchEvent(new CustomEvent(eventName, { detail: { source: 'navigation-api', href: raw } }));
                }

                return null;
            };

            if (!(stateKey in window)) {
                const originalPushState = history.pushState.bind(history);
                const originalReplaceState = history.replaceState.bind(history);
                const originalAssign = typeof Location.prototype.assign === 'function' ? Location.prototype.assign : null;
                const originalReplace = typeof Location.prototype.replace === 'function' ? Location.prototype.replace : null;

                const state = {
                    enabled: false,
                    clickHandler: (event) => {
                        if (!state.enabled) {
                            return;
                        }

                        const target = event.target;
                        if (!(target instanceof Element)) {
                            return;
                        }

                        const anchor = target.closest('a[href]');
                        if (!(anchor instanceof HTMLAnchorElement)) {
                            return;
                        }

                        const hrefAttr = anchor.getAttribute('href');
                        if (!hrefAttr) {
                            return;
                        }

                        if (!isPlayerRouteUrl(hrefAttr)) {
                            return;
                        }

                        window.dispatchEvent(new CustomEvent(eventName, { detail: { source: 'anchor-click', href: hrefAttr } }));
                    },
                    hashHandler: () => {
                        if (!state.enabled || !window.location.hash.startsWith(nativePrefix)) {
                            return;
                        }

                        window.dispatchEvent(new CustomEvent(eventName, { detail: { source: 'hashchange', href: window.location.hash } }));
                    },
                };

                history.pushState = function (historyState, title, url) {
                    const rewritten = interceptPlayerRoute(url);
                    return originalPushState(historyState, title, rewritten ?? url);
                };

                history.replaceState = function (historyState, title, url) {
                    const rewritten = interceptPlayerRoute(url);
                    return originalReplaceState(historyState, title, rewritten ?? url);
                };

                if (originalAssign) {
                    Location.prototype.assign = function (url) {
                        const rewritten = interceptPlayerRoute(url);
                        return originalAssign.call(this, rewritten ?? url);
                    };
                }

                if (originalReplace) {
                    Location.prototype.replace = function (url) {
                        const rewritten = interceptPlayerRoute(url);
                        return originalReplace.call(this, rewritten ?? url);
                    };
                }

                document.addEventListener('click', state.clickHandler, true);
                window.addEventListener('hashchange', state.hashHandler, true);
                window[stateKey] = state;
            }

            const state = window[stateKey];
            state.enabled = ${enabled ? 'true' : 'false'};

            if (state.enabled && window.location.hash.startsWith(nativePrefix)) {
                state.hashHandler();
            }
        })();
    `;

    (document.head ?? document.documentElement).appendChild(script);
    script.remove();
    routeObserverInstalled = true;
}

function ensurePlayerRouteIntentHooks(): void {
    if (routeIntentHooksInstalled) {
        return;
    }

    routeIntentHooksInstalled = true;
    window.addEventListener(PLAYER_ROUTE_INTENT_EVENT, (event: Event) => {
        const detail = (event as CustomEvent<{ source?: string }>).detail;
        markPlayerRouteIntent(detail?.source ?? 'route-intent');
    });

    window.addEventListener(EXIT_EMBEDDED_PLAYBACK_EVENT, () => {
        stopEmbeddedPlayback(true);
    });
}

function clearPendingPlayerRouteIntent(resetUi: boolean, clearPendingState: boolean = true): void {
    hasPendingPlayerRouteIntent = false;

    if (earlyLaunchPollId !== null) {
        window.clearInterval(earlyLaunchPollId);
        earlyLaunchPollId = null;
    }

    if (earlyLaunchTimeoutId !== null) {
        window.clearTimeout(earlyLaunchTimeoutId);
        earlyLaunchTimeoutId = null;
    }

    if (clearPendingState) {
        pendingEmbeddedPlayerState = null;
    }

    if (resetUi && activeEmbeddedStreamUrl == null && !isLaunching) {
        deactivateEmbeddedOverlay();
        deactivateEmbeddedNativePlayerBridge();
    }
}

async function getImmediatePlayerState(): Promise<PlayerState | null> {
    try {
        const playerState = await Helpers._eval('core.transport.getState("player")') as {
            seriesInfo?: PlayerState['seriesInfoDetails'];
            metaItem?: { content?: PlayerState['metaDetails'] };
            stream?: { content: { url: string } };
        };

        if (!playerState?.metaItem?.content) {
            return null;
        }

        return {
            seriesInfoDetails: playerState.seriesInfo ?? null,
            metaDetails: playerState.metaItem.content,
            stream: playerState.stream,
        };
    } catch {
        return null;
    }
}

function markPlayerRouteIntent(source: string): void {
    if (!isEmbeddedMpvPlaybackMode(getPlaybackMode())) {
        return;
    }

    cancelScheduledStop();
    hasPendingPlayerRouteIntent = true;

    if (shouldUseEmbeddedOverlay()) {
        prepareEmbeddedOverlay();
    } else {
        deactivateEmbeddedOverlay();
    }

    if (earlyLaunchPollId === null) {
        earlyLaunchPollId = window.setInterval(() => {
            void tryEarlyEmbeddedLaunch();
        }, EARLY_LAUNCH_POLL_MS);
    }

    if (earlyLaunchTimeoutId !== null) {
        window.clearTimeout(earlyLaunchTimeoutId);
    }

    earlyLaunchTimeoutId = window.setTimeout(() => {
        logger.info(`Clearing pending embedded player intent (${source}) after timeout`);
        clearPendingPlayerRouteIntent(true);
        if (isNativePlayerRouteHash()) {
            navigateToLastNonPlaybackRoute();
        }
    }, EARLY_LAUNCH_TIMEOUT_MS);

    void tryEarlyEmbeddedLaunch();
}

async function tryEarlyEmbeddedLaunch(): Promise<void> {
    if (!hasPendingPlayerRouteIntent || isLaunching || !isEmbeddedMpvPlaybackMode(getPlaybackMode())) {
        return;
    }

    const playerState = await getImmediatePlayerState();
    if (!playerState?.stream?.content?.url) {
        return;
    }

    pendingEmbeddedPlayerState = playerState;
    clearPendingPlayerRouteIntent(false, false);

    if (isManagedPlaybackRouteHash() && !isLaunching) {
        void launchEmbedded(playerState);
    }
}

function cancelScheduledStop(): void {
    if (stopTimerId !== null) {
        window.clearTimeout(stopTimerId);
        stopTimerId = null;
    }
}

function scheduleStopEmbeddedPlayback(reason: string): void {
    cancelScheduledStop();

    stopTimerId = window.setTimeout(() => {
        stopTimerId = null;

        if (isManagedPlaybackRouteHash()) {
            return;
        }

        logger.info(`Stopping embedded playback after ${reason}`);
        stopEmbeddedPlayback();
    }, ROUTE_EXIT_STOP_DELAY_MS);
}

export function checkExternalPlayer(): void {
    ensurePlayerRouteIntentHooks();

    const playbackMode = getPlaybackMode();
    const embeddedMode = isEmbeddedMpvPlaybackMode(playbackMode);
    setPlayerRouteIntentObserverEnabled(embeddedMode);

    if (!isManagedPlaybackRouteHash()) {
        if (!hasPendingPlayerRouteIntent) {
            lastNonPlaybackHash = location.hash || '#/';
        }

        if (!embeddedMode) {
            clearPendingPlayerRouteIntent(true);
        }

        if (hasPendingPlayerRouteIntent) {
            return;
        }

        if (activeEmbeddedStreamUrl !== null) {
            scheduleStopEmbeddedPlayback('embedded route exit');
        }
        return;
    }

    if (embeddedMode) {
        if (isNativePlayerRouteHash()) {
            markPlayerRouteIntent('native player route');
            return;
        }

        if (isEmbeddedShellRouteHash()) {
            cancelScheduledStop();

            if (isLaunching) {
                return;
            }

            void launchEmbedded(pendingEmbeddedPlayerState);
            return;
        }
    }

    cancelScheduledStop();

    if (isLaunching) {
        return;
    }

    if (isEmbeddedShellRouteHash()) {
        navigateToLastNonPlaybackRoute();
    }

    stopEmbeddedPlayback();

    if (!isExternalPlayerMode(playbackMode) || playbackMode === 'disabled') {
        return;
    }

    void launchExternal(playbackMode);
}

async function launchExternal(player: ExternalPlayer): Promise<void> {
    isLaunching = true;
    try {
        logger.info(`External player interceptor triggered for ${player}`);

        const playerState = await PlaybackState.getPlayerState();
        if (!playerState?.stream?.content?.url) {
            logger.error("Could not retrieve stream URL for external player.");
            Helpers.createToast("extPlayerError", "External Player", "Could not get stream URL.", "fail");
            return;
        }

        const streamUrl = playerState.stream.content.url;
        logger.info(`Launching ${player} with stream URL: ${streamUrl}`);

        navigateToLastNonPlaybackRoute();

        const customPath = localStorage.getItem(PLAYER_PATH_STORAGE_KEY[player]);

        const result = await externalPlayerAPI.launchExternalPlayer(player, streamUrl, customPath || undefined);
        if (result.success) {
            Helpers.createToast("extPlayerLaunch", "External Player", `Opening stream in ${player.toUpperCase()}...`, "success");
        } else {
            Helpers.createToast("extPlayerError", "External Player", result.error ?? "Failed to launch player.", "fail");
        }
    } finally {
        isLaunching = false;
    }
}

async function launchEmbedded(initialPlayerState?: PlayerState | null): Promise<void> {
    isLaunching = true;

    try {
        const playerState = initialPlayerState ?? await PlaybackState.getPlayerState();
        if (!playerState?.stream?.content?.url) {
            logger.error("Could not retrieve stream URL for embedded MPV.");
            deactivateEmbeddedNativePlayerBridge();
            Helpers.createToast("embeddedMpvError", "Embedded MPV", "Could not get stream URL.", "fail");
            if (isEmbeddedShellRouteHash()) {
                navigateToLastNonPlaybackRoute();
            }
            return;
        }

        const streamUrl = playerState.stream.content.url;
        if (activeEmbeddedStreamUrl === streamUrl) {
            if (shouldUseEmbeddedOverlay()) {
                activateEmbeddedOverlay(playerState);
            } else {
                deactivateEmbeddedOverlay();
            }
            activateEmbeddedNativePlayerBridge();
            pendingEmbeddedPlayerState = null;
            ensureStreamMonitor();
            return;
        }

        const environment = await externalPlayerAPI.getEmbeddedMpvEnvironment();
        const customPath = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH) ?? undefined;

        if (!environment.transparentWindow) {
            deactivateEmbeddedOverlay();
            deactivateEmbeddedNativePlayerBridge();
            Helpers.createToast(
                "embeddedMpvRestartRequired",
                "Embedded MPV",
                "Embedded mode needs a transparent window. Restart Stremio Enhanced after enabling the playback mode.",
                "info",
                4500,
            );
            if (isEmbeddedShellRouteHash()) {
                navigateToLastNonPlaybackRoute();
            }
            return;
        }

        if (!customPath && !environment.available) {
            deactivateEmbeddedOverlay();
            deactivateEmbeddedNativePlayerBridge();
            Helpers.createToast(
                "embeddedMpvMissing",
                "Embedded MPV",
                "MPV was not found. Install MPV or set a custom MPV path in settings.",
                "fail",
                4500,
            );
            if (isEmbeddedShellRouteHash()) {
                navigateToLastNonPlaybackRoute();
            }
            return;
        }

        if (shouldUseEmbeddedOverlay()) {
            activateEmbeddedOverlay(playerState);
        } else {
            deactivateEmbeddedOverlay();
        }

        const result = await externalPlayerAPI.startEmbeddedMpv(
            {
                streamUrl,
                title: playerState.metaDetails.name,
            },
            customPath,
        );

        if (!result.success) {
            activeEmbeddedStreamUrl = null;
            pendingEmbeddedPlayerState = null;
            deactivateEmbeddedOverlay();
            deactivateEmbeddedNativePlayerBridge();
            Helpers.createToast("embeddedMpvLaunchFail", "Embedded MPV", result.error ?? "Failed to start embedded playback.", "fail", 4500);
            if (isEmbeddedShellRouteHash()) {
                navigateToLastNonPlaybackRoute();
            }
            return;
        }

        activeEmbeddedStreamUrl = streamUrl;
        pendingEmbeddedPlayerState = null;
        clearPendingPlayerRouteIntent(false);
        activateEmbeddedNativePlayerBridge();
        if (shouldUseEmbeddedOverlay()) {
            updateEmbeddedOverlayState(await externalPlayerAPI.getEmbeddedMpvState());
        } else {
            deactivateEmbeddedOverlay();
        }
        ensureStreamMonitor();
    } finally {
        isLaunching = false;
    }
}

function ensureStreamMonitor(): void {
    if (streamMonitorId !== null) {
        return;
    }

    streamMonitorId = window.setInterval(() => {
        void monitorEmbeddedStream();
    }, 2000);
}

async function monitorEmbeddedStream(): Promise<void> {
    if (!isManagedPlaybackRouteHash()) {
        scheduleStopEmbeddedPlayback('stream monitor route exit');
        return;
    }

    cancelScheduledStop();

    if (!isEmbeddedMpvPlaybackMode(getPlaybackMode()) || isLaunching) {
        return;
    }

    const playerState = await PlaybackState.getPlayerState();
    const streamUrl = playerState?.stream?.content?.url;
    const mpvState = await externalPlayerAPI.getEmbeddedMpvState();

    if (!mpvState.active && streamUrl === activeEmbeddedStreamUrl) {
        activeEmbeddedStreamUrl = null;
    }

    if (!streamUrl || streamUrl === activeEmbeddedStreamUrl) {
        return;
    }

    await launchEmbedded(playerState);
}

function stopEmbeddedPlayback(restoreRoute: boolean = false): void {
    cancelScheduledStop();
    clearPendingPlayerRouteIntent(false);
    activeEmbeddedStreamUrl = null;
    pendingEmbeddedPlayerState = null;
    deactivateEmbeddedOverlay();
    deactivateEmbeddedNativePlayerBridge();

    if (streamMonitorId !== null) {
        window.clearInterval(streamMonitorId);
        streamMonitorId = null;
    }

    void externalPlayerAPI.stopEmbeddedMpv();

    if (restoreRoute) {
        navigateToLastNonPlaybackRoute();
    }
}
