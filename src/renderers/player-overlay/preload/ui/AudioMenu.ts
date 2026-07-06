import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS } from "../../../../constants";
import { getAudioTrackEntryTemplate } from "../../components/audiotracks-menu/trackEntry";

export class AudioMenu {
    private static audioDropdownMenu = null as HTMLElement | null;

    public static init() {
        this.audioDropdownMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_TRACKS_LIST);
        const audioMenuBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_MENU_BUTTON); 
        const audioMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_MENU) as HTMLElement | null;

        if (audioMenu) audioMenu.style.pointerEvents = 'auto';

        audioMenuBtn?.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!audioMenu) return;

            const isHidden = audioMenu.style.display === "none";
            audioMenu.style.display = isHidden ? "" : "none";

            if (isHidden) {
                await this.populateAudioTracksMenu();
            }
        });

        this.audioDropdownMenu?.addEventListener("click", (event) => {
            const targetTrack = (event.target as HTMLElement).closest(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_TRACK) as HTMLElement | null;
            if (!targetTrack) return;

            const trackId = targetTrack.getAttribute("data-id");
            if (!trackId) return;

            this.audioDropdownMenu?.querySelectorAll(SELECTORS.MPV_PLAYER_OVERLAY.AUDIO_TRACK).forEach(el => el.classList.remove("selected"));
            targetTrack.classList.add("selected");

            ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "aid", trackId);
            audioMenu!.style.display = "none";
        });
    }

    private static async populateAudioTracksMenu() {
        if (!this.audioDropdownMenu) return;
        this.audioDropdownMenu.innerHTML = "";

        const rawTracks = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "track-list");
        let trackList: any[] = [];

        try {
            trackList = typeof rawTracks === "string" ? JSON.parse(rawTracks) : rawTracks;
        } catch (err) {
            console.error("Failed to parse MPV audio track list:", err);
        }

        const audioTracks = (trackList || []).filter((track: any) => track.type === "audio");

        if (audioTracks.length === 0) {
            this.audioDropdownMenu.innerHTML = `<div class="option-COcvW">No Audio Tracks Found</div>`;
            return;
        }

        for (const track of audioTracks) {
            const langCode = track.lang || "und";
            const langTitle = this.getLanguageName(langCode);
            const finalTitle = track.title ? `${langTitle} (${track.title})` : langTitle;

            const trackEntryHtml = await getAudioTrackEntryTemplate(track.id.toString(), finalTitle, langCode);
            this.audioDropdownMenu.insertAdjacentHTML('beforeend', trackEntryHtml);

            if (track.selected) {
                const injectedRow = this.audioDropdownMenu.lastElementChild as HTMLElement | null;
                injectedRow?.classList.add("selected");
            }
        }
    }

    private static getLanguageName(code: string): string {
        if (!code || code.toLowerCase() === 'und') return 'Unknown';
        try {
            const userLocale = navigator.language || 'en';
            const displayNames = new Intl.DisplayNames([userLocale], { type: 'language' });
            const name = displayNames.of(code);
            return name ? name.charAt(0).toUpperCase() + name.slice(1) : code.toUpperCase();
        } catch (error) {
            return code.toUpperCase();
        }
    }
}