import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import { existsSync } from 'fs';
import { getLogger } from '../utils/logger';
import { IPC_CHANNELS } from '../constants';
import { VALID_EXTERNAL_PLAYERS, type ExternalPlayer } from '../interfaces/ExternalPlayerTypes';

const logger = getLogger("ExternalPlayerController");

// Common install paths per platform
const PLAYER_PATHS: Record<string, Record<string, string[]>> = {
    win32: {
        vlc: [
            'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
            'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
        ],
        mpv: [
            'C:\\Program Files\\mpv\\mpv.exe',
            'C:\\Program Files (x86)\\mpv\\mpv.exe',
        ],
    },
    darwin: {
        vlc: ['/Applications/VLC.app/Contents/MacOS/VLC'],
        mpv: ['/usr/local/bin/mpv', '/opt/homebrew/bin/mpv'],
    },
    linux: {
        vlc: ['/usr/bin/vlc'],
        mpv: ['/usr/bin/mpv'],
    },
};

function findPlayerPath(player: 'vlc' | 'mpv'): string | null {
    const platform = process.platform;
    const paths = PLAYER_PATHS[platform]?.[player] ?? [];
    for (const p of paths) {
        if (existsSync(p)) return p;
    }
    return null;
}

export const externalPlayerController = {
    initIPC: () => {
        ipcMain.handle(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, (_, player: string, streamUrl: string, customPath?: string) => {
            if (!VALID_EXTERNAL_PLAYERS.includes(player as ExternalPlayer) || player === 'disabled') {
                logger.error(`Invalid external player: ${player}`);
                return { success: false, error: `Invalid player: ${player}` };
            }

            const playerPath = customPath || findPlayerPath(player as 'vlc' | 'mpv');
            if (!playerPath) {
                logger.error(`${player} not found at any known path.`);
                return { success: false, error: `${player} not found. Please install it or set a custom path in settings.` };
            }

            logger.info(`Launching ${player} at ${playerPath} with URL: ${streamUrl}`);
            const child = execFile(playerPath, [streamUrl], (err) => {
                if (err) logger.error(`Failed to launch ${player}: ${err.message}`);
            });
            child.unref();
            return { success: true };
        });

        ipcMain.handle(IPC_CHANNELS.GET_EXTERNAL_PLAYER_PATHS, () => {
            return {
                vlc: findPlayerPath('vlc'),
                mpv: findPlayerPath('mpv'),
            };
        });
    }
};
