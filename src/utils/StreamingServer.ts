import { fork } from "child_process";
import { createWriteStream, existsSync, mkdir, mkdirSync } from "fs";
import { dirname, join } from "path";
import { getLogger } from "./logger";
import { app } from "electron";
import Properties from "../core/Properties";

class StreamingServer {
    private static logger = getLogger("StreamingServer");

    private static streamingServerDir = join(dirname(app.getPath('exe')), "streamingserver");
    private static serverScriptPath = join(this.streamingServerDir, "server.js");
    private static logFilePath = join(Properties.enhancedPath, "stremio-server.log");
    private static ffmpegPath = process.platform == "win32" ? join(this.streamingServerDir, "ffmpeg.exe") : join(this.streamingServerDir, "ffmpeg");
    private static ffprobePath = process.platform == "win32" ? join(this.streamingServerDir, "ffprobe.exe") : join(this.streamingServerDir, "ffprobe");

    public static start() {
        if(!existsSync(this.streamingServerDir)) {
            this.logger.warn(`Streaming server directory not found, creating: ${this.streamingServerDir}. You need the following files: server.js, ffmpeg, and ffprobe`);
            mkdirSync(this.streamingServerDir);
        }

        if(!existsSync(this.serverScriptPath)) {
            this.logger.error("Server script not found: " + this.serverScriptPath);
            process.exit(1);
        }

        if(!existsSync(this.ffmpegPath)) {
            this.logger.error(`FFmpeg not found: ${this.ffmpegPath}. Please place ffmpeg in the same directory as the app.`);
        }

        if(!existsSync(this.ffprobePath)) {
            this.logger.error(`FFprobe not found: ${this.ffprobePath}. Please place ffprobe in the same directory as the app.`);
        }

        const logStream = createWriteStream(this.logFilePath, { flags: "a" });

        setTimeout(() => {
            const child = fork(this.serverScriptPath, [], {
                stdio: ["ignore", "pipe", "pipe", "ipc"],
                env: {
                    ...process.env,
                    FFMPEG_BIN: this.ffmpegPath,
                    FFPROBE_BIN: this.ffprobePath,
                },
            });

            if (child.stdout) child.stdout.pipe(logStream);
            if (child.stderr) child.stderr.pipe(logStream);

            this.logger.info("Streaming server started with PID: " + child.pid);
        }, 0);
    }
}

export default StreamingServer;