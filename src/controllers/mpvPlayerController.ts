import { app, BrowserWindow, ipcMain, powerSaveBlocker, screen, sharedTexture } from 'electron';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import MPV from 'electron-libmpv';
import { ENHANCED_API } from '../constants';
import { mainWindow } from '../main';
import Updater from '../core/Updater';
import { getLogger } from '../utils/logger';

const logger = getLogger('MpvPlayerController');

const TRANSPORT_NAME = 'transport';

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

function observeFormatForProperty(name: string): MPV.MpvObserveFormat {
    if (FLOAT_PROPERTIES.has(name)) return 'double';
    if (BOOL_PROPERTIES.has(name)) return 'flag';
    if (NODE_PROPERTIES.has(name)) return 'node';
    return 'string';
}

function parseShellPropertyValue(name: string, value: unknown): unknown {
    if (typeof value !== 'string') return value;
    // Match stremio-linux-shell: parse JSON primitives/objects for string properties (e.g. sid "1" -> 1),
    // while leaving plain strings ("mpv 0.40.0", "yes", "no", URLs) intact.
    if (name === 'mpv-version' || name === 'ffmpeg-version' || name === 'path') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

class MpvPlayerController {
    private mpv: MPV | null = null;
    private available = false;
    private ipcInitialized = false;
    private rendererReady = false;
    private softwareFallbackTriggered = false;
    private inFlightSharedTransfers = 0;
    private logFilePath: string | null = null;
    private firstFrameLogged = false;

    private viewportWidth = 1280;
    private viewportHeight = 720;
    private displaySupportsHdr = false;
    private streamHdrGamma: 'pq' | 'hlg' | null = null;
    private hdrOutputActive = false;

    private currentLoadId = 0;
    private fileLoaded = false;
    private videoReadyEmitted = false;
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
        this.allowDisplaySleep();
        if (this.mpv && this.available) {
            this.mpv.command('stop');
        }
    }

    public destroy(): void {
        this.rendererReady = false;
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
            const shellVersion = Updater.getCurrentVersion() || '5.0.0';
            this.sendRawShellPayload({
                id: 0,
                type: 3,
                object: TRANSPORT_NAME,
                data: {
                    transport: {
                        properties: [[], ['', 'shellVersion', '', shellVersion]],
                        signals: [],
                        methods: [['onEvent']],
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
                    if (data[0] !== 'time-pos') {
                        this.writeDiagLog(`SET_PROP: ${data[0]} = ${JSON.stringify(data[1])}`);
                    }
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
                        this.currentLoadId += 1;
                        this.fileLoaded = false;
                        this.videoReadyEmitted = false;
                        this.firstFrameLogged = false;
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.preventDisplaySleep();
                        this.sendShellEvent('mpv-event-video-ready', {
                            loadId: this.currentLoadId,
                            ready: false,
                        });
                    } else if (cmdName === 'stop') {
                        this.streamHdrGamma = null;
                        this.reconcileHdrMode();
                        this.allowDisplaySleep();
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

    private handleMpvEvent(event: MPV.MpvEvent): void {
        switch (event.type) {
            case 'start-file': {
                this.fileLoaded = false;
                this.videoReadyEmitted = false;
                this.writeDiagLog('EVENT: start-file');
                break;
            }
            case 'file-loaded': {
                this.fileLoaded = true;
                this.writeDiagLog('EVENT: file-loaded');
                break;
            }
            case 'playback-restart': {
                this.writeDiagLog('EVENT: playback-restart');
                if (this.fileLoaded && !this.videoReadyEmitted) {
                    this.videoReadyEmitted = true;
                    this.sendShellEvent('mpv-event-video-ready', {
                        loadId: this.currentLoadId,
                        ready: true,
                    });
                }
                break;
            }
            case 'end-file': {
                this.fileLoaded = false;
                this.videoReadyEmitted = false;
                this.streamHdrGamma = null;
                this.reconcileHdrMode();
                this.allowDisplaySleep();

                const reason = event.reason || 'other';
                this.writeDiagLog(`EVENT: end-file reason=${reason} error=${event.error || 'none'}`);
                const error = reason === 'error'
                    ? { message: event.error || 'Stream failed to load', critical: true }
                    : null;
                this.sendShellEvent('mpv-event-ended', { reason, error });
                this.mpv?.unobserveAll();
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

                const data = parseShellPropertyValue(event.name, event.value);
                if (event.name === 'mpv-version') {
                    this.writeDiagLog(`PROP: mpv-version = ${JSON.stringify(data)}`);
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
        if (!this.mpv || !mainWindow || mainWindow.isDestroyed() || !this.rendererReady) {
            this.mpv?.releaseFrame(frame.slotId, frame.generation);
            return;
        }

        if (!this.firstFrameLogged) {
            this.firstFrameLogged = true;
            this.writeDiagLog(
                `FIRST_FRAME: kind=${frame.kind} ${frame.width}x${frame.height} fmt=${frame.pixelFormat} hdr=${frame.hdr}`
            );
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

        this.inFlightSharedTransfers += 1;
        sharedTexture
            .sendSharedTexture(
                {
                    frame: mainWindow.webContents.mainFrame,
                    importedSharedTexture: imported,
                },
                { hdr: frame.hdr, width: frame.width, height: frame.height }
            )
            .catch((err: unknown) => {
                logger.warn(`sendSharedTexture error: ${err}`);
                this.writeDiagLog(`SHARED_TEXTURE SEND ERR: ${err}`);
            })
            .finally(() => {
                this.inFlightSharedTransfers = Math.max(0, this.inFlightSharedTransfers - 1);
                try {
                    imported.release();
                } catch {
                    // Already released
                }
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
