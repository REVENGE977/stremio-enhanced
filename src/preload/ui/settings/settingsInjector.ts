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
        const currentAngle = await gpuRendererAPI.getGpuRenderer();
        const currentExternalPlayer = (localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER) ?? 'disabled') as ExternalPlayer;
        const vlcCustomPath = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER_VLC_PATH) ?? '';
        const mpvCustomPath = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH) ?? '';

        const aboutCategory = document.querySelector(SELECTORS.ABOUT_CATEGORY);
        if (aboutCategory) {
            aboutCategory.innerHTML += getAboutCategoryTemplate(
                currentVersion, checkForUpdatesOnStartup, discordRpc, isTransparencyEnabled, currentAngle, currentExternalPlayer, vlcCustomPath, mpvCustomPath
            );
        }
    }).catch(err => logger.error("Failed to write about section: " + err));
}

export function checkSettings() {
    if (!location.href.includes("#/settings")) return;
    if (document.querySelector(`a[href="#settings-enhanced"]`)) return;
        
    const themesList = readdirSync(properties.themesPath).filter(f => f.endsWith(FILE_EXTENSIONS.THEME));
    const pluginsList = readdirSync(properties.pluginsPath).filter(f => f.endsWith(FILE_EXTENSIONS.PLUGIN));
    
    logger.info("Adding 'Enhanced' sections...");
    settingsBuilder.addSection("enhanced", "Enhanced");
    settingsBuilder.addCategory("Themes", "enhanced", getThemeIcon());
    settingsBuilder.addCategory("Plugins", "enhanced", getPluginIcon());
    settingsBuilder.addCategory("About", "enhanced", getAboutIcon());
    
    settingsBuilder.addButton("Open Themes Folder", "openthemesfolderBtn", SELECTORS.THEMES_CATEGORY);
    settingsBuilder.addButton("Open Plugins Folder", "openpluginsfolderBtn", SELECTORS.PLUGINS_CATEGORY);
    
    writeAbout();
    setupBrowseModsButton();
    setupCheckUpdatesButton();
    setupCheckUpdatesOnStartupToggle();
    setupDiscordRpcToggle();
    setupTransparencyToggle();

    if(process.platform != "darwin") setupGpuDropdown();
    setupExternalPlayerDropdown();
    setupExternalPlayerPathInputs();

    Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
        const isCurrentThemeDefault = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === "Default";
        const defaultThemeContainer = document.createElement("div");
        defaultThemeContainer.innerHTML = getDefaultThemeTemplate(isCurrentThemeDefault);
        document.querySelector(SELECTORS.THEMES_CATEGORY)?.appendChild(defaultThemeContainer);
        
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
    modController.scrollListener();
    modController.bindPluginOptionsListeners();
    modController.bindFolderButtons();
}