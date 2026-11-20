import { app, ipcMain, BrowserWindow, dialog, shell } from "electron";
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statfsSync, statSync, unlinkSync, writeFileSync } from "fs";
import { dirname, join, resolve, sep, extname, isAbsolute } from "path";
import { homedir } from "os";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { getLogger } from "../utils/logger";
import { IPC_CHANNELS } from "../constants";
import DownloadLibrary, { DownloadMeta } from "../utils/DownloadLibrary";

const logger = getLogger("DownloadController");

type DownloadState = "queued" | "preparing" | "progressing" | "completed" | "failed" | "cancelled";

/** What to download, as given by the plugin. Torrents are fetched through Stremio's streaming server. */
export interface DownloadSource {
    url?: string | null;
    infoHash?: string | null;
    fileIdx?: number | null;
    sources?: string[] | null;
    filename?: string | null;
}

export interface DownloadRequest {
    id: string;
    name: string;
    source: DownloadSource;
    relativePath: string;        // folder/name, without extension
    folder?: string | null;      // custom base folder; default downloads folder when empty
    serverUrl?: string | null;   // streaming server, for torrents
    meta?: DownloadMeta | null;  // recorded in the library when finished
}

interface DownloadJob extends DownloadRequest {
    state: DownloadState;
    received: number;
    total: number | null;
    error?: string;
    url?: string | null;         // resolved http URL
    target?: string | null;      // resolved file path, with extension
}

export interface DownloadProgress {
    id: string;
    name: string;
    state: DownloadState;
    received: number;
    total: number | null;
    path: string | null;
    error?: string;
    metaId: string | null;
    season: number | null;
}

const PROGRESS_INTERVAL_MS = 500;
const CONCURRENCY = 2;
const SERVER_WAIT_MS = 120_000;
const SERVER_RETRY_MS = 3_000;
const VIDEO_EXT = /\.(mkv|mp4|avi|webm|mov|m4v|ts|wmv|flv)$/i;

const jobs = new Map<string, DownloadJob>();
const controllers = new Map<string, AbortController>();
let running = 0;
// Files written in this session; showDownload only reveals these (or library entries).
const savedFiles = new Set<string>();

const MIME_EXTENSIONS: Record<string, string> = {
    "video/mp4": ".mp4",
    "video/x-matroska": ".mkv",
    "video/webm": ".webm",
    "video/x-msvideo": ".avi",
    "video/quicktime": ".mov",
    "video/mp2t": ".ts",
};

// Electron returns the home folder itself when the system has no XDG "Downloads" entry
// (e.g. no ~/.config/user-dirs.dirs); never drop files straight into the home folder.
function downloadsRoot(): string {
    const dir = resolve(app.getPath("downloads"));
    return dir === resolve(homedir()) ? join(dir, "Downloads") : dir;
}

// Keeps every path segment free of characters that are invalid on common filesystems.
function sanitizeSegment(segment: string): string {
    return segment
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
        .replace(/^\.+/, "_")
        .trim()
        .slice(0, 180) || "_";
}

// A folder chosen by the user (absolute and existing) or the default downloads folder.
function baseFolder(folder?: string | null): string {
    if (!folder) return downloadsRoot();
    const dir = resolve(folder);
    if (!isAbsolute(folder) || !existsSync(dir) || !statSync(dir).isDirectory()) {
        throw new Error(`Download folder not found: ${folder}`);
    }
    return dir;
}

function resolveTarget(relativePath: string, folder?: string | null): string {
    const root = baseFolder(folder);
    const segments = relativePath.split(/[\\/]+/).filter(Boolean).map(sanitizeSegment);
    const target = resolve(root, ...segments);
    if (!target.startsWith(resolve(root) + sep)) {
        throw new Error("Download path escapes the downloads folder");
    }
    return target;
}

function extensionFromResponse(res: Response, url: string): string {
    const disposition = res.headers.get("content-disposition") || "";
    const named = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (named) {
        const ext = extname(decodeURIComponent(named[1]));
        if (ext) return ext;
    }
    const fromUrl = extname(new URL(res.url || url).pathname);
    if (/^\.[a-z0-9]{2,4}$/i.test(fromUrl)) return fromUrl;
    const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    return MIME_EXTENSIONS[type] || "";
}

// ---------- persistence ----------

const ACTIVE: DownloadState[] = ["queued", "preparing", "progressing"];

function queueFile(): string {
    return join(app.getPath("userData"), "downloads-queue.json");
}

/** Saves unfinished jobs so they continue after a reload or an app restart. */
function persist(): void {
    const unfinished = [...jobs.values()]
        .filter(j => ACTIVE.includes(j.state))
        .map(({ id, name, source, relativePath, folder, serverUrl, meta, url, target }) =>
            ({ id, name, source, relativePath, folder, serverUrl, meta, url, target }));
    try {
        writeFileSync(queueFile(), JSON.stringify(unfinished, null, 2));
    } catch (err) {
        logger.error(`Could not save the download queue: ${err}`);
    }
}

function restore(): void {
    let saved: (DownloadRequest & { url?: string | null; target?: string | null })[] = [];
    try {
        if (existsSync(queueFile())) saved = JSON.parse(readFileSync(queueFile(), "utf-8"));
    } catch (err) {
        logger.error(`Could not read the download queue: ${err}`);
    }
    saved.forEach(job => {
        const part = job.target ? `${job.target}.part` : null;
        jobs.set(job.id, {
            ...job,
            state: "queued",
            received: part && existsSync(part) ? statSync(part).size : 0,
            total: null,
        });
    });
    if (saved.length) logger.info(`Resuming ${saved.length} unfinished download(s)`);
}

// ---------- progress ----------

function progressOf(job: DownloadJob): DownloadProgress {
    return {
        id: job.id,
        name: job.name,
        state: job.state,
        received: job.received,
        total: job.total,
        path: job.target ?? null,
        error: job.error,
        metaId: job.meta?.metaId ?? null,
        season: job.meta?.season ?? null,
    };
}

function send(job: DownloadJob) {
    const progress = progressOf(job);
    BrowserWindow.getAllWindows().forEach(win => {
        if (!win.isDestroyed()) win.webContents.send(IPC_CHANNELS.DOWNLOAD_PROGRESS, progress);
    });
}

function setState(job: DownloadJob, state: DownloadState, error?: string) {
    job.state = state;
    job.error = error;
    persist();
    send(job);
}

// ---------- queue ----------

function pump() {
    for (const job of jobs.values()) {
        if (running >= CONCURRENCY) return;
        if (job.state !== "queued") continue;
        running++;
        run(job).finally(() => {
            running--;
            pump();
        });
    }
}

const sleep = (ms: number, signal: AbortSignal) => new Promise<void>((done, fail) => {
    const timer = setTimeout(done, ms);
    signal.addEventListener("abort", () => { clearTimeout(timer); fail(new Error("aborted")); }, { once: true });
});

/** Turns the job's source into an http URL and, when it can be known, the file extension. */
async function resolveSource(job: DownloadJob, signal: AbortSignal): Promise<{ url: string; ext: string }> {
    const { source } = job;
    if (!source.infoHash) {
        if (!source.url || !/^https?:\/\//i.test(source.url)) throw new Error("Only http(s) URLs can be downloaded");
        const fromName = (source.filename || new URL(source.url).pathname).match(VIDEO_EXT)?.[0] || "";
        return { url: source.url, ext: fromName };
    }

    const server = (job.serverUrl || "http://127.0.0.1:11470/").replace(/\/?$/, "/");
    const hash = source.infoHash.toLowerCase();
    const trackers = (source.sources || []).filter(s => s.startsWith("tracker:"));
    const started = Date.now();
    let res: Response | null = null;
    // Right after the app starts the streaming server may not be up yet: keep trying for a while.
    while (!res) {
        try {
            res = await fetch(`${server}${hash}/create`, {
                method: "POST",
                signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    torrent: { infoHash: hash },
                    peerSearch: { sources: [`dht:${hash}`, ...trackers], min: 40, max: 150 },
                }),
            });
        } catch (err) {
            if (signal.aborted) throw err;
            if (Date.now() - started > SERVER_WAIT_MS) throw new Error("Stremio streaming server is not running");
            await sleep(SERVER_RETRY_MS, signal);
        }
    }
    if (!res.ok) throw new Error(`Streaming server error (HTTP ${res.status})`);
    const files: { name: string; length: number }[] = (await res.json()).files || [];

    let fileIdx = typeof source.fileIdx === "number" ? source.fileIdx : -1;
    if (!files[fileIdx]) {
        fileIdx = files.reduce((best, f, i) =>
            VIDEO_EXT.test(f.name) && (best < 0 || f.length > files[best].length) ? i : best, -1);
    }
    if (fileIdx < 0) throw new Error("No video file found in the torrent");
    const ext = files[fileIdx].name.match(/\.[a-z0-9]{2,4}$/i)?.[0] || "";
    return { url: `${server}${hash}/${fileIdx}`, ext };
}

/**
 * Downloads one job. A partial `.part` file from an earlier attempt (also from before an app
 * restart) is resumed with a Range request when the server supports it.
 */
async function run(job: DownloadJob): Promise<void> {
    const controller = new AbortController();
    controllers.set(job.id, controller);
    let timer: NodeJS.Timeout | null = null;

    try {
        setState(job, "preparing");
        if (!job.url) {
            const { url, ext } = await resolveSource(job, controller.signal);
            job.url = url;
            if (ext) job.target = resolveTarget(`${job.relativePath}${ext}`, job.folder);
            persist();
        }

        let target = job.target || resolveTarget(job.relativePath, job.folder);
        mkdirSync(dirname(target), { recursive: true });
        let partPath = `${target}.part`;
        const resumeFrom = job.target && existsSync(partPath) ? statSync(partPath).size : 0;

        const res = await fetch(job.url, {
            signal: controller.signal,
            headers: resumeFrom > 0 ? { Range: `bytes=${resumeFrom}-` } : {},
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        if (!job.target) {
            target = `${target}${extensionFromResponse(res, job.url)}`;
            partPath = `${target}.part`;
            job.target = target;
            persist();
        }

        const resumed = res.status === 206 && resumeFrom > 0;
        const length = Number(res.headers.get("content-length")) || 0;
        job.received = resumed ? resumeFrom : 0;
        job.total = length ? length + job.received : null;
        if (resumed) logger.info(`Resuming ${job.id} from ${resumeFrom} bytes`);

        setState(job, "progressing");
        timer = setInterval(() => send(job), PROGRESS_INTERVAL_MS);

        const body = Readable.fromWeb(res.body as any);
        body.on("data", (chunk: Buffer) => { job.received += chunk.length; });
        await pipeline(body, createWriteStream(partPath, { flags: resumed ? "a" : "w" }));

        renameSync(partPath, target);
        savedFiles.add(target);
        if (job.meta?.videoId && job.meta.metaId) DownloadLibrary.add(job.meta, target);
        logger.info(`Download ${job.id} saved to ${target}`);
        setState(job, "completed");
    } catch (err) {
        if (controller.signal.aborted) {
            const partPath = job.target ? `${job.target}.part` : null;
            if (partPath && existsSync(partPath)) unlinkSync(partPath);
            setState(job, "cancelled");
        } else {
            logger.error(`Download ${job.id} failed: ${(err as Error).message}`);
            setState(job, "failed", (err as Error).message);
        }
    } finally {
        if (timer) clearInterval(timer);
        controllers.delete(job.id);
    }
}

function enqueue(requests: DownloadRequest[]): { id: string; success: boolean; error?: string }[] {
    const results = requests.map(request => {
        const existing = jobs.get(request.id);
        if (existing && ACTIVE.includes(existing.state)) {
            return { id: request.id, success: false, error: "Already downloading" };
        }
        try {
            // Validate early so a bad folder is reported to the caller instead of as a failed download.
            resolveTarget(request.relativePath, request.folder);
        } catch (err) {
            return { id: request.id, success: false, error: (err as Error).message };
        }
        const job: DownloadJob = { ...request, state: "queued", received: 0, total: null, url: null, target: null };
        jobs.delete(request.id); // re-insert at the end of the queue
        jobs.set(request.id, job);
        send(job);
        return { id: request.id, success: true };
    });
    persist();
    pump();
    return results;
}

function retry(id: string): boolean {
    const job = jobs.get(id);
    if (!job || job.state !== "failed") return false;
    job.url = null; // resolve the source again; keep the target so a .part is resumed
    job.received = 0;
    job.total = null;
    jobs.delete(id);
    jobs.set(id, job);
    setState(job, "queued");
    pump();
    return true;
}

// ---------- import of files downloaded before the library existed ----------

export interface ImportCandidate {
    path: string;
    size: number;
    type: "series" | "movie";
    name: string;             // series or movie name, from the folder/file names
    season: number | null;
    episode: number | null;
}

/**
 * Finds video files under the download folder(s) that are not in the library yet, using the
 * layout the plugin writes: "<Series>/Season N/<Series> - S01E02.ext" and "<Movie>/<Movie>.ext".
 * Other files named like "Some.Show.S01E02.mkv" inside "<Series>/..." are recognised too.
 */
function scanImportable(folders: (string | null | undefined)[]): ImportCandidate[] {
    const known = DownloadLibrary.paths();
    const roots = [...new Set(folders.map(f => {
        try { return baseFolder(f); } catch { return null; }
    }).filter((f): f is string => !!f))];
    const found: ImportCandidate[] = [];

    const walk = (dir: string, depth: number, trail: string[]) => {
        let entries;
        try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                if (depth < 3) walk(full, depth + 1, [...trail, entry.name]);
                continue;
            }
            if (!entry.isFile() || !VIDEO_EXT.test(entry.name) || known.has(full)) continue;
            const stem = entry.name.slice(0, -extname(entry.name).length);
            const ep = stem.match(/^(.*?)[\s._-]*S(\d{1,2})E(\d{1,3})/i);
            const size = statSync(full).size;
            if (ep && trail.length) {
                found.push({ path: full, size, type: "series", name: trail[0], season: Number(ep[2]), episode: Number(ep[3]) });
            } else if (!ep && trail.length === 1 && trail[0] === stem) {
                found.push({ path: full, size, type: "movie", name: stem, season: null, episode: null });
            }
        }
    };
    roots.forEach(root => walk(root, 0, []));
    return found;
}

function importFiles(items: { path: string; meta: DownloadMeta }[], folders: (string | null | undefined)[]): number {
    // Only files the scan would offer: video files inside the download folders, not yet in the library.
    const allowed = new Set(scanImportable(folders).map(c => c.path));
    let imported = 0;
    items.forEach(({ path, meta }) => {
        if (!allowed.has(path) || !meta?.videoId || !meta.metaId) return;
        DownloadLibrary.add(meta, path);
        imported++;
    });
    logger.info(`Imported ${imported} existing file(s) into the library`);
    return imported;
}

function cancel(id: string): boolean {
    const job = jobs.get(id);
    if (!job || !ACTIVE.includes(job.state)) return false;
    const controller = controllers.get(id);
    if (controller) controller.abort();
    else setState(job, "cancelled"); // still waiting in the queue
    return true;
}

export const downloadController = {
    initIPC: () => {
        restore();
        pump();

        ipcMain.handle(IPC_CHANNELS.ENQUEUE_DOWNLOADS, (_, requests: DownloadRequest[]) => enqueue(requests));
        // Running, queued and failed downloads. Finished ones are reported by the library,
        // which also knows when a file was deleted afterwards.
        ipcMain.handle(IPC_CHANNELS.GET_DOWNLOADS, () =>
            [...jobs.values()].filter(j => ACTIVE.includes(j.state) || j.state === "failed").map(progressOf));
        ipcMain.handle(IPC_CHANNELS.CANCEL_DOWNLOAD, (_, id: string) => cancel(id));
        ipcMain.handle(IPC_CHANNELS.RETRY_DOWNLOAD, (_, id: string) => retry(id));
        ipcMain.handle(IPC_CHANNELS.GET_ALL_DOWNLOADED, () => DownloadLibrary.listAll());
        ipcMain.handle(IPC_CHANNELS.SCAN_IMPORTABLE, (_, folders: (string | null)[]) => scanImportable(folders));
        ipcMain.handle(IPC_CHANNELS.IMPORT_DOWNLOADED, (_, items: { path: string; meta: DownloadMeta }[], folders: (string | null)[]) =>
            importFiles(items, folders));
        ipcMain.handle(IPC_CHANNELS.GET_DISK_SPACE, (_, folder?: string | null) => {
            try {
                const stats = statfsSync(baseFolder(folder));
                return { free: stats.bavail * stats.bsize, total: stats.blocks * stats.bsize };
            } catch (err) {
                return null;
            }
        });

        ipcMain.handle(IPC_CHANNELS.SHOW_DOWNLOAD, (_, path: string) => {
            const target = resolve(path);
            if ((!savedFiles.has(target) && !DownloadLibrary.has(target)) || !existsSync(target)) return false;
            shell.showItemInFolder(target);
            return true;
        });

        ipcMain.handle(IPC_CHANNELS.CHOOSE_DOWNLOAD_FOLDER, async (event, current?: string | null) => {
            const win = BrowserWindow.fromWebContents(event.sender);
            const options: Electron.OpenDialogOptions = {
                title: "Choose download folder",
                defaultPath: current && existsSync(current) ? current : downloadsRoot(),
                properties: ["openDirectory", "createDirectory"],
            };
            const result = win ? await dialog.showOpenDialog(win, options) : await dialog.showOpenDialog(options);
            return result.canceled || !result.filePaths.length ? null : result.filePaths[0];
        });

        ipcMain.handle(IPC_CHANNELS.GET_DOWNLOADED, (_, metaId: string) => DownloadLibrary.list(metaId));
        ipcMain.handle(IPC_CHANNELS.DELETE_DOWNLOADED, (_, videoId: string) => DownloadLibrary.remove(videoId));
        ipcMain.handle(IPC_CHANNELS.GET_LIBRARY_SERVER_URL, () => DownloadLibrary.serverUrl());

        ipcMain.handle(IPC_CHANNELS.GET_DOWNLOADS_PATH, () => downloadsRoot());
    },
};
