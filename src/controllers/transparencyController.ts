import { ipcMain } from 'electron';
import { IPC_CHANNELS } from "../constants";
import logger from "../utils/logger";
import { existsSync, writeFileSync, unlinkSync } from 'fs';
import Helpers from '../utils/Helpers';
    
export function setupWindowTransparency(transparencyFlagPath: string) {
    ipcMain.on(IPC_CHANNELS.SET_TRANSPARENCY, (_, enabled: boolean) => {
        if (enabled) {
            logger.info("Enabled window transparency");
            writeFileSync(transparencyFlagPath, "1");
        } else {
            logger.info("Disabled window transparency");
            try {
                unlinkSync(transparencyFlagPath);
            } catch {
                // File may not exist, ignore
            }
        }
        
        Helpers.showAlert("info", "Transparency setting changed", "Please restart the app to apply the changes.", ["OK"]);
    });
    
    ipcMain.handle(IPC_CHANNELS.GET_TRANSPARENCY_STATUS, () => {
        return existsSync(transparencyFlagPath);
    });
}