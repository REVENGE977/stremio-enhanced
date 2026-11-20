import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../constants';

export const gpuRendererAPI = {
    setHardwareAcceleration: (enabled: boolean): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.SET_HARDWARE_ACCELERATION, enabled);
    },
    getHardwareAcceleration: (): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_HARDWARE_ACCELERATION);
    }
};