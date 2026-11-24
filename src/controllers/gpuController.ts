import { app, ipcMain } from 'electron';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getLogger } from '../utils/logger';
import { IPC_CHANNELS } from '../constants';

const logger = getLogger("GPUController");

interface BootConfig {
    hardwareAcceleration?: boolean;
    renderer?: string;
}

function readHardwareAccelerationConfig(bootConfigPath: string): boolean {
    if (!existsSync(bootConfigPath)) return true;
    try {
        const config: BootConfig = JSON.parse(readFileSync(bootConfigPath, 'utf-8'));
        if (typeof config.hardwareAcceleration === 'boolean') {
            return config.hardwareAcceleration;
        }
        // Backwards compatibility with legacy ANGLE renderer boot-config.json
        if (config.renderer === 'software') return false;
    } catch {
        logger.error("Failed to read boot config.");
    }
    return true;
}

export const gpuController = {
    setup: (userDataPath: string) => {
        const bootConfigPath = join(userDataPath, 'boot-config.json');
        const hardwareAcceleration = readHardwareAccelerationConfig(bootConfigPath);

        if (!hardwareAcceleration) {
            logger.warn("Hardware acceleration disabled by user; falling back to software rendering.");
            app.disableHardwareAcceleration();
            return;
        }

        const enabledFeatures = [
            'PlatformHEVCDecoderSupport',
            'AudioVideoTracks',
        ];

        if (process.platform !== 'darwin') {
            enabledFeatures.push('AcceleratedVideoEncoder');
            app.commandLine.appendSwitch('disable-gpu-driver-bug-workarounds');
            app.commandLine.appendSwitch('ignore-gpu-blocklist');
            app.commandLine.appendSwitch('enable-zero-copy');
            app.commandLine.appendSwitch('enable-gpu-rasterization');
        }

        if (process.platform === 'darwin') {
            enabledFeatures.push('VideoToolboxVideoDecoder');
        } else if (process.platform === 'win32') {
            app.commandLine.appendSwitch('use-gl', 'angle');
            app.commandLine.appendSwitch('use-angle', 'd3d11');
            enabledFeatures.push('D3D11VideoDecoder');
        } else {
            app.commandLine.appendSwitch('use-angle', 'gl');
            enabledFeatures.push('VaapiVideoDecoder', 'VaapiVideoDecodeLinuxGL', 'CanvasOopRasterization');
        }

        app.commandLine.appendSwitch('enable-features', enabledFeatures.join(','));
        logger.info(`GPU setup complete (hardwareAcceleration=true, features=${enabledFeatures.join(',')})`);
    },

    initIPC: (userDataPath: string) => {
        const bootConfigPath = join(userDataPath, 'boot-config.json');

        ipcMain.handle(IPC_CHANNELS.SET_HARDWARE_ACCELERATION, (_, enabled: boolean) => {
            const hardwareAcceleration = Boolean(enabled);
            let config: Record<string, unknown> = {};

            if (existsSync(bootConfigPath)) {
                try {
                    config = JSON.parse(readFileSync(bootConfigPath, 'utf-8'));
                } catch {
                    logger.error("Failed to parse existing boot config during update.");
                }
            }

            delete config.renderer;
            config.hardwareAcceleration = hardwareAcceleration;
            writeFileSync(bootConfigPath, JSON.stringify(config, null, 2));

            logger.info(`Hardware acceleration set to ${hardwareAcceleration}. Requires restart.`);
            return true;
        });

        ipcMain.handle(IPC_CHANNELS.GET_HARDWARE_ACCELERATION, (): boolean => {
            return readHardwareAccelerationConfig(bootConfigPath);
        });
    }
};