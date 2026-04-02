import { ipcRenderer, type IpcRendererEvent } from 'electron';
import { IPC_CHANNELS } from '../../constants';
import { type ExternalPlayer } from '../../interfaces/ExternalPlayerTypes';
import type {
    EmbeddedMpvCommand,
    EmbeddedMpvEnvironment,
    EmbeddedMpvStartPayload,
    EmbeddedMpvState,
} from '../../interfaces/EmbeddedMpv';

export const externalPlayerAPI = {
    launchExternalPlayer: (player: ExternalPlayer, streamUrl: string, customPath?: string): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, player, streamUrl, customPath);
    },
    getExternalPlayerPaths: (): Promise<{ vlc: string | null; mpv: string | null }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_EXTERNAL_PLAYER_PATHS);
    },
    startEmbeddedMpv: (payload: EmbeddedMpvStartPayload, customPath?: string): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.START_EMBEDDED_MPV, payload, customPath);
    },
    stopEmbeddedMpv: (): Promise<{ success: boolean }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.STOP_EMBEDDED_MPV);
    },
    sendEmbeddedMpvCommand: (command: EmbeddedMpvCommand): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.EMBEDDED_MPV_COMMAND, command);
    },
    getEmbeddedMpvState: (): Promise<EmbeddedMpvState> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_EMBEDDED_MPV_STATE);
    },
    getEmbeddedMpvEnvironment: (): Promise<EmbeddedMpvEnvironment> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_EMBEDDED_MPV_ENVIRONMENT);
    },
    setEmbeddedMpvPreference: (enabled: boolean): void => {
        ipcRenderer.send(IPC_CHANNELS.SET_EMBEDDED_MPV_PREFERENCE, enabled);
    },
    onEmbeddedMpvState: (listener: (state: EmbeddedMpvState) => void): (() => void) => {
        const handler = (_event: IpcRendererEvent, state: EmbeddedMpvState) => {
            listener(state);
        };

        ipcRenderer.on(IPC_CHANNELS.EMBEDDED_MPV_STATE, handler);

        return () => {
            ipcRenderer.removeListener(IPC_CHANNELS.EMBEDDED_MPV_STATE, handler);
        };
    },
};
