import TemplateCache from '../../utils/templateCache';
import PluginSettingSchema from '../../interfaces/PluginSettingSchema';
import { FILE_EXTENSIONS } from '../../constants';

export const pluginOptionsModal = {
    
    getTemplate: (
        pluginName: string, 
        schema: PluginSettingSchema[], 
        currentValues: Record<string, any>
    ): string => {
        let template = TemplateCache.load(__dirname, 'plugin-settings-modal');
        const modalId = `${pluginName.replace(/[^a-zA-Z0-9]/g, '')}-settings-modal`;

        let settingsHtml = '';
        schema.forEach(setting => {
            const currentValue = currentValues[setting.key] ?? '';
            
            if (setting.type === 'toggle') {
                settingsHtml += pluginOptionsModal._buildToggle(setting, currentValue);
            } else if (setting.type === 'input') {
                settingsHtml += pluginOptionsModal._buildInput(setting, currentValue);
            } else if (setting.type === 'select') {
                settingsHtml += pluginOptionsModal._buildSelect(setting, currentValue);
            }
        });

        return template
            .replace(/\{\{\s*modalId\s*\}\}/g, modalId)
            .replace(/\{\{\s*pluginName\s*\}\}/g, pluginName.replace(FILE_EXTENSIONS.PLUGIN, ""))
            .replace(/\{\{\s*settingsHtml\s*\}\}/g, settingsHtml);
    },

    _buildToggle: (setting: PluginSettingSchema, currentValue: any): string => {
        const isChecked = currentValue === true || currentValue === "true";
        const checkedClass = isChecked ? 'checked' : '';

        return `
        <div class="option-vFOAS" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div class="heading-dYMDt" style="flex: 1; padding-right: 20px; min-width: 0;">
                <div class="label-qI6Vh" style="font-size: 1.1em; white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.4;">${setting.label}</div>
                ${setting.description ? `<div style="font-size: 0.85em; color: #a0a0a0; margin-top: 4px; white-space: normal; line-height: 1.4;">${setting.description}</div>` : ''}
            </div>
            <div class="content-P2T0i" style="flex-shrink: 0;">
                <div tabindex="0" class="toggle-container-lZfHP button-container-zVLH6 plugin-setting-toggle ${checkedClass}" data-key="${setting.key}" style="outline: none;">
                    <div class="toggle-toOWM"></div>
                </div>
            </div>
        </div>`;
    },

    _buildInput: (setting: PluginSettingSchema, currentValue: any): string => {
            return `
            <div class="option-vFOAS" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div class="heading-dYMDt" style="flex: 1; padding-right: 20px; min-width: 0;">
                    <div class="label-qI6Vh" style="font-size: 1.1em; white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.4;">${setting.label}</div>
                    ${setting.description ? `<div style="font-size: 0.85em; color: #a0a0a0; margin-top: 4px; white-space: normal; line-height: 1.4;">${setting.description}</div>` : ''}
                </div>
                
                <div class="content-P2T0i" style="flex-shrink: 0; width: 50%; max-width: 300px;">
                    <label class="search-bar-k7MXd search-bar-container-p4tSt" style="width: 100%; padding: 0; margin: 0; display: block;">
                        <input data-key="${setting.key}" size="1" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="0" class="search-input-bAgAh text-input-hnLiz plugin-setting-input" type="text" placeholder="${setting.label}" value="${currentValue}" style="width: 100%; box-sizing: border-box; height: 42px; padding: 0 15px;">
                    </label>
                </div>
            </div>`;
    },

    _buildSelect: (setting: PluginSettingSchema, currentValue: any): string => {
        let optionsHtml = '';
        if (setting.options) {
            setting.options.forEach((opt: { label: string; value: any }) => {
                const selected = (opt.value === currentValue) ? 'selected' : '';
                optionsHtml += `<option value="${opt.value}" ${selected} style="background-color: #1a1a1a; color: white;">${opt.label}</option>`;
            });
        }

        return `
        <div class="option-vFOAS" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div class="heading-dYMDt" style="flex: 1; padding-right: 20px; min-width: 0;">
                <div class="label-qI6Vh" style="font-size: 1.1em; white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.4;">${setting.label}</div>
                ${setting.description ? `<div style="font-size: 0.85em; color: #a0a0a0; margin-top: 4px; white-space: normal; line-height: 1.4;">${setting.description}</div>` : ''}
            </div>
            
            <div class="content-P2T0i" style="flex-shrink: 0; width: 50%; max-width: 300px;">
                <select data-key="${setting.key}" class="search-input-bAgAh text-input-hnLiz plugin-setting-select" style="width: 100%; padding: 0 15px; cursor: pointer; background-color: rgba(255, 255, 255, 0.08); color: white; border: 1px solid transparent; border-radius: 20px; outline: none; appearance: auto; box-sizing: border-box; height: 42px;">
                    ${optionsHtml}
                </select>
            </div>
        </div>`;
    }
};