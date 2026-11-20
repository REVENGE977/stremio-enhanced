import { app, BrowserWindow, ipcMain, powerSaveBlocker, screen, sharedTexture } from 'electron';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
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
    'cache-buffering-state',
    'demuxer-cache-time',
    'panscan',
]);

const INT_PROPERTIES = new Set([
    'aid',
    'vid',
    'sid',
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
]);

const NODE_PROPERTIES = new Set([
    'track-list',
    'video-params',
    'metadata',
]);

//Properties whose JSON representation could be parsed as a number/boolean if we ran JSON.parse(),
//or that ShellVideo expects as raw strings when not in FLOAT/BOOL/NODE_PROPERTIES.
const PLAIN_STRING_PROPERTIES = new Set([
    'path',
    'mpv-version',
    'ffmpeg-version',
    'aid',
    'vid',
    'sid',
    'mute',
    'hwdec',
    'sub-color',
    'sub-back-color',
    'sub-border-color',
    'sub-ass-override',
]);

function observeFormatForProperty(name: string): MPV.MpvObserveFormat {
    if (FLOAT_PROPERTIES.has(name)) return 'double';
    if (BOOL_PROPERTIES.has(name)) return 'flag';
    if (NODE_PROPERTIES.has(name)) return 'node';
    // Note: aid, vid, sid, mute must be observed as 'string' (not 'int64' or 'flag') because
    // when unselected in mpv their value is "no", which fails MPV_FORMAT_INT64 and returns MPV_FORMAT_NONE.
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
    if (FLOAT_PROPERTIES.has(name) || INT_PROPERTIES.has(name)) {
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
        this.activeLoadId = this.pendingLoadIds.shift() ?? this.currentLoadId;
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
    private inFlightSharedTransfers = 0;
    private inFlightSubtleFrames = new Map<number, {
        imported: Electron.SharedTextureImported;
        timer: ReturnType<typeof setTimeout>;
    }>();
    private nextSubtleFrameId = 0;
    private logFilePath: string | null = null;
    private firstFrameLogged = false;

    private viewportWidth = 1280;
    private viewportHeight = 720;
    private displaySupportsHdr = false;
    private streamHdrGamma: 'pq' | 'hlg' | null = null;
    private hdrOutputActive = false;

    private videoReadyState = new VideoReadyState();
    private playbackActive = false;
    private lastLoggedTimePosSec = -1;
    private powerSaveBlockerId: number | null = null;
    private pendingDeeplink: string | null = null;
    private windowHooksAttached = false;

    private writeDiagLog(line: string): void {
        if (!this.logFilePath) return;
        try {
            appendFileSync(this.logFilePath, `[${new Date().toISOString()}] ${line}\n`, 'utf-8');
        } catch {
            // Ignore log write errors
        }
    }

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

        this.logFilePath = join(userDataPath, 'stremio-enhanced-mpv.log');
        try {
            writeFileSync(this.logFilePath, `=== Stremio Enhanced MPV Log (${new Date().toISOString()}) ===\n`, 'utf-8');
        } catch {
            this.logFilePath = null;
        }

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
                this.writeDiagLog(`INIT FAILED: ${res.error}`);
                this.mpv.destroy();
                this.mpv = null;
                this.available = false;
                return false;
            }

            this.available = true;
            const initSummary = `backend=${res.backend}, sharedTexture=${res.sharedTexture}, hdrSupported=${res.hdrSupported}, lib=${res.libmpvPath}${res.gpuError ? `, gpuError=${res.gpuError}` : ''}`;
            logger.info(`Embedded libmpv initialized (${initSummary})`);
            this.writeDiagLog(`INIT OK: ${initSummary}`);
            if (res.gpuError) {
                logger.warn(`GPU backend init error (fell back to ${res.backend}): ${res.gpuError}`);
            }
            return true;
        } catch (err) {
            logger.error(`Failed to initialize embedded libmpv: ${err}`);
            this.writeDiagLog(`INIT EXCEPTION: ${err}`);
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

        win.on('enter-full-screen', () => this.sendShellEvent('win-visibility-changed', {
            visible: true,
            visibility: 1,
            isFullscreen: true,
        }));
        win.on('leave-full-screen', () => this.sendShellEvent('win-visibility-changed', {
            visible: true,
            visibility: 1,
            isFullscreen: false,
        }));
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
                this.clearInFlightSubtleFrames();
                this.stopPlayback();
            }
        });

        win.on('closed', () => {
            this.rendererReady = false;
            this.windowHooksAttached = false;
            this.stopPlayback();
        });

        syncBounds();
    }

    public setPendingDeeplink(url: string): void {
        this.pendingDeeplink = url;
        if (this.available && this.rendererReady) {
            this.sendShellEvent('open-media', url);
            this.pendingDeeplink = null;
        }
    }

    public stopPlayback(): void {
        this.playbackActive = false;
        this.allowDisplaySleep();
        if (this.mpv && this.available) {
            this.mpv.command('stop');
        }
    }

    public destroy(): void {
        this.rendererReady = false;
        this.playbackActive = false;
        this.videoReadyState.reset();
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
            this.completeSubtleFrameTransfer(frameId, syncToken);
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
                id: 0,
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
                    mainWindow.setFullScreen(data.fullscreen);
                    this.sendShellEvent('win-visibility-changed', {
                        visible: true,
                        visibility: 1,
                        isFullscreen: data.fullscreen,
                    });
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
                    // When a new ShellVideo instance mounts in Stremio Web, 'path' is always the first
                    // property it observes. Unobserving previous properties first keeps libmpv's
                    // observer list clean across stream changes while forcing libmpv to emit fresh
                    // initial values (including 'mpv-version', which resolves ShellVideo's load promise).
                    if (data === 'path') {
                        this.mpv.unobserveAll();
                    }
                    const fmt = observeFormatForProperty(data);
                    const rc = this.mpv.observeProperty(data, fmt);
                    if (rc < 0) {
                        this.writeDiagLog(`OBSERVE ERR: prop=${data} fmt=${fmt} rc=${rc}`);
                    }
                }
                break;
            }
            case 'mpv-set-prop': {
                if (Array.isArray(data) && data.length >= 2 && typeof data[0] === 'string') {
                    this.writeDiagLog(`SET_PROP: ${data[0]} = ${JSON.stringify(data[1])}`);
                    this.applyMpvProperty(data[0], data[1]);
                }
                break;
            }
            case 'mpv-command': {
                if (Array.isArray(data) && data.length >= 1 && typeof data[0] === 'string' && this.mpv) {
                    const cmdName = data[0];
                    const cmdArgs = data.slice(1).map((a: unknown) => String(a));
                    this.writeDiagLog(`COMMAND: ${cmdName} ${JSON.stringify(cmdArgs)}`);
                    if (cmdName === 'loadfile') {
                        const loadId = this.videoReadyState.beginTransition(true);
                        this.playbackActive = true;
                        this.firstFrameLogged = false;
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.preventDisplaySleep();
                        this.writeDiagLog(`VIDEO_READY: loadId=${loadId} ready=false (loadfile)`);
                        this.sendShellEvent('mpv-event-video-ready', {
                            loadId,
                            ready: false,
                        });
                    } else if (cmdName === 'stop') {
                        const loadId = this.videoReadyState.beginTransition(false);
                        this.playbackActive = false;
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.allowDisplaySleep();
                        this.writeDiagLog(`VIDEO_READY: loadId=${loadId} ready=false (stop)`);
                        this.sendShellEvent('mpv-event-video-ready', {
                            loadId,
                            ready: false,
                        });
                    }
                    const rc = this.mpv.command(cmdName, ...cmdArgs);
                    if (rc < 0) {
                        this.writeDiagLog(`COMMAND ERR: ${cmdName} rc=${rc}`);
                        logger.warn(`mpv command '${cmdName}' failed with rc=${rc}`);
                    }
                }
                break;
            }
            default:
                break;
        }
    }

    private applyMpvProperty(name: string, value: unknown): void {
        if (!this.mpv) return;

        // Keep vo bound to the embedded libmpv GPU render context.
        if (name === 'vo') return;

        // Pass Stremio's hwdec preference through cleanly (matches stremio-linux-shell).
        // On Linux, auto-copy (e.g. vaapi-copy / nvdec-copy) avoids broken EGL/GBM
        // vaExportSurfaceHandle interop on Intel drivers while keeping GPU rendering zero-copy.
        if (name === 'hwdec' && typeof value === 'string') {
            this.mpv.property('hwdec', value);
            return;
        }

        if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
            this.mpv.property(name, value);
        } else if (value !== null && value !== undefined) {
            this.mpv.property(name, String(value));
        }
    }

    private emitVideoReadyIfPending(source: string): void {
        const loadId = this.videoReadyState.markReady();
        if (loadId !== null) {
            this.writeDiagLog(`VIDEO_READY: loadId=${loadId} ready=true (${source})`);
            this.sendShellEvent('mpv-event-video-ready', {
                loadId,
                ready: true,
            });
        }
    }

    private handleMpvEvent(event: MPV.MpvEvent): void {
        switch (event.type) {
            case 'start-file': {
                this.videoReadyState.startFile();
                this.writeDiagLog('EVENT: start-file');
                break;
            }
            case 'file-loaded': {
                this.videoReadyState.fileLoaded();
                this.writeDiagLog('EVENT: file-loaded');
                break;
            }
            case 'playback-restart': {
                this.writeDiagLog('EVENT: playback-restart');
                this.emitVideoReadyIfPending('playback-restart');
                break;
            }
            case 'end-file': {
                this.playbackActive = false;
                this.streamHdrGamma = null;
                this.reconcileHdrMode();
                this.allowDisplaySleep();

                const reason = event.reason || 'other';
                this.writeDiagLog(`EVENT: end-file reason=${reason} error=${event.error || 'none'}`);
                const error = reason === 'error'
                    ? { message: event.error || 'Stream failed to load', critical: true }
                    : null;
                this.sendShellEvent('mpv-event-ended', { reason, error });
                break;
            }
            case 'log-message': {
                const text = (event.text || '').trimEnd();
                if (!text) break;
                const level = event.level || 'info';
                const prefix = event.prefix || 'mpv';
                const line = `MPV[${level}][${prefix}] ${text}`;
                this.writeDiagLog(line);
                if (level === 'error' || level === 'fatal') {
                    logger.error(line);
                } else if (level === 'warn') {
                    logger.warn(line);
                }
                break;
            }
            case 'property-change': {
                if (!event.name) return;
                // Skip MPV_FORMAT_NONE (null) property changes to match stremio-shell-ng / stremio-linux-shell.
                if (event.value === null || event.value === undefined) return;

                const data = parseShellPropertyValue(event.name, event.value);
                if (
                    event.name === 'mpv-version' ||
                    event.name === 'paused-for-cache' ||
                    event.name === 'seeking' ||
                    event.name === 'duration' ||
                    event.name === 'aid' ||
                    event.name === 'sid'
                ) {
                    this.writeDiagLog(`PROP: ${event.name} = ${JSON.stringify(data)}`);
                } else if (event.name === 'time-pos' && typeof data === 'number') {
                    const sec = Math.floor(data);
                    if (sec !== this.lastLoggedTimePosSec && sec % 5 === 0) {
                        this.lastLoggedTimePosSec = sec;
                        this.writeDiagLog(`PROP: time-pos = ${data.toFixed(2)}`);
                    }
                } else if (event.name === 'video-params' && data && typeof data === 'object') {
                    const gamma = typeof (data as Record<string, unknown>).gamma === 'string'
                        ? String((data as Record<string, unknown>).gamma).toLowerCase()
                        : null;
                    this.streamHdrGamma = (gamma === 'pq' || gamma === 'hlg') ? gamma : null;
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

        if (shouldUseHdrSurface !== this.hdrOutputActive) {
            this.hdrOutputActive = shouldUseHdrSurface;
            if (this.hdrOutputActive) {
                this.mpv.property('target-prim', 'bt.2020');
                this.mpv.property('target-trc', this.streamHdrGamma === 'hlg' ? 'hlg' : 'pq');
                logger.info(`Enabled 16-bit float HDR passthrough pipeline (${this.streamHdrGamma})`);
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

        if (!this.firstFrameLogged) {
            this.firstFrameLogged = true;
            this.writeDiagLog(
                `FIRST_FRAME: kind=${frame.kind} ${frame.width}x${frame.height} fmt=${frame.pixelFormat} hdr=${frame.hdr}`
            );
            this.emitVideoReadyIfPending('first-frame');
        }

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
                transfer: this.streamHdrGamma === 'hlg' ? 'hlg' : 'pq',
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
            this.writeDiagLog(`SHARED_TEXTURE IMPORT ERR: ${err}`);
            this.triggerSoftwareFallback(`sharedTexture.importSharedTexture failed: ${err}`);
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
            this.writeDiagLog(`SHARED_TEXTURE START_TRANSFER ERR: ${err}`);
            this.triggerSoftwareFallback(`startTransferSharedTexture failed: ${err}`);
            return;
        }

        const frameId = ++this.nextSubtleFrameId;
        this.inFlightSharedTransfers += 1;
        const timer = setTimeout(() => {
            this.completeSubtleFrameTransfer(frameId, null);
        }, 1000);
        this.inFlightSubtleFrames.set(frameId, {
            imported,
            timer,
        });
        mainWindow.webContents.send(ENHANCED_API.MPV.SHARED_TEXTURE_FRAME, {
            frameId,
            transfer,
            meta: { hdr: frame.hdr, width: frame.width, height: frame.height },
        });
    }

    private triggerSoftwareFallback(reason: string): void {
        if (this.softwareFallbackTriggered || !this.mpv) return;
        this.softwareFallbackTriggered = true;
        logger.warn(`Switching embedded libmpv to software frame fallback: ${reason}`);
        this.writeDiagLog(`FALLBACK_TO_SW: ${reason}`);
        this.mpv.enableSoftwareFallback();
    }
}

export const mpvPlayerController = new MpvPlayerController();
