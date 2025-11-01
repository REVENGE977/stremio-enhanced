import { ipcRenderer } from "electron";
import { readdirSync, existsSync } from "fs";
import Settings from "./core/Settings";
import properties from "./core/Properties"
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


window.addEventListener("load", async () => {
    intializeUserSettings();
    reloadServer();

    if(localStorage.getItem('checkForUpdatesOnStartup') == "true") {
        await Updater.checkForUpdates(false);
    }
    
    // Intialize Discord Rich Presence if enabled
    if(localStorage.getItem("discordrichpresence") == "true") {
        DiscordPresence.start();
        await DiscordPresence.discordRPCHandler();
    }

    // Apply enabled theme
    applyUserTheme();

    // Loads enabled plugins.
    loadEnabledPlugins();

    ipcRenderer.on('fullscreen-changed', (_, isFullscreen) => {
        const titleBar = document.querySelector('.title-bar') as HTMLElement;
        if (titleBar) {
            console.log("Fullscreen changed:", isFullscreen);
            titleBar.style.display = isFullscreen ? 'none' : 'flex';
        }
    });

    ipcRenderer.invoke("get-transparency-status").then((enableTransparentThemes) => {
        if(!enableTransparentThemes) return;
        const observer = new MutationObserver(() => {
            AddTitleBar();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });


    // Draw title bar
    ipcRenderer.invoke("get-transparency-status").then((enableTransparentThemes) => {
        if(enableTransparentThemes) AddTitleBar();
    });

    window.addEventListener("hashchange", () => {
        ipcRenderer.invoke("get-transparency-status").then((enableTransparentThemes) => {
            if(enableTransparentThemes) AddTitleBar();
        });

        if(!location.href.includes("#/settings")) return;
        if(document.querySelector(`a[href="#settings-enhanced"]`)) return;
        ModManager.addApplyThemeFunction();
        
        let themesList = readdirSync(`${properties.themesPath}`).filter((fileName) => { return fileName.endsWith(".theme.css") })
        let pluginsList = readdirSync(`${properties.pluginsPath}`).filter((fileName) => { return fileName.endsWith(".plugin.js") })
        
        logger.info("Adding 'Enhanced' sections...");
        Settings.addSection("enhanced", "Enhanced");
        Settings.addCategory("Themes", "enhanced", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" style="
        fill: currentcolor;"></path></g></svg>`);
        Settings.addCategory("Plugins", "enhanced", `<svg icon="addons-outline" class="icon" viewBox="0 0 512 512" style="fill: currentcolor;"><path d="M413.6999999999998 246.10000000000014H386c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-77.2a38.94 38.94 0 0 0-11.4-27.5 38.94 38.94 0 0 0-27.5-11.4h-77.2c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-27.7c0-27.1-21.5-49.9-48.6-50.3-6.57-0.1-13.09 1.09-19.2 3.5a49.616 49.616 0 0 0-16.4 10.7 49.823 49.823 0 0 0-11 16.2 48.894 48.894 0 0 0-3.9 19.2v28.5c-0.01 0.53-0.23 1.03-0.6 1.4-0.37 0.37-0.87 0.59-1.4 0.6h-77.2c-10.5 0-20.57 4.17-28 11.6a39.594 39.594 0 0 0-11.6 28v70.4c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h26.9c29.4 0 53.7 25.5 54.1 54.8 0.4 29.9-23.5 57.2-53.3 57.2H50c-0.53 0.01-1.03 0.23-1.4 0.6-0.37 0.37-0.59 0.87-0.6 1.4v70.4c0 10.5 4.17 20.57 11.6 28s17.5 11.6 28 11.6h70.4c0.53-0.01 1.03-0.23 1.4-0.6 0.37-0.37 0.59-0.87 0.6-1.4V441.20000000000005c0-30.3 24.8-56.4 55-57.1 30.1-0.7 57 20.3 57 50.3v27.7c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h71.1a38.94 38.94 0 0 0 27.5-11.4 38.958 38.958 0 0 0 11.4-27.5v-78c0.01-0.53 0.23-1.03 0.6-1.4 0.37-0.37 0.87-0.59 1.4-0.6h28.5c27.6 0 49.5-22.7 49.5-50.4s-23.2-48.7-50.3-48.7Z" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32;fill: currentColor;"></path></svg>`);
        Settings.addCategory("About", "enhanced", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" style="fill:currentcolor"></path> </g> </svg>`);
        
        Settings.addButton("Open Themes Folder", "openthemesfolderBtn", "#enhanced > div:nth-child(2)");
        Settings.addButton("Open Plugins Folder", "openpluginsfolderBtn", "#enhanced > div:nth-child(3)");
        
        writeAbout();
        
        //Browse plugins/themes from stremio-enhanced-registry
        Helpers.waitForElm('#browsePluginsThemesBtn').then(() => {
            let browsePluginsThemesBtn:any = document.getElementById("browsePluginsThemesBtn");
            browsePluginsThemesBtn.addEventListener("click", browseMods)
        })

        //Check for updates button
        Helpers.waitForElm('#checkforupdatesBtn').then(() => {
            let checkForUpdateBtn:any = document.getElementById("checkforupdatesBtn");
            checkForUpdateBtn.addEventListener("click", async () => {
                checkForUpdateBtn.style.pointerEvents = "none";
                ipcRenderer.send("update-check-userrequest");
                checkForUpdateBtn.style.pointerEvents = "all";
            })
        })

        //CheckForUpdatesOnStartup toggle
        Helpers.waitForElm('#checkForUpdatesOnStartup').then(() => {
            document.getElementById("checkForUpdatesOnStartup").addEventListener("click", (e) => {
                document.getElementById("checkForUpdatesOnStartup").classList.toggle("checked");
                logger.info(`Check for updates on startup toggled ${document.getElementById("checkForUpdatesOnStartup").classList.contains("checked") ? "ON" : "OFF"}`);

                if (document.getElementById("checkForUpdatesOnStartup").classList.contains("checked")) {
                    localStorage.setItem("checkForUpdatesOnStartup", "true")
                } else {
                    localStorage.setItem("checkForUpdatesOnStartup", "false")
                }
            })
        })

        //Discord Rich Presence toggle
        Helpers.waitForElm('#discordrichpresence').then(() => {
            document.getElementById("discordrichpresence").addEventListener("click", async (e) => {
                document.getElementById("discordrichpresence").classList.toggle("checked");
                logger.info(`Discord Rich Presence toggled ${document.getElementById("discordrichpresence").classList.contains("checked") ? "ON" : "OFF"}`);

                if (document.getElementById("discordrichpresence").classList.contains("checked")) {
                    localStorage.setItem("discordrichpresence", "true")
                    DiscordPresence.start();
                    await DiscordPresence.discordRPCHandler();
                } else {
                    localStorage.setItem("discordrichpresence", "false")
                    DiscordPresence.stop();
                }
            })
        })

        //Enable transparency toggle
        Helpers.waitForElm('#enableTransparentThemes').then(() => {
            let enableTransparencyBtn:any = document.getElementById("enableTransparentThemes");
            enableTransparencyBtn.addEventListener("click", async () => {
                enableTransparencyBtn.classList.toggle("checked");
                logger.info(`Enable transparency toggled ${enableTransparencyBtn.classList.contains("checked") ? "ON" : "OFF"}`);

                ipcRenderer.send("set-transparency", enableTransparencyBtn.classList.contains("checked"));
            })
        })

        Helpers.waitForElm('#enhanced > div:nth-child(2)').then(() => {
            //default theme
            const isCurrentThemeDefault = localStorage.getItem("currentTheme") == "Default";
            const defaultThemeContainer = document.createElement("div");
            defaultThemeContainer.innerHTML = getDefaultThemeTemplate(isCurrentThemeDefault);

            document.querySelector(`#enhanced > div:nth-child(2)`).appendChild(defaultThemeContainer);
            
            // add themes to the settings
            themesList.forEach(theme => {
                let readMetaData = Helpers.extractMetadataFromFile(join(properties.themesPath, theme));
                
                if (readMetaData && Object.keys(readMetaData).length > 0) {
                    if(readMetaData.name.toLowerCase() != "default") Settings.addItem("theme", theme, readMetaData);
                }
            })
        })
        
        // add plugins to the settings
        pluginsList.forEach(plugin => {
            let readMetaData = Helpers.extractMetadataFromFile(join(properties.pluginsPath, plugin));
            if (readMetaData && Object.keys(readMetaData).length > 0) Settings.addItem("plugin", plugin, readMetaData);
        })
        
        ModManager.togglePluginListener();
        ModManager.scrollListener();
        ModManager.openThemesFolder();
        ModManager.openPluginsFolder();
    })
})

function reloadServer() {
    setTimeout(() => {
        Helpers._eval(`core.transport.dispatch({ action: 'StreamingServer', args: { action: 'Reload' } });`);
        logger.info("Stremio streaming server reloaded.");
    }, 1500);
}

function intializeUserSettings() {
    if(localStorage.getItem("enabledPlugins") == null || localStorage.getItem("enabledPlugins") == "") localStorage.setItem("enabledPlugins", "[]");
    if(localStorage.getItem("checkForUpdatesOnStartup") == null || localStorage.getItem("checkForUpdatesOnStartup") == "") localStorage.setItem("checkForUpdatesOnStartup", "true");
    if(localStorage.getItem("discordrichpresence") == null || localStorage.getItem("discordrichpresence") == "") localStorage.setItem("discordrichpresence", "false");
}

function applyUserTheme() {
    if(localStorage.getItem("currentTheme") != null) {
        let currentTheme = localStorage.getItem("currentTheme");
        
        if(currentTheme != "Default" && existsSync(join(properties.themesPath, currentTheme))) {
            if(document.getElementById("activeTheme")) document.getElementById("activeTheme").remove();
            const themePath = join(properties.themesPath, currentTheme);

            let themeElement = document.createElement('link');
            themeElement.setAttribute("id", "activeTheme");
            themeElement.setAttribute("rel", "stylesheet");
            themeElement.setAttribute("href", pathToFileURL(themePath).toString());
            document.head.appendChild(themeElement);
        } else {
            localStorage.setItem("currentTheme", "Default");
        }
    } else localStorage.setItem("currentTheme", "Default");
}


function loadEnabledPlugins() {
    let pluginsToLoad = readdirSync(`${properties.pluginsPath}`).filter((fileName) => { return fileName.endsWith(".plugin.js") });
    pluginsToLoad.forEach(plugin => {
        let enabledPlugins = JSON.parse(localStorage.getItem("enabledPlugins"));
        if(enabledPlugins.includes(plugin)) ModManager.loadPlugin(plugin);
    })
}

async function browseMods() {
    document.querySelector(".settings-content-co5eU").innerHTML = getModsTabTemplate();

    let mods = await ModManager.fetchMods();
    mods.plugins.forEach((plugin:any) => {
        let installed = ModManager.isPluginInstalled(Helpers.getFileNameFromUrl(plugin.download));
        document.getElementById("mods-list").innerHTML += getModItemTemplate(plugin, "Plugin", installed);
    });

    mods.themes.forEach((theme:any) => {
        let installed = ModManager.isThemeInstalled(Helpers.getFileNameFromUrl(theme.download));
        document.getElementById("mods-list").innerHTML += getModItemTemplate(theme, "Theme", installed);
    });

    let actionBtns = document.querySelectorAll(".modActionBtn");
    actionBtns.forEach((btn: HTMLDivElement) => {
        btn.addEventListener("click", () => {
            const link = btn.getAttribute("data-link");
            const type = btn.getAttribute("data-type").toLowerCase() as "plugin" | "theme";

            if (link && type) {
                if(btn.title == "Install") {
                    ModManager.downloadMod(link, type);
                    btn.classList.remove("install-button-container-yfcq5");
                    btn.classList.add("uninstall-button-container-oV4Yo");

                    btn.title = "Uninstall";
                    btn.childNodes[1].textContent = "Uninstall";
                } else {
                    ModManager.removeMod(Helpers.getFileNameFromUrl(link), type);
                    btn.classList.remove("uninstall-button-container-oV4Yo");
                    btn.classList.add("install-button-container-yfcq5");

                    btn.title = "Install";
                    btn.childNodes[1].textContent = "Install";
                }
            }
        });
    });

    // search bar logic
    const searchInput = document.querySelector(".search-input-bAgAh") as HTMLInputElement;
    const addonsContainer = document.querySelector(".addons-list-container-Ovr2Z");

    if (!searchInput || !addonsContainer) return;

    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.trim().toLowerCase();
        const modItems = addonsContainer.querySelectorAll(".addon-container-lC5KN");

        modItems.forEach((item) => {
            const name = item.querySelector(".name-container-qIAg8")?.textContent?.toLowerCase() || "";
            const description = item.querySelector(".description-container-v7Jhe")?.textContent?.toLowerCase() || "";
            const type = item.querySelector(".types-container-DaOrg")?.textContent?.toLowerCase() || "";

            const match = 
                name.includes(filter) || 
                description.includes(filter) || 
                type.includes(filter);

            (item as HTMLElement).style.display = match ? "" : "none";
        });
    });

    // add back button
    let horizontalNav = document.querySelectorAll(".horizontal-nav-bar-container-Y_zvK")[1];
    if (horizontalNav) {
        horizontalNav.innerHTML = getBackButton();
        document.getElementById("back-btn").addEventListener("click", () => {
            location.hash = '#/';
            setTimeout(() => {
                location.hash = '#/settings';
            }, 0);
        });
    }
}

function writeAbout() {
    Helpers.waitForElm('#enhanced > div:nth-child(4)').then(() => {
        ipcRenderer.invoke("get-transparency-status").then((enableTransparentThemes) => {
            const currentVersion = Updater.getCurrentVersion();
            const checkForUpdatesOnStartup = localStorage.getItem("checkForUpdatesOnStartup") == "true";
            const discordrichpresence = localStorage.getItem("discordrichpresence") == "true";

            document.querySelector(`#enhanced > div:nth-child(4)`).innerHTML += getAboutCategoryTemplate(currentVersion, checkForUpdatesOnStartup, discordrichpresence, enableTransparentThemes);
        });
    })
}

function AddTitleBar() {
    logger.info("Adding title bar...");

    const activeRoute = document.querySelector(".route-container:last-child .route-content");
    if (activeRoute && !activeRoute.querySelector(".title-bar")) {
        activeRoute.insertAdjacentHTML("afterbegin", getTitleBarTemplate());
        logger.info("Title bar added to active route: ", activeRoute);

        const titleBar = activeRoute.querySelector(".title-bar")!;
        titleBar.querySelector("#minimizeApp-btn")?.addEventListener("click", () => {
            ipcRenderer.send("minimize-window");
        });

        titleBar.querySelector("#maximizeApp-btn")?.addEventListener("click", () => {
            if(titleBar.querySelector("#maximizeApp-btn svg path").getAttribute("d") == "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z") {
                titleBar.querySelector("#maximizeApp-btn svg path").setAttribute("d", "M3,3H21V21H3V3M5,5V19H19V5H5Z");
            } else {
                titleBar.querySelector("#maximizeApp-btn svg path").setAttribute("d", "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z");
            }
            
            ipcRenderer.send("maximize-window");
        });

        // const catcher = titleBar.querySelector('.dblclick-catcher');
        // catcher.addEventListener('dblclick', () => {
        //     if(titleBar.querySelector("#maximizeApp-btn svg path").getAttribute("d") == "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z") {
        //         titleBar.querySelector("#maximizeApp-btn svg path").setAttribute("d", "M3,3H21V21H3V3M5,5V19H19V5H5Z");
        //     } else {
        //         titleBar.querySelector("#maximizeApp-btn svg path").setAttribute("d", "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z");
        //     }
            
        //     ipcRenderer.send("maximize-window");
        // });

        titleBar.querySelector("#closeApp-btn")?.addEventListener("click", () => {
            ipcRenderer.send("close-window");
        });
    }
}