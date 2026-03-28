import { ipcMain } from 'electron';
import PluginOption from '../../interfaces/PluginSettingSchema';
import { ENHANCED_PLUGINS_API, FILE_EXTENSIONS } from '../../constants';
import Properties from '../../core/Properties';
import logger from '../../utils/logger';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const registeredPluginSchemas: Record<string, PluginOption[]> = {};

export function setupPluginSettingsAPI() {
    ipcMain.handle(ENHANCED_PLUGINS_API.GET_SETTING, (_, pluginFileName, key) => {
        let configFileExists = existsSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`);
        if(!configFileExists) {
            logger.warn(`No config found for plugin ${pluginFileName}`);
            writeFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, JSON.stringify({}));
            return Promise.reject(new Error(`No config found (${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG})!`));
        }

        let readConfig = readFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, 'utf-8');
        let jsonConfig = JSON.parse(readConfig);

        return jsonConfig[key] ?? null;
    });

    ipcMain.handle(ENHANCED_PLUGINS_API.GET_SETTINGS, (_, pluginFileName) => {
        let configFileExists = existsSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`);
        if(!configFileExists) {
            logger.warn(`No config found for plugin ${pluginFileName}`);
            writeFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, JSON.stringify({}));
            return Promise.reject(new Error(`No config found (${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG})!`));
        }

        let readConfig = readFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, 'utf-8');
        let jsonConfig = JSON.parse(readConfig);
        if(!jsonConfig) return {};

        return jsonConfig ?? {};
    });

    ipcMain.handle(ENHANCED_PLUGINS_API.SAVE_SETTING, (event, pluginFileName, key, value) => {
        if (typeof pluginFileName !== 'string' || typeof key !== 'string') return false;

        let configFileExists = existsSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`);
        if(!configFileExists) {
            logger.info(`No config found for plugin ${pluginFileName}. Creating new config file with setting ${key}.`);
            writeFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, JSON.stringify({}));
        }

        let readConfig = readFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, 'utf-8');

        let jsonConfig = JSON.parse(readConfig);
        if (!jsonConfig) jsonConfig = {};

        jsonConfig[key] = value;
        
        writeFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, JSON.stringify(jsonConfig, null, 2));

        const channel = `${ENHANCED_PLUGINS_API.ON_SETTINGS_SAVED}:${pluginFileName}`;
        event.sender.send(channel, jsonConfig);

        return true;
    });

    ipcMain.handle(ENHANCED_PLUGINS_API.REGISTER_SETTINGS, (_, pluginFileName, pluginSchema) => {
        if (typeof pluginFileName !== 'string' || !Array.isArray(pluginSchema)) {
            logger.error("Invalid plugin options schema received. Expected an array of options.");
            return Promise.reject(new Error("Invalid plugin options schema. Ensure it follows the correct structure."));
        }

        let pluginFile = existsSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN}`);
        if(!pluginFile) {
            logger.error(`Plugin file not found for registering options: ${pluginFileName}${FILE_EXTENSIONS.PLUGIN}`);
            return Promise.reject(new Error("Plugin file not found."));
        }

        let configFileExists = existsSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`);
        if(!configFileExists) {
            logger.info(`No config found for plugin ${pluginFileName}. Creating new config file.`);
            writeFileSync(`${Properties.pluginsPath}//${pluginFileName}${FILE_EXTENSIONS.PLUGIN_CONFIG}`, JSON.stringify({}));
        }
        
        if(registeredPluginSchemas[pluginFileName]) {
            return Promise.reject("This plugin already has a settings schema registered!");
        }

        registeredPluginSchemas[pluginFileName] = pluginSchema;
        logger.info(`Registered options for plugin ${pluginFileName}: ${JSON.stringify(pluginSchema)}`);
        
        return true;
    });

    ipcMain.handle(ENHANCED_PLUGINS_API.CLEAR_REGISTERED_SETTINGS, (_, pluginFileName) => {
        if(registeredPluginSchemas[pluginFileName]) {
            delete registeredPluginSchemas[pluginFileName];
            return true;
        }

        return false;
    });

    ipcMain.handle(ENHANCED_PLUGINS_API.GET_REGISTERED_SETTINGS, (_, pluginFileName) => {
        if (typeof pluginFileName !== 'string') {
            logger.error("Invalid plugin file name received for getting options.");
            return Promise.reject("Invalid plugin file name.");
        }
        
        return registeredPluginSchemas[pluginFileName] || null;
    });
}