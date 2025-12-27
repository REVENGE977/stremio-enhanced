import { homedir } from "os";
import { join } from "path";

class Properties {
    public static themeLinkSelector: string = "head > link[rel=stylesheet]";

    private static baseDataPath: string = process.platform === "win32"
        ? process.env.APPDATA || join(homedir(), "AppData", "Roaming")
        : process.platform === "darwin"
            ? join(homedir(), "Library", "Application Support")
            : join(homedir(), ".config");

    public static enhancedPath = join(Properties.baseDataPath, "stremio-enhanced");

    public static themesPath = join(Properties.enhancedPath, "themes");
    public static pluginsPath = join(Properties.enhancedPath, "plugins");
    public static pepperPluginsPath = join(Properties.enhancedPath, "pepper-plugins");
    public static pepperConfigFile = join(Properties.enhancedPath, "pepper-plugins.json");
}

export default Properties;
