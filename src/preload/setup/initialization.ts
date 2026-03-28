import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import properties from "../../core/Properties";
import Helpers from "../../utils/Helpers";
import logger from "../../utils/logger";
import { STORAGE_KEYS, FILE_EXTENSIONS, TIMEOUTS } from "../../constants";
import { modController } from "../ui/mod/modController";

export function initializeUserSettings(): void {
    const defaults: Record<string, string> = {
        [STORAGE_KEYS.ENABLED_PLUGINS]: "[]",
        [STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP]: "true",
        [STORAGE_KEYS.DISCORD_RPC]: "false",
    };
    
    for (const [key, defaultValue] of Object.entries(defaults)) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
        }
    }
}

export function reloadServer(): void {
    setTimeout(() => {
        Helpers._eval(`core.transport.dispatch({ action: 'StreamingServer', args: { action: 'Reload' } });`);
        logger.info("Stremio streaming server reloaded.");
    }, TIMEOUTS.SERVER_RELOAD_DELAY);
}

export function applyUserTheme(): void {
    const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);
    
    if (!currentTheme || currentTheme === "Default") {
        localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
        return;
    }
    
    const themePath = join(properties.themesPath, currentTheme);
    
    if (!existsSync(themePath)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
        return;
    }
    
    document.getElementById("activeTheme")?.remove();
    const themeElement = document.createElement('link');
    themeElement.setAttribute("id", "activeTheme");
    themeElement.setAttribute("rel", "stylesheet");
    themeElement.setAttribute("href", pathToFileURL(themePath).toString());
    document.head.appendChild(themeElement);
}

export function loadEnabledPlugins(): void {
    const pluginsToLoad = readdirSync(properties.pluginsPath)
        .filter(fileName => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));
    
    const enabledPlugins: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
    );
    
    pluginsToLoad.forEach(plugin => {
        if (enabledPlugins.includes(plugin)) {
            modController.loadPlugin(plugin);
        }
    });
}