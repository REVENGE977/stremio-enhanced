import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS } from "../../../../constants";

export class inputConfig {
    public static init() {
        const topNav = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.TOP_NAV) as HTMLElement | null;
        const bottomBar = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.BOTTOM_BAR) as HTMLElement | null;
        const sideButton = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SIDE_DRAWER_BUTTON) as HTMLElement | null;
        const speedOptionsContainer = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_MENU) as HTMLElement | null;
        if(speedOptionsContainer) { 
            speedOptionsContainer.style.pointerEvents = 'auto';
        }
        
        const subtitlesMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_MENU) as HTMLElement | null;
        if(subtitlesMenu) { 
            subtitlesMenu.style.pointerEvents = 'auto';
        }

        const audioMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_MENU) as HTMLElement | null;
        if(audioMenu) { 
            audioMenu.style.pointerEvents = 'auto';
        }

        const enableInput = () => ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_IGNORE_MOUSE, false);
        const disableInput = () => ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_IGNORE_MOUSE, true);

        [topNav, bottomBar, sideButton, speedOptionsContainer, subtitlesMenu, audioMenu].forEach(elm => {
            elm?.addEventListener('mouseenter', enableInput);
            elm?.addEventListener('mouseleave', disableInput);
        });

        document.body.addEventListener('mousemove', () => {
            ipcRenderer.send(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE);
        });

        ipcRenderer.send(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE);
    }
}