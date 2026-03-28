import { homedir } from "os";
import { shell } from "electron"
import { readFileSync, writeFileSync } from "fs";
import helpers from '../utils/Helpers';
import { getLogger } from "../utils/logger";
import { join } from "path";
import { getUpdateModalTemplate } from "../components/update-modal/updateModal";
import { URLS } from "../constants";

class Updater {
    private static logger = getLogger("Updater");
    private static versionCache: string | null = null;

    /**
     * Check for updates and show update modal if available
     * @param showNoUpdatePrompt - Whether to show a message if no update is available
     */
    public static async checkForUpdates(showNoUpdatePrompt: boolean): Promise<boolean> {
        try {
            const latestVersion = await this.getLatestVersion();
            const currentVersion = this.getCurrentVersion();
            
            if (helpers.isNewerVersion(latestVersion, currentVersion)) {
                this.logger.info(`Update available: v${latestVersion} (current: v${currentVersion})`);
                
                const modalsContainer = document.getElementsByClassName("modals-container")[0];
                if (modalsContainer) {
                    modalsContainer.innerHTML = await getUpdateModalTemplate(currentVersion, latestVersion);
                    
                    let downloadBtn = document.getElementById("download-update")
                    downloadBtn?.addEventListener("click", () => {
                        this.downloadAndExecuteUpdate(downloadBtn as HTMLElement);
                    })
                }
                return true;
            } else if (showNoUpdatePrompt) {
                await helpers.showAlert(
                    "info", 
                    "No update available!", 
                    `You're running the latest version (v${currentVersion}).`, 
                    ["OK"]
                );
            }
            return false;
        } catch (error) {
            this.logger.error(`Failed to check for updates: ${(error as Error).message}`);
            if (showNoUpdatePrompt) {
                await helpers.showAlert(
                    "error",
                    "Update check failed",
                    "Could not check for updates. Please check your internet connection.",
                    ["OK"]
                );
            }
            return false;
        }
    }

    /**
     * Fetch the latest version from GitHub
     */
    public static async getLatestVersion(): Promise<string> {
        const response = await fetch(URLS.VERSION_CHECK);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const version = (await response.text()).trim();
        this.logger.info(`Latest version available: v${version}`);
        return version;
    }

    /**
     * Get the current installed version
     */
    public static getCurrentVersion(): string {
        if (this.versionCache) {
            return this.versionCache;
        }
        
        try {
            this.versionCache = readFileSync(
                join(__dirname, "../", "../", "version"), 
                "utf-8"
            ).trim();
            return this.versionCache;
        } catch (error) {
            this.logger.error(`Failed to read version file: ${(error as Error).message}`);
            return "0.0.0";
        }
    }

    /**
     * Fetch release notes from GitHub API
     */
    public static async getReleaseNotes(): Promise<string> {
        try {
            const response = await fetch(URLS.RELEASES_API);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.body || "No release notes available.";
        } catch (error) {
            this.logger.error(`Failed to fetch release notes: ${(error as Error).message}`);
            return "Could not load release notes.";
        }
    }

    public static async downloadAndExecuteUpdate(btnElement: HTMLElement): Promise<void> {
        try {
            btnElement.innerText = "Finding Download...";
            btnElement.style.pointerEvents = "none";

            const asset = await this.getDownloadUrl();
            if (!asset) {
                throw new Error("Could not find a valid download for your Operating System.");
            }

            this.logger.info(`Downloading update: ${asset.name}...`);
            btnElement.innerText = "Downloading...";
            
            const downloadsPath = join(homedir(), 'Downloads');
            const filePath = join(downloadsPath, asset.name);

            const response = await fetch(asset.url);
            if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
            
            const buffer = Buffer.from(await response.arrayBuffer());
            writeFileSync(filePath, buffer);

            this.logger.info(`Download complete: ${filePath}`);
            btnElement.innerText = "Downloaded!";

            const isSetupOrMac = asset.name.includes("Setup") || asset.name.endsWith(".dmg");

            if (isSetupOrMac) {
                this.logger.info("Installer or DMG detected. Executing/Mounting...");
                shell.openPath(filePath); 
            } else {
                this.logger.info("Non-setup file detected. Highlighting in file explorer...");
                shell.showItemInFolder(filePath); 
            }

        } catch (error) {
            this.logger.error(`Update failed: ${(error as Error).message}`);
            btnElement.innerText = "Download Failed";
            btnElement.style.pointerEvents = "auto";
        }
    }

    private static async getDownloadUrl(): Promise<{ url: string, name: string } | null> {
        try {
            const response = await fetch(URLS.RELEASES_API);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            const data = await response.json();
            const assets = data.assets;
            
            const currentPlatform = process.platform;
            const currentArch = process.arch;
            
            let targetAsset;

            if (currentPlatform === "win32") {
                targetAsset = assets.find((a: any) => a.name.includes("Setup") && a.name.endsWith(".exe")) 
                           || assets.find((a: any) => a.name.endsWith(".exe"));
            } 
            else if (currentPlatform === "darwin") {
                if (currentArch === "arm64") {
                    targetAsset = assets.find((a: any) => a.name.includes("arm64") && a.name.endsWith(".dmg"));
                } else {
                    targetAsset = assets.find((a: any) => !a.name.includes("arm64") && a.name.endsWith(".dmg"));
                }
            } 
            else if (currentPlatform === "linux") {
                if (currentArch === "arm64") {
                    targetAsset = assets.find((a: any) => a.name.includes("arm64") && a.name.endsWith(".AppImage"));
                } else {
                    targetAsset = assets.find((a: any) => !a.name.includes("arm64") && a.name.endsWith(".AppImage"));
                }
            }

            if (targetAsset) {
                return { url: targetAsset.browser_download_url, name: targetAsset.name };
            }
            return null;

        } catch (error) {
            this.logger.error(`Failed to fetch release assets: ${(error as Error).message}`);
            return null;
        }
    }
}

export default Updater;
