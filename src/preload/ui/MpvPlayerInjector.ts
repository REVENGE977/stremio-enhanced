//import { ipcRenderer } from "electron";
import Helpers from "../../utils/Helpers";
import { getLogger } from "../../utils/logger";
import { mpvPlayerAPI } from "../api/mpvPlayer";

const logger = getLogger("MpvPlayerInjector");

class MpvPlayerInjector {
    private static isAttached = false;
    private static videoElm: HTMLVideoElement | null = null;
    private static resizeDebounceTimeout: NodeJS.Timeout | null = null;
    
    private static readonly CONTROL_BAR_HEIGHT = 95;

    public static async checkWatching() {
        if (!location.href.includes('#/player')) {
            return;
        }

        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        logger.info("Structural container found, attaching native player footprint...");
        await this.replacePlayer(video);

        if (this.videoElm) {
            const resizeObserver = new ResizeObserver(() => this.syncVideoGeometry());
            resizeObserver.observe(this.videoElm);

            //ipcRenderer.on("mpv-event", () => this.updateTimelineMetrics());
        }
    }

    // private static updateTimelineMetrics() {
    //     const hwdecActive = mpvPlayerAPI.getProperty("hwdec-current");
    //     const containerFps = mpvPlayerAPI.getProperty("container-fps");
    //     const estimatedFps = mpvPlayerAPI.getProperty("estimated-vf-fps");

    //     logger.info(`--- MPV Diagnostics ---`);
    //     logger.info(`Hardware Decoding : ${hwdecActive === "no" ? "Software Mode" : `Active (${hwdecActive})`}`);
    //     logger.info(`Container Target  : ${containerFps ? parseFloat(containerFps).toFixed(2) : "Unknown"} FPS`);
    //     logger.info(`Real-time Display : ${estimatedFps ? parseFloat(estimatedFps).toFixed(2) : "Unknown"} FPS`);
    // }

    private static syncVideoGeometry() {
        if (!this.isAttached || !this.videoElm) return;
        
        clearTimeout(this.resizeDebounceTimeout!);
        this.resizeDebounceTimeout = setTimeout(() => {
            const rect = this.videoElm!.getBoundingClientRect();
            
            const dpr = window.devicePixelRatio || 1;
            
            const nativeX = Math.round(rect.left * dpr);
            const nativeY = Math.round(rect.top * dpr);
            const nativeWidth = Math.round(rect.width * dpr);
            
            // Deduct the padding height from the final calculation 
            const scaledPadding = this.CONTROL_BAR_HEIGHT * dpr;
            const nativeHeight = Math.round((rect.height * dpr) - scaledPadding);
            
            mpvPlayerAPI.resize(nativeX, nativeY, nativeWidth, nativeHeight);
        }, 50);
    }

    private static async replacePlayer(videoElement: HTMLVideoElement) {
        if (this.isAttached) return;
        this.isAttached = true; 

        let videoSrc = await Helpers.getStreamURL();

        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
        videoElement.style.opacity = "0";
        videoElement.style.pointerEvents = "none";

        let mpvPlaceholder = document.getElementById("enhanced-mpv-placeholder");
        if (!mpvPlaceholder) {
            mpvPlaceholder = document.createElement("div");
            mpvPlaceholder.id = "enhanced-mpv-placeholder";
            
            mpvPlaceholder.style.position = "absolute";
            mpvPlaceholder.style.top = "0";
            mpvPlaceholder.style.left = "0";
            mpvPlaceholder.style.width = "100%";
            mpvPlaceholder.style.height = "100%";
            mpvPlaceholder.style.zIndex = "-1"; 
            
            videoElement.parentElement?.appendChild(mpvPlaceholder);
        }

        this.videoElm = mpvPlaceholder as any;

        const rect = this.videoElm!.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Deduct the padding height from the initial attach layout as well
        const scaledPadding = this.CONTROL_BAR_HEIGHT * dpr;
        const nativeHeight = Math.round((rect.height * dpr) - scaledPadding);
        
        mpvPlayerAPI.attach(
            Math.round(rect.left * dpr), 
            Math.round(rect.top * dpr), 
            Math.round(rect.width * dpr), 
            nativeHeight
        );

        mpvPlayerAPI.command("loadfile", videoSrc!);
        mpvPlayerAPI.setProperty("pause", "no");

        document.addEventListener("beforeunload", () => {
            this.destroyPlayer();
        });

        // setInterval(() => {
        //     this.updateTimelineMetrics();
        // }, 1000);
    }

    private static destroyPlayer() {
        if (!this.isAttached) return;
        this.isAttached = false;
        
        mpvPlayerAPI.command("quit"); 
        logger.info("Native MPV instance terminated safely.");
    }
}

export default MpvPlayerInjector;