import { app } from "electron";
import { createReadStream, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { basename, extname, join } from "path";
import { randomBytes } from "crypto";
import http from "http";
import { AddressInfo } from "net";
import { getLogger } from "./logger";

const logger = getLogger("DownloadLibrary");

/** What a download is, as given by the plugin that started it. */
export interface DownloadMeta {
    videoId: string;      // stream id: "tt0903747:1:2" for an episode, "tt0111161" for a movie
    metaId: string;       // "tt0903747"
    type: string;         // "series" | "movie" | ...
    name: string;         // series or movie name
    season?: number | null;
    episode?: number | null;
    title?: string | null; // episode title
    poster?: string | null;
}

export interface LibraryEntry extends DownloadMeta {
    path: string;
    size: number;
    token: string;
    completedAt: string;
}

export interface LibraryItem extends LibraryEntry {
    playUrl: string;
}

const CONTENT_TYPES: Record<string, string> = {
    ".mp4": "video/mp4",
    ".m4v": "video/mp4",
    ".mkv": "video/x-matroska",
    ".webm": "video/webm",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".ts": "video/mp2t",
};

/**
 * Remembers downloaded files and serves them on 127.0.0.1 so Stremio's player can play them.
 * The server is also a minimal Stremio stream addon (/manifest.json, /stream/:type/:id.json),
 * which lets the player find the next downloaded episode on its own. Only files recorded in
 * the library are served, each behind a random token.
 */
class DownloadLibrary {
    private entries: LibraryEntry[] | null = null;
    private server: http.Server | null = null;
    private baseUrl: Promise<string> | null = null;

    private get filePath(): string {
        return join(app.getPath("userData"), "downloads-library.json");
    }

    private load(): LibraryEntry[] {
        if (this.entries) return this.entries;
        try {
            this.entries = existsSync(this.filePath) ? JSON.parse(readFileSync(this.filePath, "utf-8")) : [];
        } catch (err) {
            logger.error(`Could not read the downloads library: ${err}`);
            this.entries = [];
        }
        return this.entries!;
    }

    private save(): void {
        writeFileSync(this.filePath, JSON.stringify(this.entries ?? [], null, 2));
    }

    /** Entries whose file is still on disk. */
    private available(): LibraryEntry[] {
        return this.load().filter(e => existsSync(e.path));
    }

    public add(meta: DownloadMeta, path: string): void {
        const entries = this.load().filter(e => e.videoId !== meta.videoId && e.path !== path);
        entries.push({
            videoId: meta.videoId,
            metaId: meta.metaId,
            type: meta.type,
            name: meta.name,
            season: meta.season ?? null,
            episode: meta.episode ?? null,
            title: meta.title ?? null,
            poster: meta.poster ?? null,
            path,
            size: statSync(path).size,
            token: randomBytes(16).toString("hex"),
            completedAt: new Date().toISOString(),
        });
        this.entries = entries;
        this.save();
    }

    public async list(metaId: string): Promise<LibraryItem[]> {
        const base = await this.serverUrl();
        return this.available()
            .filter(e => e.metaId === metaId)
            .sort((a, b) => (a.season ?? 0) - (b.season ?? 0) || (a.episode ?? 0) - (b.episode ?? 0))
            .map(e => ({ ...e, playUrl: this.fileUrl(base, e) }));
    }

    /** Everything downloaded that is still on disk, newest first. */
    public async listAll(): Promise<LibraryItem[]> {
        const base = await this.serverUrl();
        return this.available()
            .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
            .map(e => ({ ...e, size: statSync(e.path).size, playUrl: this.fileUrl(base, e) }));
    }

    public paths(): Set<string> {
        return new Set(this.load().map(e => e.path));
    }

    /** Deletes the file from disk and forgets it. */
    public remove(videoId: string): boolean {
        const entry = this.load().find(e => e.videoId === videoId);
        if (!entry) return false;
        if (existsSync(entry.path)) unlinkSync(entry.path);
        this.entries = this.load().filter(e => e !== entry);
        this.save();
        return true;
    }

    public has(path: string): boolean {
        return this.load().some(e => e.path === path);
    }

    private fileUrl(base: string, e: LibraryEntry): string {
        return `${base}/file/${e.token}/${encodeURIComponent(basename(e.path))}`;
    }

    public serverUrl(): Promise<string> {
        if (this.baseUrl) return this.baseUrl;
        this.baseUrl = new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => this.handle(req, res));
            this.server.on("error", reject);
            this.server.listen(0, "127.0.0.1", () => {
                const { port } = this.server!.address() as AddressInfo;
                logger.info(`Serving downloads on http://127.0.0.1:${port}`);
                resolve(`http://127.0.0.1:${port}`);
            });
        });
        return this.baseUrl;
    }

    private async handle(req: http.IncomingMessage, res: http.ServerResponse) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const base = await this.serverUrl();
        const url = new URL(req.url || "/", base);
        const json = (body: unknown) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(body));
        };

        if (url.pathname === "/manifest.json") {
            return json({
                id: "com.stremio-enhanced.downloads",
                version: "1.0.0",
                name: "Downloaded",
                description: "Videos downloaded with Stremio Enhanced",
                resources: ["stream"],
                types: ["movie", "series"],
                catalogs: [],
            });
        }

        const stream = url.pathname.match(/^\/stream\/([^/]+)\/([^/]+)\.json$/);
        if (stream) {
            const videoId = decodeURIComponent(stream[2]);
            const streams = this.available()
                .filter(e => e.videoId === videoId)
                .map(e => ({
                    url: this.fileUrl(base, e),
                    name: "Downloaded",
                    description: basename(e.path),
                    behaviorHints: { filename: basename(e.path), bingeGroup: `enhanced-downloads-${e.metaId}` },
                }));
            return json({ streams });
        }

        const file = url.pathname.match(/^\/file\/([0-9a-f]{32})\//);
        const entry = file && this.available().find(e => e.token === file[1]);
        if (!entry) {
            res.writeHead(404);
            return res.end();
        }
        this.sendFile(req, res, entry.path);
    }

    private sendFile(req: http.IncomingMessage, res: http.ServerResponse, path: string) {
        const size = statSync(path).size;
        const type = CONTENT_TYPES[extname(path).toLowerCase()] || "application/octet-stream";
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
        let start = 0;
        let end = size - 1;

        if (range) {
            if (range[1]) {
                start = parseInt(range[1], 10);
                if (range[2]) end = Math.min(parseInt(range[2], 10), size - 1);
            } else if (range[2]) {
                start = Math.max(size - parseInt(range[2], 10), 0);
            }
            if (start > end || start >= size) {
                res.writeHead(416, { "Content-Range": `bytes */${size}` });
                res.end();
                return;
            }
            res.writeHead(206, {
                "Content-Type": type,
                "Content-Length": end - start + 1,
                "Content-Range": `bytes ${start}-${end}/${size}`,
                "Accept-Ranges": "bytes",
            });
        } else {
            res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
        }

        if (req.method === "HEAD") {
            res.end();
            return;
        }
        const stream = createReadStream(path, { start, end });
        stream.on("error", () => res.destroy());
        stream.pipe(res);
    }
}

export default new DownloadLibrary();
