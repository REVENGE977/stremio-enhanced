import { PlatformManager } from "../platform/PlatformManager";

class Properties {
    public static themeLinkSelector: string = "head > link[rel=stylesheet]";

    public static get enhancedPath(): string {
        return PlatformManager.current.getEnhancedPath();
    }

    public static get themesPath(): string {
        return PlatformManager.current.getThemesPath();
    }

    public static get pluginsPath(): string {
        return PlatformManager.current.getPluginsPath();
    }

    public static isUsingStremioService = false;
}

export default Properties;
