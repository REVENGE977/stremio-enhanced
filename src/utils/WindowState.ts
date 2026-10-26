import { app, BrowserWindow, Rectangle, screen } from "electron";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getLogger } from "./logger";

const logger = getLogger("WindowState");

export interface WindowStateData {
	x?: number;
	y?: number;
	width: number;
	height: number;
	isMaximized: boolean;
	isFullScreen: boolean;
}

const DEFAULT_WIDTH = 1500;
const DEFAULT_HEIGHT = 850;

export class WindowStateManager {
	private stateFilePath: string;
	private state: WindowStateData;
	private saveTimer: NodeJS.Timeout | null = null;
	
	constructor() {
		this.stateFilePath = join(app.getPath("userData"), "window-state.json");
		this.state = this.loadState();
	}
	
	public getBounds(): Partial<WindowStateData> {
		return {
			x: this.state.x,
			y: this.state.y,
			width: this.state.width,
			height: this.state.height,
		};
	}
	
	public manage(window: BrowserWindow): void {
		if (this.state.isMaximized) {
			window.maximize();
		}
		
		if (this.state.isFullScreen) {
			window.setFullScreen(true);
		}
		
		const updateState = () => {
			if (window.isDestroyed()) return;
			
			const bounds: Rectangle = window.getBounds();
			
			if (!window.isMinimized() && !window.isMaximized() && !window.isFullScreen()) {
				this.state.x = bounds.x;
				this.state.y = bounds.y;
				this.state.width = bounds.width;
				this.state.height = bounds.height;
			}
			
			this.state.isMaximized = window.isMaximized();
			this.state.isFullScreen = window.isFullScreen();
		};
		
		const triggerSave = () => {
			updateState();
			
			if (this.saveTimer) {
				clearTimeout(this.saveTimer);
			}
			
			this.saveTimer = setTimeout(() => {
				this.saveState();
			}, 500);
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
	
	private loadState(): WindowStateData {
		const defaultState: WindowStateData = {
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			isMaximized: false,
			isFullScreen: false,
		};
		
		if (!existsSync(this.stateFilePath)) {
			return defaultState;
		}
		
		try {
			const rawData = readFileSync(this.stateFilePath, "utf-8");
			const savedState = JSON.parse(rawData);
			
			const width =
			typeof savedState.width === "number" && savedState.width > 200
			? savedState.width
			: DEFAULT_WIDTH;
			
			const height =
			typeof savedState.height === "number" && savedState.height > 200
			? savedState.height
			: DEFAULT_HEIGHT;
			
			const isMaximized =
			typeof savedState.isMaximized === "boolean"
			? savedState.isMaximized
			: false;
			
			const isFullScreen =
			typeof savedState.isFullScreen === "boolean"
			? savedState.isFullScreen
			: false;
			
			const loadedState: WindowStateData = {
				width,
				height,
				isMaximized,
				isFullScreen,
			};
			
			if (
				typeof savedState.x === "number" &&
				typeof savedState.y === "number"
			) {
				if (this.isPositionVisible(savedState.x, savedState.y, width, height)) {
					loadedState.x = savedState.x;
					loadedState.y = savedState.y;
				}
			}
			
			return loadedState;
		} catch (error) {
			logger.error(`Failed to load window state: ${error}`);
			return defaultState;
		}
	}
	
	private isPositionVisible(
		x: number,
		y: number,
		width: number,
		height: number,
	): boolean {
		const displays = screen.getAllDisplays();
		
		return displays.some((display) => {
			const area = display.workArea;
			
			return (
				x + width > area.x &&
				x < area.x + area.width &&
				y + height > area.y &&
				y < area.y + area.height
			);
		});
	}
	
	private saveState(): void {
		if (this.saveTimer) {
			clearTimeout(this.saveTimer);
			this.saveTimer = null;
		}
		
		try {
			writeFileSync(
				this.stateFilePath,
				JSON.stringify(this.state, null, 2),
				"utf-8",
			);
		} catch (error) {
			logger.error(`Failed to save window state: ${error}`);
		}
	}
}