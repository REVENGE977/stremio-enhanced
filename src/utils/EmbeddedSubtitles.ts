// For some reason, some videos embedded subtitles don't work by default on Chromium-based browsers
// This class is meant to be a workaround to extract embedded subtitles using FFmpeg and FFprobe from Enhanced itself in case they don't load natively.

import { spawn } from "child_process";
import { dirname, join, resolve } from "path";
import Properties from "../core/Properties";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { getLogger } from "./logger";
import StremioService from "./StremioService";
import FFprobeStream from "../interfaces/FFprobeStream";

class EmbeddedSubtitles {
	private static logger = getLogger("EmbeddedSubtitles");

	private static async findStreamingServerDir(): Promise<string> {
		if(Properties.isUsingStremioService == false) {
			return join(Properties.enhancedPath, "streamingserver");
		} else {
			return dirname(StremioService.findExecutable()!);
		}
	}
	
	public static async extractSubtitles(streamURL: string): Promise<object[]> {
		const streamingServerDir = await this.findStreamingServerDir();
		this.removeExistingVTTFiles(streamingServerDir);

		const targetDir = resolve(streamingServerDir, "subtitles");
		if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
		
		const ffprobe = spawn(`${streamingServerDir}\\ffprobe`, [
			"-v", "error",
			"-select_streams", "s",
			"-show_entries", "stream=index,codec_name:stream_tags=language,title",
			"-of", "json",
			`"${streamURL}"`
		], { stdio: "pipe", shell: true });


		let probeOutput = "";
		for await (const chunk of ffprobe.stdout) probeOutput += chunk;
		
		const exitCodeProbe: number = await new Promise(resolve => ffprobe.on("close", resolve));
		if (exitCodeProbe !== 0) throw new Error("ffprobe failed");
		
		const streams: FFprobeStream[] = JSON.parse(probeOutput).streams;
		if (!streams || streams.length === 0) return [];
		
		const outPaths: object[] = [];
		
		await Promise.all(streams.map(stream => {
			return new Promise<void>((resolve, reject) => {
				// Short ISO lang code
				const shortLang = stream.tags?.language ?? `track${stream.index}`;
				// Descriptive title from MKV / FFprobe
				const descriptiveName = stream.tags?.title ?? shortLang;

				// Output file
				const outFile = join(targetDir, `subs_${shortLang}_${stream.index}.vtt`);

				outPaths.push({ shortLang, descriptiveName, path: outFile });

				const isVttNative = stream.codec_name === "webvtt" || stream.codec_name === "vtt";

				const args = [
					"-y", // overwrite
					"-i", streamURL,
					"-map", `0:${stream.index}`,
					"-an", "-vn", // ignore audio/video
					...(isVttNative ? ["-c", "copy"] : ["-c:s", "webvtt"]),
					outFile
				];

				const ffmpeg = spawn(`${streamingServerDir}\\ffmpeg`, args, { stdio: "ignore" });

				ffmpeg.on("error", reject);
				ffmpeg.on("close", code => {
					if (code !== 0) reject(new Error(`ffmpeg failed on track ${descriptiveName}`));
					else resolve();
				});
			});
		}));

		
		return outPaths;
	}

	private static removeExistingVTTFiles(dir: string) {
		const files = readdirSync(dir);
		files.forEach(file => {
			if (file.endsWith(".vtt")) {
				const filePath = join(dir, file);
				try
				{
					unlinkSync(filePath);
				} catch (err)
				{
					this.logger.error(`Failed to delete file ${filePath}: ${err}`);
				}
			}
		});		
	}
}

export default EmbeddedSubtitles;
