import { app, BrowserWindow, ipcMain, powerSaveBlocker, screen, sharedTexture } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import MPV from 'electron-libmpv';
import { ENHANCED_API } from '../constants';
import { mainWindow } from '../main';
import { getLogger } from '../utils/logger';

const logger = getLogger('MpvPlayerController');

const TRANSPORT_NAME = 'transport';
const SHELL_PROTOCOL_VERSION = '5.0.27';

const FLOAT_PROPERTIES = new Set([
    'time-pos',
    'duration',
    'volume',
    'speed',
    'sub-pos',
    'sub-scale',
    'sub-delay',
    'secondary-sub-delay',
    'secondary-sub-pos',
    'cache-buffering-state',
    'demuxer-cache-time',
    'panscan',
]);

const BOOL_PROPERTIES = new Set([
    'pause',
    'buffering',
    'seeking',
    'osc',
    'input-default-bindings',
    'input-vo-keyboard',
    'eof-reached',
    'paused-for-cache',
    'keepaspect',
    'sub-ass-force-margins',
    'sub-bold',
    'secondary-sub-visibility',
]);

const NODE_PROPERTIES = new Set([
    'track-list',
    'video-params',
    'metadata',
]);

// Properties that ShellVideo expects as raw strings (or boolean for mute) instead of JSON-parsed numbers.
const PLAIN_STRING_PROPERTIES = new Set([
    'path',
    'mpv-version',
    'ffmpeg-version',
    'aid',
    'vid',
    'sid',
    'secondary-sid',
    'mute',
    'hwdec',
    'sub-color',
    'sub-back-color',
    'sub-border-color',
    'sub-ass-override',
    'sub-text',
    'secondary-sub-text',
]);

const GPU_ERROR_FALLBACK_THRESHOLD = 5;
const SHARED_TEXTURE_ACK_TIMEOUT_MS = 3000;

function isSafeStartOption(option: string): boolean {
    if (!option.startsWith('start=+')) return false;
    const num = Number(option.slice('start=+'.length));
    return Number.isFinite(num) && num >= 0;
}

function normalizeMpvCommand(cmdName: string, cmdArgs: string[]): { name: string; args: string[] } {
    // mpv 0.38+ added an optional `index` parameter before `options` in `loadfile`:
    // normalize 4-arg `loadfile <url> replace start=+X` to 5-arg `loadfile <url> replace -1 start=+X`.
    if (cmdName === 'loadfile' && cmdArgs.length === 3 && cmdArgs[1] === 'replace' && isSafeStartOption(cmdArgs[2])) {
        return { name: cmdName, args: [cmdArgs[0], 'replace', '-1', cmdArgs[2]] };
    }
    return { name: cmdName, args: cmdArgs };
}

function observeFormatForProperty(name: string): MPV.MpvObserveFormat {
    if (FLOAT_PROPERTIES.has(name)) return 'double';
    if (BOOL_PROPERTIES.has(name)) return 'flag';
    if (NODE_PROPERTIES.has(name)) return 'node';
    // aid, vid, sid, mute must be observed as 'string' because when unselected in mpv
    // their value is "no", which fails MPV_FORMAT_INT64 / MPV_FORMAT_FLAG and returns MPV_FORMAT_NONE.
    return 'string';
}

function parseShellPropertyValue(name: string, value: unknown): unknown {
    if (typeof value !== 'string') return value;
    if (PLAIN_STRING_PROPERTIES.has(name)) {
        if (name === 'mute') {
            if (value === 'yes' || value === 'true') return true;
            if (value === 'no' || value === 'false') return false;
        }
        return value;
    }
    if (BOOL_PROPERTIES.has(name)) {
        if (value === 'yes' || value === 'true') return true;
        if (value === 'no' || value === 'false') return false;
    }
    if (FLOAT_PROPERTIES.has(name)) {
        const num = Number(value);
        if (Number.isFinite(num)) return num;
    }
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

/**
 * Matches stremio-shell-ng's VideoReadyState state machine so interleaved stop / loadfile
 * transitions never desync ShellVideo's loadId tracking and leave the loading screen stuck on top.
 */
class VideoReadyState {
    private nextLoadId = 0;
    private currentLoadId: number | null = null;
    private pendingLoadIds: number[] = [];
    private activeLoadId: number | null = null;
    private fileLoadedId: number | null = null;
    private readySentId: number | null = null;

    public beginTransition(loadsFile: boolean): number {
        this.nextLoadId += 1;
        this.currentLoadId = this.nextLoadId;
        this.fileLoadedId = null;
        this.readySentId = null;
        if (loadsFile) {
            this.pendingLoadIds.push(this.nextLoadId);
        }
        return this.nextLoadId;
    }

    public startFile(): void {
        this.activeLoadId = this.pendingLoadIds.shift() ?? null;
        this.fileLoadedId = null;
    }

    public fileLoaded(): void {
        if (this.activeLoadId !== null && this.activeLoadId === this.currentLoadId) {
            this.fileLoadedId = this.activeLoadId;
        }
    }

    public markReady(): number | null {
        if (this.currentLoadId === null) return null;
        if (this.fileLoadedId !== this.currentLoadId || this.readySentId === this.currentLoadId) {
            return null;
        }
        this.readySentId = this.currentLoadId;
        return this.currentLoadId;
    }

    public reset(): void {
        this.currentLoadId = null;
        this.pendingLoadIds = [];
        this.activeLoadId = null;
        this.fileLoadedId = null;
        this.readySentId = null;
    }
}

class MpvPlayerController {
    private mpv: MPV | null = null;
    private available = false;
    private ipcInitialized = false;
    private rendererReady = false;
    private softwareFallbackTriggered = false;
    private consecutiveGpuErrors = 0;
    private inFlightSharedTransfers = 0;
    private inFlightSubtleFrames = new Map<number, {
        imported: Electron.SharedTextureImported;
        timer: ReturnType<typeof setTimeout>;
    }>();
    private nextSubtleFrameId = 0;

    private viewportWidth = 1280;
    private viewportHeight = 720;
    private displaySupportsHdr = false;
    private streamHdrGamma: 'pq' | 'hlg' | null = null;
    private activeHdrGamma: 'pq' | 'hlg' | null = null;
    private hdrOutputActive = false;

    private videoReadyState = new VideoReadyState();
    private observedProperties = new Set<string>();
    private mediaEpoch = 0;
    private pendingSubCommands: Array<{ epoch: number; name: string; args: string[] }> = [];
    private subFlushTimer: ReturnType<typeof setTimeout> | null = null;
    private playbackActive = false;
    private powerSaveBlockerId: number | null = null;
    private pendingDeeplink: string | null = null;
    private windowHooksAttached = false;

    public isAvailable(): boolean {
        return this.available && this.mpv !== null;
    }

    public getBackendInfo() {
        return this.mpv?.getBackendInfo() ?? {
            libmpvLoaded: false,
            libmpvPath: '',
            libmpvError: 'MPV not initialized',
            initialized: false,
            backend: 'none',
            sharedTexture: false,
            hdrSupported: false,
        };
    }

    public init(userDataPath: string): boolean {
        if (this.mpv) return this.available;

        try {
            const mpvConfPath = join(userDataPath, 'mpv.conf');
            const configPath = existsSync(mpvConfPath) ? mpvConfPath : '';

            this.mpv = new MPV({
                configPath,
                width: this.viewportWidth,
                height: this.viewportHeight,
                onEvent: (event) => this.handleMpvEvent(event),
                onFrame: (frame) => this.handleMpvFrame(frame),
            });

            const res = this.mpv.initialize({
                width: this.viewportWidth,
                height: this.viewportHeight,
                hdr: false,
                preferGpu: app.isHardwareAccelerationEnabled(),
            });

            if (!res.ok) {
                logger.warn(`Embedded libmpv unavailable, falling back to HTML5 video: ${res.error}`);
                this.mpv.destroy();
                this.mpv = null;
                this.available = false;
                return false;
            }

            this.available = true;
            logger.info(
                `Embedded libmpv initialized (backend=${res.backend}, sharedTexture=${res.sharedTexture}, hdrSupported=${res.hdrSupported}, lib=${res.libmpvPath})`
            );
            if (res.gpuError) {
                logger.warn(`GPU backend init error (fell back to ${res.backend}): ${res.gpuError}`);
            }
            return true;
        } catch (err) {
            logger.error(`Failed to initialize embedded libmpv: ${err}`);
            this.mpv = null;
            this.available = false;
            return false;
        }
    }

    public attachWindow(win: BrowserWindow): void {
        if (this.windowHooksAttached) return;
        this.windowHooksAttached = true;

        const syncBounds = () => {
            if (!this.available || !this.mpv || win.isDestroyed()) return;
            const bounds = win.getContentBounds();
            if (bounds.width > 0 && bounds.height > 0) {
                const scaleFactor = screen.getDisplayMatching(bounds)?.scaleFactor || 1;
                this.updateSurfaceTarget(
                    Math.round(bounds.width * scaleFactor),
                    Math.round(bounds.height * scaleFactor),
                    this.displaySupportsHdr
                );
            }
        };

        const onDisplayMetricsChanged = () => syncBounds();
        screen.on('display-metrics-changed', onDisplayMetricsChanged);

        win.on('moved', syncBounds);
        win.on('resize', syncBounds);
        win.on('enter-full-screen', () => {
            syncBounds();
            this.sendShellEvent('win-visibility-changed', {
                visible: true,
                visibility: 1,
                isFullscreen: true,
            });
        });
        win.on('leave-full-screen', () => {
            syncBounds();
            this.sendShellEvent('win-visibility-changed', {
                visible: true,
                visibility: 1,
                isFullscreen: false,
            });
        });
        win.on('show', () => this.sendShellEvent('win-visibility-changed', {
            visible: true,
            visibility: 1,
            isFullscreen: win.isFullScreen(),
        }));
        win.on('hide', () => this.sendShellEvent('win-visibility-changed', {
            visible: false,
            visibility: 0,
            isFullscreen: false,
        }));

        win.webContents.on('did-start-navigation', (_event, _url, isInPlace, isMainFrame) => {
            if (isMainFrame && !isInPlace) {
                this.rendererReady = false;
                this.resetSessionState();
                this.stopPlayback();
            }
        });

        win.on('closed', () => {
            screen.removeListener('display-metrics-changed', onDisplayMetricsChanged);
            this.rendererReady = false;
            this.windowHooksAttached = false;
            this.resetSessionState();
            this.stopPlayback();
        });

        syncBounds();
    }

    private clearPendingSubCommands(): void {
        this.pendingSubCommands = [];
        if (this.subFlushTimer) {
            clearTimeout(this.subFlushTimer);
            this.subFlushTimer = null;
        }
    }

    private resetSessionState(): void {
        this.mediaEpoch += 1;
        this.clearPendingSubCommands();
        this.clearInFlightSubtleFrames();
        this.videoReadyState.reset();
        this.observedProperties.clear();
        this.streamHdrGamma = null;
        if (this.mpv && this.available) {
            this.mpv.unobserveAll();
            this.reconcileHdrMode();
        }
    }

    public setPendingDeeplink(url: string): void {
        this.pendingDeeplink = url;
        if (this.available && this.rendererReady) {
            this.sendShellEvent('open-media', url);
            this.pendingDeeplink = null;
        }
    }

    public stopPlayback(): void {
        this.mediaEpoch += 1;
        this.clearPendingSubCommands();
        const loadId = this.videoReadyState.beginTransition(false);
        this.playbackActive = false;
        this.streamHdrGamma = null;
        this.reconcileHdrMode();
        this.allowDisplaySleep();
        if (this.mpv && this.available) {
            this.mpv.command('stop');
        }
        this.sendShellEvent('mpv-event-video-ready', { loadId, ready: false });
        this.sendShellEvent('mpv-prop-change', { name: 'path', data: null });
    }

    public destroy(): void {
        this.rendererReady = false;
        this.playbackActive = false;
        this.mediaEpoch += 1;
        this.clearPendingSubCommands();
        this.videoReadyState.reset();
        this.observedProperties.clear();
        this.clearInFlightSubtleFrames();
        this.allowDisplaySleep();
        if (this.mpv) {
            try {
                this.mpv.destroy();
            } catch (err) {
                logger.error(`Error destroying libmpv: ${err}`);
            }
            this.mpv = null;
        }
        this.available = false;
    }

    public initIPC(): void {
        if (this.ipcInitialized) return;
        this.ipcInitialized = true;

        ipcMain.on(ENHANCED_API.MPV.IS_AVAILABLE, (event) => {
            event.returnValue = this.isAvailable();
        });

        ipcMain.handle(ENHANCED_API.MPV.BACKEND_INFO, () => {
            return this.getBackendInfo();
        });

        ipcMain.on(ENHANCED_API.MPV.RENDERER_READY, (_event, ready: boolean) => {
            this.rendererReady = Boolean(ready);
        });

        ipcMain.on(ENHANCED_API.MPV.RESIZE, (_event, width: number, height: number, displayHdr?: boolean) => {
            if (!this.available || !this.mpv) return;
            this.updateSurfaceTarget(width, height, typeof displayHdr === 'boolean' ? displayHdr : this.displaySupportsHdr);
        });

        ipcMain.on(ENHANCED_API.MPV.SHELL_IPC_TO_MAIN, (_event, rawMessage: unknown) => {
            this.handleShellIpcMessage(rawMessage);
        });

        ipcMain.on(ENHANCED_API.MPV.COMMAND, (_event, ...args: (string | number | boolean)[]) => {
            this.mpv?.command(...args);
        });

        ipcMain.on(ENHANCED_API.MPV.SET_PROPERTY, (_event, name: string, value: string | number | boolean) => {
            this.applyMpvProperty(name, value);
        });

        ipcMain.on(ENHANCED_API.MPV.GET_PROPERTY, (event, name: string) => {
            event.returnValue = this.mpv?.getRawProperty(name) ?? null;
        });

        ipcMain.on(ENHANCED_API.MPV.STOP, () => {
            this.stopPlayback();
        });

        ipcMain.on(ENHANCED_API.MPV.SHARED_TEXTURE_ACK, (_event, frameId: number, syncToken?: Electron.SharedTextureSyncToken | null) => {
            this.consecutiveGpuErrors = 0;
            this.completeSubtleFrameTransfer(frameId, syncToken);
        });

        ipcMain.on(ENHANCED_API.MPV.SHARED_TEXTURE_ERROR, (_event, frameId: number, reason: string) => {
            if (typeof frameId === 'number') {
                this.completeSubtleFrameTransfer(frameId, null);
            }
            this.recordGpuTransferError(`Renderer sharedTexture error: ${reason || 'unknown'}`);
        });
    }

    private clearInFlightSubtleFrames(): void {
        for (const [frameId] of this.inFlightSubtleFrames) {
            this.completeSubtleFrameTransfer(frameId, null);
        }
    }

    private completeSubtleFrameTransfer(frameId: number, syncToken?: Electron.SharedTextureSyncToken | null): void {
        const entry = this.inFlightSubtleFrames.get(frameId);
        if (!entry) return;
        clearTimeout(entry.timer);
        this.inFlightSubtleFrames.delete(frameId);
        this.inFlightSharedTransfers = Math.max(0, this.inFlightSharedTransfers - 1);
        if (syncToken) {
            try {
                entry.imported.subtle.setReleaseSyncToken(syncToken);
            } catch {
                // Ignore sync token errors if frame/GPU context is torn down
            }
        }
        try {
            entry.imported.release();
        } catch {
            // Already released
        }
    }

    private preventDisplaySleep(): void {
        if (this.powerSaveBlockerId === null || !powerSaveBlocker.isStarted(this.powerSaveBlockerId)) {
            this.powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
        }
    }

    private allowDisplaySleep(): void {
        if (this.powerSaveBlockerId !== null) {
            if (powerSaveBlocker.isStarted(this.powerSaveBlockerId)) {
                powerSaveBlocker.stop(this.powerSaveBlockerId);
            }
            this.powerSaveBlockerId = null;
        }
    }

    private sendRawShellPayload(payload: object): void {
        if (!mainWindow || mainWindow.isDestroyed()) return;
        mainWindow.webContents.send(ENHANCED_API.MPV.SHELL_IPC_TO_RENDERER, JSON.stringify(payload));
    }

    private sendShellEvent(name: string, data: unknown): void {
        this.sendRawShellPayload({
            id: 1,
            type: 1,
            object: TRANSPORT_NAME,
            args: [name, data],
        });
    }

    private handleShellIpcMessage(rawMessage: unknown): void {
        let msg: any = rawMessage;
        if (typeof rawMessage === 'string') {
            try {
                msg = JSON.parse(rawMessage);
            } catch {
                return;
            }
        }
        if (!msg || typeof msg !== 'object') return;

        // Qt WebChannel Init handshake (type === 3)
        if (msg.type === 3) {
            this.sendRawShellPayload({
                id: typeof msg.id === 'number' ? msg.id : 0,
                type: 3,
                object: TRANSPORT_NAME,
                data: {
                    transport: {
                        properties: [
                            [],
                            ['', 'shellVersion', '', SHELL_PROTOCOL_VERSION],
                            ['', 'nativeAssSubtitles', '', 'true'],
                        ],
                        signals: [],
                        methods: [['onEvent', '']],
                    },
                },
            });
            return;
        }

        // Method invocation (type === 6)
        if (msg.type !== 6 || !Array.isArray(msg.args) || msg.args.length === 0) return;

        const method = msg.args[0];
        const data = msg.args[1];

        switch (method) {
            case 'app-ready': {
                if (this.pendingDeeplink) {
                    this.sendShellEvent('open-media', this.pendingDeeplink);
                    this.pendingDeeplink = null;
                }
                break;
            }
            case 'quit': {
                app.quit();
                break;
            }
            case 'win-set-visibility': {
                if (mainWindow && !mainWindow.isDestroyed() && data && typeof data.fullscreen === 'boolean') {
                    if (mainWindow.isFullScreen() === data.fullscreen) {
                        this.sendShellEvent('win-visibility-changed', {
                            visible: true,
                            visibility: 1,
                            isFullscreen: data.fullscreen,
                        });
                    } else {
                        // Let enter-full-screen / leave-full-screen emit the authoritative state
                        // once the OS transition finishes (avoids premature/duplicate events on macOS).
                        mainWindow.setFullScreen(data.fullscreen);
                    }
                }
                break;
            }
            case 'media.status': {
                if (data && typeof data.paused === 'boolean') {
                    if (data.paused) this.allowDisplaySleep();
                    else this.preventDisplaySleep();
                }
                break;
            }
            case 'media.metadata':
            case 'mpv-set-gpu-video-processing':
                break;

            case 'mpv-observe-prop': {
                if (typeof data === 'string' && this.mpv) {
                    // When a new ShellVideo instance mounts in Stremio Web, it re-observes 'path'
                    // (which is already in observedProperties). Reset observers only on re-mount so
                    // we never wipe properties observed before 'path'.
                    if (data === 'path' && this.observedProperties.has('path')) {
                        this.mpv.unobserveAll();
                        this.observedProperties.clear();
                    }
                    this.observedProperties.add(data);
                    this.mpv.observeProperty(data, observeFormatForProperty(data));
                }
                break;
            }
            case 'mpv-set-prop': {
                if (Array.isArray(data) && data.length >= 2 && typeof data[0] === 'string') {
                    this.applyMpvProperty(data[0], data[1]);
                }
                break;
            }
            case 'mpv-command': {
                if (Array.isArray(data) && data.length >= 1 && typeof data[0] === 'string' && this.mpv) {
                    const rawName = data[0];
                    const rawArgs = data.slice(1).map((a: unknown) => String(a));
                    const { name: cmdName, args: cmdArgs } = normalizeMpvCommand(rawName, rawArgs);

                    if (cmdName === 'sub-add' || cmdName === 'sub-remove') {
                        this.enqueueSubtitleCommand(cmdName, cmdArgs);
                        break;
                    }

                    if (cmdName === 'loadfile') {
                        this.mediaEpoch += 1;
                        this.clearPendingSubCommands();
                        const loadId = this.videoReadyState.beginTransition(true);
                        this.playbackActive = true;
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.preventDisplaySleep();
                        this.sendShellEvent('mpv-event-video-ready', { loadId, ready: false });
                    } else if (cmdName === 'stop') {
                        this.mediaEpoch += 1;
                        this.clearPendingSubCommands();
                        const loadId = this.videoReadyState.beginTransition(false);
                        this.playbackActive = false;
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.allowDisplaySleep();
                        this.sendShellEvent('mpv-event-video-ready', { loadId, ready: false });
                    }
                    const rc = this.mpv.command(cmdName, ...cmdArgs);
                    if (rc < 0) {
                        logger.warn(`mpv command '${cmdName}' failed with rc=${rc}`);
                    }
                }
                break;
            }
            default:
                break;
        }
    }

    private enqueueSubtitleCommand(name: string, args: string[]): void {
        this.pendingSubCommands.push({ epoch: this.mediaEpoch, name, args });
        if (!this.subFlushTimer) {
            this.flushNextSubtitleCommand();
        }
    }

    private flushNextSubtitleCommand(): void {
        this.subFlushTimer = null;
        while (this.pendingSubCommands.length > 0) {
            const next = this.pendingSubCommands.shift()!;
            if (next.epoch !== this.mediaEpoch) continue;
            if (!this.mpv || !this.available) return;
            const rc = this.mpv.command(next.name, ...next.args);
            if (rc < 0) {
                logger.warn(`mpv subtitle command '${next.name}' failed with rc=${rc}`);
            }
            if (this.pendingSubCommands.length > 0) {
                this.subFlushTimer = setTimeout(() => this.flushNextSubtitleCommand(), 10);
            }
            return;
        }
    }

    private applyMpvProperty(name: string, value: unknown): void {
        if (!this.mpv) return;

        // Keep vo bound to the embedded libmpv GPU render context.
        if (name === 'vo') return;

        // Prefer zero-copy hardware decoding when Stremio enables HW decoding (avoids 25 MB/frame
        // 4K 10-bit P010 GPU->CPU->GPU readback/upload stalls on integrated GPUs).
        if (name === 'hwdec' && typeof value === 'string') {
            if (value === 'no') {
                this.mpv.property('hwdec', 'no');
            } else if (process.platform === 'linux') {
                const target = (value === 'auto-copy' || value === 'auto' || value === 'yes')
                    ? 'vaapi,vaapi-copy,auto-copy'
                    : value;
                this.mpv.property('hwdec', target);
            } else {
                const target = value === 'auto-copy' ? 'auto-safe' : value;
                this.mpv.property('hwdec', target);
            }
            return;
        }

        if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
            this.mpv.property(name, value);
        } else if (value !== null && value !== undefined) {
            this.mpv.property(name, String(value));
        }
    }

    private emitVideoReadyIfPending(): void {
        const loadId = this.videoReadyState.markReady();
        if (loadId !== null) {
            this.sendShellEvent('mpv-event-video-ready', { loadId, ready: true });
        }
    }

    private handleMpvEvent(event: MPV.MpvEvent): void {
        switch (event.type) {
            case 'start-file':
                this.videoReadyState.startFile();
                break;

            case 'file-loaded':
                this.videoReadyState.fileLoaded();
                break;

            case 'playback-restart':
                this.emitVideoReadyIfPending();
                break;

            case 'end-file': {
                this.playbackActive = false;
                this.streamHdrGamma = null;
                this.reconcileHdrMode();
                this.allowDisplaySleep();

                const reason = event.reason || 'other';
                const error = reason === 'error'
                    ? { message: event.error || 'Stream failed to load', critical: true }
                    : null;
                this.sendShellEvent('mpv-event-ended', { reason, error });
                break;
            }
            case 'log-message': {
                const text = (event.text || '').trimEnd();
                if (!text) break;
                const level = event.level || 'warn';
                const line = `MPV[${level}][${event.prefix || 'mpv'}] ${text}`;
                if (level === 'error' || level === 'fatal') {
                    logger.error(line);
                } else if (level === 'warn') {
                    logger.warn(line);
                }
                break;
            }
            case 'property-change': {
                if (!event.name || event.value === undefined) return;

                const data = event.value === null ? null : parseShellPropertyValue(event.name, event.value);
                if (event.name === 'video-params') {
                    if (data && typeof data === 'object') {
                        const gamma = typeof (data as Record<string, unknown>).gamma === 'string'
                            ? String((data as Record<string, unknown>).gamma).toLowerCase()
                            : null;
                        this.streamHdrGamma = (gamma === 'pq' || gamma === 'hlg') ? gamma : null;
                    } else {
                        this.streamHdrGamma = null;
                    }
                    this.reconcileHdrMode();
                }

                this.sendShellEvent('mpv-prop-change', {
                    name: event.name,
                    data,
                });
                break;
            }
        }
    }

    private updateSurfaceTarget(width: number, height: number, displayHdr: boolean): void {
        const clampedW = Math.max(16, Math.min(7680, Math.round(width)));
        const clampedH = Math.max(16, Math.min(4320, Math.round(height)));
        this.viewportWidth = clampedW;
        this.viewportHeight = clampedH;
        this.displaySupportsHdr = displayHdr;
        this.reconcileHdrMode();
    }

    private reconcileHdrMode(): void {
        if (!this.mpv || !this.available) return;

        const info = this.mpv.getBackendInfo();
        // True HDR extended-range WebGPU presentation works zero-copy on Windows and macOS.
        // On SDR displays or Linux (where Electron SharedImage uses Raster/GLES2), mpv tone-maps HDR->SDR on GPU.
        const shouldUseHdrSurface =
            (process.platform === 'win32' || process.platform === 'darwin') &&
            info.sharedTexture &&
            info.hdrSupported &&
            this.displaySupportsHdr &&
            this.streamHdrGamma !== null;

        const desiredGamma = shouldUseHdrSurface ? this.streamHdrGamma : null;
        if (shouldUseHdrSurface !== this.hdrOutputActive || desiredGamma !== this.activeHdrGamma) {
            this.hdrOutputActive = shouldUseHdrSurface;
            this.activeHdrGamma = desiredGamma;
            if (this.hdrOutputActive) {
                // Resize to 16-bit float first so mpv switches target-trc alongside/after HDR surface creation.
                this.mpv.resize(this.viewportWidth, this.viewportHeight, true);
                this.mpv.property('target-prim', 'bt.2020');
                this.mpv.property('target-trc', this.activeHdrGamma === 'hlg' ? 'hlg' : 'pq');
                logger.info(`Enabled 16-bit float HDR passthrough pipeline (${this.activeHdrGamma})`);
                return;
            } else {
                this.mpv.property('target-prim', 'auto');
                this.mpv.property('target-trc', 'auto');
            }
        }

        this.mpv.resize(this.viewportWidth, this.viewportHeight, this.hdrOutputActive);
    }

    private handleMpvFrame(frame: MPV.MpvFrame): void {
        if (!this.mpv || !mainWindow || mainWindow.isDestroyed() || !this.rendererReady || !this.playbackActive) {
            this.mpv?.releaseFrame(frame.slotId, frame.generation);
            return;
        }

        this.emitVideoReadyIfPending();

        if (frame.kind === 'software') {
            if (frame.buffer && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send(ENHANCED_API.MPV.SOFTWARE_FRAME, {
                    width: frame.width,
                    height: frame.height,
                    stride: frame.stride ?? frame.width * 4,
                    buffer: frame.buffer,
                });
            }
            this.mpv.releaseFrame(frame.slotId, frame.generation);
            return;
        }

        if (!frame.handle || !sharedTexture || typeof sharedTexture.importSharedTexture !== 'function') {
            this.mpv.releaseFrame(frame.slotId, frame.generation);
            this.triggerSoftwareFallback('Electron sharedTexture API is unavailable');
            return;
        }

        // Prevent IPC transfer queue buildup if the renderer is paused/minimized.
        if (this.inFlightSharedTransfers >= 2 || mainWindow.isMinimized()) {
            this.mpv.releaseFrame(frame.slotId, frame.generation);
            return;
        }

        const colorSpace: Electron.ColorSpace = frame.hdr
            ? {
                primaries: 'bt2020',
                transfer: (this.activeHdrGamma ?? this.streamHdrGamma) === 'hlg' ? 'hlg' : 'pq',
                matrix: 'rgb',
                range: 'full',
            }
            : {
                primaries: 'bt709',
                transfer: 'srgb',
                matrix: 'rgb',
                range: 'full',
            };

        let imported: Electron.SharedTextureImported;
        try {
            imported = sharedTexture.importSharedTexture({
                textureInfo: {
                    pixelFormat: frame.pixelFormat,
                    codedSize: { width: frame.width, height: frame.height },
                    visibleRect: { x: 0, y: 0, width: frame.width, height: frame.height },
                    colorSpace,
                    timestamp: frame.timestamp,
                    handle: frame.handle,
                },
                allReferencesReleased: () => {
                    this.mpv?.releaseFrame(frame.slotId, frame.generation);
                },
            });
        } catch (err) {
            this.mpv.releaseFrame(frame.slotId, frame.generation);
            this.recordGpuTransferError(`sharedTexture.importSharedTexture failed: ${err}`);
            return;
        }

        // Transfer via sharedTexture.subtle + standard WebContents IPC instead of sharedTexture.sendSharedTexture():
        // in Electron 45 on Windows, sendSharedTexture stops subsequent webContents.send delivery to the preload.
        if (typeof imported.subtle?.startTransferSharedTexture !== 'function') {
            try {
                imported.release();
            } catch {
                // Already released
            }
            this.triggerSoftwareFallback('sharedTexture.subtle transfer API is unavailable');
            return;
        }

        let transfer: Electron.SharedTextureTransfer;
        try {
            transfer = imported.subtle.startTransferSharedTexture();
        } catch (err) {
            try {
                imported.release();
            } catch {
                // Already released
            }
            this.recordGpuTransferError(`startTransferSharedTexture failed: ${err}`);
            return;
        }

        const frameId = ++this.nextSubtleFrameId;
        this.inFlightSharedTransfers += 1;
        const timer = setTimeout(() => {
            this.completeSubtleFrameTransfer(frameId, null);
        }, SHARED_TEXTURE_ACK_TIMEOUT_MS);
        this.inFlightSubtleFrames.set(frameId, { imported, timer });
        mainWindow.webContents.send(ENHANCED_API.MPV.SHARED_TEXTURE_FRAME, {
            frameId,
            transfer,
            meta: { hdr: frame.hdr, width: frame.width, height: frame.height },
        });
    }

    private recordGpuTransferError(reason: string): void {
        this.consecutiveGpuErrors += 1;
        logger.warn(`Shared texture error (${this.consecutiveGpuErrors}/${GPU_ERROR_FALLBACK_THRESHOLD}): ${reason}`);
        if (this.consecutiveGpuErrors >= GPU_ERROR_FALLBACK_THRESHOLD) {
            this.triggerSoftwareFallback(reason);
        }
    }

    private triggerSoftwareFallback(reason: string): void {
        if (this.softwareFallbackTriggered || !this.mpv) return;
        this.softwareFallbackTriggered = true;
        logger.warn(`Switching embedded libmpv to software frame fallback: ${reason}`);
        this.mpv.enableSoftwareFallback();
    }
}

export const mpvPlayerController = new MpvPlayerController();
