import Helpers from "./Helpers";
import { getLogger } from "./logger";

const logger = getLogger("AudioTracks");

class AudioTracks {
    private static detectedAlready = false;
    private static menuElement: HTMLElement | null = null;
    private static closeHandler: ((e: MouseEvent) => void) | null = null;
    private static switching = false;

    /**
     * Patches React DOM methods in the PAGE context (not preload) to prevent
     * crashes when the browser modifies DOM nodes during audio track switches.
     * With contextIsolation: true, the preload and page have separate prototypes,
     * so the patch must run as a page-level script to affect React's context.
     * Does NOT use _eval (which depends on window.services.core being ready).
     */
    private static patchReactDom() {
        if (document.getElementById('enhanced-react-dom-patch')) return;

        const script = document.createElement('script');
        script.id = 'enhanced-react-dom-patch';
        script.textContent = `
            if (!window._patchedReactDomPage) {
                var origRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                    try {
                        if (child && child.parentNode !== this) return child;
                        return origRemoveChild.call(this, child);
                    } catch (e) { return child; }
                };
                var origInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, refNode) {
                    try {
                        if (refNode && refNode.parentNode !== this) return newNode;
                        return origInsertBefore.call(this, newNode, refNode);
                    } catch (e) { return newNode; }
                };
                window._patchedReactDomPage = true;
            }
        `;
        document.head.appendChild(script);
    }

    public static async checkWatching() {
        if (!location.href.includes('#/player')) {
            this.detectedAlready = false;
            this.closeMenu();
            return;
        }

        this.patchReactDom();

        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;

        video.addEventListener("loadedmetadata", () => {
            if (this.detectedAlready) return;
            this.detectedAlready = true;

            const audioTracks = (video as any).audioTracks;
            if (!audioTracks || audioTracks.length <= 1) {
                logger.info(`No multiple audio tracks (${audioTracks?.length ?? 0}).`);
                return;
            }

            logger.info(`Found ${audioTracks.length} native audio tracks.`);
            this.enableAudioButton(audioTracks);
        });
    }

    private static enableAudioButton(audioTracks: any) {
        const knownAudioSvgPrefixes = ['M57.48', 'M57,', 'M56', 'M58'];
        const disabledButtons = document.querySelectorAll('[class*="control-bar-button"][class*="disabled"]');
        let audioButton: Element | null = null;

        for (const btn of disabledButtons) {
            const paths = btn.querySelectorAll('path');
            for (const path of paths) {
                const d = path.getAttribute('d') || '';
                if (knownAudioSvgPrefixes.some(prefix => d.startsWith(prefix))) {
                    audioButton = btn;
                    break;
                }
            }
            if (audioButton) break;
        }

        if (!audioButton) {
            for (let i = disabledButtons.length - 1; i >= 0; i--) {
                const paths = disabledButtons[i].querySelectorAll('path');
                if (paths.length === 1) {
                    audioButton = disabledButtons[i];
                    break;
                }
            }
        }

        if (!audioButton) {
            logger.info("Could not find audio track button.");
            return;
        }

        audioButton.className = audioButton.className.replace(/\bdisabled\b/g, '').trim();
        logger.info("Audio track button enabled.");

        audioButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.toggleMenu(audioTracks);
        });
    }

    private static injectStyles() {
        if (document.getElementById('enhanced-audio-menu-styles')) return;

        const style = document.createElement('style');
        style.id = 'enhanced-audio-menu-styles';
        style.textContent = `
            .enhanced-audio-menu-layer {
                position: absolute;
                top: initial;
                left: initial;
                right: 4rem;
                bottom: 8rem;
                max-height: calc(100% - 13.5rem);
                max-width: calc(100% - 4rem);
                border-radius: var(--border-radius);
                background-color: var(--modal-background-color);
                box-shadow: 0 1.35rem 2.7rem rgba(0,0,0,0.4),
                    0 1.1rem 0.85rem rgba(0,0,0,0.2);
                backdrop-filter: blur(15px);
                overflow: auto;
                z-index: 1;
            }
            .enhanced-audio-menu {
                display: flex;
                flex-direction: row;
            }
            .enhanced-audio-menu .eam-container {
                flex: none;
                align-self: stretch;
                display: flex;
                flex-direction: column;
                max-height: 25rem;
                width: 16rem;
            }
            .enhanced-audio-menu .eam-header {
                flex: none;
                align-self: stretch;
                padding: 1.5rem 2rem;
                font-weight: 700;
                color: var(--primary-foreground-color);
            }
            .enhanced-audio-menu .eam-list {
                flex: 1;
                align-self: stretch;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                overflow-y: auto;
                padding: 0 1rem;
                padding-bottom: 1rem;
            }
            .enhanced-audio-menu .eam-option {
                flex: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;
                height: 4rem;
                padding: 0 1.5rem;
                border-radius: var(--border-radius);
                cursor: pointer;
                border: none;
                background: none;
                text-align: left;
                width: 100%;
                box-sizing: border-box;
            }
            .enhanced-audio-menu .eam-option:hover,
            .enhanced-audio-menu .eam-option.selected {
                background-color: var(--overlay-color);
            }
            .enhanced-audio-menu .eam-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .enhanced-audio-menu .eam-lang {
                flex: auto;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 1.1rem;
                line-height: 1.5rem;
                color: var(--primary-foreground-color);
            }
            .enhanced-audio-menu .eam-label {
                flex: auto;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 0.9rem;
                color: var(--color-placeholder-text, rgba(255,255,255,0.5));
            }
            .enhanced-audio-menu .eam-icon {
                flex: none;
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 100%;
                background-color: var(--secondary-accent-color);
            }
        `;
        document.head.appendChild(style);
    }

    private static toggleMenu(audioTracks: any) {
        if (this.menuElement) {
            this.closeMenu();
            return;
        }

        this.injectStyles();

        // Find the player container to attach the menu to (same as Stremio's menu-layer)
        const playerContainer = document.querySelector('[class*="player-container"]');
        if (!playerContainer) {
            logger.info("Could not find player container.");
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'enhanced-audio-menu-layer';
        menu.addEventListener('mousedown', (e) => {
            // Prevent menu from closing when clicking inside
            e.stopPropagation();
        });

        let selectedId: string | null = null;
        for (let i = 0; i < audioTracks.length; i++) {
            if (audioTracks[i].enabled) {
                selectedId = audioTracks[i].id;
                break;
            }
        }

        let menuHTML = `<div class="enhanced-audio-menu"><div class="eam-container">`;
        menuHTML += `<div class="eam-header">Audio tracks</div>`;
        menuHTML += `<div class="eam-list">`;

        for (let i = 0; i < audioTracks.length; i++) {
            const track = audioTracks[i];
            const langName = this.getLanguageName(track.language);
            const isSelected = track.id === selectedId;

            menuHTML += `<div class="eam-option${isSelected ? ' selected' : ''}" data-index="${i}" title="${track.label || langName}">`;
            menuHTML += `<div class="eam-info">`;
            menuHTML += `<div class="eam-lang">${langName}</div>`;
            menuHTML += `<div class="eam-label">${track.label || track.language || ''}</div>`;
            menuHTML += `</div>`;
            if (isSelected) {
                menuHTML += `<div class="eam-icon"></div>`;
            }
            menuHTML += `</div>`;
        }

        menuHTML += `</div></div></div>`;
        menu.innerHTML = menuHTML;

        // Add click handlers to each option
        menu.querySelectorAll('.eam-option').forEach((option) => {
            option.addEventListener('click', () => {
                if (this.switching) return;

                const index = parseInt(option.getAttribute('data-index') || '0');
                if (audioTracks[index].enabled) {
                    this.closeMenu();
                    return;
                }

                this.switching = true;
                for (let j = 0; j < audioTracks.length; j++) {
                    audioTracks[j].enabled = (j === index);
                }
                const langName = this.getLanguageName(audioTracks[index].language);
                logger.info(`Switched to audio track ${index}: ${audioTracks[index].language}`);
                this.closeMenu();
                Helpers.createToast("audioTrackSwitched", "Audio track changed",
                    `Now playing: ${langName}`, "success");

                // Cooldown to let the browser settle before allowing another switch
                setTimeout(() => { this.switching = false; }, 1000);
            });
        });

        playerContainer.appendChild(menu);
        this.menuElement = menu;

        // Close menu when clicking outside
        this.closeHandler = (e: MouseEvent) => {
            if (!this.menuElement?.contains(e.target as Node)) {
                this.closeMenu();
            }
        };
        setTimeout(() => document.addEventListener('mousedown', this.closeHandler!), 0);
    }

    private static closeMenu() {
        if (this.menuElement) {
            this.menuElement.remove();
            this.menuElement = null;
        }
        if (this.closeHandler) {
            document.removeEventListener('mousedown', this.closeHandler);
            this.closeHandler = null;
        }
    }

    private static getLanguageName(code: string): string {
        const names: Record<string, string> = {
            eng: 'English', jpn: 'Japanese', spa: 'Spanish', fre: 'French', fra: 'French',
            ger: 'German', deu: 'German', ita: 'Italian', por: 'Portuguese', rus: 'Russian',
            kor: 'Korean', chi: 'Chinese', zho: 'Chinese', ara: 'Arabic', hin: 'Hindi',
            tha: 'Thai', vie: 'Vietnamese', pol: 'Polish', dut: 'Dutch', nld: 'Dutch',
            swe: 'Swedish', nor: 'Norwegian', dan: 'Danish', fin: 'Finnish', tur: 'Turkish',
            hun: 'Hungarian', cze: 'Czech', ces: 'Czech', rum: 'Romanian', ron: 'Romanian',
            und: 'Unknown'
        };
        return names[code] || code.toUpperCase();
    }
}

export default AudioTracks;
