import { webFrame } from 'electron';
import { addShellMessageListener, sendShellMessageToMain } from './mpvShellBridge';
import { enforcePlayerTransparency } from './transparencyBridge';

let bridgeHost: HTMLDivElement | null = null;
let bridgeVideo: HTMLVideoElement | null = null;

let currentTimeVal = 0;
let durationVal = 0;
let pausedVal = false;
let seekingVal = false;
let endedVal = false;
let speedVal = 1;
let volumeVal = 1;
let mutedVal = false;
let srcVal = '';
let videoWidthVal = 1920;
let videoHeightVal = 1080;

function createTimeRanges(start: number, end: number) {
    return {
        length: end > start ? 1 : 0,
        start(i: number) {
            if (i === 0 && end > start) return start;
            throw new DOMException('IndexSizeError');
        },
        end(i: number) {
            if (i === 0 && end > start) return end;
            throw new DOMException('IndexSizeError');
        },
    };
}

function sendMpvProp(name: string, value: unknown): void {
    sendShellMessageToMain(JSON.stringify({
        type: 6,
        args: ['mpv-set-prop', [name, value]],
    }));
}

function sendMpvCmd(args: unknown[]): void {
    sendShellMessageToMain(JSON.stringify({
        type: 6,
        args: ['mpv-command', args],
    }));
}

export function mountBridgeHost(): void {
    if (!bridgeHost) return;
    const playerContainer = document.querySelector<HTMLElement>('[class*="player-container"]');
    const targetParent = playerContainer || document.body;
    if (targetParent && bridgeHost.parentElement !== targetParent) {
        targetParent.appendChild(bridgeHost);
    }
}

export function ensureBridgeVideo(): void {
    mountBridgeHost();
    enforcePlayerTransparency();
    if (durationVal > 0 && bridgeVideo) {
        bridgeVideo.dispatchEvent(new Event('loadedmetadata'));
        bridgeVideo.dispatchEvent(new Event('durationchange'));
    }
}

/**
 * Provides a virtual <video> element synced with libmpv so Discord RPC, VolumePersistency,
 * and Stremio Enhanced plugins expecting document.querySelector('video') work seamlessly.
 */
export function setupVideoBridge(): HTMLVideoElement {
    bridgeHost = document.getElementById('stremio-enhanced-bridge-host') as HTMLDivElement | null;
    if (!bridgeHost) {
        bridgeHost = document.createElement('div');
        bridgeHost.id = 'stremio-enhanced-bridge-host';
        Object.assign(bridgeHost.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '0px',
            height: '0px',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '-9999',
            overflow: 'hidden',
        });
    }

    bridgeVideo = document.getElementById('stremio-shell-bridge-video') as HTMLVideoElement | null;
    if (!bridgeVideo) {
        bridgeVideo = document.createElement('video');
        bridgeVideo.id = 'stremio-shell-bridge-video';
        bridgeVideo.className = 'stremio-shell-bridge-video';
        bridgeVideo.setAttribute('playsinline', '');
        bridgeVideo.setAttribute('muted', '');
        bridgeHost.appendChild(bridgeVideo);
    }

    bridgeVideo.closest = function (selector: string) {
        if (typeof selector === 'string' && selector.includes('player-container')) {
            return document.querySelector('[class*="player-container"]') ||
                document.querySelector('.player-container') ||
                document.body;
        }
        return Element.prototype.closest.call(this, selector);
    };

    bridgeVideo.getBoundingClientRect = function (): DOMRect {
        const playerContainer = document.querySelector<HTMLElement>('[class*="player-container"]');
        if (playerContainer) return playerContainer.getBoundingClientRect();
        return new DOMRect(0, 0, window.innerWidth || 1280, window.innerHeight || 720);
    };

    try {
        Object.defineProperty(bridgeVideo, 'currentTime', {
            get() { return currentTimeVal; },
            set(val: number) {
                const targetTime = Math.max(0, Number(val) || 0);
                currentTimeVal = targetTime;
                sendMpvCmd(['seek', String(targetTime), 'absolute']);
                sendMpvProp('time-pos', targetTime);
                bridgeVideo!.dispatchEvent(new Event('seeking'));
                bridgeVideo!.dispatchEvent(new Event('timeupdate'));
                setTimeout(() => {
                    bridgeVideo?.dispatchEvent(new Event('seeked'));
                    bridgeVideo?.dispatchEvent(new Event('timeupdate'));
                }, 50);
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'duration', {
            get() { return durationVal; },
            set(val: number) {
                const next = Math.max(0, Number(val) || 0);
                if (durationVal !== next) {
                    durationVal = next;
                    bridgeVideo!.dispatchEvent(new Event('durationchange'));
                    bridgeVideo!.dispatchEvent(new Event('loadedmetadata'));
                }
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'paused', {
            get() { return pausedVal; },
            set(val: boolean) {
                pausedVal = Boolean(val);
                sendMpvProp('pause', pausedVal);
                bridgeVideo!.dispatchEvent(new Event(pausedVal ? 'pause' : 'play'));
                if (!pausedVal) bridgeVideo!.dispatchEvent(new Event('playing'));
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'seeking', {
            get() { return seekingVal; },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'ended', {
            get() { return endedVal; },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'playbackRate', {
            get() { return speedVal; },
            set(val: number) {
                speedVal = Number(val) || 1;
                sendMpvProp('speed', speedVal);
                bridgeVideo!.dispatchEvent(new Event('ratechange'));
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'volume', {
            get() { return volumeVal; },
            set(val: number) {
                volumeVal = Math.max(0, Math.min(1, Number(val)));
                sendMpvProp('volume', Math.round(volumeVal * 100));
                bridgeVideo!.dispatchEvent(new Event('volumechange'));
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'muted', {
            get() { return mutedVal; },
            set(val: boolean) {
                mutedVal = Boolean(val);
                sendMpvProp('mute', mutedVal ? 'yes' : 'no');
                bridgeVideo!.dispatchEvent(new Event('volumechange'));
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'src', {
            get() { return srcVal; },
            set(val: string) {
                srcVal = String(val || '');
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'currentSrc', {
            get() { return srcVal; },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'readyState', {
            get() {
                const inPlayer = window.location.hash.startsWith('#/player') || Boolean(document.querySelector('[class*="player-container"]'));
                return (durationVal > 0 || srcVal !== '' || inPlayer) ? 4 : 0;
            },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'videoWidth', {
            get() { return videoWidthVal; },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'videoHeight', {
            get() { return videoHeightVal; },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'buffered', {
            get() { return createTimeRanges(0, durationVal); },
            configurable: true,
        });

        Object.defineProperty(bridgeVideo, 'seekable', {
            get() { return createTimeRanges(0, durationVal); },
            configurable: true,
        });

        bridgeVideo.play = function () {
            pausedVal = false;
            sendMpvProp('pause', false);
            bridgeVideo!.dispatchEvent(new Event('play'));
            bridgeVideo!.dispatchEvent(new Event('playing'));
            return Promise.resolve();
        };

        bridgeVideo.pause = function () {
            pausedVal = true;
            sendMpvProp('pause', true);
            bridgeVideo!.dispatchEvent(new Event('pause'));
        };
    } catch {
        // Ignore redefinition errors
    }

    addShellMessageListener((raw) => {
        try {
            const msg = JSON.parse(raw);
            if (!msg || !Array.isArray(msg.args)) return;
            const [action, payload] = msg.args;

            if (action === 'mpv-prop-change' && payload) {
                const { name, data } = payload;
                if (name === 'time-pos') {
                    const next = Number(data);
                    if (Number.isFinite(next) && Math.abs(currentTimeVal - next) > 0.01) {
                        currentTimeVal = next;
                        bridgeVideo!.dispatchEvent(new Event('timeupdate'));
                    }
                } else if (name === 'duration') {
                    const next = Number(data);
                    if (Number.isFinite(next) && next > 0 && durationVal !== next) {
                        durationVal = next;
                        bridgeVideo!.dispatchEvent(new Event('durationchange'));
                        bridgeVideo!.dispatchEvent(new Event('loadedmetadata'));
                    }
                } else if (name === 'pause') {
                    const nextPaused = Boolean(data);
                    if (pausedVal !== nextPaused) {
                        pausedVal = nextPaused;
                        bridgeVideo!.dispatchEvent(new Event(pausedVal ? 'pause' : 'play'));
                        if (!pausedVal) bridgeVideo!.dispatchEvent(new Event('playing'));
                    }
                } else if (name === 'seeking') {
                    seekingVal = Boolean(data);
                    if (seekingVal) {
                        bridgeVideo!.dispatchEvent(new Event('seeking'));
                    } else {
                        bridgeVideo!.dispatchEvent(new Event('seeked'));
                        bridgeVideo!.dispatchEvent(new Event('timeupdate'));
                    }
                } else if (name === 'path') {
                    if (data) {
                        srcVal = String(data);
                        endedVal = false;
                        bridgeVideo!.dispatchEvent(new Event('loadstart'));
                        bridgeVideo!.dispatchEvent(new Event('loadedmetadata'));
                        if (!pausedVal) bridgeVideo!.dispatchEvent(new Event('playing'));
                    }
                } else if (name === 'speed') {
                    speedVal = Number(data) || 1;
                    bridgeVideo!.dispatchEvent(new Event('ratechange'));
                } else if (name === 'volume') {
                    const v = Number(data);
                    if (Number.isFinite(v)) {
                        volumeVal = Math.max(0, Math.min(1, v / 100));
                        bridgeVideo!.dispatchEvent(new Event('volumechange'));
                    }
                } else if (name === 'mute') {
                    mutedVal = data === true || data === 'yes';
                    bridgeVideo!.dispatchEvent(new Event('volumechange'));
                } else if (name === 'video-params' && data && typeof data === 'object') {
                    if (data.w && data.h) {
                        videoWidthVal = Number(data.w) || 1920;
                        videoHeightVal = Number(data.h) || 1080;
                    }
                }
            } else if (action === 'mpv-event-ended') {
                endedVal = true;
                bridgeVideo!.dispatchEvent(new Event('ended'));
            }
        } catch {
            // Ignore malformed messages
        }
    });

    if (document.body) {
        mountBridgeHost();
    } else {
        document.addEventListener('DOMContentLoaded', mountBridgeHost, { once: true });
        window.addEventListener('load', mountBridgeHost, { once: true });
    }

    // Mirror the bridge <video> properties into the main world so context-isolated plugins
    // (AniSkip, playback speed, PiP, etc.) see accurate MPV state & seek/play/pause controls.
    webFrame.executeJavaScript(`
        (() => {
            if (window.__STREMIO_VIDEO_BRIDGE_MAIN_INSTALLED__) return;
            window.__STREMIO_VIDEO_BRIDGE_MAIN_INSTALLED__ = true;

            let curTime = 0, dur = 0, isPaused = false, isSeeking = false, isEnded = false;
            let rate = 1, vol = 1, isMuted = false, srcStr = '', vw = 1920, vh = 1080;

            const sendProp = (name, val) => {
                window.ipc?.postMessage?.(JSON.stringify({ type: 6, args: ['mpv-set-prop', [name, val]] }));
            };
            const sendCmd = (args) => {
                window.ipc?.postMessage?.(JSON.stringify({ type: 6, args: ['mpv-command', args] }));
            };
            const mkRanges = (s, e) => ({
                length: e > s ? 1 : 0,
                start(i) { if (i === 0 && e > s) return s; throw new DOMException('IndexSizeError'); },
                end(i) { if (i === 0 && e > s) return e; throw new DOMException('IndexSizeError'); }
            });

            const patchVideo = () => {
                const v = document.getElementById('stremio-shell-bridge-video');
                if (!v || v.__enhancedMainPatched) return v;
                v.__enhancedMainPatched = true;

                try {
                    v.closest = function (selector) {
                        if (typeof selector === 'string' && selector.includes('player-container')) {
                            return document.querySelector('[class*="player-container"]') ||
                                document.querySelector('.player-container') ||
                                document.body;
                        }
                        return Element.prototype.closest.call(this, selector);
                    };
                    v.getBoundingClientRect = function () {
                        const pc = document.querySelector('[class*="player-container"]');
                        if (pc) return pc.getBoundingClientRect();
                        return new DOMRect(0, 0, window.innerWidth || 1280, window.innerHeight || 720);
                    };
                    Object.defineProperties(v, {
                        currentTime: {
                            get: () => curTime,
                            set: (val) => {
                                curTime = Math.max(0, Number(val) || 0);
                                sendCmd(['seek', String(curTime), 'absolute']);
                                sendProp('time-pos', curTime);
                                v.dispatchEvent(new Event('seeking'));
                                v.dispatchEvent(new Event('timeupdate'));
                            },
                            configurable: true
                        },
                        duration: { get: () => dur, configurable: true },
                        paused: {
                            get: () => isPaused,
                            set: (val) => {
                                isPaused = Boolean(val);
                                sendProp('pause', isPaused);
                                v.dispatchEvent(new Event(isPaused ? 'pause' : 'play'));
                                if (!isPaused) v.dispatchEvent(new Event('playing'));
                            },
                            configurable: true
                        },
                        seeking: { get: () => isSeeking, configurable: true },
                        ended: { get: () => isEnded, configurable: true },
                        playbackRate: {
                            get: () => rate,
                            set: (val) => { rate = Number(val) || 1; sendProp('speed', rate); v.dispatchEvent(new Event('ratechange')); },
                            configurable: true
                        },
                        volume: {
                            get: () => vol,
                            set: (val) => { vol = Math.max(0, Math.min(1, Number(val))); sendProp('volume', Math.round(vol * 100)); v.dispatchEvent(new Event('volumechange')); },
                            configurable: true
                        },
                        muted: {
                            get: () => isMuted,
                            set: (val) => { isMuted = Boolean(val); sendProp('mute', isMuted ? 'yes' : 'no'); v.dispatchEvent(new Event('volumechange')); },
                            configurable: true
                        },
                        src: { get: () => srcStr, set: (val) => { srcStr = String(val || ''); }, configurable: true },
                        currentSrc: { get: () => srcStr, configurable: true },
                        readyState: { get: () => (dur > 0 || srcStr !== '' || location.hash.startsWith('#/player')) ? 4 : 0, configurable: true },
                        videoWidth: { get: () => vw, configurable: true },
                        videoHeight: { get: () => vh, configurable: true },
                        buffered: { get: () => mkRanges(0, dur), configurable: true },
                        seekable: { get: () => mkRanges(0, dur), configurable: true },
                    });
                    v.play = () => { isPaused = false; sendProp('pause', false); v.dispatchEvent(new Event('play')); v.dispatchEvent(new Event('playing')); return Promise.resolve(); };
                    v.pause = () => { isPaused = true; sendProp('pause', true); v.dispatchEvent(new Event('pause')); };
                } catch (_) {}
                return v;
            };

            window.ipc?.addEventListener?.('message', (evt) => {
                try {
                    const msg = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
                    if (!msg || !Array.isArray(msg.args)) return;
                    const [action, payload] = msg.args;
                    const v = patchVideo();
                    if (action === 'mpv-prop-change' && payload) {
                        const { name, data } = payload;
                        if (name === 'time-pos' && Number.isFinite(Number(data))) {
                            curTime = Number(data);
                            v?.dispatchEvent(new Event('timeupdate'));
                        } else if (name === 'duration' && Number.isFinite(Number(data)) && Number(data) > 0) {
                            dur = Number(data);
                            v?.dispatchEvent(new Event('durationchange'));
                            v?.dispatchEvent(new Event('loadedmetadata'));
                        } else if (name === 'pause') {
                            isPaused = Boolean(data);
                            v?.dispatchEvent(new Event(isPaused ? 'pause' : 'play'));
                            if (!isPaused) v?.dispatchEvent(new Event('playing'));
                        } else if (name === 'seeking') {
                            isSeeking = Boolean(data);
                            v?.dispatchEvent(new Event(isSeeking ? 'seeking' : 'seeked'));
                        } else if (name === 'path' && data) {
                            srcStr = String(data);
                            isEnded = false;
                            v?.dispatchEvent(new Event('loadstart'));
                            v?.dispatchEvent(new Event('loadedmetadata'));
                        } else if (name === 'speed') {
                            rate = Number(data) || 1;
                            v?.dispatchEvent(new Event('ratechange'));
                        } else if (name === 'volume' && Number.isFinite(Number(data))) {
                            vol = Math.max(0, Math.min(1, Number(data) / 100));
                            v?.dispatchEvent(new Event('volumechange'));
                        } else if (name === 'mute') {
                            isMuted = data === true || data === 'yes';
                            v?.dispatchEvent(new Event('volumechange'));
                        } else if (name === 'video-params' && data && typeof data === 'object') {
                            if (data.w) vw = Number(data.w) || 1920;
                            if (data.h) vh = Number(data.h) || 1080;
                        }
                    } else if (action === 'mpv-event-ended') {
                        isEnded = true;
                        v?.dispatchEvent(new Event('ended'));
                    }
                } catch (_) {}
            });

            patchVideo();
            window.addEventListener('hashchange', patchVideo);
        })();
    `).catch(() => {});

    return bridgeVideo;
}
