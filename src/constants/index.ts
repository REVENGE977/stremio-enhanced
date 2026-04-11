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
    TOAST_CONTAINER: '.toasts-container-oKECy'
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
    RESTORE: "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z"
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
    SET_TRANSPARENCY: 'set-transparency',
    GET_TRANSPARENCY_STATUS: 'get-transparency-status',
    UPDATE_CHECK_STARTUP: 'update-check-on-startup',
    UPDATE_CHECK_USER: 'update-check-userrequest',
    FULLSCREEN_CHANGED: 'fullscreen-changed',
    GET_GPU_RENDERER: 'get-gpu-renderer',
    SET_GPU_RENDERER: 'set-gpu-renderer',
    SHOW_ALERT: 'show-alert',
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
    STREMIO_SERVICE_GITHUB_API: "https://api.github.com/repos/Stremio/stremio-service/releases/latest"
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


export const ENHANCED_PLUGINS_API = {
    GET_SETTING: 'get-plugin-setting',
    GET_SETTINGS: 'get-plugin-settings',
    SAVE_SETTING: 'save-plugin-setting',
    REGISTER_SETTINGS: 'register-plugin-settings',
    GET_REGISTERED_SETTINGS: 'get-registered-schema',
    CLEAR_REGISTERED_SETTINGS: 'clear-registered-schema',
    ON_SETTINGS_SAVED: "on-plugin-settings-saved",
    SHOW_ALERT: 'show-alert',
    SHOW_PROMPT: 'show-prompt'
} as const;