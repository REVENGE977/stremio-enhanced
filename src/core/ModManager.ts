import Settings from "./Settings";
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { exec } from "child_process";
import properties from "./Properties"
import helpers from "../utils/Helpers"
import MetaData from "../interfaces/MetaData";
import { getLogger } from "../utils/logger";
import Properties from "./Properties";
import { getApplyThemeTemplate } from "../components/apply-theme/applyTheme";
import { basename, join } from "path";

class ModManager {
    private static logger = getLogger("ModManager");
    
    public static loadPlugin(pluginName:string) {
        if(document.getElementById(pluginName)) return;
        let plugin = readFileSync(join(properties.pluginsPath, pluginName), "utf-8");
        let script = document.createElement("script");
        script.innerHTML = plugin
        script.id = pluginName
        
        document.body.appendChild(script);
        
        let enabledPlugins = JSON.parse(localStorage.getItem("enabledPlugins"));
        if(enabledPlugins.includes(pluginName) == false) {
            enabledPlugins.push(pluginName)
            localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
        }
        
        this.logger.info(`Plugin ${pluginName} loaded!`);
    }
    
    public static unloadPlugin(pluginName:string) {
        document.getElementById(pluginName).remove();
        
        let enabledPlugins = JSON.parse(localStorage.getItem("enabledPlugins"));
        enabledPlugins = enabledPlugins.filter((x:string) => x !== pluginName);
        localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
        
        this.logger.info(`Plugin ${pluginName} unloaded!`);
    }

    // Fetch mods from the registry repository
    public static async fetchMods() {
        let mods = await fetch("https://raw.githubusercontent.com/REVENGE977/stremio-enhanced-registry/refs/heads/main/registry.json");
        return mods.json();
    }

    public static async downloadMod(modLink: string, type: "plugin" | "theme") {
        try {
            this.logger.info(`Downloading ${type} from: ${modLink}`);

            const response = await fetch(modLink);
            if (!response.ok) throw new Error(`Failed to download: ${response.status} ${response.statusText}`);

            const saveDir = type === "plugin" ? Properties.pluginsPath : Properties.themesPath;
            if (!existsSync(saveDir)) mkdirSync(saveDir, { recursive: true });

            const filename = basename(new URL(modLink).pathname) || `${type}-${Date.now()}`;
            const filePath = join(saveDir, filename);

            const buffer = Buffer.from(await response.arrayBuffer());
            writeFileSync(filePath, buffer);

            this.logger.info(`Downloaded ${type} saved to: ${filePath}`);
            return filePath;
        } catch (error) {
            this.logger.error(`Error downloading ${type}: ` + error);
            throw error;
        }
    }


    public static async removeMod(fileName: string, type: "plugin" | "theme") {
        this.logger.info(`Removing ${type} file: ${fileName}`);

        switch (type) {
            case "plugin":
                if (this.isPluginInstalled(fileName)) {
                    unlinkSync(join(Properties.pluginsPath, fileName));
                    let enabledPlugins = JSON.parse(localStorage.getItem("enabledPlugins"));
                    if(enabledPlugins.includes(fileName)) {
                        enabledPlugins = enabledPlugins.filter((x:string) => x !== fileName);
                        localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
                    }
                }
                break;
            case "theme":
                if (this.isThemeInstalled(fileName)) {
                    if(localStorage.getItem("currentTheme") === fileName) {
                        localStorage.setItem("currentTheme", "Default");
                    }

                    document.getElementById("activeTheme").remove();
                    unlinkSync(join(Properties.themesPath, fileName));
                }
                break;
        }
    }

    public static isThemeInstalled(fileName: string) {
        const installedThemes = this.getInstalledThemes();
        return installedThemes.includes(fileName);
    }

    public static isPluginInstalled(fileName: string) {
        const installedPlugins = this.getInstalledPlugins();
        return installedPlugins.includes(fileName);
    }

    private static getInstalledThemes() {
        const dirPath = Properties.themesPath;
        return readdirSync(dirPath)
            .filter(file => statSync(join(dirPath, file)).isFile());
    }

    private static getInstalledPlugins() {
        const dirPath = Properties.pluginsPath;
        return readdirSync(dirPath)
            .filter(file => statSync(join(dirPath, file)).isFile());
    }
    
    // not sure if this is the best way to do this, but hey at least it works.
    public static togglePluginListener() {
        helpers.waitForElm("#enhanced > div:nth-child(3)").then(() => {
            this.logger.info("Listening to plugin checkboxes...");
            let pluginCheckboxes = document.getElementsByClassName("plugin") as HTMLCollectionOf<HTMLInputElement>
            
            for(let i = 0; i < pluginCheckboxes.length; i++) {
                pluginCheckboxes[i].addEventListener("click", () => {
                    pluginCheckboxes[i].classList.toggle("checked");
                    const pluginName = pluginCheckboxes[i].getAttribute('name');

                    if(pluginCheckboxes[i].classList.contains("checked")) {
                        this.loadPlugin(pluginName);
                    } else {
                        this.unloadPlugin(pluginName);

                        if(!document.getElementById("plugin-reload-warning")) {
                            this.logger.info("Plugin unloaded, adding reload warning.");
                            const container = document.querySelector("#enhanced > div:nth-child(3)");

                            const paragraph = document.createElement("p");
                            paragraph.id = "plugin-reload-warning";
                            paragraph.style.color = "white";
                            
                            const link = document.createElement("a");
                            link.style.color = "cyan";
                            link.textContent = "here";
                            link.setAttribute("onclick", "window.location.href = '/'");
                            
                            paragraph.appendChild(document.createTextNode("Reload is required to disable plugins. Click "));
                            paragraph.appendChild(link);
                            paragraph.appendChild(document.createTextNode(" to reload."));
                            
                            container.appendChild(paragraph);
                        }
                    }
                })
            }
        })
    }
    
    public static openThemesFolder() {
        helpers.waitForElm("#openthemesfolderBtn").then(() => {
            const button = document.getElementById("openthemesfolderBtn");
            button?.addEventListener("click", () => {
                this.openFolder(Properties.themesPath);
            });
        });
    }

    public static openPluginsFolder() {
        helpers.waitForElm("#openpluginsfolderBtn").then(() => {
            const button = document.getElementById("openpluginsfolderBtn");
            button?.addEventListener("click", () => {
                this.openFolder(Properties.pluginsPath);
            });
        });
    }

    private static openFolder(folderPath: string) {
        let command: string;

        switch (process.platform) {
            case "win32":
                command = `start "" "${folderPath}"`;
                break;
            case "darwin":
                command = `open "${folderPath}"`;
                break;
            default:
                command = `xdg-open "${folderPath}"`;
                break;
        }

        exec(command, (error) => {
            if (error) {
                console.error(`Failed to open folder: ${folderPath}`, error);
            }
        });
    }
        
    public static scrollListener() {
        helpers.waitForElm(".menu-xeE06 > div:nth-child(5) > div").then(() => {
            let enhanced = document.getElementById('enhanced');
            let enhancedNav = document.querySelector('.menu-xeE06 > div:nth-child(5) > div');

            enhancedNav.addEventListener("click", () => {
                document.querySelector("#enhanced > div").scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                Settings.activeSection(enhancedNav);
            })
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Settings.activeSection(enhancedNav);
                    } else {
                        enhancedNav.classList.remove("selected-S7SeK");
                    }
                });
            }, { threshold: 0.1 });
        
            observer.observe(enhanced);
        })
    }
    
    public static addApplyThemeFunction() {
        let applyThemeScript = getApplyThemeTemplate();
        let script = document.createElement("script");  
        script.innerHTML = applyThemeScript;
        
        document.body.appendChild(script);
    }
    
    public static async checkForItemUpdates(itemFile: string) {
        this.logger.info('Checking for updates for ' + itemFile);
        let pluginOrTheme:'theme'|'plugin';
        let itemBox = document.getElementsByName(`${itemFile}-box`)[0];
        if(!itemBox) return this.logger.warn(`${itemFile}-box element not found.`);

        if(itemFile.endsWith(".theme.css")) pluginOrTheme = "theme";
        else pluginOrTheme = "plugin";

        const itemPath = join(pluginOrTheme === "theme" ? properties.themesPath : properties.pluginsPath, itemFile);
        
        let installedItemMetaData:MetaData = helpers.extractMetadataFromFile(itemPath);
        if (installedItemMetaData && Object.keys(installedItemMetaData).length > 0) {
            let updateUrl = installedItemMetaData.updateUrl;
            if(updateUrl) {
                if(updateUrl == "none") return this.logger.info(`No update URL is provided in the metadata of ${pluginOrTheme} (${installedItemMetaData.name})`);
                let request = await fetch(updateUrl);
                let response = await request.text();
                
                if(request.status == 200) {
                    let extractedMetaData:MetaData = helpers.extractMetadataFromText(response);
                    if(extractedMetaData) {
                        if(extractedMetaData.version > installedItemMetaData.version) {
                            this.logger.info(`An update exists for ${pluginOrTheme} (${installedItemMetaData.name}). New version: ${extractedMetaData.version} | Current version: ${installedItemMetaData.version}`);

                            document.getElementById(`${itemFile}-update`).style.display = "flex";
                            document.getElementById(`${itemFile}-update`).addEventListener("click", () => {
                                writeFileSync(itemPath, response, 'utf-8');
                                Settings.removeItem(itemFile);
                                Settings.addItem(pluginOrTheme, itemFile, extractedMetaData);
                            })
                        } else this.logger.info(`No update available for ${pluginOrTheme} (${installedItemMetaData.name}). Current version: ${installedItemMetaData.version}`);
                    } else this.logger.warn(`Failed to extract metadata from response for ${pluginOrTheme} (${installedItemMetaData.name}). Possibly invalid updateUrl provided.`);
                }
            }
        }
    }
}
    
export default ModManager;