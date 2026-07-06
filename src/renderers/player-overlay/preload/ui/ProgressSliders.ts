import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS } from "../../../../constants";

export class ProgressSliders {
    private static videoDuration = 0;

    public static init() {
        const timeCurrentLabel = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.TIME_CURRENT) as HTMLElement | null;
        const timeTotalLabel = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.TIME_TOTAL) as HTMLElement | null;

        const seekBarSlider = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SEEK_BAR_SLIDER) as HTMLElement | null;
        const seekTrackBefore = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SEEK_TRACK_BEFORE) as HTMLElement | null;
        const seekTrackAfter = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SEEK_TRACK_AFTER) as HTMLElement | null;
        const seekThumb = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SEEK_THUMB) as HTMLElement | null;

        const volumeSlider = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.VOLUME_SLIDER) as HTMLElement | null;
        const volumeTrackBefore = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.VOLUME_TRACK_BEFORE) as HTMLElement | null;
        const volumeTrackAfter = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.VOLUME_TRACK_AFTER) as HTMLElement | null;
        const volumeThumb = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.VOLUME_THUMB) as HTMLElement | null;

        setInterval(() => {
            const currentTime = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "time-pos"));
            const duration = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "duration"));
            const currentVolume = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "volume"));

            if (!isNaN(duration) && duration > 0) {
                this.videoDuration = duration;
                if (timeTotalLabel) timeTotalLabel.textContent = this.formatTime(duration);
                
                if (!isNaN(currentTime) && timeCurrentLabel && seekTrackBefore && seekTrackAfter && seekThumb) {
                    timeCurrentLabel.textContent = this.formatTime(currentTime);
                    const progressPercent = (currentTime / duration) * 100;
                    
                    seekTrackBefore.style.width = `${progressPercent}%`;
                    seekTrackAfter.style.setProperty('--mask-width', `${progressPercent}%`);
                    seekThumb.style.marginLeft = `${progressPercent}%`;
                }
            }

            if (!isNaN(currentVolume) && volumeTrackBefore && volumeTrackAfter && volumeThumb) {
                volumeTrackBefore.style.width = `${currentVolume}%`;
                volumeTrackAfter.style.setProperty('--mask-width', `${currentVolume}%`);
                volumeThumb.style.marginLeft = `${currentVolume}%`;
            }
        }, 500);

        seekBarSlider?.addEventListener("click", (e) => {
            if (this.videoDuration <= 0) return;
            this.handleSliderClick(e as MouseEvent, seekBarSlider, (percentage) => {
                const targetTime = percentage * this.videoDuration;
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "time-pos", targetTime.toString());
            });
        });

        volumeSlider?.addEventListener("click", (e) => {
            this.handleSliderClick(e as MouseEvent, volumeSlider, (percentage) => {
                const targetVolume = Math.round(percentage * 100);
                ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "volume", targetVolume.toString());
            });
        });
    }

    private static handleSliderClick(event: MouseEvent, sliderElement: HTMLElement, callback: (percentage: number) => void) {
        const rect = sliderElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        callback(percentage);
    }

    private static formatTime(seconds: number): string {
        if (isNaN(seconds) || seconds === null) return "00:00:00";
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }
}