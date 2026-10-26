import { BrowserWindow, screen, Rectangle } from "electron";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import logger from "./logger";

export interface WindowStateData {
    width: number;
    height: number;
    x?: number;
    y?: number;
    isMaximized: boolean;
}

const DEFAULT_WIDTH = 1500;
const DEFAULT_HEIGHT = 850;

export class WindowState {
    private stateFilePath: string;
    private state: WindowStateData;
    private debounceTimer: NodeJS.Timeout | null = null;

    constructor(userDataPath: string) {
        this.stateFilePath = join(userDataPath, "window-state.json");
        this.state = this.loadState();
    }

    public getState(): WindowStateData {
        return { ...this.state };
    }

    private loadState(): WindowStateData {
        const defaultState: WindowStateData = {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            isMaximized: true,
        };

        if (!existsSync(this.stateFilePath)) {
            return defaultState;
        }

        try {
            const rawData = readFileSync(this.stateFilePath, "utf-8");
            const parsed = JSON.parse(rawData);

            const width = typeof parsed.width === "number" && parsed.width > 200 ? parsed.width : DEFAULT_WIDTH;
            const height = typeof parsed.height === "number" && parsed.height > 200 ? parsed.height : DEFAULT_HEIGHT;
            const isMaximized = typeof parsed.isMaximized === "boolean" ? parsed.isMaximized : true;

            const loadedState: WindowStateData = {
                width,
                height,
                isMaximized,
            };

            if (typeof parsed.x === "number" && typeof parsed.y === "number") {
                if (this.isPositionVisible(parsed.x, parsed.y, width, height)) {
                    loadedState.x = parsed.x;
                    loadedState.y = parsed.y;
                }
            }

            return loadedState;
        } catch (error) {
            logger.error(`Failed to load window state: ${error}`);
            return defaultState;
        }
    }

    private isPositionVisible(x: number, y: number, width: number, height: number): boolean {
        const displays = screen.getAllDisplays();
        return displays.some(display => {
            const area = display.workArea;
            return (
                x + width > area.x &&
                x < area.x + area.width &&
                y + height > area.y &&
                y < area.y + area.height
            );
        });
    }

    public track(window: BrowserWindow): void {
        const updateState = (isClosing = false) => {
            if (window.isDestroyed()) return;

            const isMaximized = window.isMaximized();

            if (!isMaximized && !window.isMinimized() && !window.isFullScreen()) {
                const bounds: Rectangle = window.getBounds();
                this.state = {
                    width: bounds.width,
                    height: bounds.height,
                    x: bounds.x,
                    y: bounds.y,
                    isMaximized: false,
                };
            } else if (!window.isFullScreen() && !window.isMinimized()) {
                this.state.isMaximized = isMaximized;
            }

            if (isClosing) {
                this.saveSync();
            } else {
                this.saveDebounced();
            }
        };

        window.on("resize", () => updateState());
        window.on("move", () => updateState());
        window.on("maximize", () => updateState());
        window.on("unmaximize", () => updateState());
        window.on("close", () => updateState(true));
    }

    private saveDebounced(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.saveSync();
        }, 500);
    }

    private saveSync(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
        try {
            writeFileSync(this.stateFilePath, JSON.stringify(this.state, null, 2), "utf-8");
        } catch (error) {
            logger.error(`Failed to save window state: ${error}`);
        }
    }
}
