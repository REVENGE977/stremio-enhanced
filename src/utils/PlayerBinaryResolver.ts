import { app } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';

export type SupportedPlayerBinary = 'vlc' | 'mpv';

const KNOWN_PLAYER_PATHS: Record<NodeJS.Platform, Record<SupportedPlayerBinary, string[]>> = {
    win32: {
        vlc: [
            'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
            'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
        ],
        mpv: [
            'C:\\Program Files\\mpv\\mpv.exe',
            'C:\\Program Files (x86)\\mpv\\mpv.exe',
        ],
    },
    darwin: {
        vlc: ['/Applications/VLC.app/Contents/MacOS/VLC'],
        mpv: ['/usr/local/bin/mpv', '/opt/homebrew/bin/mpv'],
    },
    linux: {
        vlc: ['/usr/bin/vlc', '/usr/local/bin/vlc'],
        mpv: ['/usr/bin/mpv', '/usr/local/bin/mpv'],
    },
    aix: { vlc: [], mpv: [] },
    android: { vlc: [], mpv: [] },
    cygwin: { vlc: [], mpv: [] },
    freebsd: { vlc: [], mpv: [] },
    haiku: { vlc: [], mpv: [] },
    netbsd: { vlc: [], mpv: [] },
    openbsd: { vlc: [], mpv: [] },
    sunos: { vlc: [], mpv: [] },
};

function uniquePaths(paths: string[]): string[] {
    return [...new Set(paths.filter(Boolean))];
}

function getBinaryName(player: SupportedPlayerBinary): string {
    if (process.platform === 'win32') {
        return `${player}.exe`;
    }

    if (process.platform === 'darwin' && player === 'vlc') {
        return 'VLC';
    }

    return player;
}

function getBundledSearchRoots(player: SupportedPlayerBinary): string[] {
    const appPath = app.getAppPath();

    return uniquePaths([
        join(process.resourcesPath, player),
        join(process.resourcesPath, 'binaries', player),
        join(appPath, 'static', player),
        join(process.cwd(), 'static', player),
    ]);
}

function getBundledCandidatePaths(player: SupportedPlayerBinary): string[] {
    const binaryName = getBinaryName(player);
    const platform = process.platform;
    const arch = process.arch;

    return uniquePaths(
        getBundledSearchRoots(player).flatMap((root) => [
            join(root, binaryName),
            join(root, platform, binaryName),
            join(root, arch, binaryName),
            join(root, `${platform}-${arch}`, binaryName),
            join(root, platform, arch, binaryName),
        ]),
    );
}

function getKnownSystemPaths(player: SupportedPlayerBinary): string[] {
    return KNOWN_PLAYER_PATHS[process.platform]?.[player] ?? [];
}

export function resolvePlayerPath(player: SupportedPlayerBinary, customPath?: string): string | null {
    const candidatePaths = uniquePaths([
        customPath ?? '',
        ...getBundledCandidatePaths(player),
        ...getKnownSystemPaths(player),
    ]);

    for (const candidate of candidatePaths) {
        if (existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}

export function getDetectedPlayerPaths(): Record<SupportedPlayerBinary, string | null> {
    return {
        vlc: resolvePlayerPath('vlc'),
        mpv: resolvePlayerPath('mpv'),
    };
}