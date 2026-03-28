import { Client as DiscordClient } from '@xhayper/discord-rpc';
import { getLogger } from '../utils/logger';
import { ActivityType } from 'discord-api-types/v10';
import type { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser';
import { DISCORD } from '../constants';

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
            });

            this.rpc.on('disconnected', () => {
                this.logger.warn(`DiscordRPC Disconnected! Attempting to reconnect...`);
                this.handleReconnect();
            });
            
            this.rpc.login().catch(() => {
                this.logger.error("Failed to connect to DiscordRPC.");
                this.handleReconnect();
            });
        } catch (error) {
            this.logger.error(`An unexpected error occurred: ${(error as Error).message}`);
            this.handleReconnect();
        }
    }

    private static handleReconnect(): void {
        if (!this.enabled) return; 
        setTimeout(() => {
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
    }

    public static setPlaying(details: string, state: string, startTimestamp: number, endTimestamp: number, imageKey: string | undefined): void {
        this._updateActivity({ 
            details, 
            state, 
            startTimestamp,
            endTimestamp,
            largeImageKey: imageKey || DISCORD.DEFAULT_IMAGE,
            largeImageText: "Stremio Enhanced",
            smallImageKey: "play",
            smallImageText: "Playing..",
            instance: false,
            type: ActivityType.Watching
        });
    }

    public static setPaused(details: string, state: string, imageKey: string | undefined): void {
        this._updateActivity({
            details,
            state,
            largeImageKey: imageKey || DISCORD.DEFAULT_IMAGE,
            largeImageText: "Stremio Enhanced",
            smallImageKey: "pause",
            smallImageText: "Paused",
            instance: false,
            type: ActivityType.Watching
        });
    }

    public static setExploring(details: string, imageKey: string | undefined): void {
        this._updateActivity({ 
            details,
            state: 'Exploring',
            largeImageKey: imageKey || DISCORD.DEFAULT_IMAGE,
            largeImageText: "Stremio Enhanced",
            smallImageKey: "menuburger",
            smallImageText: "Main Menu",
            instance: false,
            type: ActivityType.Playing
        });
    }

    public static setMainMenu(menuName: string): void {
        this._updateActivity({
            details: menuName,
            largeImageKey: DISCORD.DEFAULT_IMAGE,
            largeImageText: "Stremio Enhanced",
            smallImageKey: "menuburger",
            smallImageText: "Main Menu",
            instance: false,
            type: ActivityType.Playing
        });
    }

    private static _updateActivity(newActivity: SetActivity): void {
        if (!this.rpc || !this.enabled) return;
        this.rpc.user?.setActivity(newActivity).catch((error) => {
            this.logger.error(`Failed to set Discord activity: ${(error as Error).message}`);
        });                
    }
}
    
export default DiscordPresence;