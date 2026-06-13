import { ipcMain, BrowserWindow } from 'electron';
import { execFile } from 'child_process';
import { existsSync } from 'fs';
import * as net from 'net';
import { getLogger } from '../utils/logger';
import { IPC_CHANNELS } from '../constants';
import { VALID_EXTERNAL_PLAYERS, type ExternalPlayer } from '../interfaces/ExternalPlayerTypes';

const logger = getLogger("ExternalPlayerController");

const MPV_SOCKET = process.platform === 'win32' ? '\\\\.\\pipe\\mpvsocket' : '/tmp/mpvsocket';
const VLC_HTTP_PORT = 9090;
const VLC_HTTP_PASSWORD = 'stremio';

const PLAYER_PATHS: Record<string, Record<string, string[]>> = {
    win32: {
        vlc: ['C:\\Program Files\\VideoLAN\\VLC\\vlc.exe', 'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe'],
        mpv: ['C:\\Program Files\\mpv\\mpv.exe', 'C:\\Program Files (x86)\\mpv\\mpv.exe'],
    },
    darwin: {
        vlc: ['/Applications/VLC.app/Contents/MacOS/VLC'],
        mpv: ['/usr/local/bin/mpv', '/opt/homebrew/bin/mpv'],
    },
    linux: {
        vlc: ['/usr/bin/vlc'],
        mpv: ['/usr/bin/mpv'],
    },
};

let pollInterval: ReturnType<typeof setInterval> | null = null;

function findPlayerPath(player: 'vlc' | 'mpv'): string | null {
    const paths = PLAYER_PATHS[process.platform]?.[player] ?? [];
    return paths.find(p => existsSync(p)) ?? null;
}

function getMpvPosition(): Promise<number | null> {
    return new Promise((resolve) => {
        const socket = net.createConnection(MPV_SOCKET);
        const request = JSON.stringify({ command: ['get_property', 'time-pos'] }) + '\n';
        let resolved = false;

        const done = (val: number | null) => {
            if (!resolved) { resolved = true; resolve(val); socket.destroy(); }
        };

        socket.on('connect', () => socket.write(request));
        socket.on('data', (data) => {
            try { done(JSON.parse(data.toString()).data ?? null); }
            catch { done(null); }
        });
        socket.on('error', () => done(null));
        setTimeout(() => done(null), 1000);
    });
}

async function getVlcPosition(): Promise<number | null> {
    try {
        const auth = Buffer.from(`:${VLC_HTTP_PASSWORD}`).toString('base64');
        const res = await fetch(`http://localhost:${VLC_HTTP_PORT}/requests/status.json`, {
            headers: { Authorization: `Basic ${auth}` }
        });
        if (!res.ok) return null;
        const data = await res.json() as any;
        return data.time ?? null;
    } catch {
        return null;
    }
}

function startPolling(player: ExternalPlayer) {
    if (pollInterval) clearInterval(pollInterval);

    pollInterval = setInterval(async () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (!win) return;

        const position = player === 'mpv'
            ? await getMpvPosition()
            : await getVlcPosition();

        if (position !== null) {
            win.webContents.send(IPC_CHANNELS.EXTERNAL_PLAYER_POSITION, { position });
        } else {
            // player closed
            clearInterval(pollInterval!);
            pollInterval = null;
            win.webContents.send(IPC_CHANNELS.EXTERNAL_PLAYER_CLOSED);
        }
    }, 1500);
}

export const externalPlayerController = {
    initIPC: () => {
        ipcMain.handle(IPC_CHANNELS.LAUNCH_EXTERNAL_PLAYER, (_, player: string, streamUrl: string, customPath?: string) => {
            if (!VALID_EXTERNAL_PLAYERS.includes(player as ExternalPlayer) || player === 'disabled') {
                return { success: false, error: `Invalid player: ${player}` };
            }

            const playerPath = customPath || findPlayerPath(player as 'vlc' | 'mpv');
            if (!playerPath) {
                return { success: false, error: `${player} not found. Please install it or set a custom path in settings.` };
            }

            const args = player === 'mpv'
                ? [streamUrl, `--input-ipc-server=${MPV_SOCKET}`]
                : [streamUrl, '--extraintf=http', `--http-password=${VLC_HTTP_PASSWORD}`, `--http-port=${VLC_HTTP_PORT}`];

            logger.info(`Launching ${player} at ${playerPath}`);

            const child = execFile(playerPath, args, (err) => {
                if (err) logger.error(`Failed to launch ${player}: ${err.message}`);
            });

            child.on('exit', () => {
                if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
                const win = BrowserWindow.getAllWindows()[0];
                if (win) win.webContents.send(IPC_CHANNELS.EXTERNAL_PLAYER_CLOSED);
            });

            child.unref();

            // give the player a moment to start before polling
            setTimeout(() => startPolling(player as ExternalPlayer), 2000);

            const win = BrowserWindow.getAllWindows()[0];
            if (win) win.webContents.send(IPC_CHANNELS.EXTERNAL_PLAYER_LAUNCHED);

            return { success: true };
        });

        ipcMain.handle(IPC_CHANNELS.GET_EXTERNAL_PLAYER_PATHS, () => ({
            vlc: findPlayerPath('vlc'),
            mpv: findPlayerPath('mpv'),
        }));
    }
};
