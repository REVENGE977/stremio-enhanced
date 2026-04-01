import { ipcRenderer } from "electron";
import { IPC_CHANNELS, SELECTORS } from "../../constants";
import { getTitleBarTemplate } from "../../components/title-bar/titleBar";
import logger from "../../utils/logger";

let transparencyStatusCache: boolean | null = null;

export async function getTransparencyStatus(): Promise<boolean> {
    if (transparencyStatusCache === null) {
        transparencyStatusCache = await ipcRenderer.invoke(IPC_CHANNELS.GET_TRANSPARENCY_STATUS) as boolean;
    }
    return transparencyStatusCache ?? false;
}

export function addTitleBar(): void {
    const activeRoute = document.querySelector(SELECTORS.ROUTE_CONTAINER);
    if (!activeRoute || activeRoute.querySelector(".title-bar")) return;
    
    logger.info("Adding title bar...");
    activeRoute.insertAdjacentHTML("afterbegin", getTitleBarTemplate());
    
    const titleBar = activeRoute.querySelector(".title-bar") as HTMLElement;
    if (!titleBar) return;
    
    logger.info("Title bar added to active route");

    let isWindowMaximized = false;
    let isWindowFullscreen = false;
    let isDragging = false;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    const updateMaximizeIcon = (isMax: boolean) => {
        const pathElement = titleBar.querySelector("#maximizeApp-btn svg path");
        if (!pathElement) return;

        const maximizeIcon = "M3,3H21V21H3V3M5,5V19H19V5H5Z"; 
        const restoreIcon = "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z"; 
        
        pathElement.setAttribute("d", isMax ? restoreIcon : maximizeIcon);
    };

    ipcRenderer.invoke(IPC_CHANNELS.IS_MAXIMIZED).then((isMax: boolean) => {
        isWindowMaximized = isMax;
        updateMaximizeIcon(isMax);
    });

    ipcRenderer.on(IPC_CHANNELS.WINDOW_MAXIMIZED, (_, isMax: boolean) => {
        isWindowMaximized = isMax;
        updateMaximizeIcon(isMax);
    });

    ipcRenderer.on(IPC_CHANNELS.FULLSCREEN_CHANGED, (_, isFullscreen: boolean) => {
        isWindowFullscreen = isFullscreen;
        document.body.classList.toggle('is-fullscreen', isFullscreen);
    });

    titleBar.querySelector("#minimizeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.MINIMIZE_WINDOW);
    });
    
    titleBar.querySelector("#maximizeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.MAXIMIZE_WINDOW);
    });

    titleBar.querySelector("#closeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.CLOSE_WINDOW);
    });

    titleBar.addEventListener("mousedown", (e: MouseEvent) => {
        e.stopPropagation();

        if ((e.target as HTMLElement).closest('.title-bar-buttons') || isWindowMaximized || isWindowFullscreen) {
            return;
        }

        isDragging = true;
        mouseOffsetX = e.screenX - window.screenX;
        mouseOffsetY = e.screenY - window.screenY;
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
        if (!isDragging) return;
        
        const moveX = Math.round(e.screenX - mouseOffsetX);
        const moveY = Math.round(e.screenY - mouseOffsetY);
        
        ipcRenderer.send(IPC_CHANNELS.DRAG_WINDOW, moveX, moveY);
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    titleBar.addEventListener("dblclick", (e: MouseEvent) => {
        e.stopPropagation();
        
        if ((e.target as HTMLElement).closest('.title-bar-buttons')) return;
        ipcRenderer.send(IPC_CHANNELS.MAXIMIZE_WINDOW);
    });
}