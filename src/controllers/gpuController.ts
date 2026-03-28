import { app, ipcMain } from 'electron';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getLogger } from '../utils/logger';
import { IPC_CHANNELS } from '../constants';
import { Renderer, VALID_RENDERERS } from "../interfaces/RendererTypes";

const logger = getLogger("GPUController");

export const gpuController = {
    setup: (userDataPath: string) => {
        app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights,UseChromeOSDirectVideoDecoder');
        app.commandLine.appendSwitch('enable-accelerated-video-decode');
        app.commandLine.appendSwitch('enable-zero-copy'); 
        app.commandLine.appendSwitch('media-cache-size', '268435456');
        app.commandLine.appendSwitch('num-raster-threads', '4');
        app.commandLine.appendSwitch('mse-video-buffer-size-limit-mb', '500');
        app.commandLine.appendSwitch('mse-audio-buffer-size-limit-mb', '50');
        app.commandLine.appendSwitch('ignore-connections-limit', 'localhost,127.0.0.1');

        let enabledFeatures = ['PlatformHEVCDecoderSupport'];

        const bootConfigPath = join(userDataPath, 'boot-config.json');
        let userRenderer = 'auto'; // 'auto', 'd3d11', 'd3d9', 'gl', 'vulkan', 'software'

        if (existsSync(bootConfigPath)) {
            try {
                const config = JSON.parse(readFileSync(bootConfigPath, 'utf-8'));
                if (config.renderer) userRenderer = config.renderer;
            } catch (e) {
                logger.error("Failed to read boot config.");
            }
        }

        if (userRenderer === 'software') {
            logger.warn("User forced Software Rendering.");
            app.disableHardwareAcceleration();
            return;
        }

        if (process.platform === "darwin") {
            logger.info(`Running on macOS, forcing Metal`);
            app.commandLine.appendSwitch('use-angle', 'metal');
            
        } else if (process.platform === "win32") {
            const renderer = userRenderer === 'auto' ? 'd3d11' : userRenderer;
            logger.info(`Running on Windows, using ${renderer}`);
            
            app.commandLine.appendSwitch('use-angle', renderer);
            app.commandLine.appendSwitch('enable-gpu-rasterization');

        } else {
            const renderer = userRenderer === 'auto' ? 'gl' : userRenderer;
            logger.info(`Running on Linux, using ${renderer}`);
            
            app.commandLine.appendSwitch('use-angle', renderer);
            app.commandLine.appendSwitch('enable-gpu-rasterization');
            
            if (renderer === 'vulkan') {
                app.commandLine.appendSwitch('ignore-gpu-blocklist');

                enabledFeatures.push(
                    'Vulkan', 
                    'VaapiVideoDecoder', 
                    'VaapiIgnoreDriverChecks', 
                    'CanvasOopRasterization'
                );
            } else {
                enabledFeatures.push('VaapiVideoDecoder', 'VaapiVideoDecodeLinuxGL', 'CanvasOopRasterization');
            }
        }

        app.commandLine.appendSwitch('enable-features', enabledFeatures.join(','));
    },

    initIPC: (userDataPath: string) => {
        const bootConfigPath = join(userDataPath, 'boot-config.json');

        ipcMain.handle(IPC_CHANNELS.SET_GPU_RENDERER, (_, selectedRenderer: string) => {            
            let config = { renderer: 'auto' };
            
            if (existsSync(bootConfigPath)) {
                try {
                    const existingConfig = JSON.parse(readFileSync(bootConfigPath, 'utf-8'));
                    config = { ...config, ...existingConfig };
                } catch (e) {
                    logger.error("Failed to parse existing boot config during update.");
                }
            }

            config.renderer = selectedRenderer;
            writeFileSync(bootConfigPath, JSON.stringify(config, null, 2));
            
            logger.info(`User updated GPU renderer to: ${selectedRenderer}. Requires restart.`);
            return true;
        });

        ipcMain.handle(IPC_CHANNELS.GET_GPU_RENDERER, (): Renderer => {
            if (!existsSync(bootConfigPath)) {
                writeFileSync(bootConfigPath, JSON.stringify({ renderer: "auto" }, null, 2));
                return "auto";
            }

            try {
                const rawData = readFileSync(bootConfigPath, 'utf-8');
                const configFile = JSON.parse(rawData);
                const savedRenderer = configFile?.renderer;

                if (VALID_RENDERERS.includes(savedRenderer as Renderer)) {
                    return savedRenderer as Renderer;
                } else {
                    logger.warn(`Invalid renderer '${savedRenderer}' found in config. Defaulting to auto.`);
                    return "auto";
                }
            } catch (error) {
                logger.error(`Failed to read/parse boot config: ${(error as Error).message}`);
                return "auto"; 
            }
        });
    }
}