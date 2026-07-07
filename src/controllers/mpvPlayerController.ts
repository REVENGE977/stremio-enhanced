import { ipcMain, BrowserWindow } from 'electron';
import { mainWindow, mpvPlayer } from '../main';
import { ENHANCED_API, SELECTORS } from '../constants';
import { getPlayerOverlayTemplate, getPlayerOverlayPreloadTemplate } from "../renderers/player-overlay/components/playerOverlay";
import { getLogger } from '../utils/logger';

let uiOverlay: BrowserWindow | null = null;
let hideTimer: NodeJS.Timeout | null = null;
let nextVideoLink: string | null = null;

const logger = getLogger("MpvPlayerController");

function setOverlayVisibility(visible: boolean) {
    if (!uiOverlay || uiOverlay.isDestroyed()) return;

    if (visible) {
        uiOverlay.setOpacity(1);
        uiOverlay.setIgnoreMouseEvents(true, { forward: true });

        const showCursorCSS = "document.body.style.cursor = 'default';";
        uiOverlay.webContents.executeJavaScript(showCursorCSS);
        mainWindow?.webContents.executeJavaScript(showCursorCSS);
    } else {
        const hideCursorCSS = "document.body.style.cursor = 'none';";
        uiOverlay.webContents.executeJavaScript(hideCursorCSS);
        mainWindow?.webContents.executeJavaScript(hideCursorCSS);

        uiOverlay.setOpacity(0);
    }
}

function triggerOverlayWakefulness() {
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isFocused()) {
        return;
    }

    if (uiOverlay && uiOverlay.getOpacity() === 0) {
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
                    focusable: false,
                    hasShadow: false,
                    opacity: 0,
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
                    uiOverlay.webContents.zoomFactor = mainWindow.webContents.zoomFactor;

                    const mainHandle = mainWindow.getNativeWindowHandle();
                    const overlayHandle = uiOverlay.getNativeWindowHandle();
                    mpvPlayer?.lockOverlayToParent(mainHandle, overlayHandle);
                    
                    triggerOverlayWakefulness();
                    uiOverlay.webContents.send(ENHANCED_API.MPV.OVERLAY_SET_STREAM_TITLE, await getStreamTitle());

                    if(process.argv.includes("--devtools")) { 
                        uiOverlay.webContents.openDevTools({ mode: "detach" }); 
                    }
                });

                mainWindow.on('resize', syncOverlayBounds);
                mainWindow.on('move', syncOverlayBounds);

                // Since uiOverlay is not focusable, we have to implement the key event listeners from here.
                mainWindow.webContents.on('before-input-event', (event, input) => {
                    if (input.key === ' ' && input.type === 'keyDown') {
                        event.preventDefault();

                        if (mpvPlayer) {
                            const isPaused = mpvPlayer.getRawProperty("pause") === "yes";
                            mpvPlayer.property("pause", isPaused ? "no" : "yes");
                            
                            uiOverlay?.webContents.send(ENHANCED_API.MPV.PLAYBACK_STATE_CHANGED, isPaused ? "playing" : "paused");
                            triggerOverlayWakefulness();
                        }
                    }

                    if (input.key === 'ArrowRight' && input.type === 'keyDown') {
                        event.preventDefault();
                        if (mpvPlayer) {
                            mpvPlayer.command("seek", "5", "relative");
                            triggerOverlayWakefulness(); 
                        }
                    }

                    if (input.key === 'ArrowLeft' && input.type === 'keyDown') {
                        event.preventDefault();
                        if (mpvPlayer) {
                            mpvPlayer.command("seek", "-5", "relative");
                            triggerOverlayWakefulness();
                        }
                    }

                    if(input.key === "Escape" && input.type === 'keyDown') {
                        event.preventDefault();

                        if(mainWindow && !mainWindow.isDestroyed() && mainWindow.isFullScreen()) {
                            mainWindow.setFullScreen(false);
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

        ipcMain.on(ENHANCED_API.MPV.AVAILABLE_ADDON_SUBTITLES, (event, subtitlesList: { id: string, lang: string, url: string, addonSubtitleId?: string, origin: string }[]) => {
            if(subtitlesList) {
                subtitlesList.forEach(subtitle => {
                    uiOverlay?.webContents.send(ENHANCED_API.MPV.ADD_SUBTITLE_ENTRY, subtitle.addonSubtitleId, subtitle.origin, subtitle.lang, "external");
                });
            }

            event.returnValue = true;
        })

        ipcMain.on(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, (_event, sub_id:string) => {
            if (!mpvPlayer) return;

            try {
                logger.info("Loading external subtitle: " + sub_id)
                mainWindow?.webContents.send(ENHANCED_API.MPV.LOAD_EXTERNAL_SUBTITLE, sub_id);
            } catch (err) {
                logger.error("Failed to add external subtitle to MPV: " + err);
            }
        });
                
        ipcMain.on(ENHANCED_API.MPV.GET_PROPERTY, (event, name) => {
            event.returnValue = mpvPlayer?.getRawProperty(name);
        });

        ipcMain.on(ENHANCED_API.MPV.MAIN_WINDOW_MOUSE_MOVE, () => {
            triggerOverlayWakefulness();
        });

        ipcMain.on(ENHANCED_API.MPV.OVERLAY_TRIGGER_NEXTVIDEO, () => {
            if (!uiOverlay || uiOverlay.isDestroyed() || !nextVideoLink) return;
            
            if (mpvPlayer) mpvPlayer.command("stop");
            
            if (uiOverlay && !uiOverlay.isDestroyed()) uiOverlay.close();
            uiOverlay = null;

            const targetRoute = nextVideoLink;
            nextVideoLink = null;

            mainWindow?.webContents.send(ENHANCED_API.EXECUTE_STREMIO_ROUTER_NAV, targetRoute);
        });

        ipcMain.on(ENHANCED_API.MPV.OVERLAY_SET_NEXTVIDEO, (_event, link: string) => {
            if (!uiOverlay || uiOverlay.isDestroyed()) return;
            nextVideoLink = link;
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