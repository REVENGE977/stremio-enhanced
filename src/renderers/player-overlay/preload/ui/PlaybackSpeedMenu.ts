import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS } from "../../../../constants";

export class PlaybackSpeedMenu {
    public static init() {
        const playbackSpeedBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_BUTTON) as HTMLElement | null;
        const speedOptionsContainer = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_MENU) as HTMLElement | null;

        playbackSpeedBtn?.addEventListener("click", () => {
            if (speedOptionsContainer) {
                const isVisible = speedOptionsContainer.style.display === "";
                speedOptionsContainer.style.display = isVisible ? "none" : "";
            }
        });

        speedOptionsContainer?.addEventListener("click", (event) => {
            const targetOption = (event.target as HTMLElement).closest(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_OPTION) as HTMLElement | null;
            if (!targetOption) return;

            const labelElement = targetOption.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_LABEL) as HTMLElement | null;
            if (!labelElement || !labelElement.textContent) return;

            const speedText = labelElement.textContent.trim().replace('x', '');
            const speedValue = parseFloat(speedText);

            if (!isNaN(speedValue)) {
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "speed", speedValue.toString());

                speedOptionsContainer.querySelectorAll(SELECTORS.MPV_PLAYER_OVERLAY.PLAYBACK_SPEED_OPTION).forEach(opt => {
                    opt.classList.remove('selected');
                });

                targetOption.classList.add('selected');
            }
        });
    }
}