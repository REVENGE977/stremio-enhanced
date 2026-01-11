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

// LocalStorage keys
export const STORAGE_KEYS = {
    ENABLED_PLUGINS: 'enabledPlugins',
    CURRENT_THEME: 'currentTheme',
    DISCORD_RPC: 'discordrichpresence',
    CHECK_UPDATES_ON_STARTUP: 'checkForUpdatesOnStartup',
} as const;

// IPC Channel names for main <-> renderer communication
export const IPC_CHANNELS = {
    MINIMIZE_WINDOW: 'minimize-window',
    MAXIMIZE_WINDOW: 'maximize-window',
    CLOSE_WINDOW: 'close-window',
    SET_TRANSPARENCY: 'set-transparency',
    GET_TRANSPARENCY_STATUS: 'get-transparency-status',
    UPDATE_CHECK_STARTUP: 'update-check-on-startup',
    UPDATE_CHECK_USER: 'update-check-userrequest',
    FULLSCREEN_CHANGED: 'fullscreen-changed',
} as const;

// File extensions for mods
export const FILE_EXTENSIONS = {
    THEME: '.theme.css',
    PLUGIN: '.plugin.js',
} as const;

// URLs
export const URLS = {
    STREMIO_WEB: 'https://web.stremio.com/',
    REGISTRY: 'https://raw.githubusercontent.com/REVENGE977/stremio-enhanced-registry/refs/heads/main/registry.json',
    VERSION_CHECK: 'https://github.com/REVENGE977/stremio-enhanced-community/raw/main/version',
    RELEASES_API: 'https://api.github.com/repos/REVENGE977/stremio-enhanced-community/releases/latest',
    RELEASES_PAGE: 'https://github.com/REVENGE977/stremio-enhanced-community/releases/latest',
    STREMIO_SERVICE_GITHUB_API: "https://api.github.com/repos/Stremio/stremio-service/releases/latest"
} as const;

// server.js (Stremio streaming server) Download URL
export const SERVER_JS_URL = "https://dl.strem.io/server/v4.20.12/desktop/server.js";

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
};

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
    DISCORDRPC_RETRY_INTERVAL: 1000,
    DISCORDRPC_MAX_RETRIES: 30,
} as const;
