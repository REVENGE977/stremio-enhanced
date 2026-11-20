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
    device: any;
    context: any;
    pipeline: any;
    sampler: any;
    bindGroupLayout: any;
    format: string;
    hdr: boolean;
}

let mpvEnabled = false;
let shellListeners: Array<(message: string) => void> = [];
let mainWorldCallback: ((message: string) => void) | null = null;
let canvasEl: HTMLCanvasElement | null = null;
let ctx2d: CanvasRenderingContext2D | null = null;
let gpuState: WebGpuState | null = null;
let gpuInitAttempted = false;
let gpuInitInFlight = false;
let lastSentW = 0;
let lastSentH = 0;
let lastSentHdr: boolean | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let activeStream = false;

function getPlatformIpcKey(): string {
    if (process.platform === 'win32') return 'WIN';
    if (process.platform === 'darwin') return 'MAC';
    return 'LINUX';
}

function isPlayerRoute(): boolean {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/player') || hash.includes('/player/')) return true;
    return document.querySelector('[class*="player-container"]') !== null;
}

function isDisplayHdrCapable(): boolean {
    try {
        return window.matchMedia('(dynamic-range: high)').matches;
    } catch {
        return false;
    }
}

function updateCanvasVisibility(): void {
    if (!canvasEl) return;
    const show = activeStream || isPlayerRoute();
    canvasEl.style.display = show ? 'block' : 'none';
    if (!show && ctx2d && canvasEl.width > 0 && canvasEl.height > 0) {
        ctx2d.fillStyle = '#000';
        ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);
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

async function initWebGpuForHdr(canvas: HTMLCanvasElement, hdr: boolean): Promise<WebGpuState | null> {
    if (gpuState) {
        if (gpuState.hdr !== hdr) {
            const preferredFormat = (navigator as any).gpu.getPreferredCanvasFormat();
            const format = hdr ? 'rgba16float' : preferredFormat;
            gpuState.context.configure({
                device: gpuState.device,
                format,
                alphaMode: 'opaque',
                toneMapping: { mode: hdr ? 'extended' : 'standard' },
            });
            gpuState.format = format;
            gpuState.hdr = hdr;
        }
        return gpuState;
    }
    if (gpuInitAttempted || gpuInitInFlight) return null;
    const gpu = (navigator as any).gpu;
    if (!gpu) {
        gpuInitAttempted = true;
        return null;
    }

    gpuInitInFlight = true;
    try {
        const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) {
            gpuInitAttempted = true;
            return null;
        }
        const device = await adapter.requestDevice();
        const context = canvas.getContext('webgpu') as any;
        if (!context) {
            gpuInitAttempted = true;
            return null;
        }

        const preferredFormat = gpu.getPreferredCanvasFormat();
        const format = hdr ? 'rgba16float' : preferredFormat;
        context.configure({
            device,
            format,
            alphaMode: 'opaque',
            toneMapping: { mode: hdr ? 'extended' : 'standard' },
        });

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

        gpuState = {
            device,
            context,
            pipeline,
            sampler,
            bindGroupLayout,
            format,
            hdr,
        };
        gpuInitAttempted = true;
        return gpuState;
    } catch {
        gpuInitAttempted = true;
        return null;
    } finally {
        gpuInitInFlight = false;
    }
}

function drawVideoFrame2D(canvas: HTMLCanvasElement, frame: VideoFrame): void {
    if (!ctx2d) {
        ctx2d = canvas.getContext('2d', { alpha: false, desynchronized: true });
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
    if (old && old.parentElement) {
        const fresh = document.createElement('canvas');
        fresh.id = CANVAS_ID;
        fresh.style.cssText = old.style.cssText;
        old.parentElement.replaceChild(fresh, old);
        canvasEl = fresh;
        ctx2d = null;
        gpuState = null;
        gpuInitAttempted = false;
        gpuInitInFlight = false;
        return fresh;
    }
    canvasEl = null;
    ctx2d = null;
    gpuState = null;
    gpuInitAttempted = false;
    gpuInitInFlight = false;
    return ensureCanvas();
}

async function renderSharedVideoFrame(frame: VideoFrame, meta?: SharedTextureMeta): Promise<void> {
    let canvas = ensureCanvas();
    if (!canvas) return;

    if (canvas.style.display === 'none' && (activeStream || isPlayerRoute())) {
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
    } else if (!wantWebGpu && gpuState) {
        canvas = recreateCanvas();
        if (!canvas) return;
    }

    if (wantWebGpu) {
        const wg = await initWebGpuForHdr(canvas, true);
        if (wg) {
            if (canvas.width !== frame.codedWidth || canvas.height !== frame.codedHeight) {
                canvas.width = frame.codedWidth;
                canvas.height = frame.codedHeight;
            }
            const externalTex = wg.device.importExternalTexture({ source: frame });
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
        // WebGPU unavailable — recreate canvas so 2D fallback can bind cleanly.
        canvas = recreateCanvas();
        if (!canvas) return;
    }

    drawVideoFrame2D(canvas, frame);
}

function renderSoftwareFrame(payload: SoftwareFramePayload): void {
    const canvas = ensureCanvas();
    if (!canvas) return;

    if (canvas.style.display === 'none' && (activeStream || isPlayerRoute())) {
        canvas.style.display = 'block';
    }

    if (!ctx2d) {
        ctx2d = canvas.getContext('2d', { alpha: false, desynchronized: true });
    }
    if (!ctx2d) return;

    const { width, height, stride, buffer } = payload;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
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
                for (let i = 0; i < listeners.length; i++) {
                    try { listeners[i](evt); } catch (e) { console.error('[ShellIPC] listener error:', e); }
                }
            };

            const postMessage = (data) => {
                if (window.__stremioShellBridge && typeof window.__stremioShellBridge.send === 'function') {
                    window.__stremioShellBridge.send(data);
                }
            };

            const addEventListener = (name, listener) => {
                if (name !== 'message') return;
                listeners.push(listener);
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
                } else {
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

    // Register zero-copy shared texture receiver from main process.
    if (sharedTexture && typeof sharedTexture.setSharedTextureReceiver === 'function') {
        sharedTexture.setSharedTextureReceiver(async ({ importedSharedTexture }, meta?: SharedTextureMeta) => {
            try {
                const videoFrame = importedSharedTexture.getVideoFrame();
                try {
                    await renderSharedVideoFrame(videoFrame, meta);
                } finally {
                    videoFrame.close();
                }
            } finally {
                importedSharedTexture.release();
            }
        });
    }

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

    return true;
}
