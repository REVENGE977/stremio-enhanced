import { Client as DiscordClient } from '@xhayper/discord-rpc';
import { getLogger } from './logger';
import Helpers from './Helpers';
import { ActivityType } from 'discord-api-types/v10';
import type { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser';

class DiscordPresence {
    private static logger = getLogger("DiscordPresence");
    private static rpc: DiscordClient | null = null;
    private static enabled: boolean = false;
    private static reconnectInterval: number = 10000;
    private static clientId: string = "1200186750727893164";

    public static start() {
        if(this.enabled) return;
        this.enabled = true;
        this.connect();
    }

    private static connect() {
        if(!this.enabled) return;
        try {            
            this.rpc = new DiscordClient({ clientId: this.clientId });

            this.rpc.on('ready', () => {
                this.logger.info('Connected to DiscordRPC.');
                this.handleNavigation();
            });

            this.rpc.on('disconnected', () => {
                this.logger.warn(`DiscordRPC Disconnected! Attempting to reconnect in ${this.reconnectInterval}ms...`);
                this.handleReconnect();
            });
            
            this.rpc.login().catch(() => {
                this.logger.error("Failed to connect to DiscordRPC, maybe Discord isn't running.")
                this.handleReconnect();
            });
        } catch (error) {
            this.logger.error("An unexpected error occurred while starting Discord RPC:" + error);
            this.handleReconnect();
        }
    }

    private static handleReconnect() {
        if (!this.enabled) return; 
    
        setTimeout(() => {
            this.logger.info("Reconnecting to DiscordRPC...");
            this.connect();
        }, this.reconnectInterval);
    }

    public static stop() {
        if(!this.enabled) return;
        this.enabled = false;

        if(this.rpc) {
            this.logger.info('Clearing DiscordRPC.');
            this.rpc.user.clearActivity();
            this.rpc.destroy();
        }

        window.removeEventListener('hashchange', this.handleNavigation);
    }

    public static updateActivity(newActivity: SetActivity) {
        if(!this.rpc || !this.enabled) return;

        this.rpc.user.setActivity(newActivity).catch((error) => {
            this.logger.error("Failed to set Discord activity:" + error);
        });                
    }
    
    public static async discordRPCHandler() {
        window.addEventListener('hashchange', this.handleNavigation);
    }

    private static handleNavigation = () => {
        if(!this.enabled || !this.rpc) return;    

        this.checkWatching();
        this.checkExploring();
        this.checkMainMenu();
    };
    
    private static async checkWatching() {
        if(location.href.includes('#/player')) {
            this.logger.info("Video player opened.");
            Helpers.waitForElm('video').then(async () => {
                let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;

                const playerState = (await this.getPlayerState());
                let metaInfo = playerState.metaDetails;
                this.logger.info("Updating activity to Watching.");
                
                const handlePlaying = async () => {

                    let startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(video.currentTime);
                    let endTimestamp = startTimestamp + Math.floor(video.duration);
                    
                    if(metaInfo.type == "series") {
                        let seriesInfoDetails = playerState.seriesInfoDetails;

                        let episode = seriesInfoDetails.episode;
                        let season = seriesInfoDetails.season;
                        let isKitsu = metaInfo.id.startsWith("kitsu:");

                        this.updateActivity({ 
                            details: metaInfo.name, 
                            state: "Watching " + (!isKitsu ? `S${season} E${episode}` : `E${episode}`), 
                            startTimestamp,
                            endTimestamp,
                            largeImageKey: metaInfo.poster ?? "1024stremio",
                            largeImageText: "Stremio Enhanced",
                            smallImageKey: "play",
                            smallImageText: "Playing..",
                            instance: false,
                            type: ActivityType.Watching
                        }); 
                    } else if(metaInfo.type == "movie") {
                        this.updateActivity({ 
                            details: metaInfo.name, 
                            state: 'Watching',
                            startTimestamp,
                            endTimestamp,
                            largeImageKey: metaInfo.poster ?? "1024stremio",
                            largeImageText: "Stremio Enhanced",
                            smallImageKey: "play",
                            smallImageText: "Playing..",
                            instance: false,
                            type: ActivityType.Watching
                        }); 
                    }
                };
                
                const handlePausing = async () => {
                    if(metaInfo.type == "series") {
                        const playerState = (await this.getPlayerState());
                        let metaInfo = playerState.metaDetails;
                        let seriesInfoDetails = playerState.seriesInfoDetails;

                        let episode = seriesInfoDetails.episode;
                        let season = seriesInfoDetails.season;
                        let isKitsu = metaInfo.id.startsWith("kitsu:");

                        this.updateActivity({
                            details: metaInfo.name, 
                            state: `Paused at ${Helpers.formatTime(video.currentTime)} in ${!isKitsu ? `S${season} E${episode}` : `E${episode}`}`, 
                            largeImageKey: metaInfo.poster,
                            largeImageText: "Stremio Enhanced",
                            smallImageKey: "pause",
                            smallImageText: "Paused",
                            instance: false,
                            type: ActivityType.Watching
                        }); 
                    } else if(metaInfo.type == "movie") {
                        this.updateActivity({
                            details: metaInfo.name,
                            state: `Paused at ${Helpers.formatTime(video.currentTime)}`,
                            largeImageKey: metaInfo.poster ?? "1024stremio",
                            largeImageText: "Stremio Enhanced",
                            smallImageKey: "pause",
                            smallImageText: "Paused",
                            instance: false,
                            type: ActivityType.Watching
                        }); 
                    }
                }
                
                video.addEventListener('playing', handlePlaying);
                video.addEventListener('pause', handlePausing);
                video.play();
            })
        }
    }
    
    private static checkExploring() {
        if(location.href.includes("#/detail")) {
            Helpers.waitForElm('.metadetails-container-K_Dqa').then(async () => {
                const metaDetails = await this.getMetaDetails();
                this.logger.info("Updating activity to Exploring.");
                
                Helpers.waitForElm('.description-container-yi8iU').then(() => {
                    let mediaName = metaDetails.name;
                    let mediaPoster = metaDetails.poster;
                                            
                    this.updateActivity({ 
                        details: mediaName,
                        state: 'Exploring',
                        largeImageKey: mediaPoster ?? "1024stremio",
                        largeImageText: "Stremio Enhanced",
                        smallImageKey: "menuburger",
                        smallImageText: "Main Menu",
                        instance: false,
                        type: ActivityType.Playing
                    });
                })
            })
        }
    }
    
    private static checkMainMenu() {
        let activityDetails: SetActivity = {
            details: "",
            largeImageKey: "1024stremio",
            largeImageText: "Stremio Enhanced",
            smallImageKey: "menuburger",
            smallImageText: "Main Menu",
            instance: false,
            type: ActivityType.Playing
        };
    
        switch (location.hash) {
            case '':
            case "#/":
                this.logger.info("Updating activity to Home.");
                activityDetails.details = "Home";
                break;
            case "#/discover":
                this.logger.info("Updating activity to Discover.");
                activityDetails.details = "Discover";
                break;
            case "#/library":
                this.logger.info("Updating activity to Library.");
                activityDetails.details = "Library";
                break;
            case "#/calendar":
                this.logger.info("Updating activity to Calendar.");
                activityDetails.details = "Calendar";
                break;
            case "#/addons":
                this.logger.info("Updating activity to Addons.");
                activityDetails.details = "Addons";
                break;
            case "#/settings":
                this.logger.info("Updating activity to Settings.");
                activityDetails.details = "Settings";
                break;
            default:
                return;
        }
    
        this.updateActivity(activityDetails);
    };
    
    private static async getMetaDetails() {
        let metaDetailsState = null;
        
        // Retry fetching the data until it's available
        while (metaDetailsState == null || !metaDetailsState.metaItem?.content?.content) {
            try {
                metaDetailsState = await Helpers._eval('core.transport.getState(\'meta_details\')');
                
                if (metaDetailsState.metaItem?.content?.content) {
                    break;  // Data is available, break out of the loop
                }
            } catch (err) {
                console.error('Error fetching meta details:', err);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const metaDetails = metaDetailsState.metaItem.content.content;
        return metaDetails;
    }

    private static async getPlayerState() {
        let playerState = null;
      
        // Retry fetching the data until it's available
        while (playerState == null || !playerState.seriesInfo || !playerState.metaItem?.content) {
            try {
                playerState = await Helpers._eval('core.transport.getState(\'player\')');
                
                if (playerState.seriesInfo && playerState.metaItem?.content) {
                    break;  // Data is available, break out of the loop
                }
            } catch (err) {
                console.error('Error fetching player state:', err);
            }
        
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      
        const seriesInfoDetails = playerState.seriesInfo;
        const metaDetails = playerState.metaItem.content;
        return { seriesInfoDetails, metaDetails };
    }
}
    
export default DiscordPresence;