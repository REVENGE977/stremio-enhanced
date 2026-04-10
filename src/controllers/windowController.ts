import { ipcMain } from 'electron';
import { IPC_CHANNELS } from "../constants";
import { mainWindow } from '../main';

const isWindows = process.platform === 'win32';

export function setupWindowControls() {
    ipcMain.on(IPC_CHANNELS.MINIMIZE_WINDOW, () => {
        mainWindow?.minimize();
    });
    
    ipcMain.on(IPC_CHANNELS.MAXIMIZE_WINDOW, () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.handle(IPC_CHANNELS.IS_MAXIMIZED, () => {
        return mainWindow?.isMaximized() ?? false;
    });
    
    ipcMain.on(IPC_CHANNELS.CLOSE_WINDOW, () => {
        mainWindow?.close();
    });

    mainWindow?.on('maximize', () => {
        if (isWindows) mainWindow?.setResizable(false);
        mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_MAXIMIZED, true);
    });

    mainWindow?.on('unmaximize', () => {
        if (isWindows) mainWindow?.setResizable(true);
        mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_MAXIMIZED, false);
    });

    mainWindow?.on('enter-full-screen', () => {
        if (isWindows) mainWindow?.setResizable(false); 
        mainWindow?.webContents.send(IPC_CHANNELS.FULLSCREEN_CHANGED, true);
    });

    mainWindow?.on('leave-full-screen', () => {
        if (isWindows && !mainWindow?.isMaximized()) {
            mainWindow?.setResizable(true); 
        }
        
        mainWindow?.webContents.send(IPC_CHANNELS.FULLSCREEN_CHANGED, false);
    });

    ipcMain.on(IPC_CHANNELS.DRAG_WINDOW, (_, x: number, y: number) => {
        mainWindow?.setPosition(x, y);
    });
}