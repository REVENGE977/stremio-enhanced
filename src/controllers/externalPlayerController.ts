import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import { getLogger } from '../utils/logger';
import { IPC_CHANNELS } from '../constants';
import { VALID_EXTERNAL_PLAYERS, type ExternalPlayer } from '../interfaces/ExternalPlayerTypes';
import { getDetectedPlayerPaths, resolvePlayerPath } from '../utils/PlayerBinaryResolver';

const logger = getLogger("ExternalPlayerController");

export const externalPlayerController = {
    initIPC: () => {
        ipcMain.handle(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, (_, player: string, streamUrl: string, customPath?: string) => {
            if (!VALID_EXTERNAL_PLAYERS.includes(player as ExternalPlayer) || player === 'disabled') {
                logger.error(`Invalid external player: ${player}`);
                return { success: false, error: `Invalid player: ${player}` };
            }

            const playerPath = resolvePlayerPath(player as 'vlc' | 'mpv', customPath);
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
            return getDetectedPlayerPaths();
        });
    }
};
