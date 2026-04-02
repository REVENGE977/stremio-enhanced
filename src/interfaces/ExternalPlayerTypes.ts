export const EMBEDDED_MPV_PLAYBACK_MODE = "embedded-mpv" as const;

export const VALID_PLAYBACK_MODES = ["disabled", "vlc", "mpv", EMBEDDED_MPV_PLAYBACK_MODE] as const;
export const VALID_EXTERNAL_PLAYERS = ["disabled", "vlc", "mpv"] as const;

export type PlaybackMode = typeof VALID_PLAYBACK_MODES[number];
export type ExternalPlayer = typeof VALID_EXTERNAL_PLAYERS[number];

export function isExternalPlayerMode(mode: string): mode is ExternalPlayer {
	return (VALID_EXTERNAL_PLAYERS as readonly string[]).includes(mode);
}

export function isEmbeddedMpvPlaybackMode(mode: string | null | undefined): mode is typeof EMBEDDED_MPV_PLAYBACK_MODE {
	return mode === EMBEDDED_MPV_PLAYBACK_MODE;
}
