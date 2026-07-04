import { ipcMain, BrowserWindow } from 'electron';
import { mainWindow, mpvPlayer } from '../main';
import { ENHANCED_API, SELECTORS } from '../constants';
import { getPlayerOverlayTemplate, getPlayerOverlayPreloadTemplate } from "../components/player-overlay/playerOverlay";

let uiOverlay: BrowserWindow | null = null;
let hideTimer: NodeJS.Timeout | null = null;

function setOverlayVisibility(visible: boolean) {
    if (!uiOverlay || uiOverlay.isDestroyed()) return;

    if (visible) {
        uiOverlay.show();
        uiOverlay.setIgnoreMouseEvents(true, { forward: true });
    } else {
        uiOverlay.hide();
    }
}

function triggerOverlayWakefulness() {
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isFocused()) {
        return;
    }

    if (uiOverlay && !uiOverlay.isVisible()) {
        setOverlayVisibility(true);
    }

    if (hideTimer) clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
        setOverlayVisibility(false);
    }, 3000); 
}

function syncOverlayBounds() {
    if (!mainWindow || !uiOverlay || mainWindow.isDestroyed() || uiOverlay.isDestroyed()) return;
    const contentBounds = mainWindow.getContentBounds();
    uiOverlay.setBounds({
        x: contentBounds.x,
        y: contentBounds.y,
        width: contentBounds.width,
        height: contentBounds.height
    });
};

async function getStreamTitle() {
    const titleSpan = mainWindow?.webContents.executeJavaScript(`
        (function() {
            const titleElement = document.querySelector('${SELECTORS.MPV_PLAYER_OVERLAY.STREAM_TITLE}');
            return titleElement ? titleElement.textContent : null;
        })();
    `);

    return titleSpan;
}

export const mpvPlayerController = {
    initIPC: () => {
        ipcMain.on(ENHANCED_API.MPV.ATTACH, (event, left, top, width, height) => {
            const handle = mainWindow?.getNativeWindowHandle();
            const attachSuccess = mpvPlayer?.attach(handle!, left, top, width, height);
            
            if (attachSuccess && mainWindow && !uiOverlay) {
                const contentBounds = mainWindow.getContentBounds();

                uiOverlay = new BrowserWindow({
                    x: contentBounds.x,
                    y: contentBounds.y,
                    width: contentBounds.width,
                    height: contentBounds.height,
                    transparent: true,
                    frame: false,
                    parent: mainWindow, 
                    focusable: true,
                    hasShadow: false,
                    backgroundColor: '#00000000', 
                    webPreferences: {
                        preload: getPlayerOverlayPreloadTemplate(), 
                        contextIsolation: true,
                        nodeIntegration: false,
                        sandbox: false // to import constants
                    }
                });

                uiOverlay.loadFile(getPlayerOverlayTemplate());

                uiOverlay.webContents.once('did-finish-load', async () => {
                    if (!mainWindow || !uiOverlay) return;
                    const mainHandle = mainWindow.getNativeWindowHandle();
                    const overlayHandle = uiOverlay.getNativeWindowHandle();
                    mpvPlayer?.lockOverlayToParent(mainHandle, overlayHandle);
                    
                    triggerOverlayWakefulness();
                    uiOverlay.webContents.send(ENHANCED_API.MPV.OVERLAY_SET_STREAM_TITLE, await getStreamTitle());
                });

                mainWindow.on('resize', syncOverlayBounds);
                mainWindow.on('move', syncOverlayBounds);

                uiOverlay.webContents.on('before-input-event', (event, input) => {
                    if (input.key === 'F11' && input.type === 'keyDown') {
                        event.preventDefault(); 
                        
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            const isFullScreen = mainWindow.isFullScreen();
                            mainWindow.setFullScreen(!isFullScreen);
                        }
                    }
                });
            }

            event.returnValue = attachSuccess;
        });
        
        ipcMain.on(ENHANCED_API.MPV.RESIZE, (_event, x, y, width, height) => {
            mpvPlayer?.resize(x, y, width, height);
        });
        
        ipcMain.on(ENHANCED_API.MPV.COMMAND, (_event, ...args) => {
            mpvPlayer?.command(...args);
        });
        
        ipcMain.on(ENHANCED_API.MPV.SET_PROPERTY, (_event, name, value) => {
            mpvPlayer?.property(name, value);
        });
        
        ipcMain.on(ENHANCED_API.MPV.GET_PROPERTY, (event, name) => {
            event.returnValue = mpvPlayer?.getRawProperty(name);
        });

        ipcMain.on(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE, () => {
            triggerOverlayWakefulness();
        });

        ipcMain.on(ENHANCED_API.MPV.TRIGGER_MAIN_BACK_NAVIGATION, () => {
            if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents.navigationHistory.canGoBack()) {
                mainWindow.webContents.navigationHistory.goBack();
            }
        });
        
        ipcMain.on(ENHANCED_API.MPV.TRIGGER_MAIN_FULLSCREEN, () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                const isFullScreen = mainWindow.isFullScreen();
                mainWindow.setFullScreen(!isFullScreen);
            }
        });

        ipcMain.on(ENHANCED_API.MPV.OVERLAY_SET_IGNORE_MOUSE, (_event, ignore: boolean) => {
            if (!uiOverlay || uiOverlay.isDestroyed()) return;
            
            uiOverlay.setIgnoreMouseEvents(ignore, { forward: true });

            if (!ignore) {
                if (hideTimer) clearTimeout(hideTimer);
            } else {
                triggerOverlayWakefulness();
            }
        });

        ipcMain.on(ENHANCED_API.MPV.DESTROY_OVERLAY, () => {
            if (!uiOverlay) return;
            if (hideTimer) clearTimeout(hideTimer);
            
            if (mainWindow) {
                mainWindow.off('resize', syncOverlayBounds);
                mainWindow.off('move', syncOverlayBounds);
            }
            uiOverlay.close();
            uiOverlay = null;
        });
    }
};