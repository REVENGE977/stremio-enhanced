import { ipcMain } from 'electron';
import { IPC_CHANNELS } from "../constants";
import logger from "../utils/logger";
import StremioService from '../utils/StremioService';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

let autokillEnabled = true;
let flagPath = '';
let isTerminating = false;

export function setupServiceController(userDataPath: string) {
    flagPath = join(userDataPath, "autokill_stremio_service");

    if (existsSync(flagPath)) {
        try {
            const val = readFileSync(flagPath, "utf8").trim();
            autokillEnabled = val !== "0" && val !== "false";
        } catch {
            autokillEnabled = true;
        }
    } else {
        autokillEnabled = true;
    }

    ipcMain.on(IPC_CHANNELS.SET_AUTOKILL_SERVICE, (_, enabled: boolean) => {
        autokillEnabled = enabled;
        logger.info(`Auto-kill Stremio Service on exit set to: ${enabled}`);
        try {
            writeFileSync(flagPath, enabled ? "1" : "0", "utf8");
        } catch (err) {
            logger.error(`Failed to save autokill service flag: ${err}`);
        }
    });

    ipcMain.handle(IPC_CHANNELS.GET_AUTOKILL_SERVICE_STATUS, () => {
        return autokillEnabled;
    });
}

export function isAutokillServiceEnabled(): boolean {
    if (process.argv.includes("--no-autokill-service") || process.argv.includes("--no-stremio-service")) {
        return false;
    }
    return autokillEnabled;
}

export async function terminateStremioServiceIfEnabled(): Promise<void> {
    if (isTerminating) return;
    if (!isAutokillServiceEnabled()) return;

    isTerminating = true;
    try {
        if (await StremioService.isProcessRunning()) {
            StremioService.terminate();
        }
    } catch (err) {
        logger.error(`Error during Stremio Service termination: ${err}`);
    } finally {
        isTerminating = false;
    }
}
