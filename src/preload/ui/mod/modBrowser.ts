import ModManager from "../../../core/ModManager";
import Helpers from "../../../utils/Helpers";
import { getModsTabTemplate } from "../../../components/marketplace-tab/marketplaceTab";
import { getModItemTemplate } from "../../../components/marketplace-item/marketplaceItem";
import { getBackButton } from "../../../components/back-btn/backBtn";
import { SELECTORS, CLASSES } from "../../../constants";
import { modController } from "./modController";

export function setupBrowseModsButton(): void {
    Helpers.waitForElm('#browsePluginsThemesBtn').then(() => {
        const btn = document.getElementById("browsePluginsThemesBtn");
        btn?.addEventListener("click", browseMods);
    }).catch(() => {});
}

function setupSearchBar(): void {
    const searchInput = document.querySelector(SELECTORS.SEARCH_INPUT) as HTMLInputElement;
    const addonsContainer = document.querySelector(SELECTORS.ADDONS_LIST_CONTAINER);
    
    if (!searchInput || !addonsContainer) return;
    
    searchInput.addEventListener("input", () => {
        const filter = searchInput.value.trim().toLowerCase();
        const modItems = addonsContainer.querySelectorAll(SELECTORS.ADDON_CONTAINER);
        
        modItems.forEach((item) => {
            const name = item.querySelector(SELECTORS.NAME_CONTAINER)?.textContent?.toLowerCase() || "";
            const description = item.querySelector(SELECTORS.DESCRIPTION_ITEM)?.textContent?.toLowerCase() || "";
            const type = item.querySelector(SELECTORS.TYPES_CONTAINER)?.textContent?.toLowerCase() || "";
            
            const match = name.includes(filter) || description.includes(filter) || type.includes(filter);
            (item as HTMLElement).style.display = match ? "" : "none";
        });
    });
}

export async function browseMods(): Promise<void> {
    const settingsContent = document.querySelector(SELECTORS.SETTINGS_CONTENT);
    if (!settingsContent) return;
    
    settingsContent.innerHTML = getModsTabTemplate();
    const mods = await ModManager.fetchMods();
    const modsList = document.getElementById("mods-list");
    if (!modsList) return;
    
    (mods.plugins as any[]).forEach(async (plugin) => {
        const installed = ModManager.isPluginInstalled(Helpers.getFileNameFromUrl(plugin.download));
        const template = await getModItemTemplate(plugin, "Plugin", installed);
        modsList.innerHTML += template;
    });
    
    (mods.themes as any[]).forEach(async (theme) => {
        const installed = ModManager.isThemeInstalled(Helpers.getFileNameFromUrl(theme.download));
        const template = await getModItemTemplate(theme, "Theme", installed);
        modsList.innerHTML += template;
    });
    
    const actionBtns = document.querySelectorAll(".modActionBtn");
    actionBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const link = btn.getAttribute("data-link");
            const type = btn.getAttribute("data-type")?.toLowerCase() as "plugin" | "theme";
            if (!link || !type) return;
            
            if (btn.getAttribute("title") === "Install") {
                ModManager.downloadMod(link, type);
                btn.classList.remove(CLASSES.INSTALL_BUTTON);
                btn.classList.add(CLASSES.UNINSTALL_BUTTON);
                btn.setAttribute("title", "Uninstall");
                if (btn.childNodes[1]) btn.childNodes[1].textContent = "Uninstall";
            } else {
                modController.removeModUI(Helpers.getFileNameFromUrl(link), type);
                btn.classList.remove(CLASSES.UNINSTALL_BUTTON);
                btn.classList.add(CLASSES.INSTALL_BUTTON);
                btn.setAttribute("title", "Install");
                if (btn.childNodes[1]) btn.childNodes[1].textContent = "Install";
            }
        });
    });
    
    setupSearchBar();
    
    const horizontalNavs = document.querySelectorAll(SELECTORS.HORIZONTAL_NAV);
    if (horizontalNavs[1]) {
        horizontalNavs[1].innerHTML = getBackButton();
        document.getElementById("back-btn")?.addEventListener("click", () => {
            location.hash = '#/';
            setTimeout(() => location.hash = '#/settings', 0);
        });
    }
}