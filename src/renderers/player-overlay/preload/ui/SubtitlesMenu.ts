import { ipcRenderer } from "electron";
import { ENHANCED_API, SELECTORS } from "../../../../constants";
import { getLangEntryTemplate } from "../../components/subtitles-menu/langEntry";
import { getTrackEntryTemplate } from "../../components/subtitles-menu/trackEntry";
import { SubtitleTrack } from "../../interfaces/SubtitleTrack";
import { EmbeddedSubtitle } from "../../interfaces/EmbeddedSubtitle";

export class SubtitlesMenu {
    private static subtitleLanguageGroups: Record<string, SubtitleTrack[]> = {};
    private static activeLanguageCode: string | null = null;
    private static subtitleMenuLanguagesList = null as HTMLElement | null;
    private static subtitleMenuVariantsList = null as HTMLElement | null;
    private static loadInterval: NodeJS.Timeout | null = null;
    
    public static init() {
        const subtitlesMenuBtn = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_MENU_BUTTON) as HTMLElement | null;
        const subtitlesMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_MENU) as HTMLElement | null;
        const subOffBtn = document.querySelector(`${SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGE}[title="OFF"]`) as HTMLElement | null;
        this.subtitleMenuLanguagesList = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGES_LIST);
        this.subtitleMenuVariantsList = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_VARIENTS_LIST);

        if (subtitlesMenu) subtitlesMenu.style.pointerEvents = 'auto';

        subtitlesMenuBtn?.addEventListener("click", () => {
            if (!subtitlesMenu) return;
            const isVisible = subtitlesMenu.style.display === "";
            subtitlesMenu.style.display = isVisible ? "none" : "";
        });

        ipcRenderer.on(ENHANCED_API.MPV.ADD_SUBTITLE_ENTRY, async (_event, subId: string, source: string, langCode: string, type: "embedded" | "external") => {
            if (!subtitlesMenu) return console.log("subtitles menu not yet rendered");

            let safeLangCode = (langCode || 'und').trim().toLowerCase();

            if (safeLangCode === 'en') safeLangCode = 'eng';
            if (safeLangCode === 'ar') safeLangCode = 'ara';

            const langTitle = this.getLanguageName(safeLangCode);
            let isNewLanguage = false;

            if (!this.subtitleLanguageGroups[safeLangCode]) {
                this.subtitleLanguageGroups[safeLangCode] = [];
                isNewLanguage = true;
                
                if (this.subtitleMenuLanguagesList) {
                    const langEntryHtml = await getLangEntryTemplate(langTitle, safeLangCode);
                    this.subtitleMenuLanguagesList.insertAdjacentHTML('beforeend', langEntryHtml);
                }
            }

            this.subtitleLanguageGroups[safeLangCode].push({ subId, langTitle, source, type });

            const isCurrentActive = this.activeLanguageCode === safeLangCode;
            const isVariantsColumnEmpty = this.subtitleMenuVariantsList && this.subtitleMenuVariantsList.children.length === 0;

            if (isCurrentActive || (isNewLanguage && isVariantsColumnEmpty)) {
                if (isVariantsColumnEmpty && !this.activeLanguageCode) {
                    this.activeLanguageCode = safeLangCode;
                    
                    const langOption = this.subtitleMenuLanguagesList?.querySelector(`${SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGE}[data-lang="${safeLangCode}"]`);
                    langOption?.classList.add("selected");
                }
                
                await this.populateVariantsColumn(this.activeLanguageCode!);
            }
        });

        this.subtitleMenuLanguagesList?.addEventListener("click", async (event) => {
            const targetLang = (event.target as HTMLElement).closest(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGE) as HTMLElement | null;
            if (!targetLang) return;

            const langCode = targetLang.getAttribute("data-lang");
            if (!langCode) return;

            this.subtitleMenuLanguagesList?.querySelectorAll(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGE).forEach(el => el.classList.remove("selected"));
            targetLang.classList.add("selected");

            this.activeLanguageCode = langCode.toLowerCase();
            await this.populateVariantsColumn(this.activeLanguageCode);
        });

        subOffBtn?.addEventListener("click", () => {
            ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "sid", "no");
            this.activeLanguageCode = null;

            this.subtitleMenuLanguagesList?.querySelectorAll(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_LANGUAGE).forEach(el => el.classList.remove("selected"));
            subOffBtn.classList.add("selected");

            if (this.subtitleMenuVariantsList) {
                this.subtitleMenuVariantsList.innerHTML = `
                    <div class="variant-option-RT1Op placeholder-text-muted" style="pointer-events: none; justify-content: center; opacity: 0.5; padding: 20px 10px;">
                        <div class="title-qywea" style="font-size: 14px; color: white;">Subtitles are turned off</div>
                    </div>
                `;
            }
        });

        this.subtitleMenuVariantsList?.addEventListener("click", (event) => {
            const targetTrack = (event.target as HTMLElement).closest(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_VARIANT) as HTMLElement | null;
            if (!targetTrack || !targetTrack.title) return;
            
            this.subtitleMenuVariantsList?.querySelectorAll(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_VARIANT).forEach(el => el.classList.remove("selected"));
            this.activateSubtitle(targetTrack.title);
        });

        this.startMediaLoadCheck();            
    }

    private static startMediaLoadCheck() {
        if (this.loadInterval) clearInterval(this.loadInterval);

        console.log("Starting real-time media load tracking...");

        this.loadInterval = setInterval(() => {
            try {
                const subtitlesMenu = document.querySelector(SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_MENU);
                if (!subtitlesMenu) {
                    console.log("Player overlay context closed. Stopping load checks.");
                    this.stopMediaLoadCheck();
                    return;
                }

                const rawDuration = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "duration");
                const duration = parseFloat(rawDuration);

                if (!isNaN(duration) && duration > 0) {
                    this.displayDiagnostics();
                    console.log(`Media container metadata fully parsed! Duration: ${duration}s. Syncing tracks...`);
                    this.stopMediaLoadCheck();
                    this.loadEmbeddedSubtitles();
                }
            } catch (err) {
                console.error("Error while checking media container state:", err);
                this.stopMediaLoadCheck();
            }
        }, 500);
    }

    private static stopMediaLoadCheck() {
        if (this.loadInterval) {
            clearInterval(this.loadInterval);
            this.loadInterval = null;
        }
    }

    private static displayDiagnostics() {
        const hwdecActive = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "hwdec-current");
		const containerFps = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "container-fps");
		const estimatedFps = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "estimated-vf-fps");
		
		console.log(`--- MPV Diagnostics ---`);
		console.log(`Hardware Decoding : ${hwdecActive === "no" ? "Software Mode" : `Active (${hwdecActive})`}`);
		console.log(`Container Target  : ${containerFps ? parseFloat(containerFps).toFixed(2) : "Unknown"} FPS`);
		console.log(`Real-time Display : ${estimatedFps ? parseFloat(estimatedFps).toFixed(2) : "Unknown"} FPS`);
        console.log(`--- MPV Diagnostics ---`);
    }

    private static loadEmbeddedSubtitles() {
        try {
            const rawTracks = ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, "track-list");
            const trackList = typeof rawTracks === "string" ? JSON.parse(rawTracks) : rawTracks;
            if (!Array.isArray(trackList)) return;

            const embeddedSubs: EmbeddedSubtitle[] = trackList
                .filter((track: any) => track.type === "sub" && !track.external)
                .map((track: any) => {
                    const langName = this.getLanguageName(track.lang);
                    return {
                        id: track.id,              
                        lang: track.lang || "und",
                        label: track.title ? `${langName} (${track.title})` : langName,
                        selected: !!track.selected 
                    };
                });

            if (embeddedSubs.length === 0) {
                console.log("Media container metadata successfully parsed, but zero embedded subtitles were detected.");
                return;
            }

            // Object.keys(this.subtitleLanguageGroups).forEach(lang => {
            //     this.subtitleLanguageGroups[lang] = this.subtitleLanguageGroups[lang].filter(track => {
            //         return track.type !== "embedded" && track.source !== "Embedded";
            //     });
            // });

            embeddedSubs.forEach(sub => {
                ipcRenderer.emit(
                    ENHANCED_API.MPV.ADD_SUBTITLE_ENTRY, 
                    null, 
                    sub.id.toString(), 
                    "Embedded", 
                    sub.lang, 
                    "embedded"
                );
            });

            if (this.activeLanguageCode && this.subtitleLanguageGroups[this.activeLanguageCode]) {
                this.populateVariantsColumn(this.activeLanguageCode);
            }
        } catch (err) {
            console.error("Failed to parse embedded subtitles:", err);
        }
    }

    private static async populateVariantsColumn(langCode: string) {
        if (!this.subtitleMenuVariantsList) return;
        this.subtitleMenuVariantsList.innerHTML = "";
        
        const tracks = this.subtitleLanguageGroups[langCode] || [];
        const sortedTracks = [...tracks].sort((a, b) => {
            if (a.type === "embedded" && b.type !== "embedded") return -1;
            if (a.type !== "embedded" && b.type === "embedded") return 1;  
            return 0; 
        });

        for (const track of sortedTracks) {
            const trackEntryHtml = await getTrackEntryTemplate(track.subId, track.langTitle, track.source, track.type);
            this.subtitleMenuVariantsList.insertAdjacentHTML('beforeend', trackEntryHtml);
        }
    }

    private static activateSubtitle(sub_id: string) {
        let track = document.querySelector(`${SELECTORS.MPV_PLAYER_OVERLAY.SUBTITLES_VARIANT}[title="${sub_id}"]`) as HTMLElement | null;
        if (!track) return;

        track.classList.add("selected");
        if (track.attributes.getNamedItem("type")?.value === "external") {
            ipcRenderer.send(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, sub_id);
        } else {
            ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, "sid", sub_id);
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