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
    logger.info("Adding title bar...");
    const activeRoute = document.querySelector(SELECTORS.ROUTE_CONTAINER);
    if (!activeRoute || activeRoute.querySelector(".title-bar")) return;
    
    activeRoute.insertAdjacentHTML("afterbegin", getTitleBarTemplate());
    logger.info("Title bar added to active route");
    
    const titleBar = activeRoute.querySelector(".title-bar");
    if (!titleBar) return;
    
    titleBar.querySelector("#minimizeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.MINIMIZE_WINDOW);
    });
    
    titleBar.querySelector("#maximizeApp-btn")?.addEventListener("click", () => {
        const pathElement = titleBar.querySelector("#maximizeApp-btn svg path");
        if (pathElement) {
            const currentPath = pathElement.getAttribute("d");
            const maximizedPath = "M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z";
            const normalPath = "M3,3H21V21H3V3M5,5V19H19V5H5Z";
            pathElement.setAttribute("d", currentPath === maximizedPath ? normalPath : maximizedPath);
        }
        ipcRenderer.send(IPC_CHANNELS.MAXIMIZE_WINDOW);
    });
    
    titleBar.querySelector("#closeApp-btn")?.addEventListener("click", () => {
        ipcRenderer.send(IPC_CHANNELS.CLOSE_WINDOW);
    });
}