import MetaDetails from "../interfaces/MetaDetails";
import SeriesInfo from "../interfaces/SeriesInfo";
import PlayerState from "../interfaces/PlayerState";
import { TIMEOUTS } from "../constants";
import Helpers from "./Helpers";
import { getLogger } from "./logger";

class PlaybackState {
    private static logger = getLogger("PlaybackState");
    
    public static async getMetaDetails(): Promise<MetaDetails | null> {
        for (let attempt = 0; attempt < TIMEOUTS.CORESTATE_MAX_RETRIES; attempt++) {
            try {
                const metaDetailsState = await Helpers._eval('core.transport.getState("meta_details")') as {
                    metaItem?: { content?: { content?: MetaDetails } }
                };
                
                if (metaDetailsState?.metaItem?.content?.content) {
                    return metaDetailsState.metaItem.content.content;
                }
            } catch (err) {
                this.logger.warn(`Attempt ${attempt + 1} failed to fetch meta details: ${err}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, TIMEOUTS.CORESTATE_RETRY_INTERVAL));
        }
        
        this.logger.error('Max retries exceeded for getMetaDetails');
        return null;
    }

    public static async getPlayerState(): Promise<PlayerState | null> {
        for (let attempt = 0; attempt < TIMEOUTS.CORESTATE_MAX_RETRIES; attempt++) {
            try {
                const playerState = await Helpers._eval('core.transport.getState("player")') as {
                    seriesInfo?: SeriesInfo;
                    metaItem?: { content?: MetaDetails }
                    stream?: { content: { url: string } }
                };
                
                if(playerState?.metaItem?.content) {
                    return {
                        seriesInfoDetails: playerState?.seriesInfo ?? null,
                        metaDetails: playerState!.metaItem!.content,
                        stream: playerState?.stream
                    };
                }

            } catch (err) {
                this.logger.warn(`Attempt ${attempt + 1} failed to fetch player state: ${err}`);
            }
        
            await new Promise(resolve => setTimeout(resolve, TIMEOUTS.CORESTATE_RETRY_INTERVAL));
        }
        
        this.logger.error('Max retries exceeded for getPlayerState');
        return null;
    }
}

export default PlaybackState;