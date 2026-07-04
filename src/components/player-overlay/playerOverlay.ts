import * as path from 'path';

export function getPlayerOverlayTemplate(): string {
    return path.join(__dirname, 'player-overlay.html');
}

export function getPlayerOverlayPreloadTemplate(): string {
    return path.join(__dirname, 'playerOverlayPreload.js');
}