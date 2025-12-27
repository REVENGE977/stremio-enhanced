import { join } from "path";
import { mkdirSync, existsSync, writeFileSync, unlinkSync, readFileSync } from "fs";
import { PepperPluginEntry, PepperPluginConfig } from "./interfaces/PepperPluginConfig";
import helpers from './utils/Helpers';
import Updater from "./core/Updater";
import Properties from "./core/Properties";
import logger from "./utils/logger";

// Fix GTK 2/3 and GTK 4 conflict on Linux
import { app } from 'electron';
if (process.platform === 'linux') app.commandLine.appendSwitch('gtk-version', '3');

import { BrowserWindow, shell, ipcMain } from "electron";
import StreamingServer from "./utils/StreamingServer";
import Helpers from "./utils/Helpers";
import StremioService from "./utils/StremioService";

app.setName("stremio-enhanced");

let mainWindow: BrowserWindow | null;
const transparencyFlagPath = join(app.getPath("userData"), "transparency");
const transparencyEnabled = existsSync(transparencyFlagPath);

if(process.platform === "darwin") {
    logger.info(`Running on macOS, using Metal for rendering`);
    app.commandLine.appendSwitch('use-angle', 'metal'); 
} else {
    logger.info(`Running on ${process.platform}, using OpenGL for rendering`);

    app.commandLine.appendSwitch('use-angle', 'gl'); 
    app.commandLine.appendSwitch('enable-gpu-rasterization'); 
    app.commandLine.appendSwitch('ignore-gpu-blocklist'); 
    app.commandLine.appendSwitch('disable-software-rasterizer'); 
}

app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights');

// PPAPI (Pepper Plugin) Support
app.commandLine.appendSwitch('enable-plugins');

// Load and register custom pepper plugins from configuration
function loadPepperPluginConfig(): PepperPluginEntry[] {
    try {
        if (existsSync(Properties.pepperConfigFile)) {
            const configData = readFileSync(Properties.pepperConfigFile, "utf-8");
            const config: PepperPluginConfig = JSON.parse(configData);

            return config.plugins.filter(plugin => {
                if (!plugin.enabled) return false;
                if (!existsSync(plugin.path)) {
                    logger.warn(`PPAPI plugin not found: ${plugin.name} at ${plugin.path}`);
                    return false;
                }
                return true;
            });
        }
    } catch (error) {
        logger.error("Failed to load pepper plugin config: " + error);
    }
    return [];
}

const pepperPlugins = loadPepperPluginConfig();
if (pepperPlugins.length > 0) {
    const pluginArgs = pepperPlugins
        .map(p => `${p.path};${p.mimeType}`)
        .join(',');
    app.commandLine.appendSwitch('register-pepper-plugins', pluginArgs);
    logger.info(`Registered PPAPI plugins: ${pluginArgs}`);
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true,
        },
        width: 1500,
        height: 850,
        resizable: true,
        maximizable: true,
        fullscreenable: true,
        useContentSize: true,
        icon: "./images/icon.ico",
        frame: transparencyEnabled ? false : true,
        transparent: transparencyEnabled,
        hasShadow: false,
        visualEffectState: transparencyEnabled ? "active" : "followWindow",
        backgroundColor: "#00000000",
    });

    mainWindow.setMenu(null);
    mainWindow.loadURL("https://web.stremio.com/");
    
    helpers.setMainWindow(mainWindow);

    if(transparencyEnabled) {
        mainWindow.on('enter-full-screen', () => {
            mainWindow.webContents.send('fullscreen-changed', true);
        });

        mainWindow.on('leave-full-screen', () => {
            mainWindow.webContents.send('fullscreen-changed', false);
        });
    }

    ipcMain.on("minimize-window", () => {
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on("maximize-window", () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.on("close-window", () => {
        if (mainWindow) mainWindow.close();
    });

    ipcMain.on('update-check-on-startup', async (_, checkForUpdatesOnStartup) => {
        logger.info(`Checking for updates on startup: ${checkForUpdatesOnStartup == "true" ? "enabled" : "disabled"}.`);
        if(checkForUpdatesOnStartup == "true") await Updater.checkForUpdates(false);
    });

    ipcMain.on('update-check-userrequest', async () => {
        logger.info("Checking for updates on user request.");
        await Updater.checkForUpdates(true);
    });

    ipcMain.on("set-transparency", (_, enabled: boolean) => {
        if (enabled) {
            logger.info("Enabled window transparency");
            writeFileSync(transparencyFlagPath, "1");
        } else {
            try {
                logger.info("Disabled window transparency");
                unlinkSync(transparencyFlagPath);
            } catch {}
        }

        Helpers.showAlert("info", "Transparency setting changed", "Please restart the app to apply the changes.", ["OK"]);
    });

    ipcMain.handle("get-transparency-status", () => {
        const enableTransparentThemes = existsSync(transparencyFlagPath);
        return enableTransparentThemes;
    });

    // Pepper plugin configuration IPC handlers
    ipcMain.handle("get-pepper-plugins", () => {
        try {
            if (existsSync(Properties.pepperConfigFile)) {
                const configData = readFileSync(Properties.pepperConfigFile, "utf-8");
                return JSON.parse(configData);
            }
        } catch (error) {
            logger.error("Failed to read pepper plugin config: " + error);
        }
        return { plugins: [] };
    });

    ipcMain.handle("save-pepper-plugin", (_, plugin: PepperPluginEntry) => {
        try {
            let config: PepperPluginConfig = { plugins: [] };

            if (existsSync(Properties.pepperConfigFile)) {
                config = JSON.parse(readFileSync(Properties.pepperConfigFile, "utf-8"));
            }

            const existingIndex = config.plugins.findIndex(p => p.name === plugin.name);
            if (existingIndex >= 0) {
                config.plugins[existingIndex] = plugin;
            } else {
                config.plugins.push(plugin);
            }

            writeFileSync(Properties.pepperConfigFile, JSON.stringify(config, null, 2));
            Helpers.showAlert("info", "Pepper plugin saved", "Please restart the app to apply changes.", ["OK"]);
            return { success: true };
        } catch (error) {
            logger.error("Failed to save pepper plugin config: " + error);
            return { success: false, message: String(error) };
        }
    });

    ipcMain.handle("remove-pepper-plugin", (_, pluginName: string) => {
        try {
            if (existsSync(Properties.pepperConfigFile)) {
                const config: PepperPluginConfig = JSON.parse(readFileSync(Properties.pepperConfigFile, "utf-8"));
                config.plugins = config.plugins.filter(p => p.name !== pluginName);
                writeFileSync(Properties.pepperConfigFile, JSON.stringify(config, null, 2));
                return { success: true };
            }
            return { success: false, message: "Config file not found" };
        } catch (error) {
            logger.error("Failed to remove pepper plugin: " + error);
            return { success: false, message: String(error) };
        }
    });

    // Opens links in external browser instead of opening them in the Electron app.
    mainWindow.webContents.setWindowOpenHandler((edata:any) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });
    
    // Devtools flag
    if(process.argv.includes("--devtools")) { 
        logger.info("Developer tools flag detected. Opening DevTools in detached mode...");
        mainWindow.webContents.openDevTools({ mode: "detach" }); 
    }

    // mainWindow.on('closed', () => {
    //     if(!process.argv.includes("--no-stremio-service") && StremioService.isProcessRunning()) StremioService.terminate();
    // });
}

// Helper function to fall back to Stremio Service when streaming server is not available
async function fallbackToStremioService() {
    if(await StremioService.isServiceInstalled()) {
        logger.info("Found installation of Stremio Service.");
        await StremioService.start();
    } else {
        const result = await Helpers.showAlert(
            "warning",
            "Stremio Service not found",
            `Stremio Service is required for streaming features. Do you want to download it now? ${process.platform == "linux" ? "This will install the service via Flatpak (if available)." : ""}`,
            ["YES", "NO"]
        );
        if (result === 0) {
            await StremioService.downloadAndInstallService();
        } else {
            logger.info("User declined to download Stremio Service.");
        }
    }
}

app.on("ready", async () => {
    logger.info("Enhanced version: v" + Updater.getCurrentVersion());
    logger.info("Running on NodeJS version: " + process.version);
    logger.info("Running on Electron version: v" + process.versions.electron);
    logger.info("Running on Chromium version: v" + process.versions.chrome);

    logger.info("User data path: " + app.getPath("userData"));
    logger.info("Themes path: " + Properties.themesPath);
    logger.info("Plugins path: " + Properties.pluginsPath);
    logger.info("Pepper plugins path: " + Properties.pepperPluginsPath);

    try {
        const basePath = Properties.enhancedPath;

        if (!existsSync(basePath)) {
            mkdirSync(basePath, { recursive: true });
        }
        if (!existsSync(Properties.themesPath)) {
            mkdirSync(Properties.themesPath, { recursive: true });
        }
        if (!existsSync(Properties.pluginsPath)) {
            mkdirSync(Properties.pluginsPath, { recursive: true });
        }
        if (!existsSync(Properties.pepperPluginsPath)) {
            mkdirSync(Properties.pepperPluginsPath, { recursive: true });
        }

        // Create default pepper plugins config if not exists
        if (!existsSync(Properties.pepperConfigFile)) {
            const defaultConfig: PepperPluginConfig = {
                plugins: [{
                    name: "Widevine CDM",
                    path: "",
                    mimeType: "application/x-ppapi-widevine-cdm",
                    enabled: false,
                    description: "Content Decryption Module for protected media playback"
                }]
            };
            writeFileSync(Properties.pepperConfigFile, JSON.stringify(defaultConfig, null, 2));
            logger.info("Created default pepper plugins configuration");
        }
    } catch (err) {
        logger.error("Failed to create necessary directories: " + err);
    }
    
    if(!process.argv.includes("--no-stremio-server")) {
        if(!await StremioService.isProcessRunning()) {
            // First, try to ensure streaming server files are available
            logger.info("Checking for streaming server files...");
            const filesStatus = await StreamingServer.ensureStreamingServerFiles();

            if(filesStatus === "ready") {
                logger.info("Launching local streaming server.");
                StreamingServer.start();
            } else if(filesStatus === "missing_server_js") {
                // server.js is missing - show instructions to the user in a loop
                logger.info("server.js not found. Showing download instructions to user...");
                const serverDir = StreamingServer.getStreamingServerDir();
                const downloadUrl = StreamingServer.getServerJsUrl();

                let serverJsFound = false;
                while (!serverJsFound) {
                    const result = await Helpers.showAlert(
                        "info",
                        "Streaming Server Setup Required",
                        `To enable video playback, you need to download the Stremio streaming server file (server.js).\n\n` +
                        `1. Download server.js from:\n${downloadUrl}\n\n` +
                        `2. Right click the page and select "Save As" or "Save Link As" and save it as "server.js".\n\n` +
                        `3. Place it in:\n${serverDir}\n\n` +
                        `Click "Open Folder" to open the destination folder, or "Download" to open the download link in your browser.`,
                        ["Open Folder", "Download", "Close"]
                    );

                    if (result === 0) {
                        // Open the folder
                        StreamingServer.openStreamingServerDir();
                    } else if (result === 1) {
                        // Open the download URL in browser
                        shell.openExternal(downloadUrl);
                    } else {
                        // User clicked Close - check if file exists now
                        if (StreamingServer.serverJsExists()) {
                            serverJsFound = true;
                            logger.info("server.js found after user action. Proceeding with streaming server setup...");
                            // Re-run the setup to also check/download ffmpeg
                            const retryStatus = await StreamingServer.ensureStreamingServerFiles();
                            if (retryStatus === "ready") {
                                logger.info("Launching local streaming server.");
                                StreamingServer.start();
                            } else {
                                // FFmpeg issue - fall back to Stremio Service
                                logger.info("FFmpeg not available after server.js setup. Falling back to Stremio Service...");
                                await fallbackToStremioService();
                            }
                        } else {
                            // File still not there - warn and show dialog again
                            await Helpers.showAlert(
                                "warning",
                                "File Not Found",
                                `server.js was not found in:\n${serverDir}\n\nPlease download the file and place it in the correct location.`,
                                ["OK"]
                            );
                        }
                    }
                }
            } else {
                // FFmpeg download failed - fall back to Stremio Service
                logger.info("FFmpeg not available. Falling back to Stremio Service...");
                await fallbackToStremioService();
            }
        } else logger.info("Stremio Service is already running.");
    } else logger.info("Launching without Stremio streaming server.");
    
    createWindow();
    
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    logger.info("Closing app...");

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on('browser-window-created', (_, window) => {
    window.webContents.on('before-input-event', (event:any, input:any) => {
        switch (true) {
            // Opens Devtools on Ctrl + Shift + I
            case input.control && input.shift && input.key === 'I':
                window.webContents.toggleDevTools();
                event.preventDefault();
                break;
    
            // Toggles fullscreen on F11
            case input.key === 'F11':
                window.setFullScreen(!window.isFullScreen());
                event.preventDefault();
                break;
    
            // Implements zooming in/out using shortcuts (Ctrl + =, Ctrl + -)
            case input.control && input.key === '=':
                mainWindow.webContents.zoomFactor += 0.1;
                event.preventDefault();
                break;
            case input.control && input.key === '-':
                mainWindow.webContents.zoomFactor -= 0.1;
                event.preventDefault();
                break;
    
            // Implements reload on Ctrl + R
            case input.control && input.key === 'r':
                mainWindow.reload();
                event.preventDefault();
                break;
        }
    });
});