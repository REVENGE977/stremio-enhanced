import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS, ICONS } from "../../../../constants";

export class ControlBar {
    public static init() {
        const titleSpan = document.querySelector('.player-title-qywea') as HTMLSpanElement | null;
        const backBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.BACK_BUTTON) as HTMLElement | null;
        const playPauseBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAY_PAUSE_BUTTON) as HTMLElement | null;
        const nextBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.NEXT_BUTTON) as HTMLElement | null;
        const muteBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.MUTE_BUTTON) as HTMLElement | null;
        const fullscreenBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.FULLSCREEN_BUTTON) as HTMLElement | null;

        ipcRenderer.on(ENHANCED_API.MPV.OVERLAY_SET_STREAM_TITLE, (_event, title: string) => {
            if (titleSpan) titleSpan.textContent = title;
        });

        backBtn?.addEventListener("click", () => {
            ipcRenderer.send(ENHANCED_API.MPV.TRIGGER_MAIN_BACK_NAVIGATION);
        });

        playPauseBtn?.addEventListener("click", () => {
            const isCurrentlyPaused = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "pause");
            const playPauseBtnIcon = playPauseBtn.querySelector("svg > path") as HTMLElement | null;

            if (isCurrentlyPaused === "yes") {
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "pause", "no");
                playPauseBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_PAUSE);
                playPauseBtn?.setAttribute("title", "Pause");
            } else {
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "pause", "yes");
                playPauseBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_PLAY);
                playPauseBtn?.setAttribute("title", "Play");
            }
        });

        ipcRenderer.on(ENHANCED_API.MPV.PLAYBACK_STATE_CHANGED, (_event, state) => {
            const playPauseBtnIcon = playPauseBtn?.querySelector("svg > path") as HTMLElement | null;
            if (!playPauseBtn) return;

            if (state === "playing") {
                playPauseBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_PAUSE);
                playPauseBtn?.setAttribute("title", "Pause");
            } else {
                playPauseBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_PLAY);
                playPauseBtn?.setAttribute("title", "Play");
            }
        });

        nextBtn?.addEventListener("click", () => {
            ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_TRIGGER_NEXTVIDEO);
        });

        muteBtn?.addEventListener("click", () => {
            const isCurrentlyMuted = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "mute");
            const muteBtnIcon = muteBtn.querySelector("svg > path") as HTMLElement | null;

            if (isCurrentlyMuted === "yes") {
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "mute", "no");
                muteBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_MUTE);
                muteBtn?.setAttribute("title", "Mute");
            } else {
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "mute", "yes");
                muteBtnIcon?.setAttribute("d", ICONS.PLAYER_OVERLAY_UNMUTE);
                muteBtn?.setAttribute("title", "Unmute");
            }
        });

        fullscreenBtn?.addEventListener("click", () => {
            ipcRenderer.send(ENHANCED_API.MPV.TRIGGER_MAIN_FULLSCREEN);
        });
    }
}