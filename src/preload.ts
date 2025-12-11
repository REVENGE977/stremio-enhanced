import { ipcRenderer } from "electron";
import { readdirSync, existsSync } from "fs";
import Settings from "./core/Settings";
import properties from "./core/Properties";
import ModManager from "./core/ModManager";
import Helpers from "./utils/Helpers";
import Updater from "./core/Updater";
import DiscordPresence from "./utils/DiscordPresence";
import { getModsTabTemplate } from "./components/mods-tab/modsTab";
import { getModItemTemplate } from "./components/mods-item/modsItem";
import { getAboutCategoryTemplate } from "./components/about-category/aboutCategory";
import { getDefaultThemeTemplate } from "./components/default-theme/defaultTheme";
import { getBackButton } from "./components/back-btn/backBtn";
import { getTitleBarTemplate } from "./components/title-bar/titleBar";
import logger from "./utils/logger";
import { join } from "path";
import { pathToFileURL } from "url";
import { 
    STORAGE_KEYS, 
    SELECTORS, 
    CLASSES, 
    IPC_CHANNELS, 
    FILE_EXTENSIONS,
    TIMEOUTS 
} from "./constants";

// Cache transparency status to avoid repeated IPC calls
let transparencyStatusCache: boolean | null = null;

async function getTransparencyStatus(): Promise<boolean> {
    if (transparencyStatusCache === null) {
        transparencyStatusCache = await ipcRenderer.invoke(IPC_CHANNELS.GET_TRANSPARENCY_STATUS) as boolean;
    }
    return transparencyStatusCache ?? false;
}

window.addEventListener("load", async () => {
    initializeUserSettings();
    reloadServer();

    const checkUpdates = localStorage.getItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP);
    if (checkUpdates === "true") {
        await Updater.checkForUpdates(false);
    }
    
    // Initialize Discord Rich Presence if enabled
    const discordRpcEnabled = localStorage.getItem(STORAGE_KEYS.DISCORD_RPC);
    if (discordRpcEnabled === "true") {
        DiscordPresence.start();
        await DiscordPresence.discordRPCHandler();
    }

    // Apply enabled theme
    applyUserTheme();

    // Load enabled plugins
    loadEnabledPlugins();

    // Get transparency status once and reuse
    const isTransparencyEnabled = await getTransparencyStatus();

    // Handle fullscreen changes for title bar
    ipcRenderer.on(IPC_CHANNELS.FULLSCREEN_CHANGED, (_, isFullscreen: boolean) => {
        const titleBar = document.querySelector('.title-bar') as HTMLElement;
        if (titleBar) {
            titleBar.style.display = isFullscreen ? 'none' : 'flex';
        }
    });

    // Set up title bar observer for transparent themes
    if (isTransparencyEnabled) {
        const observer = new MutationObserver(() => {
            addTitleBar();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        addTitleBar();
    }

    // Handle navigation changes
    window.addEventListener("hashchange", async () => {
        if (isTransparencyEnabled) {
            addTitleBar();
        }

        if (!location.href.includes("#/settings")) return;
        if (document.querySelector(`a[href="#settings-enhanced"]`)) return;
        
        ModManager.addApplyThemeFunction();
        
        const themesList = readdirSync(properties.themesPath)
            .filter(fileName => fileName.endsWith(FILE_EXTENSIONS.THEME));
        const pluginsList = readdirSync(properties.pluginsPath)
            .filter(fileName => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));
        
        logger.info("Adding 'Enhanced' sections...");
        Settings.addSection("enhanced", "Enhanced");
        Settings.addCategory("Themes", "enhanced", getThemeIcon());
        Settings.addCategory("Plugins", "enhanced", getPluginIcon());
        Settings.addCategory("About", "enhanced", getAboutIcon());
        
        Settings.addButton("Open Themes Folder", "openthemesfolderBtn", SELECTORS.THEMES_CATEGORY);
        Settings.addButton("Open Plugins Folder", "openpluginsfolderBtn", SELECTORS.PLUGINS_CATEGORY);
        
        writeAbout();
        
        // Browse plugins/themes from stremio-enhanced-registry
        setupBrowseModsButton();
        
        // Check for updates button
        setupCheckUpdatesButton();
        
        // CheckForUpdatesOnStartup toggle
        setupCheckUpdatesOnStartupToggle();
        
        // Discord Rich Presence toggle
        setupDiscordRpcToggle();
        
        // Enable transparency toggle
        setupTransparencyToggle();

        // Add themes to settings
        Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
            // Default theme
            const isCurrentThemeDefault = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === "Default";
            const defaultThemeContainer = document.createElement("div");
            defaultThemeContainer.innerHTML = getDefaultThemeTemplate(isCurrentThemeDefault);
            document.querySelector(SELECTORS.THEMES_CATEGORY)?.appendChild(defaultThemeContainer);
            
            // Add installed themes
            themesList.forEach(theme => {
                const metaData = Helpers.extractMetadataFromFile(join(properties.themesPath, theme));
                if (metaData && metaData.name && metaData.description && metaData.author && metaData.version) {
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
            });
        }).catch(err => logger.error("Failed to setup themes: " + err));
        
        // Add plugins to settings
        pluginsList.forEach(plugin => {
            const metaData = Helpers.extractMetadataFromFile(join(properties.pluginsPath, plugin));
            if (metaData && metaData.name && metaData.description && metaData.author && metaData.version) {
                Settings.addItem("plugin", plugin, {
                    name: metaData.name,
                    description: metaData.description,
                    author: metaData.author,
                    version: metaData.version,
                    updateUrl: metaData.updateUrl,
                    source: metaData.source
                });
            }
        });
        
        ModManager.togglePluginListener();
        ModManager.scrollListener();
        ModManager.openThemesFolder();
        ModManager.openPluginsFolder();
    });
});

function reloadServer(): void {
    setTimeout(() => {
        Helpers._eval(`core.transport.dispatch({ action: 'StreamingServer', args: { action: 'Reload' } });`);
        logger.info("Stremio streaming server reloaded.");
    }, TIMEOUTS.SERVER_RELOAD_DELAY);
}

function initializeUserSettings(): void {
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

function applyUserTheme(): void {
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

    // Remove existing theme if present
    document.getElementById("activeTheme")?.remove();
    
    const themeElement = document.createElement('link');
    themeElement.setAttribute("id", "activeTheme");
    themeElement.setAttribute("rel", "stylesheet");
    themeElement.setAttribute("href", pathToFileURL(themePath).toString());
    document.head.appendChild(themeElement);
}

function loadEnabledPlugins(): void {
    const pluginsToLoad = readdirSync(properties.pluginsPath)
        .filter(fileName => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));
    
    const enabledPlugins: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
    );

    pluginsToLoad.forEach(plugin => {
        if (enabledPlugins.includes(plugin)) {
            ModManager.loadPlugin(plugin);
        }
    });
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
    }

    // Add plugins
    (mods.plugins as RegistryMod[]).forEach((plugin) => {
        const installed = ModManager.isPluginInstalled(Helpers.getFileNameFromUrl(plugin.download));
        modsList.innerHTML += getModItemTemplate(plugin, "Plugin", installed);
    });

    // Add themes
    (mods.themes as RegistryMod[]).forEach((theme) => {
        const installed = ModManager.isThemeInstalled(Helpers.getFileNameFromUrl(theme.download));
        modsList.innerHTML += getModItemTemplate(theme, "Theme", installed);
    });

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

function setupCheckUpdatesButton(): void {
    Helpers.waitForElm('#checkforupdatesBtn').then(() => {
        const btn = document.getElementById("checkforupdatesBtn");
        btn?.addEventListener("click", async () => {
            if (btn) btn.style.pointerEvents = "none";
            ipcRenderer.send(IPC_CHANNELS.UPDATE_CHECK_USER);
            if (btn) btn.style.pointerEvents = "all";
        });
    }).catch(() => {});
}

function setupCheckUpdatesOnStartupToggle(): void {
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

function setupDiscordRpcToggle(): void {
    Helpers.waitForElm('#discordrichpresence').then(() => {
        const toggle = document.getElementById("discordrichpresence");
        toggle?.addEventListener("click", async () => {
            toggle.classList.toggle(CLASSES.CHECKED);
            const isChecked = toggle.classList.contains(CLASSES.CHECKED);
            logger.info(`Discord Rich Presence toggled ${isChecked ? "ON" : "OFF"}`);

            if (isChecked) {
                localStorage.setItem(STORAGE_KEYS.DISCORD_RPC, "true");
                DiscordPresence.start();
                await DiscordPresence.discordRPCHandler();
            } else {
                localStorage.setItem(STORAGE_KEYS.DISCORD_RPC, "false");
                DiscordPresence.stop();
            }
        });
    }).catch(() => {});
}

function setupTransparencyToggle(): void {
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

function writeAbout(): void {
    Helpers.waitForElm(SELECTORS.ABOUT_CATEGORY).then(async () => {
        const isTransparencyEnabled = await getTransparencyStatus();
        const currentVersion = Updater.getCurrentVersion();
        const checkForUpdatesOnStartup = localStorage.getItem(STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP) === "true";
        const discordRpc = localStorage.getItem(STORAGE_KEYS.DISCORD_RPC) === "true";

        const aboutCategory = document.querySelector(SELECTORS.ABOUT_CATEGORY);
        if (aboutCategory) {
            aboutCategory.innerHTML += getAboutCategoryTemplate(
                currentVersion, 
                checkForUpdatesOnStartup, 
                discordRpc, 
                isTransparencyEnabled
            );
        }
    }).catch(err => logger.error("Failed to write about section: " + err));
}

function addTitleBar(): void {
    logger.info("Adding title bar...");

    const activeRoute = document.querySelector(SELECTORS.ROUTE_CONTAINER);
    if (!activeRoute || activeRoute.querySelector(".title-bar")) return;

    activeRoute.insertAdjacentHTML("afterbegin", getTitleBarTemplate());
    logger.info("Title bar added to active route");

    const titleBar = activeRoute.querySelector(".title-bar");
    if (!titleBar) return;

    // Minimize button
    titleBar.querySelector("#minimizeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.MINIMIZE_WINDOW);
    });

    // Maximize button
    titleBar.querySelector("#maximizeApp-btn")?.addEventListener("click", () => {
        const pathElement = titleBar.querySelector("#maximizeApp-btn svg path");
        if (pathElement) {
            const currentPath = pathElement.getAttribute("d");
            const maximizedPath = "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z";
            const normalPath = "M3,3H21V21H3V3M5,5V19H19V5H5Z";
            
            pathElement.setAttribute("d", currentPath === maximizedPath ? normalPath : maximizedPath);
        }
        ipcRenderer.send(IPC_CHANNELS.MAXIMIZE_WINDOW);
    });

    // Close button
    titleBar.querySelector("#closeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.CLOSE_WINDOW);
    });
}

// Icon SVGs
function getThemeIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" style="fill: currentcolor;"></path></g></svg>`;
}

function getPluginIcon(): string {
    return `<svg icon="addons-outline" class="icon" viewBox="0 0 512 512" style="fill: currentcolor;">
        <path d="M413.7 246.1H386c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-77.2a38.94 38.94 0 0 0-11.4-27.5 38.94 38.94 0 0 0-27.5-11.4h-77.2c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-27.7c0-27.1-21.5-49.9-48.6-50.3-6.57-0.1-13.09 1.09-19.2 3.5a49.616 49.616 0 0 0-16.4 10.7 49.823 49.823 0 0 0-11 16.2 48.894 48.894 0 0 0-3.9 19.2v28.5c-0.01 0.53-0.23 1.03-0.6 1.4-0.37 0.37-0.87 0.59-1.4 0.6h-77.2c-10.5 0-20.57 4.17-28 11.6a39.594 39.594 0 0 0-11.6 28v70.4c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h26.9c29.4 0 53.7 25.5 54.1 54.8 0.4 29.9-23.5 57.2-53.3 57.2H50c-0.53 0.01-1.03 0.23-1.4 0.6-0.37 0.37-0.59 0.87-0.6 1.4v70.4c0 10.5 4.17 20.57 11.6 28s17.5 11.6 28 11.6h70.4c0.53-0.01 1.03-0.23 1.4-0.6 0.37-0.37 0.59-0.87 0.6-1.4V441.2c0-30.3 24.8-56.4 55-57.1 30.1-0.7 57 20.3 57 50.3v27.7c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h71.1a38.94 38.94 0 0 0 27.5-11.4 38.958 38.958 0 0 0 11.4-27.5v-78c0.01-0.53 0.23-1.03 0.6-1.4 0.37-0.37 0.87-0.59 1.4-0.6h28.5c27.6 0 49.5-22.7 49.5-50.4s-23.2-48.7-50.3-48.7Z" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32;fill: currentColor;"></path></svg>`;
}

function getAboutIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" style="fill:currentcolor"></path></g></svg>`;
}
