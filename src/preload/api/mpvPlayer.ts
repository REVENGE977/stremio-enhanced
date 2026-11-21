import { ipcRenderer } from 'electron';
import { ENHANCED_API } from '../../constants';

export const mpvPlayerAPI = {
    isAvailable: (): boolean => {
        return Boolean(ipcRenderer.sendSync(ENHANCED_API.MPV.IS_AVAILABLE));
    },
    getBackendInfo: () => {
        return ipcRenderer.invoke(ENHANCED_API.MPV.BACKEND_INFO);
    },
    command: (...args: (string | number | boolean)[]) => {
        ipcRenderer.send(ENHANCED_API.MPV.COMMAND, ...args);
    },
    setProperty: (property: string, value: string | number | boolean) => {
        ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, property, value);
    },
    getProperty: (property: string): string | null => {
        return ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, property);
    },
    stop: () => {
        ipcRenderer.send(ENHANCED_API.MPV.STOP);
    },
};
