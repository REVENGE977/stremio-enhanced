export const NATIVE_PLAYER_ROUTE_PREFIX = '#/player';
const EMBEDDED_PLAYER_ROUTE = '#/stremio-enhanced-player';
export const EXIT_EMBEDDED_PLAYBACK_EVENT = 'stremio-enhanced-exit-embedded-playback';

export function isNativePlayerRouteHash(hash: string = location.hash): boolean {
    return hash.startsWith(NATIVE_PLAYER_ROUTE_PREFIX);
}

export function isEmbeddedShellRouteHash(hash: string = location.hash): boolean {
    return hash === EMBEDDED_PLAYER_ROUTE || hash.startsWith(`${EMBEDDED_PLAYER_ROUTE}?`) || hash.startsWith(`${EMBEDDED_PLAYER_ROUTE}/`);
}

export function isManagedPlaybackRouteHash(hash: string = location.hash): boolean {
    return isNativePlayerRouteHash(hash) || isEmbeddedShellRouteHash(hash);
}