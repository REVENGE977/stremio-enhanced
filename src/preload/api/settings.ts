import { ipcRenderer } from 'electron';
import PluginOption from '../../interfaces/PluginSettingSchema';
import { ENHANCED_PLUGINS_API } from "../../constants";
import { getLogger } from "../../utils/logger";
import { FILE_EXTENSIONS } from '../../constants';

const logger = getLogger("settingsAPI");
    
function isValidPluginSchema(schema: any): schema is PluginOption[] {
    if (!Array.isArray(schema)) return false;

    return schema.every(item => {
        if (typeof item !== 'object' || item === null) return false;

        if (typeof item.key !== 'string' || item.key.trim() === '') return false;
        if (typeof item.label !== 'string') return false;
        
        const validTypes = ['input', 'toggle', 'select'];
        if (!validTypes.includes(item.type)) return false;

        if (item.description !== undefined && typeof item.description !== 'string') return false;
        
        if (item.type === 'select') {
            if (!Array.isArray(item.options)) return false;
            
            const validOptions = item.options.every((opt: any) => 
                typeof opt === 'object' && opt !== null && typeof opt.label === 'string' && 'value' in opt
            );
            if (!validOptions) return false;
        }

        return true;
    });
}

export const settingsAPI = {
    getSetting: (pluginFileName: string, key: string) => {
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.GET_SETTING, pluginFileName, key);
    },
    getSettings: (pluginFileName: string) => {
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.GET_SETTINGS, pluginFileName);
    },
    saveSetting: (pluginFileName: string, key: string, value: any) => {
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.SAVE_SETTING, pluginFileName, key, value);
    },
    registerSettings: (pluginFileName: string, pluginSchema: PluginOption[]) => {
        if(!isValidPluginSchema(pluginSchema)) {
            logger.error(`Invalid plugin options schema provided by ${pluginFileName}. Registration failed.`);
            return Promise.reject(new Error("Invalid plugin options schema. Ensure it follows the correct structure."));
        }
                
        let optionsBtn = document.getElementById(`${pluginFileName}${FILE_EXTENSIONS.PLUGIN}-settings`);
        if(optionsBtn) {
            optionsBtn.style.display = 'flex';
        }
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.REGISTER_SETTINGS, pluginFileName, pluginSchema);
    },
    getRegisteredSettings: (pluginFileName: string) => {
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.GET_REGISTERED_SETTINGS, pluginFileName);
    },
    clearRegisteredSettings: (pluginFileName: string) => {
        return ipcRenderer.invoke(ENHANCED_PLUGINS_API.CLEAR_REGISTERED_SETTINGS, pluginFileName);
    },
    onSettingsSaved: (pluginFileName: string, callback: (newSettings: any) => void) => {
        const channel = `${ENHANCED_PLUGINS_API.ON_SETTINGS_SAVED}:${pluginFileName}`;
        
        ipcRenderer.removeAllListeners(channel);
        
        ipcRenderer.on(channel, (_event, newSettings) => {
            callback(newSettings);
        });
    }
};