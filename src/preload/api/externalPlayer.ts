import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../constants';
import { type ExternalPlayer } from '../../interfaces/ExternalPlayerTypes';

export const externalPlayerAPI = {
    launchExternalPlayer: (player: ExternalPlayer, streamUrl: string, customPath?: string, subtitles?: { url: string; lang: string }[]): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, player, streamUrl, customPath, subtitles);
    },
    getExternalPlayerPaths: (): Promise<{ vlc: string | null; mpv: string | null }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_EXTERNAL_PLAYER_PATHS);
    },
};
