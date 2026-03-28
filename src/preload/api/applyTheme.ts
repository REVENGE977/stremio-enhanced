import Properties from "../../core/Properties";
import { getLogger } from "../../utils/logger";
import { STORAGE_KEYS } from "../../constants";
import { alertAPI } from "./alert";
import ExtractMetaData from "../../utils/ExtractMetaData";
import { join } from "path";

const logger = getLogger("applyThemeAPI");

export const applyThemeAPI = {
    applyTheme: async (theme: string) => {
        logger.info("Attempting to apply " + theme);

        if (theme !== "Default") {
            const themePath = join(Properties.themesPath, theme);
            const themeMetaData = ExtractMetaData.extractMetadataFromFile(themePath);

            if (themeMetaData && themeMetaData.requirements && themeMetaData.requirements.length > 0) {
                const enabledPlugins: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]");
                const missingPlugins = themeMetaData.requirements.filter(req => !enabledPlugins.includes(req));

                if (missingPlugins.length > 0) {
                    const formattedList = missingPlugins.map(p => `• ${p}`).join("\n");
                    
                    await alertAPI.showAlert(
                        "warning",
                        "Missing Required Plugins",
                        `The theme "${themeMetaData.name || theme}" requires the following plugins to be installed and enabled first:\n\n${formattedList}`,
                        ["OK"]
                    );
                    
                    logger.warn(`Aborted applying ${theme}. Missing: ${missingPlugins.join(", ")}`);
                    return; 
                }
            }
        }
        
        const activeThemeElement = document.getElementById("activeTheme");
        if (activeThemeElement) {
            activeThemeElement.remove();
        }

        if (theme !== "Default") {      
            const themeElement = document.createElement("link");
            themeElement.id = "activeTheme";
            themeElement.rel = "stylesheet";
            themeElement.href = `${Properties.themesPath}/${theme}`;

            document.head.appendChild(themeElement);
        }

        const currentTheme = localStorage.getItem("currentTheme");
        if (currentTheme) {
            logger.info("Disabling " + currentTheme + " as an active theme");

            const currentThemeElement = document.getElementById(currentTheme);
            if (currentThemeElement) {
                currentThemeElement.classList.remove("disabled");

                if (currentTheme !== "Default") {
                    currentThemeElement.classList.remove("uninstall-button-container-oV4Yo");
                    currentThemeElement.classList.add("install-button-container-yfcq5");   
                } else {
                    currentThemeElement.style.backgroundColor = "var(--secondary-accent-color)";
                }

                currentThemeElement.innerText = "Apply";
            }
        }

        localStorage.setItem("currentTheme", theme);
        logger.info("Disabling " + theme + " as an active theme");

        const newThemeElement = document.getElementById(theme);
        if (newThemeElement) {
            newThemeElement.classList.add("disabled");

            if (theme !== "Default") {
                newThemeElement.classList.remove("install-button-container-yfcq5");
                newThemeElement.classList.add("uninstall-button-container-oV4Yo");
            } else {
                newThemeElement.style.backgroundColor = "var(--overlay-color)";
            }

            newThemeElement.innerText = "Applied";
        }

        logger.info(`${theme} applied!`);
    },
};