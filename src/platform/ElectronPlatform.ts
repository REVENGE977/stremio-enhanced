import { IPlatform, FileStat } from "./IPlatform";
import { readFile, writeFile, readdir, unlink, mkdir, stat } from "fs/promises";
import { existsSync } from "fs"; // exists is deprecated in fs/promises
import { shell } from "electron";
import { join } from "path";
import { homedir } from "os";

export class ElectronPlatform implements IPlatform {
    id: "electron" = "electron";

    private baseDataPath: string;
    private enhancedPath: string;
    private themesPath: string;
    private pluginsPath: string;

    constructor() {
        this.baseDataPath = process.platform === "win32"
            ? process.env.APPDATA || join(homedir(), "AppData", "Roaming")
            : process.platform === "darwin"
                ? join(homedir(), "Library", "Application Support")
                : join(homedir(), ".config");

        this.enhancedPath = join(this.baseDataPath, "stremio-enhanced");
        this.themesPath = join(this.enhancedPath, "themes");
        this.pluginsPath = join(this.enhancedPath, "plugins");
    }

    async readFile(path: string): Promise<string> {
        return readFile(path, "utf-8");
    }

    async writeFile(path: string, content: string): Promise<void> {
        return writeFile(path, content, "utf-8");
    }

    async readdir(path: string): Promise<string[]> {
        return readdir(path);
    }

    async exists(path: string): Promise<boolean> {
        return existsSync(path);
    }

    async unlink(path: string): Promise<void> {
        return unlink(path);
    }

    async mkdir(path: string): Promise<void> {
        return mkdir(path, { recursive: true }).then(() => {});
    }

    async stat(path: string): Promise<FileStat> {
        const stats = await stat(path);
        return {
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
    }

    async openPath(path: string): Promise<void> {
        await shell.openPath(path);
    }

    async openExternal(url: string): Promise<void> {
        await shell.openExternal(url);
    }

    getThemesPath(): string {
        return this.themesPath;
    }

    getPluginsPath(): string {
        return this.pluginsPath;
    }

    getEnhancedPath(): string {
        return this.enhancedPath;
    }

    async init(): Promise<void> {
        // Ensure directories exist
        if (!await this.exists(this.enhancedPath)) {
            await this.mkdir(this.enhancedPath);
        }
        if (!await this.exists(this.themesPath)) {
            await this.mkdir(this.themesPath);
        }
        if (!await this.exists(this.pluginsPath)) {
            await this.mkdir(this.pluginsPath);
        }
    }
}
