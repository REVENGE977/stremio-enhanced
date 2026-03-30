import { STORAGE_KEYS } from '../../constants';
import { externalPlayerAPI } from '../api/externalPlayer';
import { type ExternalPlayer } from '../../interfaces/ExternalPlayerTypes';
import PlaybackState from '../../utils/PlaybackState';
import Helpers from '../../utils/Helpers';
import { getLogger } from '../../utils/logger';

const logger = getLogger("ExternalPlayerInterceptor");

let isLaunching = false;

export function checkExternalPlayer(): void {
    if (isLaunching) return;
    const externalPlayer = localStorage.getItem(STORAGE_KEYS.EXTERNAL_PLAYER);
    if (!externalPlayer || externalPlayer === 'disabled') return;
    if (!location.href.includes('#/player')) return;

    launchExternal(externalPlayer as ExternalPlayer);
}

async function launchExternal(player: ExternalPlayer): Promise<void> {
    isLaunching = true;
    try {
        logger.info(`External player interceptor triggered for ${player}`);

        const playerState = await PlaybackState.getPlayerState();
        if (!playerState?.stream?.content?.url) {
            logger.error("Could not retrieve stream URL for external player.");
            Helpers.createToast("extPlayerError", "External Player", "Could not get stream URL.", "fail");
            return;
        }

        const streamUrl = playerState.stream.content.url;
        logger.info(`Launching ${player} with stream URL: ${streamUrl}`);

        // Navigate back before launching to prevent the built-in player from loading
        history.back();

        const result = await externalPlayerAPI.launchExternalPlayer(player, streamUrl);
        if (result.success) {
            Helpers.createToast("extPlayerLaunch", "External Player", `Opening stream in ${player.toUpperCase()}...`, "success");
        } else {
            Helpers.createToast("extPlayerError", "External Player", result.error ?? "Failed to launch player.", "fail");
        }
    } finally {
        isLaunching = false;
    }
}
