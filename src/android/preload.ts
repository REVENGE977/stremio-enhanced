import { PlatformManager } from "../platform/PlatformManager";
import { CapacitorPlatform } from "../platform/CapacitorPlatform";
import Settings from "../core/Settings";
import properties from "../core/Properties";
import ModManager from "../core/ModManager";
import Helpers from "../utils/Helpers";
import { getModsTabTemplate } from "../components/mods-tab/modsTab";
import { getModItemTemplate } from "../components/mods-item/modsItem";
import { getAboutCategoryTemplate } from "../components/about-category/aboutCategory";
import { getDefaultThemeTemplate } from "../components/default-theme/defaultTheme";
import { getBackButton } from "../components/back-btn/backBtn";
import logger from "../utils/logger";
import { join } from "path";
import {
    STORAGE_KEYS,
    SELECTORS,
    CLASSES,
    FILE_EXTENSIONS,
} from "../constants";
import ExtractMetaData from "../utils/ExtractMetaData";
import { NodeJS } from 'capacitor-nodejs';
import LogManager from "../core/LogManager";

// Initialize platform for Capacitor
PlatformManager.setPlatform(new CapacitorPlatform());

// Hook console for logs menu
LogManager.hookConsole();
LogManager.addLog('INFO', 'Stremio Enhanced: Preload script initialized');

// Listen for server logs and errors
NodeJS.addListener('log', (data) => {
    LogManager.addLog('INFO', `[Server] ${data.args.join(' ')}`);
    console.log('[Server]', ...data.args);
});

NodeJS.addListener('error', (data) => {
    LogManager.addLog('ERROR', `[Server Error] ${data.args.join(' ')}`);
    console.error('[Server Error]', ...data.args);
    Helpers.showAlert('error', 'Server Error', data.args.join(' '), ['OK']);
});

// Mock ipcRenderer for Android
const ipcRenderer = {
    invoke: async (channel: string, ...args: any[]) => {
        logger.info(`[Android] Invoke ${channel}`, args);
        if (channel === 'get-transparency-status') return false;
        if (channel === 'extract-embedded-subtitles') return [];
        return null;
    },
    send: (channel: string, ...args: any[]) => {
        logger.info(`[Android] Send ${channel}`, args);
    },
    on: (channel: string, listener: any) => {
        // No-op
    }
};

const init = async () => {
    LogManager.addLog('INFO', 'Stremio Enhanced: Initialization started');
    // Initialize platform
    if (!PlatformManager.current) PlatformManager.setPlatform(new CapacitorPlatform());
    await PlatformManager.current.init();

    // Inject CSS to hide fullscreen button
    const style = document.createElement('style');
    style.textContent = `
        [title="Fullscreen" i],
        [title="Exit Fullscreen" i],
        [aria-label="Fullscreen" i],
        .fullscreen-toggle,
        div[class*="fullscreen" i],
        button[class*="fullscreen" i],
        [title="Shortcuts" i] {
            display: none !important;
        }
    `;
    if (document.head) {
        document.head.appendChild(style);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                document.head.appendChild(style);
                obs.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // Expose API for injected scripts
    (window as any).stremioEnhanced = {
        applyTheme: async (theme: string) => {
            // applyUserTheme reads from localStorage which is updated by the injected script
            await applyUserTheme();
        }
    };

    initializeUserSettings();

    // Apply enabled theme
    await applyUserTheme();

    // Load enabled plugins
    await loadEnabledPlugins();

    // Handle navigation changes
    window.addEventListener("hashchange", async () => {
        await checkSettings();
    });

    // Initial check
    await checkSettings();

    // Inject success toast
    Helpers.createToast('enhanced-loaded', 'Stremio Enhanced', 'Stremio Enhanced Loaded', 'success');
};

if (document.readyState === 'loading') {
    window.addEventListener("load", init);
} else {
    init();
}

// Settings page opened
async function checkSettings() {
    if (!location.href.includes("#/settings")) return;
    if (document.querySelector(`[data-section="enhanced"]`)) return;

    ModManager.addApplyThemeFunction();

    const themesPath = properties.themesPath;
    const pluginsPath = properties.pluginsPath;

    let allThemes: string[] = [];
    let allPlugins: string[] = [];

    try {
        allThemes = await PlatformManager.current.readdir(themesPath);
        allPlugins = await PlatformManager.current.readdir(pluginsPath);
    } catch(e) {
        logger.error("Failed to read themes/plugins directories: " + e);
    }

    const themesList = allThemes.filter(fileName => fileName.endsWith(FILE_EXTENSIONS.THEME));
    const pluginsList = allPlugins.filter(fileName => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));

    logger.info("Adding 'Enhanced' sections...");
    Settings.addSection("enhanced", "Enhanced");
    Settings.addCategory("Themes", "enhanced", getThemeIcon());
    Settings.addCategory("Plugins", "enhanced", getPluginIcon());
    Settings.addCategory("About", "enhanced", getAboutIcon());

    createModInstaller("theme", "installThemeBtn", SELECTORS.THEMES_CATEGORY);
    createModInstaller("plugin", "installPluginBtn", SELECTORS.PLUGINS_CATEGORY);

    writeAbout();

    // Browse plugins/themes from stremio-enhanced-registry
    setupBrowseModsButton();

    // Add themes to settings
    Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(async () => {
        // Default theme
        const isCurrentThemeDefault = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === "Default";
        const defaultThemeContainer = document.createElement("div");
        defaultThemeContainer.innerHTML = getDefaultThemeTemplate(isCurrentThemeDefault);
        document.querySelector(SELECTORS.THEMES_CATEGORY)?.appendChild(defaultThemeContainer);

        // Add installed themes
        for (const theme of themesList) {
            try {
                const themePath = join(themesPath, theme);
                const content = await PlatformManager.current.readFile(themePath);
                const metaData = ExtractMetaData.extractMetadataFromText(content);

                if (metaData) {
                    if (metaData.name.toLowerCase() !== "default") {
                        Settings.addItem("theme", theme, {
                            name: metaData.name,
                            description: metaData.description,
                            author: metaData.author,
                            version: metaData.version,
                            updateUrl: metaData.updateUrl,
                            source: metaData.source
                        });
                    }
                }
            } catch (e) {
                logger.error(`Failed to load theme metadata for ${theme}: ${e}`);
            }
        }
    }).catch(err => logger.error("Failed to setup themes: " + err));

    // Add plugins to settings
    for (const plugin of pluginsList) {
        try {
            const pluginPath = join(pluginsPath, plugin);
            const content = await PlatformManager.current.readFile(pluginPath);
            const metaData = ExtractMetaData.extractMetadataFromText(content);

            if (metaData) {
                Settings.addItem("plugin", plugin, {
                    name: metaData.name,
                    description: metaData.description,
                    author: metaData.author,
                    version: metaData.version,
                    updateUrl: metaData.updateUrl,
                    source: metaData.source
                });
            }
        } catch (e) {
            logger.error(`Failed to load plugin metadata for ${plugin}: ${e}`);
        }
    }

    ModManager.togglePluginListener();
    ModManager.scrollListener();
    // ModManager.openThemesFolder(); // Uses platform openPath which logs not supported on Android
    // ModManager.openPluginsFolder();

    // Override open folder buttons to do something else or just log?
    // ModManager.openThemesFolder uses PlatformManager.current.openPath
    // In CapacitorPlatform, it just logs.
}

function initializeUserSettings(): void {
    const defaults: Record<string, string> = {
        [STORAGE_KEYS.ENABLED_PLUGINS]: "[]",
        [STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP]: "false",
        [STORAGE_KEYS.DISCORD_RPC]: "false",
    };

    for (const [key, defaultValue] of Object.entries(defaults)) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
        }
    }
}

async function applyUserTheme(): Promise<void> {
    const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);

    if (!currentTheme || currentTheme === "Default") {
        localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
        return;
    }

    const themePath = join(properties.themesPath, currentTheme);

    // In capacitor, we need to read the file content and inject it as style
    // because file:// URLs might not work or are restricted.
    // Electron implementation uses pathToFileURL which results in file://.
    // Let's try to read content and inject <style> instead of <link>.

    try {
        if (!await PlatformManager.current.exists(themePath)) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
            return;
        }

        // Remove existing theme if present
        document.getElementById("activeTheme")?.remove();

        const content = await PlatformManager.current.readFile(themePath);

        const styleElement = document.createElement('style');
        styleElement.setAttribute("id", "activeTheme");
        styleElement.textContent = content;
        document.head.appendChild(styleElement);
    } catch (e) {
        logger.error("Failed to apply theme: " + e);
    }
}

async function loadEnabledPlugins(): Promise<void> {
    const pluginsPath = properties.pluginsPath;
    try {
        if (!await PlatformManager.current.exists(pluginsPath)) return;

        const allPlugins = await PlatformManager.current.readdir(pluginsPath);
        const pluginsToLoad = allPlugins.filter(fileName => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));

        const enabledPlugins: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
        );

        for (const plugin of pluginsToLoad) {
            if (enabledPlugins.includes(plugin)) {
                await ModManager.loadPlugin(plugin);
            }
        }
    } catch (e) {
        logger.error("Failed to load plugins: " + e);
    }
}

async function browseMods(): Promise<void> {
    const settingsContent = document.querySelector(SELECTORS.SETTINGS_CONTENT);
    if (!settingsContent) return;

    settingsContent.innerHTML = getModsTabTemplate();

    const mods = await ModManager.fetchMods();
    const modsList = document.getElementById("mods-list");
    if (!modsList) return;

    interface RegistryMod {
        name: string;
        description: string;
        author: string;
        version: string;
        preview?: string;
        download: string;
        repo: string;
    }

    // Add plugins
    for (const plugin of (mods.plugins as RegistryMod[])) {
        const installed = await ModManager.isPluginInstalled(Helpers.getFileNameFromUrl(plugin.download));
        modsList.innerHTML += getModItemTemplate(plugin, "Plugin", installed);
    }

    // Add themes
    for (const theme of (mods.themes as RegistryMod[])) {
        const installed = await ModManager.isThemeInstalled(Helpers.getFileNameFromUrl(theme.download));
        modsList.innerHTML += getModItemTemplate(theme, "Theme", installed);
    }

    // Set up action buttons
    const actionBtns = document.querySelectorAll(".modActionBtn");
    actionBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const link = btn.getAttribute("data-link");
            const type = btn.getAttribute("data-type")?.toLowerCase() as "plugin" | "theme";

            if (!link || !type) return;

            if (btn.getAttribute("title") === "Install") {
                ModManager.downloadMod(link, type);
                btn.classList.remove(CLASSES.INSTALL_BUTTON);
                btn.classList.add(CLASSES.UNINSTALL_BUTTON);
                btn.setAttribute("title", "Uninstall");
                if (btn.childNodes[1]) {
                    btn.childNodes[1].textContent = "Uninstall";
                }
            } else {
                ModManager.removeMod(Helpers.getFileNameFromUrl(link), type);
                btn.classList.remove(CLASSES.UNINSTALL_BUTTON);
                btn.classList.add(CLASSES.INSTALL_BUTTON);
                btn.setAttribute("title", "Install");
                if (btn.childNodes[1]) {
                    btn.childNodes[1].textContent = "Install";
                }
            }
        });
    });

    // Search bar logic
    setupSearchBar();

    // Add back button
    const horizontalNavs = document.querySelectorAll(SELECTORS.HORIZONTAL_NAV);
    const horizontalNav = horizontalNavs[1];
    if (horizontalNav) {
        horizontalNav.innerHTML = getBackButton();
        document.getElementById("back-btn")?.addEventListener("click", () => {
            location.hash = '#/';
            setTimeout(() => {
                location.hash = '#/settings';
            }, 0);
        });
    }
}

function setupSearchBar(): void {
    const searchInput = document.querySelector(SELECTORS.SEARCH_INPUT) as HTMLInputElement;
    const addonsContainer = document.querySelector(SELECTORS.ADDONS_LIST_CONTAINER);

    if (!searchInput || !addonsContainer) return;

    searchInput.addEventListener("input", () => {
        const filter = searchInput.value.trim().toLowerCase();
        const modItems = addonsContainer.querySelectorAll(SELECTORS.ADDON_CONTAINER);

        modItems.forEach((item) => {
            const name = item.querySelector(SELECTORS.NAME_CONTAINER)?.textContent?.toLowerCase() || "";
            const description = item.querySelector(SELECTORS.DESCRIPTION_ITEM)?.textContent?.toLowerCase() || "";
            const type = item.querySelector(SELECTORS.TYPES_CONTAINER)?.textContent?.toLowerCase() || "";

            const match = name.includes(filter) || description.includes(filter) || type.includes(filter);
            (item as HTMLElement).style.display = match ? "" : "none";
        });
    });
}

function setupBrowseModsButton(): void {
    Helpers.waitForElm('#browsePluginsThemesBtn').then(() => {
        const btn = document.getElementById("browsePluginsThemesBtn");
        btn?.addEventListener("click", browseMods);
    }).catch(() => {});
}

function writeAbout(): void {
    Helpers.waitForElm(SELECTORS.ABOUT_CATEGORY).then(async () => {
        const aboutCategory = document.querySelector(SELECTORS.ABOUT_CATEGORY);
        if (aboutCategory) {
            // Hardcoded values for Android
            aboutCategory.innerHTML += getAboutCategoryTemplate(
                "Android-v1.0.0",
                false,
                false,
                false
            );

            // Add Open Logs button
            Settings.addButton("Open Logs", "openLogsBtn", SELECTORS.ABOUT_CATEGORY);

            // Attach listener
            Helpers.waitForElm("#openLogsBtn").then(() => {
                document.getElementById("openLogsBtn")?.addEventListener("click", () => {
                    LogManager.showLogs();
                });
            });
        }
    }).catch(err => logger.error("Failed to write about section: " + err));
}

function getAboutIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" style="fill:currentcolor"></path></g></svg>`;
}

function getThemeIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" style="fill: currentcolor;"></path></g></svg>`;
}

function getPluginIcon(): string {
    return `<svg icon="addons-outline" class="icon" viewBox="0 0 512 512" style="fill: currentcolor;">
        <path d="M413.7 246.1H386c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-77.2a38.94 38.94 0 0 0-11.4-27.5 38.94 38.94 0 0 0-27.5-11.4h-77.2c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-27.7c0-27.1-21.5-49.9-48.6-50.3-6.57-0.1-13.09 1.09-19.2 3.5a49.616 49.616 0 0 0-16.4 10.7 49.823 49.823 0 0 0-11 16.2 48.894 48.894 0 0 0-3.9 19.2v28.5c-0.01 0.53-0.23 1.03-0.6 1.4-0.37 0.37-0.87 0.59-1.4 0.6h-77.2c-10.5 0-20.57 4.17-28 11.6a39.594 39.594 0 0 0-11.6 28v70.4c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h26.9c29.4 0 53.7 25.5 54.1 54.8 0.4 29.9-23.5 57.2-53.3 57.2H50c-0.53 0.01-1.03 0.23-1.4 0.6-0.37 0.37-0.59 0.87-0.6 1.4v70.4c0 10.5 4.17 20.57 11.6 28s17.5 11.6 28 11.6h70.4c0.53-0.01 1.03-0.23 1.4-0.6 0.37-0.37 0.59-0.87 0.6-1.4V441.2c0-30.3 24.8-56.4 55-57.1 30.1-0.7 57 20.3 57 50.3v27.7c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h71.1a38.94 38.94 0 0 0 27.5-11.4 38.958 38.958 0 0 0 11.4-27.5v-78c0.01-0.53 0.23-1.03 0.6-1.4 0.37-0.37 0.87-0.59 1.4-0.6h28.5c27.6 0 49.5-22.7 49.5-50.4s-23.2-48.7-50.3-48.7Z" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32;fill: currentColor;"></path></svg>`;
}


function createModInstaller(type: "theme" | "plugin", buttonId: string, selector: string) {
    Settings.addButton(`Install ${type === "theme" ? "Theme" : "Plugin"}`, buttonId, selector);

    Helpers.waitForElm(`#${buttonId}`).then(() => {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = type === "theme" ? ".css" : ".js";
        fileInput.style.display = "none";

        fileInput.addEventListener("change", async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                // Read the file as text
                const reader = new FileReader();
                reader.onload = async (event: any) => {
                    const fileContent = event.target.result as string;
                    let fileName = file.name;

                    if (type === "theme" && !fileName.endsWith(".theme.css")) {
                         fileName = fileName.replace(".css", ".theme.css");
                         if (!fileName.endsWith(".theme.css")) fileName += ".theme.css";
                    } else if (type === "plugin" && !fileName.endsWith(".plugin.js")) {
                         fileName = fileName.replace(".js", ".plugin.js");
                         if (!fileName.endsWith(".plugin.js")) fileName += ".plugin.js";
                    }

                    const folderPath = type === "theme" ? properties.themesPath : properties.pluginsPath;
                    const fullPath = folderPath + "/" + fileName;

                    // Write using PlatformManager (which calls Capacitor filesystem)
                    await PlatformManager.current.writeFile(fullPath, fileContent);

                    Helpers.createToast("mod-installed", "Stremio Enhanced", `Successfully installed ${fileName}. Please restart Stremio.`, "success");
                };
                reader.readAsText(file);
            } catch (err) {
                logger.error(`Failed to install ${type}: ${err}`);
                Helpers.createToast("mod-install-error", "Stremio Enhanced", `Failed to install ${type}`, "error");
            }
        });

        document.body.appendChild(fileInput);
        btn.addEventListener("click", () => fileInput.click());
    }).catch(() => {});
}
