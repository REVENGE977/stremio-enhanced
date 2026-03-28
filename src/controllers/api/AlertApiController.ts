import { ipcMain } from 'electron';
import { ENHANCED_PLUGINS_API } from '../../constants';
import Helpers from '../../utils/Helpers';

export function setupPluginAlertAPI() {
    ipcMain.handle(ENHANCED_PLUGINS_API.SHOW_ALERT, async (_, alertType, title, message, buttons) => {
        const response = await Helpers.showAlert(alertType, title, message, buttons);
        return response;
    });
}