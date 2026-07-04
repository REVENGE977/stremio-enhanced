import { ipcRenderer } from "electron";
import Helpers from "../../utils/Helpers";
import { getLogger } from "../../utils/logger";
import { mpvPlayerAPI } from "../api/mpvPlayer";
import { ENHANCED_API, SELECTORS } from "../../constants";

const logger = getLogger("MpvPlayerInjector");

class MpvPlayerInjector {
    private static isAttached = false;
    private static videoElm: HTMLVideoElement | null = null;
    private static resizeDebounceTimeout: NodeJS.Timeout | null = null;

    public static async checkWatching() {
        if (!location.href.includes('#/player')) {
            this.destroyPlayer();
            return;
        }

        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        logger.info("Initializing mpv player injection...");
        await this.replacePlayer(video);

        if (this.videoElm) {
            const resizeObserver = new ResizeObserver(() => this.syncVideoGeometry());
            resizeObserver.observe(this.videoElm);
        }
    }

    private static syncVideoGeometry() {
        if (!this.isAttached || !this.videoElm) return;
        
        clearTimeout(this.resizeDebounceTimeout!);
        this.resizeDebounceTimeout = setTimeout(() => {
            const rect = this.videoElm!.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            const nativeX = Math.round(rect.left * dpr);
            const nativeY = Math.round(rect.top * dpr);
            const nativeWidth = Math.round(rect.width * dpr);
            const nativeHeight = Math.round(rect.height * dpr);
            
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

        let mpvPlaceholder = document.querySelector(SELECTORS.MPV_PLACEHOLDER) as HTMLElement | null;
        if (!mpvPlaceholder) {
            mpvPlaceholder = document.createElement("div");
            mpvPlaceholder.id = SELECTORS.MPV_PLACEHOLDER.replace("#", "");
            
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
        
        mpvPlayerAPI.attach(
            Math.round(rect.left * dpr), 
            Math.round(rect.top * dpr), 
            Math.round(rect.width * dpr), 
            Math.round(rect.height * dpr)
        );

        mpvPlayerAPI.command("loadfile", videoSrc!);
        mpvPlayerAPI.setProperty("pause", "no");

        // Copy current stylesheets to the overlay
        // const stylesToSync = Array.from(document.styleSheets)
        //     .map(sheet => {
        //         try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); }
        //         catch (e) { return ''; }
        //     }).join('\n');

        
        document.body.addEventListener('mousemove', () => {
            ipcRenderer.send(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE);
        });

        document.addEventListener("beforeunload", () => {
            this.destroyPlayer();
        });
    }

    public static destroyPlayer() {
        if (!this.isAttached) return;
        this.isAttached = false;
        
        ipcRenderer.send(ENHANCED_API.MPV.DESTROY_OVERLAY);
        mpvPlayerAPI.command("stop");
        logger.info("Native MPV instance terminated safely.");
    }
}

export default MpvPlayerInjector;