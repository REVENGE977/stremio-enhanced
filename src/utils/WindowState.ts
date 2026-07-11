import { app, BrowserWindow } from "electron";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { getLogger } from "./logger";

const logger = getLogger("WindowState");

export interface WindowState {
    x?: number;
    y?: number;
    width: number;
    height: number;
    isMaximized: boolean;
    isFullScreen: boolean;
}

export class WindowStateManager {
    private state: WindowState;
    private stateFilePath: string;

    constructor() {
        this.stateFilePath = join(app.getPath("userData"), "window-state.json");
        this.state = this.loadState();
    }

    private loadState(): WindowState {
        const defaultState: WindowState = {
            width: 1500,
            height: 850,
            isMaximized: false,
            isFullScreen: false,
        };

        try {
            if (existsSync(this.stateFilePath)) {
                const data = readFileSync(this.stateFilePath, "utf8");
                const savedState = JSON.parse(data);
                return { ...defaultState, ...savedState };
            }
        } catch (error) {
            logger.error(`Failed to load window state: ${error}`);
        }
        return defaultState;
    }

    private saveState() {
        try {
            writeFileSync(this.stateFilePath, JSON.stringify(this.state));
        } catch (error) {
            logger.error(`Failed to save window state: ${error}`);
        }
    }

    public getBounds(): Partial<WindowState> {
        return {
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height
        };
    }

    public manage(window: BrowserWindow) {
        if (this.state.isMaximized) {
            window.maximize();
        }
        if (this.state.isFullScreen) {
            window.setFullScreen(true);
        }

        const updateState = () => {
            try {
                if (!window.isMaximized() && !window.isFullScreen()) {
                    const bounds = window.getBounds();
                    this.state.x = bounds.x;
                    this.state.y = bounds.y;
                    this.state.width = bounds.width;
                    this.state.height = bounds.height;
                }
                this.state.isMaximized = window.isMaximized();
                this.state.isFullScreen = window.isFullScreen();
            } catch (e) {
                // Ignore if window is already destroyed
            }
        };

        let saveTimeout: NodeJS.Timeout | null = null;
        const triggerSave = () => {
            updateState();
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.saveState(), 500);
        };

        window.on("resize", triggerSave);
        window.on("move", triggerSave);
        window.on("maximize", triggerSave);
        window.on("unmaximize", triggerSave);
        window.on("enter-full-screen", triggerSave);
        window.on("leave-full-screen", triggerSave);
        window.on("close", () => {
            updateState();
            this.saveState();
        });
    }
}
