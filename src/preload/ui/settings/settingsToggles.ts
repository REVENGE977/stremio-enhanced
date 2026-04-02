import { ipcRenderer } from "electron";
import Helpers from "../../../utils/Helpers";
import logger from "../../../utils/logger";
import DiscordPresence from "../../../core/DiscordPresence";
import { discordTracker } from "../discordTracker";
import { STORAGE_KEYS, IPC_CHANNELS, CLASSES, PLAYER_PATH_STORAGE_KEY } from "../../../constants";
import { gpuRendererAPI } from "../../api/gpuRenderer";
import { externalPlayerAPI } from "../../api/externalPlayer";
import { alertAPI } from "../../api/alert";
import {
    EMBEDDED_MPV_PLAYBACK_MODE,
    isEmbeddedMpvPlaybackMode,
    type PlaybackMode,
} from "../../../interfaces/ExternalPlayerTypes";

function getPlayerPathStorageKey(mode: PlaybackMode): string | null {
    if (mode === EMBEDDED_MPV_PLAYBACK_MODE) {
        return STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH;
    }

    return PLAYER_PATH_STORAGE_KEY[mode] ?? null;
}

export function setupCheckUpdatesButton(): void {
    Helpers.waitForElm('#checkforupdatesBtn').then(() => {
        const btn = document.getElementById("checkforupdatesBtn");
        btn?.addEventListener("click", async () => {
            if (btn) btn.style.pointerEvents = "none";
            ipcRenderer.send(IPC_CHANNELS.UPDATE_CHECK_USER);
            if (btn) btn.style.pointerEvents = "all";
        });
    }).catch(() => {});
}

export function setupCheckUpdatesOnStartupToggle(): void {
    Helpers.waitForElm('#checkForUpdatesOnStartup').then(() => {
        const toggle = document.getElementById("checkForUpdatesOnStartup");
        toggle?.addEventListener("click", () => {
            toggle.classList.toggle(CLASSES.CHECKED);
            const isChecked = toggle.classList.contains(CLASSES.CHECKED);
            logger.info(`Check for updates on startup toggled ${isChecked ? "ON" : "OFF"}`);
            localStorage.setItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP, isChecked ? "true" : "false");
        });
    }).catch(() => {});
}

export function setupDiscordRpcToggle(): void {
    Helpers.waitForElm('#discordrichpresence').then(() => {
        const toggle = document.getElementById("discordrichpresence");
        toggle?.addEventListener("click", async () => {
            toggle.classList.toggle(CLASSES.CHECKED);
            const isChecked = toggle.classList.contains(CLASSES.CHECKED);
            logger.info(`Discord Rich Presence toggled ${isChecked ? "ON" : "OFF"}`);
            
            if (isChecked) {
                localStorage.setItem(STORAGE_KEYS.DISCORD_RPC, "true");
                DiscordPresence.start();
                discordTracker.init();
            } else {
                localStorage.setItem(STORAGE_KEYS.DISCORD_RPC, "false");
                DiscordPresence.stop();
            }
        });
    }).catch(() => {});
}

export function setupTransparencyToggle(): void {
    Helpers.waitForElm('#enableTransparentThemes').then(() => {
        const toggle = document.getElementById("enableTransparentThemes");
        toggle?.addEventListener("click", () => {
            toggle.classList.toggle(CLASSES.CHECKED);
            const isChecked = toggle.classList.contains(CLASSES.CHECKED);
            logger.info(`Enable transparency toggled ${isChecked ? "ON" : "OFF"}`);
            ipcRenderer.send(IPC_CHANNELS.SET_TRANSPARENCY, isChecked);
        });
    }).catch(() => {});
}

export function setupGpuDropdown() {
    Helpers.waitForElm('#gpu-renderer-dropdown').then(() => {
        const gpuDropdown = document.getElementById('gpu-renderer-dropdown') as HTMLSelectElement;
        if (!gpuDropdown) return;

        gpuDropdown.addEventListener('change', async (e) => {
            const selectedValue = (e.target as HTMLSelectElement).value;
            
            await gpuRendererAPI.setGpuRenderer(selectedValue);
            await alertAPI.showAlert(
                "info",
                "Restart Required",
                "Your hardware acceleration settings have been saved. Please restart Stremio Enhanced to apply the changes.",
                ["OK"]
            );
        });
    }).catch(() => {});
}

export function setupExternalPlayerDropdown() {
    Helpers.waitForElm('#external-player-dropdown').then(() => {
        const dropdown = document.getElementById('external-player-dropdown') as HTMLSelectElement;
        if (!dropdown) return;

        dropdown.addEventListener('change', async (e) => {
            const previousValue = (localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE) ?? 'disabled') as PlaybackMode;
            const selectedValue = (e.target as HTMLSelectElement).value as PlaybackMode;
            localStorage.setItem(STORAGE_KEYS.PLAYBACK_MODE, selectedValue);
            externalPlayerAPI.setEmbeddedMpvPreference(isEmbeddedMpvPlaybackMode(selectedValue));
            logger.info(`Playback mode set to: ${selectedValue}`);

            const vlcPathOption = document.getElementById('vlc-path-option');
            const mpvPathOption = document.getElementById('mpv-path-option');
            if (vlcPathOption) vlcPathOption.style.display = selectedValue === 'vlc' ? '' : 'none';
            if (mpvPathOption) mpvPathOption.style.display = selectedValue === 'mpv' || selectedValue === EMBEDDED_MPV_PLAYBACK_MODE ? '' : 'none';

            const modeSwitchedAcrossEmbedding = isEmbeddedMpvPlaybackMode(previousValue) !== isEmbeddedMpvPlaybackMode(selectedValue);

            if (selectedValue !== 'disabled') {
                const pathStorageKey = getPlayerPathStorageKey(selectedValue);
                const customPath = pathStorageKey ? localStorage.getItem(pathStorageKey) : null;

                if (!customPath) {
                    const paths = await externalPlayerAPI.getExternalPlayerPaths();
                    const playerPath = selectedValue === 'vlc' ? paths.vlc : paths.mpv;
                    if (!playerPath) {
                        await alertAPI.showAlert(
                            "warning",
                            "Player Not Found",
                            `${selectedValue === 'vlc' ? 'VLC' : 'MPV'} was not found on your system. You can set a custom path to the player executable below.`,
                            ["OK"]
                        );
                    }
                }
            }

            if (isEmbeddedMpvPlaybackMode(selectedValue)) {
                const environment = await externalPlayerAPI.getEmbeddedMpvEnvironment();
                if (!environment.transparentWindow || modeSwitchedAcrossEmbedding) {
                    await alertAPI.showAlert(
                        "info",
                        "Restart Required",
                        "Embedded MPV uses a transparent frameless window behind the web UI. Restart Stremio Enhanced to fully apply the playback mode change.",
                        ["OK"]
                    );
                }
            } else if (modeSwitchedAcrossEmbedding) {
                await alertAPI.showAlert(
                    "info",
                    "Restart Recommended",
                    "Restart Stremio Enhanced to return to the standard window chrome after disabling embedded MPV playback.",
                    ["OK"]
                );
            }
        });
    }).catch(() => {});
}

export function setupExternalPlayerPathInputs() {
    setupPathInput('external-player-vlc-path', STORAGE_KEYS.EXTERNAL_PLAYER_VLC_PATH, 'VLC');
    setupPathInput('external-player-mpv-path', STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH, 'MPV');
}

function setupPathInput(elementId: string, storageKey: string, playerName: string) {
    Helpers.waitForElm(`#${elementId}`).then((el) => {
        const input = el as HTMLInputElement;

        input.addEventListener('change', () => {
            const value = input.value.trim();
            if (value) {
                localStorage.setItem(storageKey, value);
                logger.info(`Custom ${playerName} path set to: ${value}`);
            } else {
                localStorage.removeItem(storageKey);
                logger.info(`Custom ${playerName} path cleared, using auto-detect`);
            }
        });
    }).catch(() => {});
}