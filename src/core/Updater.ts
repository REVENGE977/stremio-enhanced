import { readFileSync } from "fs";
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
                    modalsContainer.innerHTML = await getUpdateModalTemplate();
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
}

export default Updater;
