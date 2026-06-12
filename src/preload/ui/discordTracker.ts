import Helpers from "../../utils/Helpers";
import PlaybackState from "../../utils/PlaybackState";
import DiscordPresence from "../../core/DiscordPresence";

export const discordTracker = {

    init: () => {
        window.addEventListener('hashchange', discordTracker.handleNavigation);
        discordTracker.handleNavigation();
    },

    stop: () => {
        window.removeEventListener('hashchange', discordTracker.handleNavigation);
    },

    handleNavigation: () => {
        discordTracker._checkWatching();
        discordTracker._checkExploring();
        discordTracker._checkMainMenu();
    },

    _checkWatching: async () => {
        if (!location.href.includes('#/player')) return;

        try {
            await Helpers.waitForElm('video');
            const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
            if (!video) return;

            const playerState = await PlaybackState.getPlayerState();
            if (!playerState) return;
            const { metaDetails } = playerState;

            const episodeKey =
                metaDetails.id +
                (playerState.seriesInfoDetails
                    ? `${playerState.seriesInfoDetails.season}-${playerState.seriesInfoDetails.episode}`
                    : '');

            const sourceKey = video.currentSrc || video.src;

            const handlePlaying = () => {
                const startTimestamp =
                    Math.floor(Date.now() / 1000) -
                    Math.floor(video.currentTime);

                const endTimestamp =
                    startTimestamp + Math.floor(video.duration);

                if (metaDetails.type === "series") {
                    const { episode, season } = playerState.seriesInfoDetails!;
                    const isKitsu = metaDetails.id.startsWith("kitsu:");
                    const stateStr = `Watching ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`;

                    DiscordPresence.setPlaying(
                        metaDetails.name,
                        stateStr,
                        startTimestamp,
                        endTimestamp,
                        metaDetails.poster
                    );
                } else {
                    DiscordPresence.setPlaying(
                        metaDetails.name,
                        "Watching",
                        startTimestamp,
                        endTimestamp,
                        metaDetails.poster
                    );
                }
            };

            const handlePausing = async () => {
                const currentState = await PlaybackState.getPlayerState();
                if (!currentState) return;

                const pausedMeta = currentState.metaDetails;
                const formattedTime = Helpers.formatTime(video.currentTime);

                if (pausedMeta.type === "series") {
                    const { episode, season } = currentState.seriesInfoDetails!;
                    const isKitsu = pausedMeta.id.startsWith("kitsu:");
                    const stateStr = `Paused at ${formattedTime} in ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`;

                    DiscordPresence.setPaused(
                        pausedMeta.name,
                        stateStr,
                        pausedMeta.poster
                    );
                } else {
                    DiscordPresence.setPaused(
                        pausedMeta.name,
                        `Paused at ${formattedTime}`,
                        pausedMeta.poster
                    );
                }
            };

            video.onplaying = handlePlaying;
            video.onpause = handlePausing;

            const prev = (window as any).__rpc_state || {};

            (window as any).__rpc_state = {
                episodeKey,
                sourceKey
            };

            if (
                prev.episodeKey !== episodeKey ||
                prev.sourceKey !== sourceKey
            ) {
                handlePlaying();
            }

            if (!(window as any).__rpc_watcher) {
                (window as any).__rpc_watcher = setInterval(() => {
                    if (!location.href.includes('#/player')) return;

                    const v = document.querySelector('video') as HTMLVideoElement | null;
                    if (!v) return;

                    const currentSource = v.currentSrc || v.src;
                    const state = (window as any).__rpc_state || {};

                    if (state.sourceKey && state.sourceKey !== currentSource) {
                        discordTracker._checkWatching();
                    }

                    (window as any).__rpc_state = {
                        ...state,
                        sourceKey: currentSource
                    };
                }, 2000);
            }

            if (!video.paused && !video.ended) {
                handlePlaying();
            } else {
                handlePausing();
            }

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
