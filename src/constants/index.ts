/**
 * Centralized constants for Stremio Enhanced
 * Using constants instead of magic strings improves maintainability
 */

// CSS Selectors used to interact with Stremio's UI
// Note: These may need updating when Stremio updates their class names
export const SELECTORS = {
    SECTIONS_CONTAINER: '[class^="sections-container-"]',
    SECTION: '[class^="section-"]',
    CATEGORY: '.category-GP0hI',
    CATEGORY_LABEL: '.label-N_O2v',
    CATEGORY_ICON: '.icon-oZoyV',
    CATEGORY_HEADING: '.heading-XePFl',
    LABEL: '[class^="label-wXG3e"]',
    NAV_MENU: '.menu-xeE06',
    SETTINGS_CONTENT: '.settings-content-co5eU',
    ENHANCED_SECTION: '#enhanced',
    THEMES_CATEGORY: '#enhanced > div:nth-child(2)',
    PLUGINS_CATEGORY: '#enhanced > div:nth-child(3)',
    ABOUT_CATEGORY: '#enhanced > div:nth-child(4)',
    ROUTE_CONTAINER: '.route-container:last-child .route-content',
    META_DETAILS_CONTAINER: '.metadetails-container-K_Dqa',
    DESCRIPTION_CONTAINER: '.description-container-yi8iU',
    ADDONS_LIST_CONTAINER: '.addons-list-container-Ovr2Z',
    ADDON_CONTAINER: '.addon-container-lC5KN',
    NAME_CONTAINER: '.name-container-qIAg8',
    DESCRIPTION_ITEM: '.description-container-v7Jhe',
    TYPES_CONTAINER: '.types-container-DaOrg',
    SEARCH_INPUT: '.search-input-bAgAh',
    HORIZONTAL_NAV: '.horizontal-nav-bar-container-Y_zvK',
    TOAST_ITEM: '.toast-item-container-nG0uk',
    TOAST_CONTAINER: '.toasts-container-oKECy',
    MPV_PLAYER_OVERLAY: {
        TOP_NAV: '.player-nav-McZjs',
        BOTTOM_BAR: '.control-bar-layer-m2jto',
        SIDE_DRAWER_BUTTON: '.side-drawer-button-layer-RrB8k',
        BACK_BUTTON: '#backButton',
        PLAY_PAUSE_BUTTON: '#playPauseButton',
        NEXT_BUTTON: '#nextButton',
        MUTE_BUTTON: '#muteButton',
        FULLSCREEN_BUTTON: '#fullscreenButton',
        TIME_CURRENT: '#timeCurrent',
        TIME_TOTAL: '#timeTotal',
        SEEK_BAR_SLIDER: '#seekBarSlider',
        SEEK_TRACK_BEFORE: '#seekTrackBefore',
        SEEK_TRACK_AFTER: '#seekTrackAfter',
        SEEK_THUMB: '#seekThumb',
        VOLUME_SLIDER: '#volumeSlider',
        VOLUME_TRACK_BEFORE: '#volumeTrackBefore',
        VOLUME_TRACK_AFTER: '#volumeTrackAfter',
        VOLUME_THUMB: '#volumeThumb',
        STREAM_TITLE: '.player-title-qywea',
        PLAYBACK_SPEED_BUTTON: '#playbackSpeedButton',
        PLAYBACK_SPEED_MENU: '.speed-menu-container-ABjzc',
        PLAYBACK_SPEED_OPTION: '.option-GcPlB',
        PLAYBACK_SPEED_LABEL: '.label-FEOiu',
        SUBTITLES_MENU: '.subtitles-menu-container-PxBRZ',
        SUBTITLES_MENU_BUTTON: '.control-bar-buttons-menu-container-M6L0_ > .control-bar-button-FQUsj:nth-child(4)',
        SUBTITLES_LANGUAGES_LIST: ".languages-list-sxIwI",
        SUBTITLES_VARIENTS_LIST: ".variants-list-yZo6B",
        SUBTITLES_VARIANT: ".variant-option-RT1Op",
        SUBTITLES_LANGUAGE: ".language-option-O1Yr9",
        AUDIO_MENU_BUTTON: "#audioMenuButton",
        AUDIO_MENU: ".audio-menu-qB4SQ",
        AUDIO_TRACKS_LIST: ".list-lt_h8",
        AUDIO_TRACK: ".option-COcvW",
        SCALE_BUTTON: "#scaleButton"
    },
    MPV_PLACEHOLDER: "#enhanced-mpv-placeholder"
} as const;

// CSS Classes used for styling
export const CLASSES = {
    OPTION: 'option-vFOAS',
    CONTENT: 'content-P2T0i',
    BUTTON: 'button-DNmYL',
    BUTTON_CONTAINER: 'button-container-zVLH6',
    SELECTED: 'selected-S7SeK',
    INSTALL_BUTTON: 'install-button-container-yfcq5',
    UNINSTALL_BUTTON: 'uninstall-button-container-oV4Yo',
    CHECKED: 'checked',
} as const;

// Icons (SVG strings or paths)
export const ICONS = {
    PLUGIN: "M413.7 246.1H386c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-77.2a38.94 38.94 0 0 0-11.4-27.5 38.94 38.94 0 0 0-27.5-11.4h-77.2c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-27.7c0-27.1-21.5-49.9-48.6-50.3-6.57-0.1-13.09 1.09-19.2 3.5a49.616 49.616 0 0 0-16.4 10.7 49.823 49.823 0 0 0-11 16.2 48.894 48.894 0 0 0-3.9 19.2v28.5c-0.01 0.53-0.23 1.03-0.6 1.4-0.37 0.37-0.87 0.59-1.4 0.6h-77.2c-10.5 0-20.57 4.17-28 11.6a39.594 39.594 0 0 0-11.6 28v70.4c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h26.9c29.4 0 53.7 25.5 54.1 54.8 0.4 29.9-23.5 57.2-53.3 57.2H50c-0.53 0.01-1.03 0.23-1.4 0.6-0.37 0.37-0.59 0.87-0.6 1.4v70.4c0 10.5 4.17 20.57 11.6 28s17.5 11.6 28 11.6h70.4c0.53-0.01 1.03-0.23 1.4-0.6 0.37-0.37 0.59-0.87 0.6-1.4V441.2c0-30.3 24.8-56.4 55-57.1 30.1-0.7 57 20.3 57 50.3v27.7c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h71.1a38.94 38.94 0 0 0 27.5-11.4 38.958 38.958 0 0 0 11.4-27.5v-78c0.01-0.53 0.23-1.03 0.6-1.4 0.37-0.37 0.87-0.59 1.4-0.6h28.5c27.6 0 49.5-22.7 49.5-50.4s-23.2-48.7-50.3-48.7Z",
    THEME: "M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z",
    ABOUT: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z",
    MAXIMIZE: "M3,3H21V21H3V3M5,5V19H19V5H5Z",
    RESTORE: "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z",
    PLAYER_OVERLAY_PAUSE: "M182.593 93h-18.4v330.5h18.4zM347.791 93h-18.4v330.5h18.4z",
    PLAYER_OVERLAY_PLAY: "M396.097 246.1 164.194 85.5a13.5 13.5 0 0 0-4.787-2.08c-1.717-.37-3.492-.4-5.219-.07-1.728.3-3.377.97-4.852 1.91a13.4 13.4 0 0 0-3.743 3.64 13.7 13.7 0 0 0-2.4 7.61v321.4a13.3 13.3 0 0 0 1.029 5.1 13.2 13.2 0 0 0 2.909 4.32 13.4 13.4 0 0 0 4.347 2.89c1.624.65 3.363 1 5.116.98 2.723.03 5.382-.82 7.6-2.39l231.903-160.6c1.448-1 2.684-2.28 3.64-3.75a13.4 13.4 0 0 0 1.925-4.85c.316-1.72.287-3.51-.084-5.22a13.2 13.2 0 0 0-2.08-4.78 13.8 13.8 0 0 0-3.401-3.41z",
    PLAYER_OVERLAY_FULLSCREEN: "M406.5 311.9v95.8h-95.8M105.5 202.5v-95.8h95.8M310.7 106.7h95.8v95.8M201.3 407.7h-95.8v-95.8",
    PLAYER_OVERLAY_EXIT_FULLSCREEN: "M310.7 407.7v-95.8h95.8M201.3 106.7v95.8h-95.8M406.5 202.5h-95.8v-95.8M105.5 311.99h95.8v95.8",
    PLAYER_OVERLAY_MUTE: "M121.89 188.9h-72.6c-1.09 0-2.16.21-3.18.63a8.24 8.24 0 0 0-4.49 4.49c-.41 1.01-.62 2.1-.62 3.18V314c0 1.09.21 2.18.62 3.19a8.1 8.1 0 0 0 1.8 2.69c.78.78 1.68 1.39 2.69 1.8a8.3 8.3 0 0 0 3.18.62h72.6c3.88-.01 7.64 1.32 10.61 3.81l95.39 78.09a8.44 8.44 0 0 0 6.22 1.51c2.19-.35 4.17-1.53 5.48-3.31a7.95 7.95 0 0 0 1.61-4.99v-283.9c0-1.1-.21-2.18-.63-3.19a8.6 8.6 0 0 0-1.8-2.68 8.2 8.2 0 0 0-2.7-1.81c-1-.42-2.09-.62-3.18-.62-1.76 0-3.46.57-4.9 1.6L132.6 184.9a16.57 16.57 0 0 1-10.71 4M324.49 322.3a148.9 148.9 0 0 0 16.71-66.7c-.08-23.25-5.81-46.14-16.71-66.7M374.6 372.4A213.56 213.56 0 0 0 408 255.6c.71-41.39-10.93-82.05-33.4-116.79M421.69 415.6c69.41-88.2 61.41-242.3-1.29-321.3",
    PLAYER_OVERLAY_UNMUTE: "M423.8 441.5 54.7 72.3",
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
    ENABLED_PLUGINS: 'enabledPlugins',
    CURRENT_THEME: 'currentTheme',
    DISCORD_RPC: 'discordrichpresence',
    CHECK_UPDATES_ON_STARTUP: 'checkForUpdatesOnStartup',
    EXTERNAL_PLAYER: 'externalPlayer',
    EXTERNAL_PLAYER_VLC_PATH: 'externalPlayerVlcPath',
    EXTERNAL_PLAYER_MPV_PATH: 'externalPlayerMpvPath',
} as const;

/** Maps a player name to its custom-path storage key. */
export const PLAYER_PATH_STORAGE_KEY: Record<string, string> = {
    vlc: STORAGE_KEYS.EXTERNAL_PLAYER_VLC_PATH,
    mpv: STORAGE_KEYS.EXTERNAL_PLAYER_MPV_PATH,
} as const;

// IPC Channel names for main <-> renderer communication
export const IPC_CHANNELS = {
    MINIMIZE_WINDOW: 'minimize-window',
    MAXIMIZE_WINDOW: 'maximize-window',
    WINDOW_MAXIMIZED: 'window-maximized',
    WINDOW_MINIMIZED: 'window-minimized',
    DRAG_WINDOW: 'drag-window',
    IS_MAXIMIZED: 'is-window-maximized',
    CLOSE_WINDOW: 'close-window',
    EXTERNAL_PLAYER_LAUNCHED: 'external-player-launched',
    EXTERNAL_PLAYER_POSITION: 'external-player-position',
    EXTERNAL_PLAYER_CLOSED: 'external-player-closed',
    SET_TRANSPARENCY: 'set-transparency',
    GET_TRANSPARENCY_STATUS: 'get-transparency-status',
    UPDATE_CHECK_STARTUP: 'update-check-on-startup',
    UPDATE_CHECK_USER: 'update-check-userrequest',
    FULLSCREEN_CHANGED: 'fullscreen-changed',
    GET_GPU_RENDERER: 'get-gpu-renderer',
    SET_GPU_RENDERER: 'set-gpu-renderer',
    LAUNCH_EXTERNAL_PLAYER: 'launch-external-player',
    GET_EXTERNAL_PLAYER_PATHS: 'get-external-player-paths',
} as const;

// File extensions for mods
export const FILE_EXTENSIONS = {
    THEME: '.theme.css',
    PLUGIN: '.plugin.js',
    PLUGIN_CONFIG: '.plugin.json'
} as const;

// URLs
export const URLS = {
    STREMIO_WEB: 'https://web.stremio.com/',
    STREMIO_WEB_ADD_ADDON: 'https://web.stremio.com/#/addons?addon=',
    REGISTRY: 'https://raw.githubusercontent.com/REVENGE977/stremio-enhanced-registry/refs/heads/main/registry.json',
    VERSION_CHECK: 'https://github.com/REVENGE977/stremio-enhanced-community/raw/main/version',
    RELEASES_API: 'https://api.github.com/repos/REVENGE977/stremio-enhanced-community/releases/latest',
    RELEASES_PAGE: 'https://github.com/REVENGE977/stremio-enhanced-community/releases/latest',
    STREMIO_SERVICE_GITHUB_API: "https://api.github.com/repos/Stremio/stremio-service/releases/latest",
    STREMIO_SERVICE_DOWNLOAD_PAGE: "https://www.stremio.com/download-service"
} as const;

// server.js (Stremio streaming server) Download URL
export const SERVER_JS_URL = "https://dl.strem.io/server/v4.20.17/desktop/server.js";

// FFmpeg Download URLs
export const FFMPEG_URLS = {
    win32: {
        x64: "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip",
        arm64: "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-winarm64-gpl.zip",
    },
    darwin: {
        x64: "https://ffmpeg.martin-riedl.de/download/macos/amd64/1766437297_8.0.1/ffmpeg.zip",
        arm64: "https://ffmpeg.martin-riedl.de/download/macos/arm64/1766430132_8.0.1/ffmpeg.zip",
    },
    linux: {
        x64: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz",
        arm64: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz",
    },
} as const;

// FFprobe Download URLs for macOS
export const MACOS_FFPROBE_URLS = {
    x64: "https://ffmpeg.martin-riedl.de/download/macos/amd64/1766437297_8.0.1/ffprobe.zip",
    arm64: "https://ffmpeg.martin-riedl.de/download/macos/arm64/1766430132_8.0.1/ffprobe.zip",
} as const;

// Discord RPC
export const DISCORD = {
    CLIENT_ID: '1200186750727893164',
    RECONNECT_INTERVAL: 10000,
    DEFAULT_IMAGE: '1024stremio',
} as const;

// Timeouts
export const TIMEOUTS = {
    ELEMENT_WAIT: 10000,
    INSTALL_COMPLETION: 120000,
    SERVICE_CHECK_INTERVAL: 5000,
    SERVER_RELOAD_DELAY: 1500,
    CORESTATE_RETRY_INTERVAL: 1000,
    CORESTATE_MAX_RETRIES: 30,
} as const;

// Enhanced Plugins API
export const ENHANCED_API = {
    GET_SETTING: 'get-plugin-setting',
    GET_SETTINGS: 'get-plugin-settings',
    SAVE_SETTING: 'save-plugin-setting',
    REGISTER_SETTINGS: 'register-plugin-settings',
    GET_REGISTERED_SETTINGS: 'get-registered-schema',
    CLEAR_REGISTERED_SETTINGS: 'clear-registered-schema',
    ON_SETTINGS_SAVED: "on-plugin-settings-saved",
    SHOW_ALERT: 'show-alert',
    SHOW_PROMPT: 'show-prompt',
    EXECUTE_STREMIO_ROUTER_NAV: 'execute-stremio-router-nav',
    // mpv stuff
    MPV: {
        ATTACH: 'mpv-attach',
        RESIZE: 'mpv-resize',
        COMMAND: 'mpv-command',
        SET_PROPERTY: 'mpv-set-property',
        GET_PROPERTY: 'mpv-get-property',
        DESTROY_OVERLAY: 'mpv-destroy-overlay',
        OVERLAY_SET_IGNORE_MOUSE: 'overlay-set-ignore-mouse',
        OVERLAY_SET_STREAM_TITLE: 'overlay-set-stream-title',
        OVERLAY_TRIGGER_NEXTVIDEO: 'overlay-trigger-nextvideo',
        OVERLAY_SET_NEXTVIDEO: 'overlay-set-nextvideo',
        OVERLAY_SET_WATCHING_MOVIE: "overlay-set-watching-movie",
        MAIN_WINDOW_MOUSE_MOVE: 'main-window-mouse-move',
        TRIGGER_MAIN_BACK_NAVIGATION: 'trigger-main-back-navigation',
        TRIGGER_MAIN_FULLSCREEN: 'trigger-main-fullscreen',
        ADD_SUBTITLE_ENTRY: 'mpv-add-subtitle-entry',
        LOAD_EXTERNAL_SUBTITLE: 'mpv-load-external-subtitle',
        AVAILABLE_ADDON_SUBTITLES: 'available-addon-subtitles',
        TRACKS_CHANGED: "mpv-tracks-changed",
        PLAYBACK_STATE_CHANGED: "mpv-playback-state-changed",
        SEEK: "mpv-seek"
    }
} as const;