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
    private static isInitializing = false;
    private static videoElm: HTMLVideoElement | null = null;
    private static resizeDebounceTimeout: NodeJS.Timeout | null = null;
    private static resizeObserver: ResizeObserver | null = null;
    private static domObserver: MutationObserver | null = null;

    private static mouseMoveHandler = () => {
        ipcRenderer.send(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE);
    };

    public static get isActive() {
        return this.isAttached || this.isInitializing;
    }

    public static async checkWatching() {
        if (!location.href.includes('#/player')) {
            this.destroyPlayer();
            return;
        }

        if (this.isAttached || this.isInitializing) return;

        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        logger.info("Initializing mpv player injection...");
        await this.replacePlayer(video);
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

    private static autoPlayObserver() {
        if (this.domObserver) return;
        
        this.domObserver = new MutationObserver(() => {
            if (!this.isActive) return;
            
            const rogueVideos = document.querySelectorAll('video');
            rogueVideos.forEach(video => {
                if (video.src || video.hasAttribute('autoplay') || !video.muted || !video.paused) {
                    logger.info("Intercepted and stopped an auto-playing HTML5 video element.");
                    video.pause();
                    video.removeAttribute('src');
                    video.removeAttribute('autoplay');
                    video.muted = true;
                    video.style.opacity = "0";
                    video.style.pointerEvents = "none";
                }
            });
        });
        
        this.domObserver.observe(document.body, { childList: true, subtree: true });
    }

    private static stopAutoPlayObserver() {
        if (this.domObserver) {
            this.domObserver.disconnect();
            this.domObserver = null;
        }
    }

    private static async replacePlayer(videoElement: HTMLVideoElement) {
        if (this.isAttached || this.isInitializing) return;
        this.isInitializing = true;

        try {
            let videoSrc = await Helpers.getStreamURL();

            if (!location.href.includes('#/player')) {
                this.isInitializing = false;
                return;
            }

            this.isAttached = true; 
            this.autoPlayObserver();

            videoElement.pause();
            videoElement.removeAttribute('src');
            videoElement.load();
            videoElement.style.opacity = "0";
            videoElement.style.pointerEvents = "none";

            ipcRenderer.on(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, this.handleLoadExternalSubtitle);

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

            this.resizeObserver = new ResizeObserver(() => this.syncVideoGeometry());
            this.resizeObserver.observe(this.videoElm!);

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
            mpvPlayerAPI.setProperty("sub-delay", "0.0");
            mpvPlayerAPI.setProperty("sub-scale", "1.0");
            mpvPlayerAPI.setProperty("sub-use-margins", "yes");
            mpvPlayerAPI.setProperty("sub-align-y", "bottom");
            mpvPlayerAPI.setProperty("sub-pos", "100");
            mpvPlayerAPI.setProperty("keepaspect", "yes"); 
            mpvPlayerAPI.setProperty("video-unscaled", "no");
            mpvPlayerAPI.setProperty("panscan", "0.0");
            
            // load addon subs in the background
            (async () => {
                try {
                    const subtitlesList = await PlaybackState.waitForAddonSubtitles();
                    
                    if (!this.isAttached) {
                        logger.info("Subtitles arrived but player context was already terminated. Discarding.");
                        return;
                    }

                    if (subtitlesList && subtitlesList.length > 0) {
                        ipcRenderer.send(ENHANCED_API.MPV.AVAILABLE_ADDON_SUBTITLES, subtitlesList);
                    } else {
                        logger.warn("No external addon subtitles resolved within the maximum timeout bounds.");
                    }
                } catch (err) {
                    logger.error("Error encountered inside subtitle population worker: " + err);
                }
            })();

            // Copy current stylesheets to the overlay
            // const stylesToSync = Array.from(document.styleSheets)
            //     .map(sheet => {
            //         try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); }
            //         catch (e) { return ''; }
            //     }).join('\n');

            const nextVideoLink = await Helpers.getNextVideo();
            if (this.isAttached) {
                ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_NEXTVIDEO, nextVideoLink ?? "");
            }

            document.body.addEventListener('mousemove', this.mouseMoveHandler);

            document.addEventListener("beforeunload", () => {
                this.destroyPlayer();
            });

        } catch (err) {
            logger.error("Fatal error during player replacement execution path: " + err);
        } finally {
            this.isInitializing = false; 
        }
    }

    private static handleLoadExternalSubtitle = async (_: any, sub_id: string) => {
        let getSubtitlesList = await PlaybackState.getPlayerState();
        let list = getSubtitlesList?.subtitles;
        let subtitleToLoad = list?.find(sub => sub.addonSubtitleId === sub_id);

        if (subtitleToLoad) {
            const { url, origin, lang } = subtitleToLoad;
            mpvPlayerAPI.command("sub-add", url, "select", origin || "Addon Subtitle", lang || "und");
            logger.info(`Instructed MPV to load remote subtitle: ${url}`);
        }
    };

    public static destroyPlayer() {
        if (!this.isAttached) return;
        this.isAttached = false;
        this.isInitializing = false;
        this.stopAutoPlayObserver();
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        document.body.removeEventListener('mousemove', this.mouseMoveHandler);
        ipcRenderer.off(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, this.handleLoadExternalSubtitle);

        ipcRenderer.send(ENHANCED_API.MPV.DESTROY_OVERLAY);
        mpvPlayerAPI.command("stop");
        
        logger.info("Native MPV instance terminated safely.");
    }
}

export default MpvPlayerInjector;