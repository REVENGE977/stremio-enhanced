import { Client as DiscordClient } from '@xhayper/discord-rpc';
import { getLogger } from '../utils/logger';
import Helpers from '../utils/Helpers';
import { ActivityType } from 'discord-api-types/v10';
import type { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser';
import { DISCORD } from '../constants';
import PlaybackState from '../utils/PlaybackState';

class DiscordPresence {
    private static logger = getLogger("DiscordPresence");
    private static rpc: DiscordClient | null = null;
    private static enabled = false;

    public static start(): void {
        if (this.enabled) return;
        this.enabled = true;
        this.connect();
    }

    private static connect(): void {
        if (!this.enabled) return;
        
        try {            
            this.rpc = new DiscordClient({ clientId: DISCORD.CLIENT_ID });

            this.rpc.on('ready', () => {
                this.logger.info('Connected to DiscordRPC.');
                this.handleNavigation();
            });

            this.rpc.on('disconnected', () => {
                this.logger.warn(`DiscordRPC Disconnected! Attempting to reconnect in ${DISCORD.RECONNECT_INTERVAL}ms...`);
                this.handleReconnect();
            });
            
            this.rpc.login().catch(() => {
                this.logger.error("Failed to connect to DiscordRPC, maybe Discord isn't running.");
                this.handleReconnect();
            });
        } catch (error) {
            this.logger.error(`An unexpected error occurred while starting Discord RPC: ${(error as Error).message}`);
            this.handleReconnect();
        }
    }

    private static handleReconnect(): void {
        if (!this.enabled) return; 
    
        setTimeout(() => {
            this.logger.info("Reconnecting to DiscordRPC...");
            this.connect();
        }, DISCORD.RECONNECT_INTERVAL);
    }

    public static stop(): void {
        if (!this.enabled) return;
        this.enabled = false;

        if (this.rpc) {
            this.logger.info('Clearing DiscordRPC.');
            this.rpc.user?.clearActivity();
            this.rpc.destroy();
            this.rpc = null;
        }

        window.removeEventListener('hashchange', this.handleNavigation);
    }

    public static updateActivity(newActivity: SetActivity): void {
        if (!this.rpc || !this.enabled) return;

        this.rpc.user?.setActivity(newActivity).catch((error) => {
            this.logger.error(`Failed to set Discord activity: ${(error as Error).message}`);
        });                
    }
    
    public static async discordRPCHandler(): Promise<void> {
        window.addEventListener('hashchange', this.handleNavigation);
    }

    private static handleNavigation = (): void => {
        if (!this.enabled || !this.rpc) return;    

        this.checkWatching();
        this.checkExploring();
        this.checkMainMenu();
    };
    
    private static async checkWatching(): Promise<void> {
        if (!location.href.includes('#/player')) return;
        
        this.logger.info("Video player opened.");
        
        try {
            await Helpers.waitForElm('video');
            const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
            if (!video) return;

            const playerState = await PlaybackState.getPlayerState();
            if (!playerState) return;

            const { metaDetails } = playerState;
            this.logger.info("Updating activity to Watching.");
            
            const handlePlaying = async (): Promise<void> => {
                const startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(video.currentTime);
                const endTimestamp = startTimestamp + Math.floor(video.duration);
                
                if (metaDetails.type === "series") {
                    const { seriesInfoDetails } = playerState;
                    const { episode, season } = seriesInfoDetails!;
                    const isKitsu = metaDetails.id.startsWith("kitsu:");

                    this.updateActivity({ 
                        details: metaDetails.name, 
                        state: `Watching ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`, 
                        startTimestamp,
                        endTimestamp,
                        largeImageKey: metaDetails.poster ?? DISCORD.DEFAULT_IMAGE,
                        largeImageText: "Stremio Enhanced",
                        smallImageKey: "play",
                        smallImageText: "Playing..",
                        instance: false,
                        type: ActivityType.Watching
                    }); 
                } else if (metaDetails.type === "movie") {
                    this.updateActivity({ 
                        details: metaDetails.name, 
                        state: 'Watching',
                        startTimestamp,
                        endTimestamp,
                        largeImageKey: metaDetails.poster ?? DISCORD.DEFAULT_IMAGE,
                        largeImageText: "Stremio Enhanced",
                        smallImageKey: "play",
                        smallImageText: "Playing..",
                        instance: false,
                        type: ActivityType.Watching
                    }); 
                }
            };
            
            const handlePausing = async (): Promise<void> => {
                const currentState = await PlaybackState.getPlayerState();
                if (!currentState) return;

                const pausedMeta = currentState.metaDetails;
                const formattedTime = Helpers.formatTime(video.currentTime);

                if (pausedMeta.type === "series") {
                    const { episode, season } = currentState.seriesInfoDetails!;
                    const isKitsu = pausedMeta.id.startsWith("kitsu:");

                    this.updateActivity({
                        details: pausedMeta.name, 
                        state: `Paused at ${formattedTime} in ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`, 
                        largeImageKey: pausedMeta.poster ?? DISCORD.DEFAULT_IMAGE,
                        largeImageText: "Stremio Enhanced",
                        smallImageKey: "pause",
                        smallImageText: "Paused",
                        instance: false,
                        type: ActivityType.Watching
                    }); 
                } else if (pausedMeta.type === "movie") {
                    this.updateActivity({
                        details: pausedMeta.name,
                        state: `Paused at ${formattedTime}`,
                        largeImageKey: pausedMeta.poster ?? DISCORD.DEFAULT_IMAGE,
                        largeImageText: "Stremio Enhanced",
                        smallImageKey: "pause",
                        smallImageText: "Paused",
                        instance: false,
                        type: ActivityType.Watching
                    }); 
                }
            };
            
            video.addEventListener('playing', handlePlaying);
            video.addEventListener('pause', handlePausing);
            video.play();
        } catch (error) {
            this.logger.error(`Error in checkWatching: ${(error as Error).message}`);
        }
    }
    
    private static async checkExploring(): Promise<void> {
        if (!location.href.includes("#/detail")) return;
        
        try {
            await Helpers.waitForElm('.metadetails-container-K_Dqa');
            const metaDetails = await PlaybackState.getMetaDetails();
            if (!metaDetails) return;

            this.logger.info("Updating activity to Exploring.");
            
            await Helpers.waitForElm('.description-container-yi8iU');
            
            this.updateActivity({ 
                details: metaDetails.name,
                state: 'Exploring',
                largeImageKey: metaDetails.poster ?? DISCORD.DEFAULT_IMAGE,
                largeImageText: "Stremio Enhanced",
                smallImageKey: "menuburger",
                smallImageText: "Main Menu",
                instance: false,
                type: ActivityType.Playing
            });
        } catch (error) {
            this.logger.error(`Error in checkExploring: ${(error as Error).message}`);
        }
    }
    
    private static checkMainMenu(): void {
        const activityDetails: SetActivity = {
            details: "",
            largeImageKey: DISCORD.DEFAULT_IMAGE,
            largeImageText: "Stremio Enhanced",
            smallImageKey: "menuburger",
            smallImageText: "Main Menu",
            instance: false,
            type: ActivityType.Playing
        };
    
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
        if (!activity) return;

        this.logger.info(`Updating activity to ${activity}.`);
        activityDetails.details = activity;
        this.updateActivity(activityDetails);
    }
}
    
export default DiscordPresence;
