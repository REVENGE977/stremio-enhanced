import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../constants';

export const gpuRendererAPI = {
    setGpuRenderer: (renderer: string) => {
        return ipcRenderer.invoke(IPC_CHANNELS.SET_GPU_RENDERER, renderer);
    },
    getGpuRenderer: (): Promise<string> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_GPU_RENDERER);
    }
};