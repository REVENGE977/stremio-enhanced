/**
 * Centralized constants for Stremio Enhanced
 * Using constants instead of magic strings improves maintainability
 */

// CSS Selectors used to interact with Stremio's UI
// Note: These may need updating when Stremio updates their class names
export const SELECTORS = {
    // Settings page (Stremio Web 5.1+): a sidebar of link groups next to a pane showing one page.
    // Matched by class-name prefix, because the hash suffixes change with every Stremio Web build.
    SETTINGS_CONTENT: '[class*="settings-content-"]',
    NAV_MENU: '[class*="settings-content-"] > nav',
    NAV_GROUP: '[class*="settings-content-"] > nav > div[class*="group-"]',
    SETTINGS_PANE: '[class*="settings-content-"] > [class*="pane-"]',
    SETTINGS_PAGE_CONTAINER: '[class*="settings-content-"] > [class*="pane-"] > [class*="page-container-"]',
    SETTINGS_PAGE: '[class*="settings-content-"] > [class*="pane-"] > [class*="page-container-"] > [class*="page-"]',
    SETTINGS_GROUP: '[class*="page-container-"] > [class*="page-"] > section[class*="group-"]',
    ENHANCED_SECTION: '#enhanced',
    THEMES_CATEGORY: '#enhanced > [data-category="themes"]',
    PLUGINS_CATEGORY: '#enhanced > [data-category="plugins"]',
    MARKETPLACE_CATEGORY: '#enhanced > [data-category="marketplace"]',
    ABOUT_CATEGORY: '#enhanced > [data-category="about"]',
    ROUTE_CONTAINER: '.route-container:last-child .route-content',
    META_DETAILS_CONTAINER: '[class*="metadetails-container-"]',
    DESCRIPTION_CONTAINER: '[class*="description-container-"]',
    ADDONS_LIST_CONTAINER: '[class*="addons-list-container-"]',
    ADDON_CONTAINER: '[class*="addon-container-"]',
    NAME_CONTAINER: '[class*="name-container-"]',
    DESCRIPTION_ITEM: '[class*="description-container-"]',
    TYPES_CONTAINER: '[class*="types-container-"]',
    SEARCH_INPUT: '[class*="search-input-"]',
    HORIZONTAL_NAV: '[class*="horizontal-nav-bar-container-"]',
    TOAST_ITEM: '[class*="toast-item-container-"]',
    TOAST_CONTAINER: '[class*="toasts-container-"]',
} as const;

// CSS Classes used for styling
export const CLASSES = {
    // Option rows on the Enhanced pages use Stremio Enhanced's own classes (see settingsStyles.ts).
    OPTION: 'enhanced-option',
    CONTENT: 'enhanced-option-content',
    BUTTON: 'enhanced-button',
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
    MARKETPLACE: "M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z",
    ABOUT: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z",
    MAXIMIZE: "M3,3H21V21H3V3M5,5V19H19V5H5Z",
    RESTORE: "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z",
} as const;

// Address of the Enhanced settings pages (#/settings/enhanced/themes, /plugins, /marketplace, /about)
export const ENHANCED_ROUTE = '#/settings/enhanced';

// LocalStorage keys
export const STORAGE_KEYS = {
    ENABLED_PLUGINS: 'enabledPlugins',
    CURRENT_THEME: 'currentTheme',
    DISCORD_RPC: 'discordrichpresence',
    CHECK_UPDATES_ON_STARTUP: 'checkForUpdatesOnStartup',
    AUTOKILL_SERVICE: 'autokillService',
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
    SET_AUTOKILL_SERVICE: 'set-autokill-service',
    GET_AUTOKILL_SERVICE_STATUS: 'get-autokill-service-status',
    UPDATE_CHECK_STARTUP: 'update-check-on-startup',
    UPDATE_CHECK_USER: 'update-check-userrequest',
    FULLSCREEN_CHANGED: 'fullscreen-changed',
    GET_HARDWARE_ACCELERATION: 'get-hardware-acceleration',
    SET_HARDWARE_ACCELERATION: 'set-hardware-acceleration',
    LAUNCH_EXTERNAL_PLAYER: 'launch-external-player',
    GET_EXTERNAL_PLAYER_PATHS: 'get-external-player-paths',
    ENQUEUE_DOWNLOADS: 'enqueue-downloads',
    GET_DOWNLOADS: 'get-downloads',
    RETRY_DOWNLOAD: 'retry-download',
    GET_ALL_DOWNLOADED: 'get-all-downloaded',
    SCAN_IMPORTABLE: 'scan-importable',
    IMPORT_DOWNLOADED: 'import-downloaded',
    GET_DISK_SPACE: 'get-disk-space',
    CANCEL_DOWNLOAD: 'cancel-download',
    SHOW_DOWNLOAD: 'show-download',
    GET_DOWNLOADS_PATH: 'get-downloads-path',
    CHOOSE_DOWNLOAD_FOLDER: 'choose-download-folder',
    GET_DOWNLOADED: 'get-downloaded',
    DELETE_DOWNLOADED: 'delete-downloaded',
    GET_LIBRARY_SERVER_URL: 'get-library-server-url',
    DOWNLOAD_PROGRESS: 'download-progress',
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
    // Embedded libmpv & Stremio Native Shell IPC
    MPV: {
        SHELL_IPC_TO_MAIN: 'stremio-shell-ipc',
        SHELL_IPC_TO_RENDERER: 'stremio-shell-ipc-response',
        IS_AVAILABLE: 'mpv-is-available',
        BACKEND_INFO: 'mpv-backend-info',
        RENDERER_READY: 'mpv-renderer-ready',
        RESIZE: 'mpv-resize',
        SOFTWARE_FRAME: 'mpv-software-frame',
        SHARED_TEXTURE_FRAME: 'mpv:shared-texture-frame',
        SHARED_TEXTURE_ACK: 'mpv:shared-texture-ack',
        COMMAND: 'mpv-command',
        SET_PROPERTY: 'mpv-set-property',
        GET_PROPERTY: 'mpv-get-property',
        STOP: 'mpv-stop',
    }
} as const;
