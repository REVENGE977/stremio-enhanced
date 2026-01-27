import Settings from "./Settings";
import { PlatformManager } from "../platform/PlatformManager";
import properties from "./Properties";
import helpers from "../utils/Helpers";
import { MetaData } from "../interfaces/MetaData";
import { getLogger } from "../utils/logger";
import Properties from "./Properties";
import { getApplyThemeTemplate } from "../components/apply-theme/applyTheme";
import { basename, join } from "path";
import { STORAGE_KEYS, SELECTORS, CLASSES, URLS } from "../constants";
import ExtractMetaData from "../utils/ExtractMetaData";

class ModManager {
    private static logger = getLogger("ModManager");
    
    /**
     * Load and enable a plugin by filename
     */
    public static async loadPlugin(pluginName: string): Promise<void> {
        if (document.getElementById(pluginName)) {
            this.logger.info(`Plugin ${pluginName} is already loaded`);
            return;
        }

        const pluginPath = join(properties.pluginsPath, pluginName);
        
        if (!await PlatformManager.current.exists(pluginPath)) {
            this.logger.error(`Plugin file not found: ${pluginPath}`);
            return;
        }

        const plugin = await PlatformManager.current.readFile(pluginPath);
        const script = document.createElement("script");
        script.innerHTML = plugin;
        script.id = pluginName;
        
        document.body.appendChild(script);
        
        const enabledPlugins: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
        );
        
        if (!enabledPlugins.includes(pluginName)) {
            enabledPlugins.push(pluginName);
            localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
        }
        
        this.logger.info(`Plugin ${pluginName} loaded!`);
    }
    
    /**
     * Unload and disable a plugin by filename
     */
    public static unloadPlugin(pluginName: string): void {
        const pluginElement = document.getElementById(pluginName);
        if (pluginElement) {
            pluginElement.remove();
        }
        
        let enabledPlugins: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
        );
        enabledPlugins = enabledPlugins.filter((x: string) => x !== pluginName);
        localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
        
        this.logger.info(`Plugin ${pluginName} unloaded!`);
    }

    /**
     * Fetch mods from the registry repository
     */
    public static async fetchMods(): Promise<{ plugins: unknown[]; themes: unknown[] }> {
        const response = await fetch(URLS.REGISTRY);
        return response.json();
    }

    /**
     * Download and save a mod (plugin or theme)
     */
    public static async downloadMod(modLink: string, type: "plugin" | "theme"): Promise<string> {
        this.logger.info(`Downloading ${type} from: ${modLink}`);

        const response = await fetch(modLink);
        if (!response.ok) throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
        
        const saveDir = type === "plugin" ? Properties.pluginsPath : Properties.themesPath;
        if (!await PlatformManager.current.exists(saveDir)) {
            await PlatformManager.current.mkdir(saveDir);
        }
        
        const filename = basename(new URL(modLink).pathname) || `${type}-${Date.now()}`;
        const filePath = join(saveDir, filename);

        const content = await response.text();
        await PlatformManager.current.writeFile(filePath, content);

        this.logger.info(`Downloaded ${type} saved to: ${filePath}`);
        return filePath;
    }

    /**
     * Remove a mod file and clean up associated state
     */
    public static async removeMod(fileName: string, type: "plugin" | "theme"): Promise<void> {
        this.logger.info(`Removing ${type} file: ${fileName}`);

        switch (type) {
            case "plugin":
                if (await this.isPluginInstalled(fileName)) {
                    await PlatformManager.current.unlink(join(Properties.pluginsPath, fileName));
                    let enabledPlugins: string[] = JSON.parse(
                        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
                    );
                    if (enabledPlugins.includes(fileName)) {
                        enabledPlugins = enabledPlugins.filter((x: string) => x !== fileName);
                        localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
                    }
                }
                break;
            case "theme":
                if (await this.isThemeInstalled(fileName)) {
                    if (localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === fileName) {
                        localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
                    }
                    document.getElementById("activeTheme")?.remove();
                    await PlatformManager.current.unlink(join(Properties.themesPath, fileName));
                }
                break;
        }
    }

    public static async isThemeInstalled(fileName: string): Promise<boolean> {
        return (await this.getInstalledThemes()).includes(fileName);
    }

    public static async isPluginInstalled(fileName: string): Promise<boolean> {
        return (await this.getInstalledPlugins()).includes(fileName);
    }

    private static async getInstalledThemes(): Promise<string[]> {
        const dirPath = Properties.themesPath;
        if (!await PlatformManager.current.exists(dirPath)) return [];

        const files = await PlatformManager.current.readdir(dirPath);
        const fileStats = await Promise.all(files.map(async file => {
            const stat = await PlatformManager.current.stat(join(dirPath, file));
            return { file, isFile: stat.isFile };
        }));
        
        return fileStats.filter(f => f.isFile).map(f => f.file);
    }

    private static async getInstalledPlugins(): Promise<string[]> {
        const dirPath = Properties.pluginsPath;
        if (!await PlatformManager.current.exists(dirPath)) return [];

        const files = await PlatformManager.current.readdir(dirPath);
        const fileStats = await Promise.all(files.map(async file => {
            const stat = await PlatformManager.current.stat(join(dirPath, file));
            return { file, isFile: stat.isFile };
        }));
        
        return fileStats.filter(f => f.isFile).map(f => f.file);
    }
    
    /**
     * Set up event listeners for plugin toggle checkboxes
     */
    public static togglePluginListener(): void {
        helpers.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
            this.logger.info("Listening to plugin checkboxes...");
            const pluginCheckboxes = document.getElementsByClassName("plugin") as HTMLCollectionOf<HTMLElement>;
            
            for (let i = 0; i < pluginCheckboxes.length; i++) {
                pluginCheckboxes[i].addEventListener("click", async () => {
                    pluginCheckboxes[i].classList.toggle(CLASSES.CHECKED);
                    const pluginName = pluginCheckboxes[i].getAttribute('name');

                    if (!pluginName) return;

                    if (pluginCheckboxes[i].classList.contains(CLASSES.CHECKED)) {
                        await this.loadPlugin(pluginName);
                    } else {
                        this.unloadPlugin(pluginName);
                        this.showReloadWarning();
                    }
                });
            }
        }).catch(err => this.logger.error(`Failed to setup plugin listeners: ${err}`));
    }

    private static showReloadWarning(): void {
        if (document.getElementById("plugin-reload-warning")) return;
        
        this.logger.info("Plugin unloaded, adding reload warning.");
        const container = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
        if (!container) return;

        const paragraph = document.createElement("p");
        paragraph.id = "plugin-reload-warning";
        paragraph.style.color = "white";
        
        const link = document.createElement("a");
        link.style.color = "cyan";
        link.style.cursor = "pointer";
        link.textContent = "here";
        link.addEventListener("click", () => {
            window.location.href = '/';
        });
        
        paragraph.appendChild(document.createTextNode("Reload is required to disable plugins. Click "));
        paragraph.appendChild(link);
        paragraph.appendChild(document.createTextNode(" to reload."));
        
        container.appendChild(paragraph);
    }
    
    public static openThemesFolder(): void {
        helpers.waitForElm("#openthemesfolderBtn").then(() => {
            const button = document.getElementById("openthemesfolderBtn");
            button?.addEventListener("click", async () => {
                await this.openFolder(Properties.themesPath);
            });
        }).catch(err => this.logger.error(`Failed to setup themes folder button: ${err}`));
    }

    public static openPluginsFolder(): void {
        helpers.waitForElm("#openpluginsfolderBtn").then(() => {
            const button = document.getElementById("openpluginsfolderBtn");
            button?.addEventListener("click", async () => {
                await this.openFolder(Properties.pluginsPath);
            });
        }).catch(err => this.logger.error(`Failed to setup plugins folder button: ${err}`));
    }

    /**
     * Open a folder in the system file explorer
     */
    private static async openFolder(folderPath: string): Promise<void> {
        try {
            await PlatformManager.current.openPath(folderPath);
        } catch (error) {
            this.logger.error(`Failed to open folder ${folderPath}: ${error}`);
        }
    }
        
    public static scrollListener(): void {
        helpers.waitForElm(".menu-xeE06 > div:nth-child(5) > div").then(() => {
            const enhanced = document.getElementById('enhanced');
            const enhancedNav = document.querySelector('.menu-xeE06 > div:nth-child(5) > div');

            if (!enhanced || !enhancedNav) return;

            enhancedNav.addEventListener("click", () => {
                const firstChild = document.querySelector("#enhanced > div");
                firstChild?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                Settings.activeSection(enhancedNav);
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Settings.activeSection(enhancedNav);
                    } else {
                        enhancedNav.classList.remove(CLASSES.SELECTED);
                    }
                });
            }, { threshold: 0.1 });
        
            observer.observe(enhanced);
        }).catch(err => this.logger.error(`Failed to setup scroll listener: ${err}`));
    }
    
    /**
     * Add the applyTheme function to the page
     */
    public static addApplyThemeFunction(): void {
        const applyThemeScript = getApplyThemeTemplate();
        const script = document.createElement("script");  
        script.innerHTML = applyThemeScript;
        
        document.body.appendChild(script);
    }
    
    /**
     * Check for updates for a specific plugin or theme
     */
    public static async checkForItemUpdates(itemFile: string): Promise<void> {
        this.logger.info('Checking for updates for ' + itemFile);
        
        const itemBox = document.getElementsByName(`${itemFile}-box`)[0];
        if (!itemBox) {
            this.logger.warn(`${itemFile}-box element not found.`);
            return;
        }

        const pluginOrTheme: 'theme' | 'plugin' = itemFile.endsWith(".theme.css") ? "theme" : "plugin";
        const itemPath = join(
            pluginOrTheme === "theme" ? properties.themesPath : properties.pluginsPath, 
            itemFile
        );
        
        // Refactored: Read file first
        let fileContent = "";
        try {
            fileContent = await PlatformManager.current.readFile(itemPath);
        } catch (e) {
            this.logger.error(`Failed to read file ${itemPath}: ${e}`);
            return;
        }

        const installedItemMetaData = ExtractMetaData.extractMetadataFromText(fileContent) as MetaData | null;
        
        if (!installedItemMetaData || Object.keys(installedItemMetaData).length === 0) {
            return;
        }

        const updateUrl = installedItemMetaData.updateUrl;
        if (!updateUrl || updateUrl === "none") {
            this.logger.info(`No update URL provided for ${pluginOrTheme} (${installedItemMetaData.name})`);
            return;
        }

        try {
            const request = await fetch(updateUrl);
            if (request.status !== 200) {
                this.logger.warn(`Failed to fetch update for ${itemFile}: HTTP ${request.status}`);
                return;
            }

            const response = await request.text();
            const extractedMetaData = ExtractMetaData.extractMetadataFromText(response) as MetaData | null;
            
            if (!extractedMetaData) {
                this.logger.warn(`Failed to extract metadata from response for ${pluginOrTheme} (${installedItemMetaData.name})`);
                return;
            }

            if (helpers.isNewerVersion(extractedMetaData.version, installedItemMetaData.version)) {
                this.logger.info(
                    `Update available for ${pluginOrTheme} (${installedItemMetaData.name}): ` +
                    `v${installedItemMetaData.version} -> v${extractedMetaData.version}`
                );

                const updateButton = document.getElementById(`${itemFile}-update`);
                if (updateButton) {
                    updateButton.style.display = "flex";
                    updateButton.addEventListener("click", async () => {
                        await PlatformManager.current.writeFile(itemPath, response);
                        Settings.removeItem(itemFile);
                        Settings.addItem(pluginOrTheme, itemFile, extractedMetaData);
                    });
                }
            } else {
                this.logger.info(
                    `No update available for ${pluginOrTheme} (${installedItemMetaData.name}). ` +
                    `Current version: v${installedItemMetaData.version}`
                );
            }
        } catch (error) {
            this.logger.error(`Error checking updates for ${itemFile}: ${(error as Error).message}`);
        }
    }
}
    
export default ModManager;
