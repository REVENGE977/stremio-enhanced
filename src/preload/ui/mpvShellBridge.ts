import { contextBridge, ipcRenderer, sharedTexture, webFrame } from 'electron';
import { ENHANCED_API } from '../../constants';

const CANVAS_ID = 'stremio-mpv-canvas';

interface SoftwareFramePayload {
    width: number;
    height: number;
    stride: number;
    buffer: Uint8Array;
}

interface SharedTextureMeta {
    hdr?: boolean;
    width?: number;
    height?: number;
}

interface WebGpuState {
    canvas: HTMLCanvasElement;
    device: any;
    context: any;
    pipeline: any;
    sampler: any;
    bindGroupLayout: any;
    format: string;
    colorSpace: 'display-p3' | 'srgb';
    hdr: boolean;
}

let mpvEnabled = false;
let shellListeners: Array<(message: string) => void> = [];
let mainWorldCallback: ((message: string) => void) | null = null;
let canvasEl: HTMLCanvasElement | null = null;
let ctx2d: CanvasRenderingContext2D | null = null;
let gpuState: WebGpuState | null = null;
let gpuInitAttempted = false;
let gpuInitPromise: Promise<WebGpuState | null> | null = null;
let lastSentW = 0;
let lastSentH = 0;
let lastSentHdr: boolean | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let activeStream = false;
let canvasVisible = false;

function getPlatformIpcKey(): string {
    if (process.platform === 'win32') return 'WIN';
    if (process.platform === 'darwin') return 'MAC';
    return 'LINUX';
}

export function isPlayerRoute(): boolean {
    const hash = window.location.hash || '';
    return hash.startsWith('#/player') || hash.includes('/player/');
}

function isDisplayHdrCapable(): boolean {
    try {
        return window.matchMedia('(dynamic-range: high)').matches;
    } catch {
        return false;
    }
}

function clearCanvas(): void {
    if (!canvasEl) return;
    if (ctx2d && canvasEl.width > 0 && canvasEl.height > 0) {
        ctx2d.fillStyle = '#000000';
        ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);
    } else if (gpuState) {
        try {
            const encoder = gpuState.device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: gpuState.context.getCurrentTexture().createView(),
                    loadOp: 'clear',
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    storeOp: 'store',
                }],
            });
            pass.end();
            gpuState.device.queue.submit([encoder.finish()]);
        } catch {
            // Ignore WebGPU clear errors while hidden
        }
    }
}

export function updateCanvasVisibility(): void {
    if (!canvasEl) return;
    const onPlayer = isPlayerRoute();
    if (!onPlayer) {
        activeStream = false;
    }
    const show = onPlayer && activeStream;
    if (show === canvasVisible && canvasEl.style.display === (show ? 'block' : 'none')) {
        return;
    }
    const wasVisible = canvasVisible;
    canvasVisible = show;
    canvasEl.style.display = show ? 'block' : 'none';
    if (!show && wasVisible) {
        clearCanvas();
    }
}

function ensureCanvas(): HTMLCanvasElement | null {
    if (canvasEl && document.contains(canvasEl)) return canvasEl;
    if (!document.body) return null;

    let existing = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;
    if (!existing) {
        existing = document.createElement('canvas');
        existing.id = CANVAS_ID;
        Object.assign(existing.style, {
            position: 'fixed',
            inset: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '0',
            pointerEvents: 'none',
            backgroundColor: '#000000',
            display: 'none',
        });
        document.body.insertBefore(existing, document.body.firstChild);
    }

    canvasEl = existing;
    updateCanvasVisibility();
    return canvasEl;
}

function syncViewportSize(immediate = false): void {
    const send = () => {
        const dpr = window.devicePixelRatio || 1;
        const w = Math.max(16, Math.round(window.innerWidth * dpr));
        const h = Math.max(16, Math.round(window.innerHeight * dpr));
        const hdr = isDisplayHdrCapable();
        if (w !== lastSentW || h !== lastSentH || hdr !== lastSentHdr) {
            lastSentW = w;
            lastSentH = h;
            lastSentHdr = hdr;
            ipcRenderer.send(ENHANCED_API.MPV.RESIZE, w, h, hdr);
        }
    };

    if (immediate) {
        if (resizeTimer) clearTimeout(resizeTimer);
        send();
        return;
    }
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(send, 50);
}

function configureWebGpuContext(
    context: any,
    device: any,
    format: string,
    hdr: boolean
): 'display-p3' | 'srgb' {
    if (hdr) {
        try {
            context.configure({
                device,
                format,
                colorSpace: 'display-p3',
                alphaMode: 'opaque',
                toneMapping: { mode: 'extended' },
            });
            return 'display-p3';
        } catch {
            // Fall back to extended sRGB if display-p3 is unsupported by this adapter
        }
    }
    context.configure({
        device,
        format,
        colorSpace: 'srgb',
        alphaMode: 'opaque',
        toneMapping: { mode: hdr ? 'extended' : 'standard' },
    });
    return 'srgb';
}

async function initWebGpuForHdr(canvas: HTMLCanvasElement, hdr: boolean): Promise<WebGpuState | null> {
    if (gpuState && gpuState.canvas === canvas) {
        if (gpuState.hdr !== hdr) {
            // Pipeline target format must match configured format; recreate context/pipeline cleanly on toggle.
            const fresh = recreateCanvas();
            if (!fresh) return null;
            return initWebGpuForHdr(fresh, hdr);
        }
        return gpuState;
    }
    if (gpuInitPromise) {
        return gpuInitPromise;
    }
    if (gpuInitAttempted) return null;
    const gpu = (navigator as any).gpu;
    if (!gpu) {
        gpuInitAttempted = true;
        return null;
    }

    gpuInitPromise = (async (): Promise<WebGpuState | null> => {
        try {
            const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
            if (!adapter || canvas !== canvasEl) {
                if (!adapter) gpuInitAttempted = true;
                return null;
            }
            const device = await adapter.requestDevice();
            if (canvas !== canvasEl) {
                try { device.destroy(); } catch { /* ignore */ }
                return null;
            }
            const context = canvas.getContext('webgpu') as any;
            if (!context) {
                gpuInitAttempted = true;
                try { device.destroy(); } catch { /* ignore */ }
                return null;
            }

            const preferredFormat = gpu.getPreferredCanvasFormat();
            const format = hdr ? 'rgba16float' : preferredFormat;
            const colorSpace = configureWebGpuContext(context, device, format, hdr);

            const shaderModule = device.createShaderModule({
                code: `
                    struct VsOut {
                        @builtin(position) pos: vec4<f32>,
                        @location(0) uv: vec2<f32>,
                    };

                    @vertex
                    fn vs(@builtin(vertex_index) idx: u32) -> VsOut {
                        var positions = array<vec2<f32>, 3>(
                            vec2<f32>(-1.0, -1.0),
                            vec2<f32>( 3.0, -1.0),
                            vec2<f32>(-1.0,  3.0)
                        );
                        var uvs = array<vec2<f32>, 3>(
                            vec2<f32>(0.0, 1.0),
                            vec2<f32>(2.0, 1.0),
                            vec2<f32>(0.0, -1.0)
                        );
                        var out: VsOut;
                        out.pos = vec4<f32>(positions[idx], 0.0, 1.0);
                        out.uv = uvs[idx];
                        return out;
                    }

                    @group(0) @binding(0) var videoSampler: sampler;
                    @group(0) @binding(1) var videoTex: texture_external;

                    @fragment
                    fn fs(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
                        return textureSampleBaseClampToEdge(videoTex, videoSampler, uv);
                    }
                `,
            });

            const pipeline = device.createRenderPipeline({
                layout: 'auto',
                vertex: { module: shaderModule, entryPoint: 'vs' },
                fragment: {
                    module: shaderModule,
                    entryPoint: 'fs',
                    targets: [{ format }],
                },
                primitive: { topology: 'triangle-list' },
            });

            const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
            const bindGroupLayout = pipeline.getBindGroupLayout(0);

            const state: WebGpuState = {
                canvas,
                device,
                context,
                pipeline,
                sampler,
                bindGroupLayout,
                format,
                colorSpace,
                hdr,
            };

            device.lost?.then(() => {
                if (gpuState === state) {
                    gpuState = null;
                    gpuInitAttempted = false;
                }
            }).catch(() => {});

            gpuState = state;
            gpuInitAttempted = true;
            return state;
        } catch {
            gpuInitAttempted = true;
            return null;
        } finally {
            gpuInitPromise = null;
        }
    })();

    return gpuInitPromise;
}

function drawVideoFrame2D(canvas: HTMLCanvasElement, frame: VideoFrame): void {
    if (!ctx2d) {
        // Avoid desynchronized: true on Windows DirectComposition where front-buffer overlays
        // can retain stale frames after hiding or route navigation.
        ctx2d = canvas.getContext('2d', { alpha: false });
    }
    if (!ctx2d) return;
    if (canvas.width !== frame.codedWidth || canvas.height !== frame.codedHeight) {
        canvas.width = frame.codedWidth;
        canvas.height = frame.codedHeight;
    }
    ctx2d.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

function recreateCanvas(): HTMLCanvasElement | null {
    const old = canvasEl;
    if (gpuState) {
        try { gpuState.device?.destroy?.(); } catch { /* ignore */ }
    }
    ctx2d = null;
    gpuState = null;
    gpuInitAttempted = false;
    gpuInitPromise = null;

    if (old && old.parentElement) {
        const fresh = document.createElement('canvas');
        fresh.id = CANVAS_ID;
        fresh.style.cssText = old.style.cssText;
        old.parentElement.replaceChild(fresh, old);
        canvasEl = fresh;
        return fresh;
    }
    canvasEl = null;
    return ensureCanvas();
}

async function renderSharedVideoFrame(frame: VideoFrame, meta?: SharedTextureMeta): Promise<void> {
    if (!isPlayerRoute()) return;
    let canvas = ensureCanvas();
    if (!canvas) return;

    activeStream = true;
    canvasVisible = true;
    if (canvas.style.display === 'none') {
        canvas.style.display = 'block';
    }

    // Use WebGPU for true 16-bit HDR extended tone mapping on Windows/macOS.
    // On SDR or Linux (where Electron SharedImage uses Raster/GLES2), Canvas2D drawImage(VideoFrame)
    // performs zero-copy GPU compositing directly through Skia.
    const wantWebGpu = Boolean(meta?.hdr) && (process.platform === 'win32' || process.platform === 'darwin');

    // A canvas element can only hold one rendering context type; recreate it when transitioning SDR <-> HDR.
    if (wantWebGpu && ctx2d) {
        canvas = recreateCanvas();
        if (!canvas) return;
    } else if (!wantWebGpu && (gpuState || gpuInitPromise)) {
        canvas = recreateCanvas();
        if (!canvas) return;
    }

    if (wantWebGpu) {
        const wg = await initWebGpuForHdr(canvas, true);
        if (wg && wg.canvas === canvasEl) {
            if (wg.canvas.width !== frame.codedWidth || wg.canvas.height !== frame.codedHeight) {
                wg.canvas.width = frame.codedWidth;
                wg.canvas.height = frame.codedHeight;
            }
            const externalTex = wg.device.importExternalTexture({
                source: frame,
                colorSpace: wg.colorSpace,
            });
            const bindGroup = wg.device.createBindGroup({
                layout: wg.bindGroupLayout,
                entries: [
                    { binding: 0, resource: wg.sampler },
                    { binding: 1, resource: externalTex },
                ],
            });
            const encoder = wg.device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: wg.context.getCurrentTexture().createView(),
                    loadOp: 'clear',
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    storeOp: 'store',
                }],
            });
            pass.setPipeline(wg.pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3);
            pass.end();
            wg.device.queue.submit([encoder.finish()]);
            return;
        }
        // Only fall back to 2D if WebGPU genuinely failed (not while a concurrent init is in progress).
        if (gpuInitPromise) return;
        canvas = recreateCanvas();
        if (!canvas) return;
    }

    drawVideoFrame2D(canvas, frame);
}

function renderSoftwareFrame(payload: SoftwareFramePayload): void {
    if (!isPlayerRoute()) return;
    const canvas = ensureCanvas();
    if (!canvas) return;

    activeStream = true;
    canvasVisible = true;
    if (canvas.style.display === 'none') {
        canvas.style.display = 'block';
    }

    if (gpuState || gpuInitPromise) {
        recreateCanvas();
    }
    const swCanvas = ensureCanvas();
    if (!swCanvas) return;

    if (!ctx2d) {
        ctx2d = swCanvas.getContext('2d', { alpha: false });
    }
    if (!ctx2d) return;

    const { width, height, stride, buffer } = payload;
    if (swCanvas.width !== width || swCanvas.height !== height) {
        swCanvas.width = width;
        swCanvas.height = height;
    }

    const expectedRowBytes = width * 4;
    const pixels = new Uint8ClampedArray(expectedRowBytes * height);
    if (stride === expectedRowBytes) {
        pixels.set(buffer.subarray(0, expectedRowBytes * height));
    } else {
        for (let y = 0; y < height; y++) {
            const srcStart = y * stride;
            pixels.set(buffer.subarray(srcStart, srcStart + expectedRowBytes), y * expectedRowBytes);
        }
    }
    // rgb0 leaves the 4th byte undefined; force opaque alpha for Canvas2D ImageData.
    for (let i = 3; i < pixels.length; i += 4) {
        pixels[i] = 255;
    }

    const imgData = new ImageData(pixels, width, height);
    ctx2d.putImageData(imgData, 0, 0);
}

export function isEmbeddedMpvEnabled(): boolean {
    return mpvEnabled;
}

export function addShellMessageListener(listener: (message: string) => void): void {
    shellListeners.push(listener);
}

export function sendShellMessageToMain(message: string): void {
    ipcRenderer.send(ENHANCED_API.MPV.SHELL_IPC_TO_MAIN, message);
}

/**
 * Must be called at the very top of preload (document_start) so Stremio Web detects
 * window.qt.webChannelTransport / chrome.webview before bootstrapping ShellVideo.
 */
export function setupMpvShellBridge(): boolean {
    mpvEnabled = Boolean(ipcRenderer.sendSync(ENHANCED_API.MPV.IS_AVAILABLE));
    if (!mpvEnabled) {
        return false;
    }

    // Receive shell IPC responses from main process and fan out to main world + preload listeners (videoBridge).
    ipcRenderer.on(ENHANCED_API.MPV.SHELL_IPC_TO_RENDERER, (_event, message: string) => {
        try {
            const parsed = JSON.parse(message);
            if (parsed?.args?.[0] === 'mpv-prop-change' && parsed.args[1]?.name === 'path') {
                activeStream = Boolean(parsed.args[1].data);
                updateCanvasVisibility();
            } else if (parsed?.args?.[0] === 'mpv-event-ended') {
                activeStream = false;
                updateCanvasVisibility();
            }
        } catch {
            // Non-JSON or unrelated payload
        }

        if (mainWorldCallback) {
            try {
                mainWorldCallback(message);
            } catch {
                // Ignore page listener errors
            }
        }

        for (const listener of shellListeners) {
            try {
                listener(message);
            } catch {
                // Ignore preload listener errors
            }
        }
    });

    // Expose a minimal transport bridge to the page's main world.
    contextBridge.exposeInMainWorld('__stremioShellBridge', {
        send: (data: unknown) => {
            const payload = typeof data === 'string' ? data : JSON.stringify(data);
            try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data as any;
                if (parsed?.args?.[0] === 'mpv-command' && Array.isArray(parsed.args[1]) && parsed.args[1][0] === 'stop') {
                    activeStream = false;
                    updateCanvasVisibility();
                }
            } catch {
                // Ignore non-JSON payloads
            }
            ipcRenderer.send(ENHANCED_API.MPV.SHELL_IPC_TO_MAIN, payload);
        },
        onMessage: (cb: (message: string) => void) => {
            mainWorldCallback = cb;
        },
    });

    // Inject Stremio Desktop Shell transport globals (compatible with Stremio Web 5.1+ ShellVideo).
    const ipcKey = getPlatformIpcKey();
    webFrame.executeJavaScript(`
        (() => {
            if (window.__STREMIO_SHELL_BRIDGE_INSTALLED__) return;
            window.__STREMIO_SHELL_BRIDGE_INSTALLED__ = true;

            let listeners = [];
            let webChannelQueue = [];
            let webChannelOnMessage = null;

            const deliverMessage = (data) => {
                const evt = { data };
                const snapshot = listeners.slice();
                for (let i = 0; i < snapshot.length; i++) {
                    try { snapshot[i](evt); } catch (e) { console.error('[ShellIPC] listener error:', e); }
                }
            };

            const postMessage = (data) => {
                if (window.__stremioShellBridge && typeof window.__stremioShellBridge.send === 'function') {
                    const json = typeof data === 'string' ? data : JSON.stringify(data);
                    window.__stremioShellBridge.send(json);
                }
            };

            const addEventListener = (name, listener) => {
                if (name !== 'message' || typeof listener !== 'function') return;
                if (!listeners.includes(listener)) {
                    listeners.push(listener);
                }
            };

            const removeEventListener = (name, listener) => {
                if (name !== 'message') return;
                listeners = listeners.filter((fn) => fn !== listener);
            };

            window.ipc = { postMessage, addEventListener, removeEventListener };

            const webChannelTransport = { send: postMessage };
            Object.defineProperty(webChannelTransport, 'onmessage', {
                get() { return webChannelOnMessage; },
                set(fn) {
                    webChannelOnMessage = fn;
                    if (typeof fn === 'function') {
                        while (webChannelQueue.length > 0) {
                            const msg = webChannelQueue.shift();
                            try { fn(msg); } catch (e) { console.error('[WebChannel] queued msg error:', e); }
                        }
                    }
                },
                configurable: true,
            });

            window.qt = { webChannelTransport };

            // Note: Stremio Web 5.1's shell hook (module 32606) registers its listener on
            // window.chrome.webview AND sets window.qt.webChannelTransport.onmessage = function(){}.
            // By keeping webChannelTransport listener separate from chrome.webview / window.ipc listeners,
            // we never invoke each message handler twice.
            window.chrome = Object.assign(window.chrome || {}, {
                webview: {
                    postMessage,
                    addEventListener,
                    removeEventListener,
                },
            });

            addEventListener('message', (message) => {
                if (typeof webChannelOnMessage === 'function') {
                    try { webChannelOnMessage(message); } catch (e) { console.error('[WebChannel] onmessage error:', e); }
                } else if (webChannelQueue.length < 64) {
                    webChannelQueue.push(message);
                }
            });

            if (window.__stremioShellBridge && typeof window.__stremioShellBridge.onMessage === 'function') {
                window.__stremioShellBridge.onMessage(deliverMessage);
            }

            window.stremio_server_ipc_key = ${JSON.stringify(ipcKey)};
            window.__STREMIO_SHELL__ = true;
        })();
    `).catch(() => {});

    // Receive zero-copy shared texture transfers over standard IPC (avoids sendSharedTexture breaking webContents.send in Electron 45).
    ipcRenderer.on(ENHANCED_API.MPV.SHARED_TEXTURE_FRAME, async (_event, payload: { frameId: number; transfer: any; meta?: SharedTextureMeta }) => {
        let importedSubtle: any = null;
        let syncToken: any = null;
        let hadError = false;
        try {
            if (sharedTexture?.subtle && typeof sharedTexture.subtle.finishTransferSharedTexture === 'function' && payload?.transfer) {
                importedSubtle = sharedTexture.subtle.finishTransferSharedTexture(payload.transfer);
                const videoFrame = importedSubtle.getVideoFrame();
                try {
                    syncToken = importedSubtle.getFrameCreationSyncToken();
                } catch {
                    // Sync token is optional on some GPU paths
                }
                try {
                    await renderSharedVideoFrame(videoFrame, payload.meta);
                } finally {
                    videoFrame.close();
                }
            } else {
                hadError = true;
                ipcRenderer.send(ENHANCED_API.MPV.SHARED_TEXTURE_ERROR, payload?.frameId, 'sharedTexture.subtle.finishTransferSharedTexture unavailable in renderer');
            }
        } catch (err) {
            hadError = true;
            console.error('[MpvShellBridge] Shared texture receive error:', err);
            ipcRenderer.send(ENHANCED_API.MPV.SHARED_TEXTURE_ERROR, payload?.frameId, err instanceof Error ? err.message : String(err));
        } finally {
            if (importedSubtle) {
                try {
                    importedSubtle.release();
                } catch {
                    // Already released
                }
            }
            if (!hadError) {
                ipcRenderer.send(ENHANCED_API.MPV.SHARED_TEXTURE_ACK, payload?.frameId, syncToken);
            }
        }
    });

    // Software fallback receiver if GPU sharedTexture import fails on an exotic driver.
    ipcRenderer.on(ENHANCED_API.MPV.SOFTWARE_FRAME, (_event, payload: SoftwareFramePayload) => {
        renderSoftwareFrame(payload);
    });

    const mountAndSync = () => {
        ensureCanvas();
        updateCanvasVisibility();
        syncViewportSize(true);
        ipcRenderer.send(ENHANCED_API.MPV.RENDERER_READY, true);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountAndSync, { once: true });
    } else {
        mountAndSync();
    }

    window.addEventListener('load', mountAndSync);
    window.addEventListener('resize', () => syncViewportSize(false));
    window.addEventListener('hashchange', () => {
        updateCanvasVisibility();
        if (isPlayerRoute()) syncViewportSize(true);
    });
    window.addEventListener('popstate', () => {
        updateCanvasVisibility();
        if (isPlayerRoute()) syncViewportSize(true);
    });
    window.addEventListener('beforeunload', () => {
        ipcRenderer.send(ENHANCED_API.MPV.RENDERER_READY, false);
    });

    try {
        window.matchMedia('(dynamic-range: high)').addEventListener('change', () => syncViewportSize(true));
    } catch {
        // Older media query listener API
    }

    // Re-sync render resolution when dragging the window across monitors with different DPI scales.
    const watchDprChange = () => {
        try {
            const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
            mq.addEventListener('change', () => {
                syncViewportSize(true);
                watchDprChange();
            }, { once: true });
        } catch {
            // Ignore unsupported media query syntax
        }
    };
    watchDprChange();

    return true;
}
