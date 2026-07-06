import { ipcRenderer } from "electron";
import Helpers from "../../utils/Helpers";
import { getLogger } from "../../utils/logger";
import { mpvPlayerAPI } from "../api/mpvPlayer";
import { ENHANCED_API, SELECTORS } from "../../constants";
import PlaybackState from "../../utils/PlaybackState";

const logger = getLogger("MpvPlayerInjector");

ipcRenderer.on(ENHANCED_API.EXECUTE_STREMIO_ROUTER_NAV, (_event, routeLink: string) => {
    try {

        window.location.hash = "#/";

        setTimeout(() => {
            window.location.hash = routeLink.startsWith('#') ? routeLink : `#${routeLink}`;
        }, 50);
    } catch (err) {
        logger.error("Failed handling client SPA single page routing navigation loop: " + err);
    }
});

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

        ipcRenderer.on(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, async (_, sub_id: string) => {
            let getSubtitlesList = await PlaybackState.getPlayerState();
            let list = getSubtitlesList?.subtitles;
            let subtitleToLoad = list?.find(sub => sub.addonSubtitleId === sub_id);

            if (subtitleToLoad) {
                const { url, origin, lang } = subtitleToLoad;
                mpvPlayerAPI.command("sub-add", url, "select", origin || "Addon Subtitle", lang || "und");
                logger.info(`Instructed MPV to load remote subtitle: ${url}`);
            }
        });

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
        mpvPlayerAPI.setProperty("sid", "no");
        
        setTimeout(async () => {
            const subtitlesList = await this.getAddonSubs();
            if (subtitlesList && subtitlesList.length > 0) {
                ipcRenderer.send(ENHANCED_API.MPV.AVAILABLE_ADDON_SUBTITLES, subtitlesList);
            } else logger.warn("No addon subtitles found.");
        }, 3000);

        // mpvPlayerAPI.command("sub-add", "https://subs5.strem.io/en/download/subencoding-stremio-utf8/src-api/file/1957994779", "select", "Arabic", "ar")

        // Copy current stylesheets to the overlay
        // const stylesToSync = Array.from(document.styleSheets)
        //     .map(sheet => {
        //         try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); }
        //         catch (e) { return ''; }
        //     }).join('\n');

        const nextVideoLink = await Helpers.getNextVideo();
        if (nextVideoLink) {
            ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_NEXTVIDEO, nextVideoLink);
        }

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

    private static async getAddonSubs() {
        let getSubtitlesList = await PlaybackState.getPlayerState();
        let list = getSubtitlesList?.subtitles;

        return list;
    }
}

export default MpvPlayerInjector;