import { IPlatform, FileStat } from "./IPlatform";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Browser } from "@capacitor/browser";

export class CapacitorPlatform implements IPlatform {
    id: "capacitor" = "capacitor";

    async readFile(path: string): Promise<string> {
        const result = await Filesystem.readFile({
            path,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        return result.data as string;
    }

    async writeFile(path: string, content: string): Promise<void> {
        await Filesystem.writeFile({
            path,
            data: content,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
    }

    async readdir(path: string): Promise<string[]> {
        const result = await Filesystem.readdir({
            path,
            directory: Directory.Data
        });
        // Capacitor 4/5: files is FileInfo[]. name is the property.
        return result.files.map(f => f.name);
    }

    async exists(path: string): Promise<boolean> {
        try {
            await Filesystem.stat({
                path,
                directory: Directory.Data
            });
            return true;
        } catch {
            return false;
        }
    }

    async unlink(path: string): Promise<void> {
        await Filesystem.deleteFile({
            path,
            directory: Directory.Data
        });
    }

    async mkdir(path: string): Promise<void> {
        try {
            await Filesystem.mkdir({
                path,
                directory: Directory.Data,
                recursive: true
            });
        } catch (e) {
            // Ignore error if directory already exists
        }
    }

    async stat(path: string): Promise<FileStat> {
        const stat = await Filesystem.stat({
            path,
            directory: Directory.Data
        });
        return {
            isFile: stat.type === 'file',
            isDirectory: stat.type === 'directory'
        };
    }

    async openPath(path: string): Promise<void> {
        console.log("openPath not supported on Capacitor", path);
    }

    async openExternal(url: string): Promise<void> {
        await Browser.open({ url });
    }

    getThemesPath(): string {
        return "themes";
    }

    getPluginsPath(): string {
        return "plugins";
    }

    getEnhancedPath(): string {
        return "";
    }

    async init(): Promise<void> {
        if (!await this.exists(this.getThemesPath())) {
            await this.mkdir(this.getThemesPath());
        }
        if (!await this.exists(this.getPluginsPath())) {
            await this.mkdir(this.getPluginsPath());
        }
    }
}
