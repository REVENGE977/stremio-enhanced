import { getLogger } from "./logger";
import { basename, join, resolve } from "path";
import { existsSync, createWriteStream } from "fs";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import { exec as execAsync } from "child_process";
import * as process from 'process';
import { homedir } from 'os';
import { app } from "electron";
import https from "https";

const execPromise = promisify(execAsync);
const execFileAsync = promisify(execFile);

class StremioService {
    private static logger = getLogger("StremioService");
    public static start(servicePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this.logger.info("Starting Stremio Service from " + servicePath);
                    
                    if (exec(servicePath)) {
                        this.logger.info("Stremio Service Started.");
                        resolve();
                    } else {
                        this.logger.error("Failed to start the service.");
                        reject(new Error("Failed to start the service.")); 
                    }
                } catch (error) {
                    reject(error); 
                }
            }, 0);
        });
    }
    
    
    private static API_URL = "https://api.github.com/repos/Stremio/stremio-service/releases/latest";
    
    public static async downloadAndInstallService() {
        const platform = process.platform;
        
        const release = await this.fetchLatestRelease();
        if (!release) {
            console.error("Failed to fetch latest release info");
            return;
        }
        
        const assetUrl = this.getAssetUrlForPlatform(release, platform);
        if (!assetUrl) {
            console.error("No suitable asset found for platform:", platform);
            return;
        }
        
        const tempDir = app.getPath("temp");
        const fileName = basename(assetUrl);
        const destPath = join(tempDir, fileName);

        this.logger.info(`Downloading latest Stremio Service (${release.tag_name}) in ${destPath}`);
        await this.downloadFile(assetUrl, destPath);
        this.logger.info("Download complete. Installing...");

        switch (platform) {
            case "win32":
                await this.installWindows(destPath);
            break;
            case "darwin":
                await this.installMac(destPath);
            break;
            case "linux":
                await this.installLinux(destPath);
            break;
            default:
                this.logger.warn("No install routine defined for: " + platform);
        }
    }
    
    // grabs the latest version of Stremio Service from the official GitHub repository
    private static fetchLatestRelease(): Promise<any | null> {
        return new Promise((resolve, reject) => {
            const req = https.request(this.API_URL, {
                headers: { "User-Agent": "Electron-AutoInstaller" },
            }, (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            req.on("error", reject);
            req.end();
        }).catch((err: Error): null => {
            console.error("Error fetching release:", err);
            return null;
        });
    }
    
    private static getAssetUrlForPlatform(release: any, platform: string): string | null {
        if (!release.assets || !Array.isArray(release.assets)) return null;
        
        const matchers: Record<string, RegExp> = {
            win32: /\.exe$/i,
            darwin: /\.dmg$/i,
            linux: /\.flatpak$/i,
        };
        
        const pattern = matchers[platform];
        if (!pattern) return null;
        
        const asset = release.assets.find((a: any) => pattern.test(a.name));
        return asset ? asset.browser_download_url : null;
    }
    
    private static async downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = createWriteStream(dest);
            const req = https.get(
                url,
                { headers: { "User-Agent": "Electron-AutoInstaller" } },
                (res) => {
                    if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        https.get(res.headers.location, (r2) => r2.pipe(file));
                    } else {
                        res.pipe(file);
                    }
                    file.on("finish", () => file.close(() => resolve()));
                    res.on("error", reject);
                }
            );
            req.on("error", reject);
        });
    }
    
    private static async installWindows(filePath: string) {
        const ps = `Start-Process -FilePath "${filePath}" -ArgumentList '/S' -Verb RunAs`;
        await execFileAsync("powershell.exe", ["-ExecutionPolicy", "Bypass", "-NoProfile", "-Command", ps], {
            windowsHide: true,
        });
        
        this.logger.info("Waiting for Stremio Service installation to finish...");
        const success = await this.waitForInstallCompletion(120000); // 2 minutes timeout
        
        if (success) {
            this.logger.info("Stremio Service detected as installed or running.");
        } else {
            this.logger.warn("Installation timeout or failed to detect Stremio Service.");
        }
    }
    
    private static async waitForInstallCompletion(timeoutMs = 120000): Promise<boolean> {
        const start = Date.now();
        
        while (Date.now() - start < timeoutMs) {
            const running = await this.isServiceRunning();
            if (running) return true;
            
            const installed = await this.isServiceInstalled();
            if (installed) {
                StremioService.start(this.findExecutable());
                return true;
            }
            
            await new Promise(r => setTimeout(r, 5000)); // check every 5s
        }
        
        return false;
    }
    
    private static async isServiceRunning(): Promise<boolean> {
        const platform = process.platform;

        if (platform === "win32") {
            return new Promise(resolve => {
                execFile("tasklist", ["/FI", 'IMAGENAME eq stremio-service.exe'], (err, stdout) => {
                    resolve(stdout && stdout.includes("stremio-service.exe"));
                });
            });
        }

        if (platform === "darwin" || platform === "linux") {
            return new Promise(resolve => {
                execFile("pgrep", ["-x", "stremio-service"], (err) => {
                    resolve(!err); 
                });
            });
        }

        return false;
    }

    
    private static async isServiceInstalled(): Promise<boolean> {
        const platform = process.platform;

        switch(platform) {
            case "win32":
                return this.isServiceInstalledWindows();
            case "darwin":
                return existsSync("/Applications/StremioService.app/Contents/MacOS/stremio-service");
            case "linux":
                try {
                    const { stdout } = await execFileAsync("flatpak", ["info", "com.stremio.Service"]);
                    return stdout.includes("com.stremio.Service");
                } catch {
                    return false;
                }
            default:
                return false;
        }
    }


    private static async isServiceInstalledWindows(): Promise<boolean> {
        const psCheck = `
        $paths = @(
            'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
            'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
            'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
        )
        foreach ($p in $paths) {
            $items = Get-ItemProperty -Path $p -ErrorAction SilentlyContinue |
            Where-Object { $_.DisplayName -like '*Stremio Service*' }
            if ($items) { Write-Output 'FOUND'; break }
        }
        `;
        try {
            const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-Command", psCheck], { windowsHide: true });
            return stdout.trim().includes("FOUND");
        } catch {
            return false;
        }
    }


    private static async installMac(filePath: string) {
        const volume = "/Volumes/StremioService";
        try {
            await execFileAsync("hdiutil", ["attach", filePath, "-mountpoint", volume]);
            await execFileAsync("cp", ["-R", `${volume}/StremioService.app`, "/Applications/"]);
        } catch (err) {
            this.logger.error(`DMG install failed: ${err}`);
        } finally {
            await execFileAsync("hdiutil", ["detach", volume]).catch(() => {});
        }
    }
    
    private static async installLinux(filePath: string) {
        try {
            await execFileAsync("flatpak", [
                "remote-add",
                "--if-not-exists",
                "flathub",
                "https://dl.flathub.org/repo/flathub.flatpakrepo"
            ]).catch(() => {});

            try {
                await execFileAsync("flatpak", ["info", "org.freedesktop.Platform//24.08"]);
            } catch {
                this.logger.info("Installing required Flatpak runtime...");
                await execFileAsync("flatpak", ["install", "-y", "flathub", "org.freedesktop.Platform//24.08"]);
            }

            await execFileAsync("flatpak", ["install", "-y", filePath]);

            this.logger.info("Stremio Service installed successfully.");
        } catch (err) {
            this.logger.error(`Flatpak install failed: ${err}`);
        }
    }

    
    public static terminate(): number {
        try {
            this.logger.info("Terminating Stremio Service.");
            
            const pid = this.getStremioServicePid();
            if (pid) {
                process.kill(pid, 'SIGTERM');
                this.logger.info("Stremio Service terminated.");
                return 0; 
            } else {
                this.logger.error("Failed to find Stremio Service PID.");
                return 1;
            }
        } catch (e) {
            this.logger.error(e);
            return 2; 
        }
    }
    
    private static getStremioServicePid(): number | null {
        switch (process.platform) {
            case 'win32':
                return this.getPidForWindows();
            case 'darwin':
            case 'linux':
                return this.getPidForUnix();
            default:
                this.logger.error('Unsupported operating system');
                return null;
        }
    }
    
    private static getPidForWindows(): number | null {
        const execSync = require('child_process').execSync;
        try {
            const output = execSync('tasklist /FI "IMAGENAME eq stremio-service.exe"').toString();
            
            const lines = output.split('\n');
            
            for (const line of lines) {
                if (line.includes('stremio-service.exe')) {
                    const columns = line.trim().split(/\s+/);
                    if (columns.length > 1) {
                        return parseInt(columns[1], 10);
                    }
                }
            }
            
            this.logger.error("Stremio service not found in tasklist.");
        } catch (error) {
            this.logger.error('Error retrieving PID for Stremio service on Windows:' + error);
        }
        return null;
    }
    
    
    private static getPidForUnix(): number | null {
        const execSync = require('child_process').execSync;
        try {
            const output = execSync("pgrep -f stremio-service").toString();
            return parseInt(output.trim(), 10);
        } catch (error) {
            this.logger.error('Error retrieving PID for Stremio service on Unix: ' + error);
        }
        return null;
    }
    
    public static findExecutable() {
        let installationPath;
        
        // Check if the executable exists in the current directory first
        const localPath = resolve('./stremio-service.exe'); // Windows
        const localPathUnix = resolve('./stremio-service'); // macOS & Linux
        
        if (existsSync(localPath) || existsSync(localPathUnix)) {
            this.logger.info("StremioService executable found in the current directory.");
            return existsSync(localPath) ? localPath : localPathUnix;
        }
        
        // If not found locally, check OS-specific paths
        switch (process.platform) {
            case 'win32':
                const localAppData = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local');
                installationPath = join(localAppData, 'Programs', 'StremioService', 'stremio-service.exe');
            break;
            case 'darwin':
                installationPath = join('/Applications', 'StremioService.app', 'Contents', 'MacOS', 'stremio-service');
            break;
            case 'linux':
                const standardPaths = [
                    '/usr/local/bin/stremio-service',
                    '/usr/bin/stremio-service',
                    join(process.env.HOME || '', 'bin', 'stremio-service')
                ];
                
                for (const path of standardPaths) {
                    if (existsSync(path)) {
                        installationPath = path;
                        break;
                    }
                }
                
                // If not found in standard paths, check for Flatpak installation
                if (!installationPath) {
                    try {
                        const execSync = require('child_process').execSync;
                        const flatpakPath = execSync('which flatpak').toString().trim();
                        
                        if (flatpakPath) {
                            // Check if the Stremio Service Flatpak is installed
                            const installed = execSync('flatpak list --app').toString();
                            if (installed.includes('com.stremio.Service')) {
                                const flatpakInstallPath = execSync('flatpak info --show-location com.stremio.Service')
                                .toString().trim();
                                
                                const flatpakExecutable = join(flatpakInstallPath, 'files', 'bin', 'stremio-service');
                                if (existsSync(flatpakExecutable)) {
                                    installationPath = flatpakExecutable;
                                }
                            }
                        }
                    } catch (e) {
                        this.logger.error("Flatpak check failed: " + e.message);
                    }
                }
            break;
            default:
                this.logger.error('Unsupported operating system');
                return null;
        }
        
        if (!installationPath) {
            this.logger.error('Failed to determine installation path for the current operating system');
            return null;
        }
        
        const fullPath = resolve(installationPath);
        this.logger.info("Checking existence of " + fullPath);
        
        try {
            if (existsSync(fullPath)) {
                this.logger.info(`StremioService executable found in OS-specific path (${process.platform}).`);
                return fullPath;
            } else {
                this.logger.warn(`StremioService executable not found at ${fullPath}`);
            }
        } catch (error) {
            this.logger.error(`Error checking StremioService existence in ${fullPath}:` + error.message);
        }
        
        return null;
    }    
    
    public static async isProcessRunning() {
        try {
            let command;
            switch (process.platform) {
                case 'win32':
                    command = 'tasklist /FI "IMAGENAME eq stremio-service.exe"';
                break;
                case 'darwin':
                case 'linux':
                    command = 'pgrep -f "stremio-service"';
                break;
                default:
                    this.logger.error('Unsupported operating system');
                    return false;
            }
            
            const { stdout } = await execPromise(command);
            const isRunning = process.platform === 'win32'
            ? stdout.toLowerCase().includes('stremio-service.exe')
            : stdout.trim().length > 0;
            
            return isRunning;
        } catch (error) {
            this.logger.error(`Error executing process check command: ${error.message}`);
            return false;
        }
    }
}

export default StremioService;