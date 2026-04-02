import Helpers from "../../utils/Helpers";
import PlaybackState from "../../utils/PlaybackState";
import DiscordPresence from "../../core/DiscordPresence";
import type PlayerState from "../../interfaces/PlayerState";
import { STORAGE_KEYS } from "../../constants";
import { isEmbeddedMpvPlaybackMode } from "../../interfaces/ExternalPlayerTypes";
import { externalPlayerAPI } from "../api/externalPlayer";
import { getEmbeddedPlaybackContext } from './embeddedOverlayController';
import { isManagedPlaybackRouteHash, isNativePlayerRouteHash } from './playbackRoutes';

let embeddedPollId: number | null = null;
let trackedVideo: HTMLVideoElement | null = null;
let trackedPlayingHandler: (() => void) | null = null;
let trackedPauseHandler: (() => void) | null = null;

function getPlaybackLabel(playerState: PlayerState, prefix: string): string {
    if (playerState.metaDetails.type !== "series" || !playerState.seriesInfoDetails) {
        return prefix;
    }

    const { episode, season } = playerState.seriesInfoDetails;
    const isKitsu = playerState.metaDetails.id.startsWith("kitsu:");
    return `${prefix} ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`;
}

function stopEmbeddedPolling(): void {
    if (embeddedPollId !== null) {
        window.clearInterval(embeddedPollId);
        embeddedPollId = null;
    }
}

function detachTrackedVideo(): void {
    if (trackedVideo && trackedPlayingHandler) {
        trackedVideo.removeEventListener('playing', trackedPlayingHandler);
    }

    if (trackedVideo && trackedPauseHandler) {
        trackedVideo.removeEventListener('pause', trackedPauseHandler);
    }

    trackedVideo = null;
    trackedPlayingHandler = null;
    trackedPauseHandler = null;
}

async function syncEmbeddedPresence(): Promise<void> {
    if (!isManagedPlaybackRouteHash()) {
        stopEmbeddedPolling();
        return;
    }

    if (!isEmbeddedMpvPlaybackMode(localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE))) {
        stopEmbeddedPolling();
        return;
    }

    const [mpvState, playerState] = await Promise.all([
        externalPlayerAPI.getEmbeddedMpvState(),
        PlaybackState.getPlayerState(),
    ]);

    const playbackContext = getEmbeddedPlaybackContext() ?? playerState;
    if (!mpvState.active || !playbackContext) {
        return;
    }

    if (mpvState.paused || mpvState.eofReached) {
        DiscordPresence.setPaused(
            playbackContext.metaDetails.name,
            `Paused at ${Helpers.formatTime(mpvState.timePos)}` + (playbackContext.metaDetails.type === 'series' ? ` in ${getPlaybackLabel(playbackContext, '').trim()}` : ''),
            playbackContext.metaDetails.poster,
        );
        return;
    }

    const startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(mpvState.timePos);
    const endTimestamp = startTimestamp + Math.max(1, Math.floor(mpvState.duration));
    const stateStr = playbackContext.metaDetails.type === 'series'
        ? `Watching ${getPlaybackLabel(playbackContext, '').trim()}`
        : 'Watching';

    DiscordPresence.setPlaying(
        playbackContext.metaDetails.name,
        stateStr,
        startTimestamp,
        endTimestamp,
        playbackContext.metaDetails.poster,
    );
}

export const discordTracker = {
    
    init: () => {
        window.addEventListener('hashchange', discordTracker.handleNavigation);
        discordTracker.handleNavigation();
    },

    stop: () => {
        window.removeEventListener('hashchange', discordTracker.handleNavigation);
        stopEmbeddedPolling();
        detachTrackedVideo();
    },

    handleNavigation: () => {
        discordTracker._checkWatching();
        discordTracker._checkExploring();
        discordTracker._checkMainMenu();
    },

    _checkWatching: async () => {
        if (!isManagedPlaybackRouteHash()) {
            stopEmbeddedPolling();
            detachTrackedVideo();
            return;
        }

        if (isEmbeddedMpvPlaybackMode(localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE))) {
            detachTrackedVideo();

            if (embeddedPollId === null) {
                void syncEmbeddedPresence();
                embeddedPollId = window.setInterval(() => {
                    void syncEmbeddedPresence();
                }, 5000);
            }

            return;
        }

        stopEmbeddedPolling();

        if (!isNativePlayerRouteHash()) {
            detachTrackedVideo();
            return;
        }
        
        try {
            await Helpers.waitForElm('video');
            const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
            if (!video) return;

            if (trackedVideo === video) {
                return;
            }

            detachTrackedVideo();

            const playerState = await PlaybackState.getPlayerState();
            if (!playerState) return;
            const { metaDetails } = playerState;

            trackedPlayingHandler = () => {
                const startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(video.currentTime);
                const endTimestamp = startTimestamp + Math.floor(video.duration);
                
                if (metaDetails.type === "series") {
                    const { episode, season } = playerState.seriesInfoDetails!;
                    const isKitsu = metaDetails.id.startsWith("kitsu:");
                    const stateStr = `Watching ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`;
                    
                    DiscordPresence.setPlaying(metaDetails.name, stateStr, startTimestamp, endTimestamp, metaDetails.poster);
                } else if (metaDetails.type === "movie") {
                    DiscordPresence.setPlaying(metaDetails.name, 'Watching', startTimestamp, endTimestamp, metaDetails.poster);
                }
            };
            
            trackedPauseHandler = async () => {
                const currentState = await PlaybackState.getPlayerState();
                if (!currentState) return;
                
                const pausedMeta = currentState.metaDetails;
                const formattedTime = Helpers.formatTime(video.currentTime);

                if (pausedMeta.type === "series") {
                    const { episode, season } = currentState.seriesInfoDetails!;
                    const isKitsu = pausedMeta.id.startsWith("kitsu:");
                    const stateStr = `Paused at ${formattedTime} in ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`;
                    
                    DiscordPresence.setPaused(pausedMeta.name, stateStr, pausedMeta.poster);
                } else if (pausedMeta.type === "movie") {
                    DiscordPresence.setPaused(pausedMeta.name, `Paused at ${formattedTime}`, pausedMeta.poster);
                }
            };
            
            trackedVideo = video;
            video.addEventListener('playing', trackedPlayingHandler);
            video.addEventListener('pause', trackedPauseHandler);
        } catch (error) {
            console.error(error);
        }
    },

    _checkExploring: async () => {
        if (!location.href.includes("#/detail")) return;
        
        try {
            await Helpers.waitForElm('.metadetails-container-K_Dqa');
            const metaDetails = await PlaybackState.getMetaDetails();
            if (!metaDetails) return;

            await Helpers.waitForElm('.description-container-yi8iU');
            DiscordPresence.setExploring(metaDetails.name, metaDetails.poster);
        } catch (error) {
            console.error(error);
        }
    },

    _checkMainMenu: () => {
        const hashToActivity: Record<string, string> = {
            '': "Home",
            "#/": "Home",
            "#/discover": "Discover",
            "#/library": "Library",
            "#/calendar": "Calendar",
            "#/addons": "Addons",
            "#/settings": "Settings",
        };

        const activity = hashToActivity[location.hash];
        if (activity) {
            DiscordPresence.setMainMenu(activity);
        }
    }
};