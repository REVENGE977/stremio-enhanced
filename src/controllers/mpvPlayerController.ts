import { ipcMain } from 'electron';
import { mainWindow, mpvPlayer } from '../main';
import { ENHANCED_API } from '../constants';

export const mpvPlayerController = {
    initIPC: () => {
        ipcMain.on(ENHANCED_API.MPV_ATTACH, (event, left, top, width, height) => {
            const handle = mainWindow?.getNativeWindowHandle();
            event.returnValue = mpvPlayer?.attach(handle!, left, top, width, height);
        });
        
        ipcMain.on(ENHANCED_API.MPV_RESIZE, (_event, x, y, width, height) => {
            mpvPlayer?.resize(x, y, width, height);
        });
        
        ipcMain.on(ENHANCED_API.MPV_COMMAND, (_event, ...args) => {
            mpvPlayer?.command(...args);
        });
        
        ipcMain.on(ENHANCED_API.MPV_SET_PROPERTY, (_event, name, value) => {
            mpvPlayer?.property(name, value);
        });
        
        ipcMain.on(ENHANCED_API.MPV_GET_PROPERTY, (event, name) => {
            event.returnValue = mpvPlayer?.getRawProperty(name);
        });
    }
}