import { spawn, execSync } from "child_process";
import * as unzipper from "unzipper";
import { createWriteStream, existsSync, mkdirSync, chmodSync, unlinkSync, readFileSync, writeFileSync, createReadStream } from "fs";
import { join } from "path";
import { getLogger } from "./logger";
import Properties from "../core/Properties";
import https from "https";
import Helpers from "./Helpers";
import { STREMIO_SERVER_GO_RELEASES_API } from "../constants";

class StremioServerGo {
    private static logger = getLogger("StremioServerGo");

    private static serverGoDir = join(Properties.enhancedPath, "stremio-server-go");
    private static dataDir = join(StremioServerGo.serverGoDir, "data");
    private static binaryName = process.platform === "win32" ? "stremio-server.exe" : "stremio-server";
    private static binaryPath = join(StremioServerGo.serverGoDir, StremioServerGo.binaryName);
    private static versionFilePath = join(StremioServerGo.serverGoDir, "version.txt");
    private static skipVersionPath = join(Properties.enhancedPath, "skip_server_go_version.txt");
    private static logFilePath = join(Properties.enhancedPath, "stremio-server.log");

    // Check if the binary exists and is ready to run
    public static binaryExists(): boolean {
        return existsSync(this.binaryPath);
    }

    // Get the directory where stremio-server-go is stored
    public static getServerGoDir(): string {
        return this.serverGoDir;
    }

    // Determine the correct release asset name for the current platform/arch
    private static getAssetName(): string {
        const archMap: Record<string, string> = {
            x64: "x86_64",
            arm64: "arm64",
        };

        const platformMap: Record<string, string> = {
            win32: "Windows",
            darwin: "Darwin",
            linux: "Linux",
        };

        const arch = archMap[process.arch];
        const platform = platformMap[process.platform];

        if (!arch || !platform) {
            throw new Error(`Unsupported platform/arch: ${process.platform}/${process.arch}`);
        }

        const ext = process.platform === "win32" ? "zip" : "tar.gz";
        return `stremio-server_${platform}_${arch}.${ext}`;
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

    // Fetch the latest release info from GitHub API
    private static async fetchLatestRelease(): Promise<any | null> {
        try {
            const data = await this.fetchText(STREMIO_SERVER_GO_RELEASES_API);
            return JSON.parse(data);
        } catch (err) {
            this.logger.error("Error fetching stremio-server-go release: " + err);
            return null;
        }
    }

    // Download and extract the stremio-server-go binary
    public static async downloadBinary(): Promise<boolean> {
        try {
            // Ensure directory exists
            if (!existsSync(this.serverGoDir)) {
                mkdirSync(this.serverGoDir, { recursive: true });
            }

            this.logger.info("Fetching latest stremio-server-go release info...");
            const release = await this.fetchLatestRelease();
            if (!release || !release.assets) {
                this.logger.error("Failed to fetch release info from GitHub.");
                return false;
            }

            const assetName = this.getAssetName();
            const asset = release.assets.find((a: any) => a.name === assetName);
            if (!asset) {
                this.logger.error(`Could not find release asset: ${assetName}`);
                return false;
            }

            const downloadUrl = asset.browser_download_url;
            const archivePath = join(this.serverGoDir, assetName);

            this.logger.info(`Downloading stremio-server-go from ${downloadUrl}...`);
            await this.downloadFile(downloadUrl, archivePath);
            this.logger.info("Download complete. Extracting...");

            // Extract the binary
            if (process.platform === "win32") {
                // Windows: extract .zip using unzipper
                await new Promise<void>((resolve, reject) => {
                    createReadStream(archivePath)
                        .pipe(unzipper.Extract({ path: this.serverGoDir }))
                        .on('close', resolve)
                        .on('error', reject);
                });
            } else {
                // macOS/Linux: extract .tar.gz using tar command
                execSync(`tar -xzf "${archivePath}" -C "${this.serverGoDir}"`, { encoding: "utf8" });
                // Set executable permissions
                chmodSync(this.binaryPath, 0o755);
            }

            // Cleanup archive
            if (existsSync(archivePath)) {
                unlinkSync(archivePath);
            }

            // Save version
            const version = release.tag_name || release.name || "unknown";
            writeFileSync(this.versionFilePath, version, "utf8");

            this.logger.info(`stremio-server-go ${version} extracted successfully.`);
            return existsSync(this.binaryPath);
        } catch (error) {
            this.logger.error(`Failed to download/extract stremio-server-go: ${error}`);
            return false;
        }
    }

    // Check for updates via GitHub Releases API
    public static async checkForUpdate(): Promise<void> {
        try {
            this.logger.info("Checking for stremio-server-go updates...");
            const release = await this.fetchLatestRelease();
            if (!release) {
                this.logger.warn("Could not fetch stremio-server-go release info.");
                return;
            }

            const latestVersion = release.tag_name || release.name;
            if (!latestVersion) {
                this.logger.warn("Could not determine latest stremio-server-go version.");
                return;
            }

            // Check skip preference
            if (existsSync(this.skipVersionPath)) {
                const skippedVersion = readFileSync(this.skipVersionPath, "utf8").trim();
                if (skippedVersion === latestVersion) {
                    this.logger.info(`User skipped stremio-server-go update to ${latestVersion}`);
                    return;
                }
            }

            // Check current version
            let currentVersion = "";
            if (existsSync(this.versionFilePath)) {
                currentVersion = readFileSync(this.versionFilePath, "utf8").trim();
            }

            if (currentVersion === latestVersion && existsSync(this.binaryPath)) {
                this.logger.info(`stremio-server-go is up to date (${latestVersion})`);
                return;
            }

            // Binary missing or outdated — prompt user
            const isMissing = !existsSync(this.binaryPath);
            const promptMessage = isMissing
                ? `The stremio-server-go streaming server (${latestVersion}) needs to be downloaded for video playback. Do you want to download it now?`
                : `A new version of stremio-server-go (${latestVersion}) is available (current: ${currentVersion}). Do you want to update it now?`;

            const response = await Helpers.showAlert(
                "question",
                "stremio-server-go Update",
                promptMessage,
                ["Yes", "No", "No and don't ask again"]
            );

            if (response === 0) { // Yes
                this.logger.info(`User accepted stremio-server-go update to ${latestVersion}`);
                // Delete old binary to trigger re-download
                if (!isMissing && existsSync(this.binaryPath)) {
                    unlinkSync(this.binaryPath);
                }
                if (existsSync(this.versionFilePath)) {
                    unlinkSync(this.versionFilePath);
                }
                // Remove skip file if it exists, since user is actively updating
                if (existsSync(this.skipVersionPath)) {
                    unlinkSync(this.skipVersionPath);
                }
            } else if (response === 2) { // No and don't ask again
                writeFileSync(this.skipVersionPath, latestVersion, "utf8");
                this.logger.info(`Saved skip preference for stremio-server-go version ${latestVersion}`);
            }
        } catch (error) {
            this.logger.error("Failed to check for stremio-server-go updates: " + error);
        }
    }

    // Ensure the binary is downloaded and ready
    public static async ensureBinary(): Promise<boolean> {
        if (existsSync(this.binaryPath)) {
            this.logger.info("stremio-server-go binary found.");
            return true;
        }

        this.logger.info("stremio-server-go binary not found. Downloading...");
        return await this.downloadBinary();
    }

    // Start the stremio-server-go process
    public static start(): void {
        if (!existsSync(this.serverGoDir)) {
            mkdirSync(this.serverGoDir, { recursive: true });
        }

        if (!existsSync(this.dataDir)) {
            mkdirSync(this.dataDir, { recursive: true });
        }

        if (!existsSync(this.binaryPath)) {
            this.logger.error("stremio-server-go binary not found: " + this.binaryPath);
            process.exit(1);
        }

        const logStream = createWriteStream(this.logFilePath, { flags: "a" });

        setTimeout(() => {
            const child = spawn(this.binaryPath, [], {
                stdio: ["ignore", "pipe", "pipe"],
                env: {
                    ...process.env,
                    APP_PATH: this.dataDir,
                },
            });

            if (child.stdout) child.stdout.pipe(logStream);
            if (child.stderr) child.stderr.pipe(logStream);

            this.logger.info("stremio-server-go started with PID: " + child.pid);

            process.on("exit", () => {
                this.logger.info("Shutting down stremio-server-go...");
                logStream.end();
                if (child && !child.killed) child.kill("SIGTERM");
            });
        }, 0);
    }
}

export default StremioServerGo;
