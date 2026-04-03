export interface EmbeddedMpvTrack {
    id: number;
    type: string;
    label: string;
    language: string | null;
    selected: boolean;
    external: boolean;
    codec: string | null;
}

export interface EmbeddedMpvState {
    available: boolean;
    active: boolean;
    connected: boolean;
    loading: boolean;
    paused: boolean;
    timePos: number;
    duration: number;
    speed: number;
    volume: number;
    fullscreen: boolean;
    eofReached: boolean;
    title: string;
    subtitleTracks: EmbeddedMpvTrack[];
    audioTracks: EmbeddedMpvTrack[];
    currentAudioTrackId: number | null;
    currentSubtitleTrackId: number | null;
    error?: string;
}

export interface EmbeddedMpvEnvironment {
    available: boolean;
    preferred: boolean;
    transparentWindow: boolean;
    mpvPath: string | null;
}

export interface EmbeddedMpvStartPayload {
    streamUrl: string;
    title: string;
}

export type EmbeddedMpvCommand =
    | { command: "toggle-pause" }
    | { command: "play" }
    | { command: "pause" }
    | { command: "seek"; value: number; mode?: "relative" | "absolute" }
    | { command: "set-speed"; value: number }
    | { command: "set-volume"; value: number }
    | { command: "set-audio-track"; value: number | null }
    | { command: "set-subtitle-track"; value: number | null }
    | { command: "set-fullscreen"; value: boolean }
    | { command: "stop" };