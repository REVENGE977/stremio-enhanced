import { ipcRenderer } from 'electron';
import { ENHANCED_API } from '../../constants';

export const mpvPlayerAPI = {
    attach: (left: number, top: number, width: number, height: number) => {
        return ipcRenderer.sendSync(ENHANCED_API.MPV.ATTACH, left, top, width, height);
    },
    resize: (x: number, y: number, width: number, height: number) => {
        ipcRenderer.send(ENHANCED_API.MPV.RESIZE, x, y, width, height);
    },
    command: (...args:string[]) => {
        ipcRenderer.send(ENHANCED_API.MPV.COMMAND, ...args);
    },
    setProperty: (property: string, value: string) => {
        ipcRenderer.send(ENHANCED_API.MPV.SET_PROPERTY, property, value);
    },
    getProperty: (property: string) => {
        return ipcRenderer.sendSync(ENHANCED_API.MPV.GET_PROPERTY, property);
    }
}