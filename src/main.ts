import { app, BrowserWindow, shell, ipcMain } from "electron";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";
import helpers from './utils/Helpers';
import Updater from "./core/Updater";
import Properties from "./core/Properties";
import logger from "./utils/logger";
import StremioService from "./utils/StremioService";

app.setName("stremio-enhanced");

let mainWindow: BrowserWindow | null;

app.commandLine.appendSwitch('use-angle', 'gl'); // Uses OpenGL for rendering. Having it on OpenGL enables the audio tracks menu in the video player
app.commandLine.appendSwitch('enable-gpu-rasterization'); // Uses GPU for rendering
app.commandLine.appendSwitch('enable-zero-copy'); // Improves video decoding
app.commandLine.appendSwitch('ignore-gpu-blocklist'); // Forces GPU acceleration
app.commandLine.appendSwitch('disable-software-rasterizer'); // Ensures no software fallback
app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights'); // Allow CORS requests to local network resources

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
        icon: "./images/icon.ico",
        // transparent: false,
        hasShadow: false,
        // visualEffectState: "active",
        backgroundColor: "#00000000",
    });
        
    mainWindow.setMenu(null);
    mainWindow.loadURL("https://web.stremio.com/");
    helpers.setMainWindow(mainWindow);

    ipcMain.on('update-check-on-startup', async (_, checkForUpdatesOnStartup) => {
        logger.info(`Checking for updates on startup: ${checkForUpdatesOnStartup == "true" ? "enabled" : "disabled"}.`);
        if(checkForUpdatesOnStartup == "true") await Updater.checkForUpdates(false);
    });

    ipcMain.on('update-check-userrequest', async () => {
        logger.info("Checking for updates on user request.");
        await Updater.checkForUpdates(true);
    });

    // Opens links in external browser instead of opening them in the Electron app.
    mainWindow.webContents.setWindowOpenHandler((edata:any) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });
    
    // Devtools flag
    if(process.argv.includes("--devtools")) { 
        logger.info("--devtools flag passed. Opening devtools.."); 
        mainWindow.webContents.openDevTools({ mode: "detach" }); 
    }

    mainWindow.on('closed', () => {
        if(!process.argv.includes("--no-stremio-service")) StremioService.terminate();
    });
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
    
    if(!process.argv.includes("--no-stremio-service")) {
        const stremioServicePath = StremioService.checkExecutableExists();
        if(!stremioServicePath) {
            const buttonClicked = await helpers.showAlert("error", "Stremio Service Is Required!", "Stremio Service not found. Please install it from https://github.com/Stremio/stremio-service", ['OK']);
            
            if(buttonClicked == 0) {
                shell.openExternal("https://www.stremio.com/download-service");
            }
            
            return process.exit();
        }
        
        // check if stremio service is running or not, and if not start it.
        if (!await StremioService.isProcessRunning()) {
            await StremioService.run(stremioServicePath);
        } else logger.info("Stremio Service is already running.");
        
    } else logger.info("Launching without Stremio Service.");
    
    createWindow();
    
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
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