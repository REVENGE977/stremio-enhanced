import { ipcRenderer, shell } from "electron";
import ModManager from "../../../core/ModManager";
import { settingsBuilder } from "../settings/settingsBuilder";
import Properties from "../../../core/Properties";
import helpers from '../../../utils/Helpers';
import { getLogger } from "../../../utils/logger";
import { STORAGE_KEYS, SELECTORS, CLASSES, FILE_EXTENSIONS } from "../../../constants";
import { settingsAPI } from "../../api/settings";
import { pluginOptionsModal } from "../../../components/plugin-settings-modal/pluginSettingsModal";
import PluginSettingSchema from "../../../interfaces/PluginSettingSchema";

const logger = getLogger("ModController");

export const modController = {
    loadPlugin: (pluginName: string): void => {
        if (document.getElementById(pluginName)) return;

        const pluginContent = ModManager.getPluginContent(pluginName);
        if (!pluginContent) {
            logger.error(`Plugin file not found or empty: ${pluginName}`);
            return;
        }

        const pluginBaseName = pluginName.split(FILE_EXTENSIONS.PLUGIN)[0];

        const scopedScript = `
        (function() {
            const StremioEnhancedAPI = {
                logger: {
                    info: (message) => window.StremioEnhancedAPI.info('${pluginBaseName}', message),
                    warn: (message) => window.StremioEnhancedAPI.warn('${pluginBaseName}', message),
                    error: (message) => window.StremioEnhancedAPI.error('${pluginBaseName}', message)
                },
                getSetting: (key) => window.StremioEnhancedAPI.getSetting('${pluginBaseName}', key),
                saveSetting: (key, value) => window.StremioEnhancedAPI.saveSetting('${pluginBaseName}', key, value),
                registerSettings: (schema) => window.StremioEnhancedAPI.registerSettings('${pluginBaseName}', schema),
                onSettingsSaved: (callback) => window.StremioEnhancedAPI.onSettingsSaved('${pluginBaseName}', callback),
                
                showAlert: window.StremioEnhancedAPI.showAlert,
                showPrompt: (title, message, defaultValue) => window.StremioEnhancedAPI.showPrompt('${pluginBaseName}', title, message, defaultValue)
            };

            try {
                ${pluginContent}
            } catch (err) {
                console.error('[ModController] Plugin crashed: ${pluginName}', err);
            }
        })();
        `;

        const script = document.createElement("script");
        script.innerHTML = scopedScript;
        script.id = pluginName;
        document.body.appendChild(script);
        
        const enabledPlugins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]");
        if (!enabledPlugins.includes(pluginName)) {
            enabledPlugins.push(pluginName);
            localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
        }
        logger.info(`Plugin ${pluginName} loaded!`);
    },
    
    unloadPlugin: (pluginName: string): void => {
        document.getElementById(pluginName)?.remove();
        
        let enabledPlugins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]");
        enabledPlugins = enabledPlugins.filter((x: string) => x !== pluginName);
        localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
        
        logger.info(`Plugin ${pluginName} unloaded!`);
    },

    removeModUI: (fileName: string, type: "plugin" | "theme"): void => {
        ModManager.deleteModFile(fileName, type);

        if (type === "plugin") {
            let enabledPlugins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]");
            if (enabledPlugins.includes(fileName)) {
                enabledPlugins = enabledPlugins.filter((x: string) => x !== fileName);
                localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
            }
        } else if (type === "theme") {
            if (localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === fileName) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
            }
            document.getElementById("activeTheme")?.remove();
        }
    },

    bindTogglePluginListener: (): void => {
        helpers.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
            const pluginCheckboxes = document.getElementsByClassName("plugin") as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < pluginCheckboxes.length; i++) {
                pluginCheckboxes[i].addEventListener("click", () => {
                    pluginCheckboxes[i].classList.toggle(CLASSES.CHECKED);
                    const pluginName = pluginCheckboxes[i].getAttribute('name');
                    if (!pluginName) return;

                    if (pluginCheckboxes[i].classList.contains(CLASSES.CHECKED)) {
                        modController.loadPlugin(pluginName);
                    } else {
                        modController.unloadPlugin(pluginName);
                        settingsAPI.clearRegisteredSettings(pluginName.split(FILE_EXTENSIONS.PLUGIN)[0])
                        modController._showReloadWarning();
                    }
                });
            }
        }).catch(err => logger.error(`Failed to setup plugin listeners: ${err}`));
    },

    bindPluginOptionsListeners: (): void => {
        helpers.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
            const container = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
            if (!container) return;

            container.addEventListener('click', async (e) => {
                const target = e.target as HTMLElement;
                const settingsBtn = target.closest('[id$="-settings"]');

                if (settingsBtn) {
                    const btnId = settingsBtn.getAttribute('id');
                    if (!btnId) return;

                    const pluginName = btnId.replace('-settings', '');
                    const pluginBaseName = pluginName.split(FILE_EXTENSIONS.PLUGIN)[0]; 

                    const schema = await settingsAPI.getRegisteredSettings(pluginBaseName);
                    if (!schema) {
                        logger.warn(`No schema found for ${pluginBaseName}`);
                        return;
                    }

                    const currentValues: Record<string, any> = {};
                    for (const setting of schema) {
                        let userValue = await settingsAPI.getSetting(pluginBaseName, setting.key);
                        if (!userValue) userValue = setting.defaultValue;
                        currentValues[setting.key] = userValue;
                    }

                    const modalHtml = pluginOptionsModal.getTemplate(pluginName, schema, currentValues);
                    const modalId = `${pluginName.replace(/[^a-zA-Z0-9]/g, '')}-settings-modal`;
                    
                    document.getElementById(modalId)?.remove(); 

                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    const modalElement = document.getElementById(modalId);
                    if (!modalElement) return;

                    const toggles = modalElement.querySelectorAll('.plugin-setting-toggle');
                    toggles.forEach(toggle => {
                        toggle.addEventListener('click', () => {
                            toggle.classList.toggle(CLASSES.CHECKED);
                        });
                    });

                    const handleCloseAndSave = () => {
                        schema.forEach(async (setting: PluginSettingSchema) => {
                            let value: any;
                            const element = modalElement.querySelector(`[data-key="${setting.key}"]`);
                            
                            if (!element) return;

                            if (setting.type === 'toggle') {
                                value = element.classList.contains(CLASSES.CHECKED);
                            } else if (setting.type === 'input' || setting.type === 'select') {
                                value = (element as HTMLInputElement | HTMLSelectElement).value;
                            }

                            if (value !== undefined) {
                                let currentValue = await settingsAPI.getSetting(pluginBaseName, setting.key);
                                if(currentValue != value) settingsAPI.saveSetting(pluginBaseName, setting.key, value);
                            }
                        });

                        modalElement.remove();
                    };

                    modalElement.querySelector('.close-button-container-cmxAp')?.addEventListener('click', handleCloseAndSave);
                    document.getElementById(`${modalId}-close-btn`)?.addEventListener('click', handleCloseAndSave);
                }
            });
        }).catch(err => logger.error(`Failed to setup plugin options listeners: ${err}`));
    },

    bindFolderButtons: (): void => {
        helpers.waitForElm("#openthemesfolderBtn").then(() => {
            document.getElementById("openthemesfolderBtn")?.addEventListener("click", () => 
                ModManager.openFolder(Properties.themesPath));
        });

        helpers.waitForElm("#openpluginsfolderBtn").then(() => {
            document.getElementById("openpluginsfolderBtn")?.addEventListener("click", () => 
                ModManager.openFolder(Properties.pluginsPath));
        });
    },
        
    scrollListener: (): void => {
        helpers.waitForElm('div > div[title="Enhanced"]').then(() => {
            const enhanced = document.getElementById('enhanced');
            const enhancedNav = document.querySelector('div > div[title="Enhanced"]');
            if (!enhanced || !enhancedNav) return;

            enhancedNav.addEventListener("click", () => {
                document.querySelector("#enhanced > div")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                settingsBuilder.activeSection(enhancedNav);
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) settingsBuilder.activeSection(enhancedNav);
                    else enhancedNav.classList.remove(CLASSES.SELECTED);
                });
            }, { threshold: 0.1 });
        
            observer.observe(enhanced);
        });
    },
    
    checkForItemUpdatesUI: async (itemFile: string): Promise<void> => {
        const updateData = await ModManager.checkUpdateData(itemFile);
        if (!updateData) return;

        const type = itemFile.endsWith(FILE_EXTENSIONS.THEME) ? "theme" : "plugin";

        if (updateData.hasUpdate && updateData.newMetaData && updateData.newContent && updateData.installedMetaData) {
            const updateButton = document.getElementById(`${itemFile}-update`);
            if (!updateButton) return;

            updateButton.style.display = "flex";
            updateButton.addEventListener("click", async () => {
                
                // Warn about non-registry updates for plugins
                if (type === "plugin" && updateData.registryVersion !== updateData.newMetaData!.version) {
                    const result = await ipcRenderer.invoke(
                        'show-alert', "warning", "Confirm Update", 
                        `This update for ${updateData.installedMetaData!.name} version (v${updateData.newMetaData!.version}) isn't submitted to the registry (Community Marketplace) yet, and thus has not been confirmed safe.\n\nAre you sure you want to update? It's recommended to read the source code of the update before updating.`, 
                        ["Yes", "No", "View Source Code"]
                    );

                    if (result === 0) {
                        modController._applyUpdate(type, itemFile, updateData.newContent!, updateData.newMetaData!);
                    } else if (result === 2) {
                        shell.openExternal(updateData.updateUrl!);
                    }
                } else {
                    modController._applyUpdate(type, itemFile, updateData.newContent!, updateData.newMetaData!);
                }
            });
        }
    },

    _showReloadWarning: (): void => {
        if (document.getElementById("plugin-reload-warning")) return;
        
        const container = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
        if (!container) return;

        const paragraph = document.createElement("p");
        paragraph.id = "plugin-reload-warning";
        paragraph.style.color = "white";
        
        const link = document.createElement("a");
        link.style.color = "var(--primary-accent-color)";
        link.style.cursor = "pointer";
        link.style.fontWeight = "bold";
        link.textContent = "here";
        link.addEventListener("click", () => { location.reload(); });
        
        paragraph.appendChild(document.createTextNode("Reload is required to disable plugins. Click "));
        paragraph.appendChild(link);
        paragraph.appendChild(document.createTextNode(" to reload."));
        
        container.appendChild(paragraph);
    },

    _applyUpdate: (type: "plugin" | "theme", itemFile: string, newContent: string, newMetaData: any): void => {
        ModManager.saveModFile(itemFile, type, newContent);
        settingsBuilder.removeItem(itemFile);
        settingsBuilder.addItem(type, itemFile, newMetaData);
        logger.info("Update successful!");
    }
};