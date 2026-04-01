import { contextBridge, ipcRenderer } from "electron";
import Updater from "../core/Updater";
import DiscordPresence from "../core/DiscordPresence";
import { discordTracker } from "./ui/discordTracker";
import EmbeddedSubtitles from "../utils/EmbeddedSubtitles";
import AudioTracks from "../utils/AudioTracks";
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
import { pluginLogger } from "./api/pluginLogger";

export const stremioEnhancedAPI = {
    ...alertAPI,
    ...settingsAPI,
    ...pluginLogger,
    ...applyThemeAPI,
    ...gpuRendererAPI,
    ...externalPlayerAPI,
};

contextBridge.exposeInMainWorld('StremioEnhancedAPI', stremioEnhancedAPI);

window.addEventListener("load", () => { 
    initializeUserSettings();
    reloadServer();
    applyUserTheme();
    loadEnabledPlugins();

    let isTransparencyEnabled = false;

    if(location.href.includes("#/settings")) 
        checkSettings();

    window.addEventListener("hashchange", () => {
        if (isTransparencyEnabled) addTitleBar();
        checkSettings();
        checkExternalPlayer();
        EmbeddedSubtitles.checkWatching();
        AudioTracks.checkWatching();
    });

    ipcRenderer.on(IPC_CHANNELS.FULLSCREEN_CHANGED, (_, isFullscreen: boolean) => {
        const titleBar = document.querySelector('.title-bar') as HTMLElement;
        if (titleBar) titleBar.style.display = isFullscreen ? 'none' : 'flex';
    });
    
    // Auto update check
    if (localStorage.getItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP) === "true") {
        Updater.checkForUpdates(false).catch(console.error);
    }

    // Discord RPC
    if (localStorage.getItem(STORAGE_KEYS.DISCORD_RPC) === "true") {
        DiscordPresence.start();
        discordTracker.init();
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