import { contextBridge, ipcRenderer, webFrame } from "electron";
import Updater from "../core/Updater";
import DiscordPresence from "../core/DiscordPresence";
import { discordTracker } from "./ui/discordTracker";
import EmbeddedSubtitles from "./ui/EmbeddedSubtitles";
import AudioTracks from "./ui/AudioTracks";
import { STORAGE_KEYS, IPC_CHANNELS } from "../constants";

// plugin API bridges
import { alertAPI } from './api/alert';
import { settingsAPI } from './api/settings';

// controllers
import { initializeUserSettings, reloadServer, applyUserTheme, loadEnabledPlugins } from "./setup/initialization";
import { addTitleBar, getTransparencyStatus } from "./ui/titleBar";
import { checkSettings } from "./ui/settings/settingsInjector";
import { checkExternalPlayer } from "./ui/externalPlayerInterceptor";
import { applyThemeAPI } from "./api/applyTheme";
import { gpuRendererAPI } from "./api/gpuRenderer";
import { externalPlayerAPI } from "./api/externalPlayer";
import { mpvPlayerAPI } from "./api/mpvPlayer";
import { pluginLogger } from "./api/pluginLogger";
import Helpers from "../utils/Helpers";
import MpvPlayerInjector from "./ui/MpvPlayerInjector";

export const stremioEnhancedAPI = {
    ...alertAPI,
    ...settingsAPI,
    ...pluginLogger,
    ...applyThemeAPI,
    ...gpuRendererAPI,
    ...externalPlayerAPI,
    ...mpvPlayerAPI
};


// Patch the history methods to trigger a hashchange event when they are called
webFrame.executeJavaScript(`
    ['pushState', 'replaceState'].forEach(method => {
        const original = history[method];
        history[method] = function (...args) {
            const result = original.apply(this, args);
            window.dispatchEvent(new Event('hashchange')); 
            return result;
        };
    });
`);

// For some reason with the new Stremio Web version they made it so window.core functions aren't available when the user watches a stream. This caches the functions permanently so we can still use them in our injected code.
const PermanentCore = {
    getState: null as Function | null,
    dispatch: null as Function | null,
};

let originalServices: any = undefined;
Object.defineProperty(window, 'services', {
    get() {
        return originalServices;
    },
    set(val) {
        originalServices = val;
        if (val && val.core) {
            if (val.core.getState && !PermanentCore.getState) {
                PermanentCore.getState = val.core.getState.bind(val.core);
            }
            if (val.core.dispatch && !PermanentCore.dispatch) {
                PermanentCore.dispatch = val.core.dispatch.bind(val.core);
            }
        }
    },
    configurable: true
});

contextBridge.exposeInMainWorld('StremioEnhancedAPI', stremioEnhancedAPI);

function parseRuntime(runtime: string | undefined): number | undefined {
    if (!runtime) return undefined;
    const match = runtime.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : undefined;
}

window.addEventListener("load", () => {
    Helpers.patchReactDom();
    initializeUserSettings();
    reloadServer();
    applyUserTheme();
    loadEnabledPlugins();

    let isTransparencyEnabled = false;

    if (location.href.includes("#/settings"))
        checkSettings();

    window.addEventListener("hashchange", () => {
        if (isTransparencyEnabled) addTitleBar();
        checkSettings();
        checkExternalPlayer();
        MpvPlayerInjector.checkWatching();
        EmbeddedSubtitles.checkWatching();
        AudioTracks.checkWatching();
    });

    // Auto update check
    if (localStorage.getItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP) === "true") {
        Updater.checkForUpdates(false).catch(console.error);
    }

    // Discord RPC
    if (localStorage.getItem(STORAGE_KEYS.DISCORD_RPC) === "true") {
        DiscordPresence.start();
        discordTracker.init();

        ipcRenderer.on(IPC_CHANNELS.EXTERNAL_PLAYER_POSITION, (_, { position, state }: { position: number, state: string}) => {
            if (localStorage.getItem(STORAGE_KEYS.DISCORD_RPC) !== "true") return;
            if (!discordTracker.lastPlayerState) return;
            
            const { metaDetails, seriesInfoDetails } = discordTracker.lastPlayerState;
            
            const now = Math.floor(Date.now() / 1000);
            const startTimestamp = now - Math.floor(position);
            const duration = parseRuntime(metaDetails.runtime);
            const endTimestamp = duration ? startTimestamp + duration : undefined;

            if (metaDetails.type === "series" && seriesInfoDetails) {
                const isKitsu = metaDetails.id.startsWith("kitsu:");
                const stateStr = `Watching ${!isKitsu ? `S${seriesInfoDetails.season} E${seriesInfoDetails.episode}` : `E${seriesInfoDetails.episode}`}`;
                
                if (state === "playing") {
                    DiscordPresence.setPlaying(metaDetails.name, stateStr, startTimestamp, endTimestamp, metaDetails.poster);
                } else if (state == "paused") {
                    DiscordPresence.setPaused(metaDetails.name, stateStr, metaDetails.poster);
                }

            } else if (metaDetails.type === "movie") {
                
                if (state === "playing") {
                    DiscordPresence.setPlaying(metaDetails.name, 'Watching', startTimestamp, endTimestamp, metaDetails.poster);
                } else if (state === "paused") {
                    DiscordPresence.setPaused(metaDetails.name, "Watching", metaDetails.poster);
                }
            }
        });

        ipcRenderer.on(IPC_CHANNELS.EXTERNAL_PLAYER_CLOSED, () => {
            discordTracker._externalPlayerActive = false;
            discordTracker.lastPlayerState = null;
            discordTracker.handleNavigation();
            DiscordPresence.setMainMenu("Home");
        });
    }

    // UI Hooks (Transparency)
    getTransparencyStatus().then((status) => {
        isTransparencyEnabled = status;
        if (isTransparencyEnabled) {
            const observer = new MutationObserver(() => addTitleBar());
            observer.observe(document.body, { childList: true, subtree: true });
            addTitleBar();
        }
    }).catch(console.error);
});
