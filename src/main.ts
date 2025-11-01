import { join } from "path";
import { mkdirSync, existsSync, writeFileSync, unlinkSync } from "fs";
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

async function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
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
            logger.info("Enabled transparent themes");
            writeFileSync(transparencyFlagPath, "1");
        } else {
            try {
                logger.info("Disabled transparent themes");
                unlinkSync(transparencyFlagPath);
            } catch {}
        }

        Helpers.showAlert("info", "Transparency setting changed", "Please restart the app to apply the changes.", ["OK"]);
    });

    ipcMain.handle("get-transparency-status", () => {
        const enableTransparentThemes = existsSync(transparencyFlagPath);
        return enableTransparentThemes;
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

app.on("ready", async () => {
    logger.info("Enhanced version: v" + Updater.getCurrentVersion());
    logger.info("Running on NodeJS version: " + process.version);
    logger.info("Running on Electron version: v" + process.versions.electron);
    logger.info("Running on Chromium version: v" + process.versions.chrome);

    logger.info("User data path: " + app.getPath("userData"));
    logger.info("Themes path: " + Properties.themesPath);
    logger.info("Plugins path: " + Properties.pluginsPath);

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
    } catch (err) {
        logger.error("Failed to create necessary directories: " + err);
    }
    
    if(!process.argv.includes("--no-stremio-server")) {
        if(!await StremioService.isProcessRunning()) {
            const streamingServerDirExists = await StreamingServer.streamingServerDirExists();
            if(streamingServerDirExists) {
                logger.info("Launching current directory Stremio streaming server.");
                StreamingServer.start();
            } else {
                logger.info("Stremio streaming server not found in the current directory. Launching Stremio Service..");
                const stremioServicePath = StremioService.findExecutable();
                if(stremioServicePath) {
                    await StremioService.start(stremioServicePath);
                } else {
                    const result = await Helpers.showAlert("warning", "Stremio Service not found", "Stremio Service is required for streaming features. Do you want to download it now?", ["YES", "NO"]);
                    if (result === 0) {
                        await StremioService.downloadAndInstallService();
                    } else {
                        logger.info("User declined to download Stremio Service.");
                    }
                }
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