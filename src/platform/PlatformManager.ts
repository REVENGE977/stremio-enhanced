import { IPlatform } from "./IPlatform";

export class PlatformManager {
    private static instance: IPlatform;

    public static setPlatform(platform: IPlatform): void {
        this.instance = platform;
    }

    public static get current(): IPlatform {
        if (!this.instance) {
            throw new Error("Platform not initialized. Call PlatformManager.setPlatform() first.");
        }
        return this.instance;
    }
}
