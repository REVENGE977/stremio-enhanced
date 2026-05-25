import { fork, execSync } from "child_process";
import * as unzipper from "unzipper";
import { createWriteStream, existsSync, mkdirSync, chmodSync, unlinkSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { getLogger } from "./logger";
import Properties from "../core/Properties";
import https from "https";
import { shell } from "electron";
import { FFMPEG_URLS, MACOS_FFPROBE_URLS } from "../constants";
import Helpers from "./Helpers";

class StreamingServer {
    private static logger = getLogger("StreamingServer");
    public static latestServerJsUrl: string = "";

    // Use config directory instead of executable directory for cross-platform compatibility (especially AppImage)
    private static streamingServerDir = join(Properties.enhancedPath, "streamingserver");
    private static serverScriptPath = join(this.streamingServerDir, "server.js");
    private static logFilePath = join(Properties.enhancedPath, "stremio-server.log");

    private static getFFmpegUrl(): string {
        const platform =
            process.platform === "win32" || process.platform === "darwin"
                ? process.platform
                : "linux";

        if (process.arch !== "x64" && process.arch !== "arm64") throw new Error(`Unsupported architecture: ${process.arch}`);

        return FFMPEG_URLS[platform][process.arch];
    }

    private static getMacOSFFprobeUrl(): string {
        if (process.arch !== "x64" && process.arch !== "arm64") throw new Error(`Unsupported architecture: ${process.arch}`);
        return MACOS_FFPROBE_URLS[process.arch];
    }

    // Get the directory where server.js should be placed
    public static getStreamingServerDir(): string {
        return this.streamingServerDir;
    }

    // Check if server.js exists
    public static serverJsExists(): boolean {
        return existsSync(this.serverScriptPath);
    }

    // Open the streaming server directory in the file manager
    public static openStreamingServerDir(): void {
        if (!existsSync(this.streamingServerDir)) {
            mkdirSync(this.streamingServerDir, { recursive: true });
        }
        shell.openPath(this.streamingServerDir);
    }

    // Check if system ffmpeg/ffprobe are available and working
    private static getSystemBinaryPath(binary: string): string | null {
        try {
            const result = execSync(`which ${binary}`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
            const path = result.trim();
            if (path && existsSync(path)) {
                this.logger.info(`Found system ${binary} at: ${path}`);
                return path;
            }
        } catch {
            // which command failed, binary not found
        }
        return null;
    }

    // Get the best available ffmpeg path (prefer system, fallback to downloaded)
    private static getFFmpegPath(): string {
        // First, try system ffmpeg
        const systemFFmpeg = this.getSystemBinaryPath("ffmpeg");
        if (systemFFmpeg) {
            return systemFFmpeg;
        }

        // Fall back to downloaded version
        const downloadedPath = process.platform == "win32"
            ? join(this.streamingServerDir, "ffmpeg.exe")
            : join(this.streamingServerDir, "ffmpeg");
        return downloadedPath;
    }

    // Get the best available ffprobe path (prefer system, fallback to downloaded)
    private static getFFprobePath(): string {
        // First, try system ffprobe
        const systemFFprobe = this.getSystemBinaryPath("ffprobe");
        if (systemFFprobe) {
            return systemFFprobe;
        }

        // Fall back to downloaded version
        const downloadedPath = process.platform == "win32"
            ? join(this.streamingServerDir, "ffprobe.exe")
            : join(this.streamingServerDir, "ffprobe");
        return downloadedPath;
    }

    private static async downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = createWriteStream(dest);

            const request = (downloadUrl: string) => {
                https.get(downloadUrl, { headers: { "User-Agent": "Stremio-Enhanced" } }, (res) => {
                    // Handle redirects (GitHub releases use redirects)
                    if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        const redirectUrl = new URL(res.headers.location, downloadUrl).toString();
                        this.logger.info(`Following redirect to: ${redirectUrl}`);
                        request(redirectUrl);
                        return;
                    }

                    if (res.statusCode !== 200) {
                        file.close();
                        reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
                        return;
                    }

                    res.pipe(file);
                    file.on("finish", () => {
                        file.close(() => resolve());
                    });
                    res.on("error", (err) => {
                        file.close();
                        reject(err);
                    });
                }).on("error", (err) => {
                    file.close();
                    reject(err);
                });
            };

            request(url);
        });
    }

    private static async downloadAndExtractFFmpeg(): Promise<boolean> {
        const archiveUrl = this.getFFmpegUrl();
        const archivePath = join(this.streamingServerDir, (process.platform == "win32" || process.platform == "darwin") ? "ffmpeg-release.zip" : "ffmpeg-release.tar.xz");
        
        const ffmpegPath = process.platform == "win32"
            ? join(this.streamingServerDir, "ffmpeg.exe")
            : join(this.streamingServerDir, "ffmpeg");
        const ffprobePath = process.platform == "win32"
            ? join(this.streamingServerDir, "ffprobe.exe")
            : join(this.streamingServerDir, "ffprobe");

        try {
            this.logger.info(`Downloading FFmpeg from ${archiveUrl}...`);
            await this.downloadFile(archiveUrl, archivePath);
            this.logger.info("FFmpeg archive downloaded. Extracting...");

            if (process.platform === "linux") {
                // Extract tar.xz archive
                // First, list contents to find the directory name
                const listOutput = execSync(`tar -tf "${archivePath}" | head -1`, { encoding: "utf8" });
                const extractDir = listOutput.trim().split("/")[0];

                // Extract the archive
                execSync(`tar -xf "${archivePath}" -C "${this.streamingServerDir}"`, { encoding: "utf8" });

                // Move ffmpeg and ffprobe to the streamingserver directory
                const extractedDir = join(this.streamingServerDir, extractDir);
                execSync(`mv "${join(extractedDir, "ffmpeg")}" "${ffmpegPath}"`, { encoding: "utf8" });
                execSync(`mv "${join(extractedDir, "ffprobe")}" "${ffprobePath}"`, { encoding: "utf8" });

                // Set executable permissions
                chmodSync(ffmpegPath, 0o755);
                chmodSync(ffprobePath, 0o755);

                // Cleanup: remove extracted directory and archive
                execSync(`rm -rf "${extractedDir}"`, { encoding: "utf8" });
                unlinkSync(archivePath);

                this.logger.info("FFmpeg and FFprobe extracted successfully.");
                return true;
            } else if (process.platform === "darwin") {
                // Handle macOS zip file
                execSync(`unzip -o "${archivePath}" -d "${this.streamingServerDir}"`, { encoding: "utf8" });
                chmodSync(ffmpegPath, 0o755);
                unlinkSync(archivePath);

                this.logger.info(`FFmpeg extracted successfully. Downloading FFprobe from ${this.getMacOSFFprobeUrl()}...`);

                const ffprobeArchivePath = join(this.streamingServerDir, "ffprobe-release.zip");
                await this.downloadFile(this.getMacOSFFprobeUrl(), ffprobeArchivePath);
                this.logger.info("FFprobe archive downloaded. Extracting...");
                
                // Extract ffprobe
                execSync(`unzip -o "${ffprobeArchivePath}" -d "${this.streamingServerDir}"`, { encoding: "utf8" });
                chmodSync(ffprobePath, 0o755);
                unlinkSync(ffprobeArchivePath);
                return true;
            } else if (process.platform === "win32") {
                // Handle Windows zip file natively to avoid PowerShell module issues
                const fs = require('fs');
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(archivePath)
                        .pipe(unzipper.Extract({ path: this.streamingServerDir }))
                        .on('close', resolve)
                        .on('error', reject);
                });
                
                const extDir = join(this.streamingServerDir, "ffmpeg-master-latest-win64-gpl");
                const ffmpegSource = join(extDir, "bin", "ffmpeg.exe");
                const ffprobeSource = join(extDir, "bin", "ffprobe.exe");
                
                if (fs.existsSync(ffmpegSource)) {
                    fs.renameSync(ffmpegSource, join(this.streamingServerDir, "ffmpeg.exe"));
                }
                if (fs.existsSync(ffprobeSource)) {
                    fs.renameSync(ffprobeSource, join(this.streamingServerDir, "ffprobe.exe"));
                }
                
                if (fs.existsSync(extDir)) {
                    fs.rmSync(extDir, { recursive: true, force: true });
                }

                unlinkSync(archivePath);
                return true;
            }

            return false;
        } catch (error) {
            this.logger.error(`Failed to download/extract FFmpeg: ${error}`);
            // Cleanup on failure
            if (existsSync(archivePath)) {
                try { unlinkSync(archivePath); } catch {}
            }
            return false;
        }
    }

    public static async ensureStreamingServerFiles(): Promise<"ready" | "missing_server_js" | "missing_ffmpeg"> {
        try {
            // Create directory if it doesn't exist
            if (!existsSync(this.streamingServerDir)) {
                this.logger.info(`Creating streaming server directory: ${this.streamingServerDir}`);
                mkdirSync(this.streamingServerDir, { recursive: true });
            }

            // Check if server.js exists (user must download manually)
            if (!existsSync(this.serverScriptPath)) {
                this.logger.warn("server.js not found. User needs to download it manually.");
                return "missing_server_js";
            }

            // Check if we need to download ffmpeg/ffprobe
            // Only download if system versions are not available
            const systemFFmpeg = this.getSystemBinaryPath("ffmpeg");
            const systemFFprobe = this.getSystemBinaryPath("ffprobe");

            if (systemFFmpeg && systemFFprobe) {
                this.logger.info("Using system ffmpeg and ffprobe.");
            } else {
                // Need to download ffmpeg binaries
                const downloadedFFmpeg = process.platform == "win32"
                    ? join(this.streamingServerDir, "ffmpeg.exe")
                    : join(this.streamingServerDir, "ffmpeg");
                const downloadedFFprobe = process.platform == "win32"
                    ? join(this.streamingServerDir, "ffprobe.exe")
                    : join(this.streamingServerDir, "ffprobe");

                if (!existsSync(downloadedFFmpeg) || !existsSync(downloadedFFprobe)) {
                    this.logger.info("System ffmpeg/ffprobe not found. Downloading...");
                    const success = await this.downloadAndExtractFFmpeg();
                    if (!success) {
                        this.logger.error("Failed to download FFmpeg binaries and system ffmpeg not available.");
                        return "missing_ffmpeg";
                    }
                }
            }

            this.logger.info("All streaming server files are ready.");
            return "ready";

        } catch (error) {
            this.logger.error(`Failed to ensure streaming server files: ${error}`);
            return "missing_ffmpeg";
        }
    }

    public static async streamingServerDirExists() {
        // Check if server.js exists and we have ffmpeg/ffprobe available (either system or downloaded)
        if (!existsSync(this.streamingServerDir) || !existsSync(this.serverScriptPath)) {
            return false;
        }

        const ffmpegPath = this.getFFmpegPath();
        const ffprobePath = this.getFFprobePath();

        if (!existsSync(ffmpegPath) || !existsSync(ffprobePath)) {
            return false;
        }

        return true;
    }

    private static async fetchText(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = (fetchUrl: string) => {
                https.get(fetchUrl, { headers: { "User-Agent": "Stremio-Enhanced" } }, (res) => {
                    if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        request(new URL(res.headers.location, fetchUrl).toString());
                        return;
                    }
                    if (res.statusCode !== 200) {
                        reject(new Error(`HTTP ${res.statusCode}`));
                        return;
                    }
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(data));
                }).on("error", err => reject(err));
            };
            request(url);
        });
    }

    public static async checkServerJsUpdate(): Promise<void> {
        try {
            this.logger.info("Checking for server.js updates...");
            const tomlContent = await this.fetchText("https://raw.githubusercontent.com/Stremio/stremio-service/refs/heads/master/Cargo.toml");
            const match = tomlContent.match(/\[package\.metadata\.server\][\s\S]*?version\s*=\s*"([^"]+)"/);
            
            if (!match) {
                this.logger.warn("Could not extract server.js version from Cargo.toml");
                return;
            }
            
            const latestVersion = match[1];
            const skipVersionPath = join(Properties.enhancedPath, "skip_server_version.txt");
            const currentVersionPath = join(this.streamingServerDir, "version.txt");
            
            if (existsSync(skipVersionPath)) {
                const skippedVersion = readFileSync(skipVersionPath, "utf8").trim();
                if (skippedVersion === latestVersion) {
                    this.logger.info(`User skipped update to ${latestVersion}`);
                    return;
                }
            }
            
            let currentVersion = "";
            if (existsSync(currentVersionPath)) {
                currentVersion = readFileSync(currentVersionPath, "utf8").trim();
            }
            
            if (currentVersion === latestVersion && existsSync(this.serverScriptPath)) {
                this.logger.info(`server.js is up to date (${latestVersion})`);
                return;
            }
            
            const downloadUrl = `https://dl.strem.io/server/${latestVersion}/desktop/server.js`;
            this.latestServerJsUrl = downloadUrl;

            const isMissing = !existsSync(this.serverScriptPath);
            const promptMessage = isMissing 
                ? `The local streaming server (server.js) version ${latestVersion} is required to play videos. Do you want to download and install it now?`
                : `A new version of the Stremio local server (${latestVersion}) is available. Do you want to update it now?`;

            const response = await Helpers.showAlert(
                "question",
                "Server Update",
                promptMessage,
                ["Yes", "No", "No and don't ask again"]
            );
            
            if (response === 0) { // Yes
                if (!isMissing) {
                    this.logger.info(`Deleting old server.js to trigger update to ${latestVersion}...`);
                    if (existsSync(this.serverScriptPath)) {
                        unlinkSync(this.serverScriptPath);
                    }
                    if (existsSync(currentVersionPath)) {
                        unlinkSync(currentVersionPath);
                    }
                }
                // Write the new version to version.txt so that when they manually download it, the version is tracked
                if (!existsSync(this.streamingServerDir)) {
                    mkdirSync(this.streamingServerDir, { recursive: true });
                }
                writeFileSync(currentVersionPath, latestVersion, "utf8");
                
            } else if (response === 2) { // No and don't ask again
                writeFileSync(skipVersionPath, latestVersion, "utf8");
                this.logger.info(`Saved skip preference for version ${latestVersion}`);
            }
            
        } catch (error) {
            this.logger.error("Failed to check for server.js updates: " + error);
        }
    }

    public static start() {
        if (!existsSync(this.streamingServerDir)) {
            this.logger.warn(`Streaming server directory not found, creating: ${this.streamingServerDir}.`);
            mkdirSync(this.streamingServerDir);
        }

        if (!existsSync(this.serverScriptPath)) {
            this.logger.error("Server script not found: " + this.serverScriptPath);
            process.exit(1);
        }

        const ffmpegPath = this.getFFmpegPath();
        const ffprobePath = this.getFFprobePath();

        if (!existsSync(ffmpegPath)) {
            this.logger.error(`FFmpeg not found: ${ffmpegPath}`);
        }

        if (!existsSync(ffprobePath)) {
            this.logger.error(`FFprobe not found: ${ffprobePath}`);
        }

        this.logger.info(`Using FFmpeg: ${ffmpegPath}`);
        this.logger.info(`Using FFprobe: ${ffprobePath}`);

        const logStream = createWriteStream(this.logFilePath, { flags: "a" });

        setTimeout(() => {
            const child = fork(this.serverScriptPath, [], {
                stdio: ["ignore", "pipe", "pipe", "ipc"],
                env: {
                    ...process.env,
                    FFMPEG_BIN: ffmpegPath,
                    FFPROBE_BIN: ffprobePath,
                },
            });

            if (child.stdout) child.stdout.pipe(logStream);
            if (child.stderr) child.stderr.pipe(logStream);

            this.logger.info("Streaming server started with PID: " + child.pid);

            process.on("exit", () => {
                this.logger.info("Shutting down streaming server...");
                logStream.end();
                if (child && !child.killed) child.kill("SIGINT");
            });
        }, 0);
    }
}

export default StreamingServer;
