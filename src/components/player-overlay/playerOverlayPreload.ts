import { ipcRenderer } from 'electron';
import { ICONS, ENHANCED_API, SELECTORS } from '../../constants';

function formatTime(seconds: number): string {
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

document.addEventListener("DOMContentLoaded", () => {
    let videoDuration = 0;

    const topNav = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.TOP_NAV) as HTMLElement | null;
    const bottomBar = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.BOTTOM_BAR) as HTMLElement | null;
    const sideButton = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SIDE_DRAWER_BUTTON) as HTMLElement | null;

    const backBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.BACK_BUTTON) as HTMLElement | null;
    const playPauseBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.PLAY_PAUSE_BUTTON) as HTMLElement | null;
    const nextBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.NEXT_BUTTON) as HTMLElement | null;
    const muteBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.MUTE_BUTTON) as HTMLElement | null;
    const fullscreenBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.FULLSCREEN_BUTTON) as HTMLElement | null;

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
    const titleSpan = document.querySelector('.player-title-qywea') as HTMLSpanElement | null;

    ipcRenderer.on(ENHANCED_API.MPV.OVERLAY_SET_STREAM_TITLE, (_event, title: string) => {
        if (titleSpan) {
            titleSpan.textContent = title;
        }
    });

    const enableInput = () => ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_IGNORE_MOUSE, false);
    const disableInput = () => ipcRenderer.send(ENHANCED_API.MPV.OVERLAY_SET_IGNORE_MOUSE, true);

    topNav?.addEventListener('mouseenter', enableInput);
    topNav?.addEventListener('mouseleave', disableInput);
    bottomBar?.addEventListener('mouseenter', enableInput);
    bottomBar?.addEventListener('mouseleave', disableInput);
    sideButton?.addEventListener('mouseenter', enableInput);
    sideButton?.addEventListener('mouseleave', disableInput);

    document.body.addEventListener('mousemove', () => {
        ipcRenderer.send(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE);
    });

    setInterval(() => {
        const currentTime = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "time-pos"));
        const duration = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "duration"));
        const currentVolume = parseFloat(ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "volume"));

        if (!isNaN(duration) && duration > 0) {
            videoDuration = duration;
            if (timeTotalLabel) timeTotalLabel.textContent = formatTime(duration);
            
            if (!isNaN(currentTime) && timeCurrentLabel && seekTrackBefore && seekTrackAfter && seekThumb) {
                timeCurrentLabel.textContent = formatTime(currentTime);
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

    nextBtn?.addEventListener("click", () => {
        // next episode implementation here
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

    function handleSliderClick(event: MouseEvent, sliderElement: HTMLElement, callback: (percentage: number) => void) {
        const rect = sliderElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        callback(percentage);
    }

    seekBarSlider?.addEventListener("click", (e) => {
        if (videoDuration <= 0) return;
        handleSliderClick(e as MouseEvent, seekBarSlider, (percentage) => {
            const targetTime = percentage * videoDuration;
            ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "time-pos", targetTime.toString());
        });
    });

    volumeSlider?.addEventListener("click", (e) => {
        handleSliderClick(e as MouseEvent, volumeSlider, (percentage) => {
            const targetVolume = Math.round(percentage * 100);
            ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "volume", targetVolume.toString());
        });
    });
});