import { spawn, type ChildProcess } from 'child_process';
import { existsSync, rmSync, unlinkSync, writeFileSync } from 'fs';
import { ipcMain } from 'electron';
import { createConnection, type Socket } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import { IPC_CHANNELS } from '../constants';
import type {
    EmbeddedMpvCommand,
    EmbeddedMpvEnvironment,
    EmbeddedMpvStartPayload,
    EmbeddedMpvState,
    EmbeddedMpvTrack,
} from '../interfaces/EmbeddedMpv';
import { mainWindow, usesTransparentWindow } from '../main';
import { getLogger } from '../utils/logger';
import { resolvePlayerPath } from '../utils/PlayerBinaryResolver';

const logger = getLogger('EmbeddedMpvController');

type JsonResolver = {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
};

type MpvTrackPayload = {
    id?: number;
    type?: string;
    title?: string;
    lang?: string;
    selected?: boolean;
    external?: boolean;
    codec?: string;
};

type MpvMessage = {
    event?: string;
    error?: string;
    request_id?: number;
    name?: string;
    data?: unknown;
};

function createDefaultState(): EmbeddedMpvState {
    return {
        available: Boolean(resolvePlayerPath('mpv')),
        active: false,
        connected: false,
        loading: false,
        paused: false,
        timePos: 0,
        duration: 0,
        speed: 1,
        volume: 100,
        fullscreen: mainWindow?.isFullScreen() ?? false,
        eofReached: false,
        title: '',
        subtitleTracks: [],
        audioTracks: [],
        currentAudioTrackId: null,
        currentSubtitleTrackId: null,
    };
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeNativeWindowHandle(buffer: Buffer): string {
    let handle = 0n;

    for (let index = 0; index < buffer.length; index += 1) {
        handle += BigInt(buffer[index]) << BigInt(index * 8);
    }

    return handle.toString();
}

function buildMpvTrack(track: MpvTrackPayload): EmbeddedMpvTrack | null {
    if (typeof track.id !== 'number' || typeof track.type !== 'string') {
        return null;
    }

    return {
        id: track.id,
        type: track.type,
        label: track.title || track.lang || `${track.type} ${track.id}`,
        language: track.lang ?? null,
        selected: Boolean(track.selected),
        external: Boolean(track.external),
        codec: track.codec ?? null,
    };
}

function sortTracksById(tracks: EmbeddedMpvTrack[]): EmbeddedMpvTrack[] {
    return [...tracks].sort((left, right) => left.id - right.id);
}

function syncSelectedTrack(tracks: EmbeddedMpvTrack[], selectedTrackId: number | null): EmbeddedMpvTrack[] {
    const alreadyCorrect = tracks.every((track) =>
        track.selected === (selectedTrackId !== null && track.id === selectedTrackId),
    );
    if (alreadyCorrect) {
        return tracks;
    }

    if (selectedTrackId === null) {
        return tracks.map((track) => ({ ...track, selected: false }));
    }

    return tracks.map((track) => ({
        ...track,
        selected: track.id === selectedTrackId,
    }));
}

function resolveSelectedTrackId(tracks: EmbeddedMpvTrack[], fallbackTrackId: number | null): number | null {
    const selectedTrack = tracks.find((track) => track.selected);
    return selectedTrack ? selectedTrack.id : fallbackTrackId;
}

class EmbeddedMpvController {
    private mpvProcess: ChildProcess | null = null;
    private socket: Socket | null = null;
    private socketBuffer = '';
    private nextRequestId = 1;
    private pendingRequests = new Map<number, JsonResolver>();
    private state: EmbeddedMpvState = createDefaultState();
    private initialized = false;
    private preferenceFlagPath = '';
    private fullscreenListenersBound = false;

    public initIPC(preferenceFlagPath: string): void {
        if (this.initialized) {
            return;
        }

        this.preferenceFlagPath = preferenceFlagPath;
        this.initialized = true;
        this.bindFullscreenListeners();

        ipcMain.handle(IPC_CHANNELS.GET_EMBEDDED_MPV_ENVIRONMENT, () => this.getEnvironment());
        ipcMain.handle(IPC_CHANNELS.GET_EMBEDDED_MPV_STATE, () => this.getState());
        ipcMain.handle(IPC_CHANNELS.START_EMBEDDED_MPV, async (_event, payload: EmbeddedMpvStartPayload, customPath?: string) => {
            return this.start(payload, customPath);
        });
        ipcMain.handle(IPC_CHANNELS.STOP_EMBEDDED_MPV, async () => this.stop('renderer-request'));
        ipcMain.handle(IPC_CHANNELS.EMBEDDED_MPV_COMMAND, async (_event, command: EmbeddedMpvCommand) => {
            return this.handleCommand(command);
        });
        ipcMain.on(IPC_CHANNELS.SET_EMBEDDED_MPV_PREFERENCE, (_event, enabled: boolean) => {
            this.setPreference(enabled);
        });
    }

    public async shutdown(): Promise<void> {
        await this.stop('shutdown');
    }

    private getEnvironment(): EmbeddedMpvEnvironment {
        const mpvPath = resolvePlayerPath('mpv');

        return {
            available: Boolean(mpvPath),
            preferred: existsSync(this.preferenceFlagPath),
            transparentWindow: usesTransparentWindow,
            mpvPath,
        };
    }

    private getState(): EmbeddedMpvState {
        return { ...this.state };
    }

    private setPreference(enabled: boolean): void {
        if (enabled) {
            writeFileSync(this.preferenceFlagPath, '1');
            return;
        }

        try {
            unlinkSync(this.preferenceFlagPath);
        } catch {
            // ignore missing preference flag
        }
    }

    private bindFullscreenListeners(): void {
        if (this.fullscreenListenersBound || !mainWindow) {
            return;
        }

        this.fullscreenListenersBound = true;

        mainWindow.on('enter-full-screen', () => {
            if (this.mpvProcess || this.state.active) {
                this.setState({ fullscreen: true });
            }
        });

        mainWindow.on('leave-full-screen', () => {
            if (this.mpvProcess || this.state.active) {
                this.setState({ fullscreen: false });
            }
        });
    }

    private emitState(): void {
        mainWindow?.webContents.send(IPC_CHANNELS.EMBEDDED_MPV_STATE, this.getState());
    }

    private refreshAvailability(): void {
        this.state.available = Boolean(resolvePlayerPath('mpv'));
    }

    private setState(patch: Partial<EmbeddedMpvState>): void {
        this.state = {
            ...this.state,
            ...patch,
        };
        this.emitState();
    }

    private resetState(error?: string): void {
        this.state = createDefaultState();
        if (error) {
            this.state.error = error;
        }
        this.emitState();
    }

    private getIpcPath(): string {
        if (process.platform === 'win32') {
            return `\\\\.\\pipe\\stremio-enhanced-mpv-${process.pid}`;
        }

        return join(tmpdir(), `stremio-enhanced-mpv-${process.pid}.sock`);
    }

    private cleanupSocketPath(ipcPath: string): void {
        if (process.platform === 'win32') {
            return;
        }

        try {
            rmSync(ipcPath, { force: true });
        } catch {
            // ignore socket cleanup issues
        }
    }

    private async start(payload: EmbeddedMpvStartPayload, customPath?: string): Promise<{ success: boolean; error?: string }> {
        if (!mainWindow) {
            return { success: false, error: 'Main window is not available.' };
        }

        if (!usesTransparentWindow) {
            return {
                success: false,
                error: 'Embedded MPV requires a transparent window. Enable the playback mode in settings and restart the app.',
            };
        }

        const mpvPath = resolvePlayerPath('mpv', customPath);
        if (!mpvPath) {
            return {
                success: false,
                error: 'MPV was not found. Install MPV or set a custom MPV path in settings.',
            };
        }

        if (this.mpvProcess) {
            await this.stop('restart', false);
        } else {
            this.closeSocket();
        }

        const ipcPath = this.getIpcPath();
        this.cleanupSocketPath(ipcPath);

        const wid = normalizeNativeWindowHandle(mainWindow.getNativeWindowHandle());
        const args = [
            `--wid=${wid}`,
            `--input-ipc-server=${ipcPath}`,
            '--no-config',
            '--no-terminal',
            '--idle=once',
            '--force-window=yes',
            '--osc=no',
            '--input-default-bindings=no',
            '--load-scripts=no',
            '--osd-level=0',
            '--keep-open=no',
            '--background=color',
            '--background-color=#00000000',
        ];

        logger.info(`Launching embedded MPV at ${mpvPath}`);
        const child = spawn(mpvPath, args, {
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        this.mpvProcess = child;
        this.state = {
            ...createDefaultState(),
            available: true,
            active: true,
            loading: true,
            title: payload.title,
            fullscreen: mainWindow.isFullScreen(),
        };
        this.emitState();

        child.stderr?.on('data', (chunk: Buffer | string) => {
            const message = chunk.toString().trim();
            if (message) {
                logger.warn(message);
            }
        });

        child.on('error', (error: Error) => {
            if (this.mpvProcess !== child) {
                return;
            }

            logger.error(`MPV process error: ${error.message}`);
            this.mpvProcess = null;
            this.closeSocket();
            this.resetState(`MPV failed to start: ${error.message}`);
        });

        child.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
            if (this.mpvProcess !== child) {
                return;
            }

            this.mpvProcess = null;
            this.closeSocket();

            const error = code && code !== 0
                ? `Embedded MPV exited with code ${code}.`
                : signal
                    ? `Embedded MPV exited due to signal ${signal}.`
                    : undefined;

            if (error) {
                logger.error(error);
            }

            this.resetState(error);
        });

        try {
            await this.connect(ipcPath);
            await this.observeProperties();
            await this.sendMpvCommand(['loadfile', payload.streamUrl, 'replace']);
            this.setState({ connected: true, loading: true, error: undefined });
            return { success: true };
        } catch (error) {
            const message = (error as Error).message;
            logger.error(`Failed to initialize embedded MPV: ${message}`);
            await this.stop('start-failed');
            this.resetState(`Failed to initialize embedded MPV: ${message}`);
            return { success: false, error: message };
        } finally {
            this.cleanupSocketPath(ipcPath);
        }
    }

    private async stop(reason: string, resetState: boolean = true): Promise<{ success: boolean }> {
        const child = this.mpvProcess;

        this.mpvProcess = null;
        this.closeSocket();

        if (child && !child.killed) {
            logger.info(`Stopping embedded MPV (${reason})`);
            const exitPromise = new Promise<void>((resolve) => {
                const timer = setTimeout(resolve, 1500);
                child.on('exit', () => { clearTimeout(timer); resolve(); });
            });
            child.kill();
            await exitPromise;
        }

        if (resetState) {
            this.resetState();
        }

        return { success: true };
    }

    private closeSocket(): void {
        for (const resolver of this.pendingRequests.values()) {
            resolver.reject(new Error('MPV IPC connection closed.'));
        }
        this.pendingRequests.clear();

        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.destroy();
            this.socket = null;
        }

        this.socketBuffer = '';
        this.refreshAvailability();
    }

    private async connect(ipcPath: string): Promise<void> {
        for (let attempt = 0; attempt < 40; attempt += 1) {
            try {
                await new Promise<void>((resolve, reject) => {
                    const socket = createConnection(ipcPath, () => {
                        if (this.mpvProcess === null) {
                            socket.destroy();
                            reject(new Error('MPV session was terminated before IPC connected.'));
                            return;
                        }

                        this.socket = socket;
                        this.socketBuffer = '';

                        socket.on('data', (chunk: Buffer) => {
                            this.socketBuffer += chunk.toString();
                            this.flushSocketBuffer();
                        });

                        socket.on('close', () => {
                            if (this.socket === socket) {
                                this.socket = null;
                                this.setState({ connected: false });
                            }
                        });

                        socket.on('error', (error: Error) => {
                            if (this.socket === socket) {
                                logger.error(`MPV IPC socket error: ${error.message}`);
                            }
                        });

                        resolve();
                    });

                    socket.once('error', (error: Error) => {
                        socket.destroy();
                        reject(error);
                    });
                });

                return;
            } catch {
                await delay(150);
            }
        }

        throw new Error('Timed out while connecting to MPV IPC.');
    }

    private flushSocketBuffer(): void {
        let newlineIndex = this.socketBuffer.indexOf('\n');

        while (newlineIndex !== -1) {
            const line = this.socketBuffer.slice(0, newlineIndex).trim();
            this.socketBuffer = this.socketBuffer.slice(newlineIndex + 1);

            if (line) {
                try {
                    this.handleMpvMessage(JSON.parse(line) as MpvMessage);
                } catch (error) {
                    logger.warn(`Failed to parse MPV IPC message: ${(error as Error).message}`);
                }
            }

            newlineIndex = this.socketBuffer.indexOf('\n');
        }
    }

    private handleMpvMessage(message: MpvMessage): void {
        if (typeof message.request_id === 'number') {
            const resolver = this.pendingRequests.get(message.request_id);
            if (resolver) {
                this.pendingRequests.delete(message.request_id);
                if (message.error && message.error !== 'success') {
                    resolver.reject(new Error(message.error));
                } else {
                    resolver.resolve(message.data);
                }
            }
        }

        if (message.event === 'property-change') {
            this.handlePropertyChange(message.name, message.data);
            return;
        }

        if (message.event === 'file-loaded') {
            this.setState({ loading: false, eofReached: false, error: undefined });
            return;
        }

        if (message.event === 'end-file') {
            this.setState({ eofReached: true, loading: false });
            return;
        }

        if (message.event === 'shutdown') {
            this.setState({ connected: false, loading: false });
        }
    }

    private handlePropertyChange(name: string | undefined, data: unknown): void {
        switch (name) {
            case 'time-pos':
                this.setState({ timePos: typeof data === 'number' ? data : 0 });
                break;
            case 'duration':
                this.setState({ duration: typeof data === 'number' ? data : 0 });
                break;
            case 'pause':
                this.setState({ paused: Boolean(data) });
                break;
            case 'eof-reached':
                this.setState({ eofReached: Boolean(data) });
                break;
            case 'aid': {
                const currentAudioTrackId = typeof data === 'number' ? data : null;
                this.setState({
                    currentAudioTrackId,
                    audioTracks: syncSelectedTrack(this.state.audioTracks, currentAudioTrackId),
                });
                break;
            }
            case 'sid': {
                const currentSubtitleTrackId = typeof data === 'number' ? data : null;
                this.setState({
                    currentSubtitleTrackId,
                    subtitleTracks: syncSelectedTrack(this.state.subtitleTracks, currentSubtitleTrackId),
                });
                break;
            }
            case 'volume':
                this.setState({ volume: typeof data === 'number' ? data : this.state.volume });
                break;
            case 'speed':
                this.setState({ speed: typeof data === 'number' ? data : this.state.speed });
                break;
            case 'track-list':
                if (Array.isArray(data)) {
                    const tracks = data
                        .map((track) => buildMpvTrack(track as MpvTrackPayload))
                        .filter((track): track is EmbeddedMpvTrack => track !== null);

                    const audioTracks = sortTracksById(tracks.filter((track) => track.type === 'audio'));
                    const subtitleTracks = sortTracksById(tracks.filter((track) => track.type === 'sub'));
                    const currentAudioTrackId = resolveSelectedTrackId(audioTracks, this.state.currentAudioTrackId);
                    const currentSubtitleTrackId = resolveSelectedTrackId(subtitleTracks, this.state.currentSubtitleTrackId);

                    this.setState({
                        currentAudioTrackId,
                        currentSubtitleTrackId,
                        audioTracks: syncSelectedTrack(audioTracks, currentAudioTrackId),
                        subtitleTracks: syncSelectedTrack(subtitleTracks, currentSubtitleTrackId),
                    });
                }
                break;
            default:
                break;
        }
    }

    private async observeProperties(): Promise<void> {
        const properties = ['time-pos', 'duration', 'pause', 'eof-reached', 'track-list', 'aid', 'sid', 'volume', 'speed'];

        for (const [index, property] of properties.entries()) {
            await this.sendMpvCommand(['observe_property', index + 1, property]);
        }
    }

    private sendMpvCommand(command: unknown[]): Promise<unknown> {
        if (!this.socket) {
            return Promise.reject(new Error('MPV IPC socket is not connected.'));
        }

        const requestId = this.nextRequestId;
        this.nextRequestId += 1;

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, { resolve, reject });
            this.socket?.write(`${JSON.stringify({ command, request_id: requestId })}\n`);
        });
    }

    private async handleCommand(command: EmbeddedMpvCommand): Promise<{ success: boolean; error?: string }> {
        if (!this.mpvProcess && command.command !== 'stop') {
            return { success: false, error: 'Embedded MPV is not active.' };
        }

        try {
            switch (command.command) {
                case 'toggle-pause':
                    await this.sendMpvCommand(['cycle', 'pause']);
                    break;
                case 'play':
                    await this.sendMpvCommand(['set_property', 'pause', false]);
                    break;
                case 'pause':
                    await this.sendMpvCommand(['set_property', 'pause', true]);
                    break;
                case 'seek':
                    await this.sendMpvCommand(['seek', command.value, (command.mode === 'absolute' ? 'absolute' : 'relative') + '+exact']);
                    break;
                case 'set-speed': {
                    const nextSpeed = Math.max(0.1, Math.min(4, command.value));
                    await this.sendMpvCommand(['set_property', 'speed', nextSpeed]);
                    break;
                }
                case 'set-volume':
                    await this.sendMpvCommand(['set_property', 'volume', Math.max(0, Math.min(100, command.value))]);
                    break;
                case 'set-audio-track':
                    await this.sendMpvCommand(['set_property', 'aid', command.value ?? 'no']);
                    break;
                case 'set-subtitle-track':
                    await this.sendMpvCommand(['set_property', 'sid', command.value ?? 'no']);
                    break;
                case 'set-fullscreen':
                    mainWindow?.setFullScreen(command.value);
                    this.setState({ fullscreen: command.value });
                    break;
                case 'stop':
                    await this.stop('command-stop');
                    break;
                default:
                    return { success: false, error: 'Unsupported embedded MPV command.' };
            }

            return { success: true };
        } catch (error) {
            const message = (error as Error).message;
            logger.error(`Embedded MPV command failed: ${message}`);
            this.setState({ error: message });
            return { success: false, error: message };
        }
    }
}

export const embeddedMpvController = new EmbeddedMpvController();