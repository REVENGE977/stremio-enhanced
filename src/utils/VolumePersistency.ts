import Helpers from "./Helpers";
import { getLogger } from "./logger";

const logger = getLogger("VolumePersistency");
const VOLUME_KEY = "stremio_enhanced_volume_state";

class VolumePersistency {
    public static async checkWatching() {
        if (!location.href.includes('#/player')) {
            return;
        }

        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        if (video.dataset.volumePersisted === "true") {
            return;
        }
        video.dataset.volumePersisted = "true";

        try {
            const savedState = localStorage.getItem(VOLUME_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                if (typeof state.volume === "number" && state.volume >= 0 && state.volume <= 1) {
                    video.volume = state.volume;
                }
                if (typeof state.muted === "boolean") {
                    video.muted = state.muted;
                }
                logger.info(`Restored volume to ${state.volume}, muted: ${state.muted}`);
            }
        } catch (e) {
            logger.error(`Error restoring volume: ${e}`);
        }

        video.addEventListener("volumechange", () => {
            const state = {
                volume: video.volume,
                muted: video.muted
            };
            localStorage.setItem(VOLUME_KEY, JSON.stringify(state));
        });
    }
}

export default VolumePersistency;
