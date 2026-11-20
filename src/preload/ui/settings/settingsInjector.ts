import { readdirSync } from "fs";
import { join } from "path";
import { settingsBuilder } from "./settingsBuilder";
import properties from "../../../core/Properties";
import Helpers from "../../../utils/Helpers";
import Updater from "../../../core/Updater";
import logger from "../../../utils/logger";
import ExtractMetaData from "../../../utils/ExtractMetaData";
import { getDefaultThemeTemplate } from "../../../components/default-theme/defaultTheme";
import { getAboutCategoryTemplate } from "../../../components/about-category/aboutCategory";
import { STORAGE_KEYS, SELECTORS, FILE_EXTENSIONS } from "../../../constants";
import { getThemeIcon, getPluginIcon, getAboutIcon } from "../../../utils/icons";
import { getTransparencyStatus } from "../titleBar";
import { setupBrowseModsButton } from "../mod/modBrowser";
import {
    setupCheckUpdatesButton,
    setupCheckUpdatesOnStartupToggle,
    setupDiscordRpcToggle,
    setupTransparencyToggle,
    setupAutokillServiceToggle,
    setupGpuDropdown,
    setupExternalPlayerDropdown,
    setupExternalPlayerPathInputs
} from "./settingsToggles";
import { type ExternalPlayer } from "../../../interfaces/ExternalPlayerTypes";
import { modController } from "../mod/modController";
import { gpuRendererAPI } from "../../api/gpuRenderer";

function writeAbout(): void {
    Helpers.waitForElm(SELECTORS.ABOUT_CATEGORY).then(async () => {
        const isTransparencyEnabled = await getTransparencyStatus();
        const currentVersion = Updater.getCurrentVersion();
        const checkForUpdatesOnStartup = localStorage.getItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP) === "true";
        const discordRpc = localStorage.getItem(STORAGE_KEYS.DISCORD_RPC) === "true";
        const autokillService = localStorage.getItem(STORAGE_KEYS.AUTOKILL_SERVICE) !== "false";
        const currentAngle = await gpuRendererAPI.getGpuRenderer();
        const currentExternalPlayer = (localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER) ?? 'disabled') as ExternalPlayer;
        const vlcCustomPath = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER_VLC_PATH) ?? '';
        const mpvCustomPath = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH) ?? '';

        const aboutCategory = document.querySelector(SELECTORS.ABOUT_CATEGORY);
        if (aboutCategory) {
            aboutCategory.innerHTML += getAboutCategoryTemplate(
                currentVersion, checkForUpdatesOnStartup, discordRpc, isTransparencyEnabled, autokillService, currentAngle, currentExternalPlayer, vlcCustomPath, mpvCustomPath
            );
        }
    }).catch(err => logger.error("Failed to write about section: " + err));
}

// The pages are built asynchronously (they wait for Stremio's settings page to render), so a second
// hashchange arriving meanwhile must not start another build.
let buildingSince = 0;

export function checkSettings() {
    if (!location.href.includes("#/settings")) return;
    settingsBuilder.updateRoute();
    if (document.getElementById("enhanced") && document.querySelector("[data-enhanced-nav]")) return;
    if (Date.now() - buildingSince < 3000) return;
    buildingSince = Date.now();

    // Stremio rebuilt its settings page (or this is the first visit): drop anything of ours that's left.
    document.getElementById("enhanced")?.closest(".enhanced-page-container")?.remove();
    document.querySelector("[data-enhanced-nav]")?.remove();

    const themesList = readdirSync(properties.themesPath).filter(f => f.endsWith(FILE_EXTENSIONS.THEME));
    const pluginsList = readdirSync(properties.pluginsPath).filter(f => f.endsWith(FILE_EXTENSIONS.PLUGIN));

    logger.info("Adding 'Enhanced' sections...");
    settingsBuilder.addSection("enhanced", "Stremio Enhanced");
    settingsBuilder.addNavGroup("Stremio Enhanced", [
        { id: "themes", label: "Themes", icon: getThemeIcon() },
        { id: "plugins", label: "Plugins", icon: getPluginIcon() },
        { id: "about", label: "About", icon: getAboutIcon() },
    ]);
    settingsBuilder.addCategory("Themes", "enhanced", getThemeIcon());
    settingsBuilder.addCategory("Plugins", "enhanced", getPluginIcon());
    settingsBuilder.addCategory("About", "enhanced", getAboutIcon());
    
    settingsBuilder.addButton("Open Themes Folder", "openthemesfolderBtn", SELECTORS.THEMES_CATEGORY);
    settingsBuilder.addButton("Open Plugins Folder", "openpluginsfolderBtn", SELECTORS.PLUGINS_CATEGORY);
    settingsBuilder.addButton("Toggle All Plugins", "toggleallpluginsBtn", SELECTORS.PLUGINS_CATEGORY);
    
    writeAbout();
    setupBrowseModsButton();
    setupCheckUpdatesButton();
    setupCheckUpdatesOnStartupToggle();
    setupDiscordRpcToggle();
    setupTransparencyToggle();
    setupAutokillServiceToggle();

    if(process.platform != "darwin") setupGpuDropdown();
    setupExternalPlayerDropdown();
    setupExternalPlayerPathInputs();

    Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
        const isCurrentThemeDefault = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === "Default";
        // Right after the category's heading, so "Default" is listed with the other themes.
        document.querySelector(SELECTORS.THEMES_CATEGORY)?.firstElementChild?.insertAdjacentHTML("afterend", getDefaultThemeTemplate(isCurrentThemeDefault));
        
        themesList.forEach(theme => {
            const metaData = ExtractMetaData.extractMetadataFromFile(join(properties.themesPath, theme));
            if (metaData && metaData.name.toLowerCase() !== "default") {
                settingsBuilder.addItem("theme", theme, { ...metaData });
            }
        });
    }).catch(err => logger.error("Failed to setup themes: " + err));
    
    pluginsList.forEach(plugin => {
        const metaData = ExtractMetaData.extractMetadataFromFile(join(properties.pluginsPath, plugin));
        if (metaData) {
            settingsBuilder.addItem("plugin", plugin, { ...metaData });
        }
    });
    
    modController.bindTogglePluginListener();
    modController.bindPluginOptionsListeners();
    modController.bindFolderButtons();
    modController.bindToggleAllPluginsButton();
}