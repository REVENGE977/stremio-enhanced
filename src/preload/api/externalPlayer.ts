import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../constants';

export const externalPlayerAPI = {
    launchExternalPlayer: (player: string, streamUrl: string): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, player, streamUrl);
    },
    getExternalPlayerPaths: (): Promise<{ vlc: string | null; mpv: string | null }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_EXTERNAL_PLAYER_PATHS);
    },
};
