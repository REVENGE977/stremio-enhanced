import { getLogger } from '../../utils/logger';

export const pluginLogger = {
    info: (pluginName: string, message: string) => {
        const logger = getLogger(pluginName);
        logger.info(message);
    },
    
    warn: (pluginName: string, message: string) => {
        const logger = getLogger(pluginName);
        logger.warn(message);
    },
    
    error: (pluginName: string, message: string) => {
        const logger = getLogger(pluginName);
        logger.error(message);
    }
};