
export interface FileStat {
    isFile: boolean;
    isDirectory: boolean;
}

export interface IPlatform {
    id: "electron" | "capacitor";

    // File System
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    readdir(path: string): Promise<string[]>;
    exists(path: string): Promise<boolean>;
    unlink(path: string): Promise<void>;
    mkdir(path: string): Promise<void>;
    stat(path: string): Promise<FileStat>;

    // Shell / System
    openPath(path: string): Promise<void>;
    openExternal(url: string): Promise<void>;

    // Paths
    getThemesPath(): string;
    getPluginsPath(): string;
    getEnhancedPath(): string;

    // Initialization
    init(): Promise<void>;
}
