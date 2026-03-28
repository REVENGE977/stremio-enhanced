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

            const handlePlaying = () => {
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
            
            const handlePausing = async () => {
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
            
            // Wipe old listeners to prevent memory leaks if the video reloads
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('pause', handlePausing);

            video.addEventListener('playing', handlePlaying);
            video.addEventListener('pause', handlePausing);
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