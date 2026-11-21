import { basename } from "path";
import ModManager from "../../../core/ModManager";
import Helpers from "../../../utils/Helpers";
import ExtractMetaData from "../../../utils/ExtractMetaData";
import { getModsTabTemplate } from "../../../components/marketplace-tab/marketplaceTab";
import { createMarketplaceCard, type ModMetaData } from "../../../components/marketplace-item/marketplaceItem";
import { CLASSES, ENHANCED_ROUTE } from "../../../constants";
import { modController } from "./modController";
import { settingsBuilder } from "../settings/settingsBuilder";
import { getLogger } from "../../../utils/logger";

const logger = getLogger("ModBrowser");

interface MarketplaceRegistry {
    plugins: ModMetaData[];
    themes: ModMetaData[];
}

let cachedRegistry: MarketplaceRegistry | null = null;

async function fetchRegistry(): Promise<MarketplaceRegistry> {
    if (cachedRegistry) return cachedRegistry;
    const data = await ModManager.fetchMods();
    cachedRegistry = {
        plugins: Array.isArray(data?.plugins) ? (data.plugins as ModMetaData[]) : [],
        themes: Array.isArray(data?.themes) ? (data.themes as ModMetaData[]) : [],
    };
    return cachedRegistry;
}

function setupSearchBar(): void {
    const searchInput = document.getElementById("marketplace-search-input") as HTMLInputElement | null;
    const modsList = document.getElementById("mods-list");
    if (!searchInput || !modsList) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        const items = modsList.querySelectorAll<HTMLElement>(".marketplace-item-card, [class*='addon-container-']");

        items.forEach((item) => {
            const name = item.querySelector(".marketplace-title")?.textContent?.toLowerCase() || "";
            const desc = item.textContent?.toLowerCase() || "";
            const matches = !query || name.includes(query) || desc.includes(query);
            item.style.display = matches ? "" : "none";
        });
    });
}

export function syncMarketplaceInstalledState(): void {
    const modsList = document.getElementById("mods-list");
    if (!modsList) return;

    modsList.querySelectorAll<HTMLElement>(".modActionBtn").forEach((btn) => {
        const link = btn.getAttribute("data-link") || "";
        const type = btn.getAttribute("data-type");
        if (!link || !type) return;

        const fileName = Helpers.getFileNameFromUrl(link);
        const installed = type === "Plugin"
            ? ModManager.isPluginInstalled(fileName)
            : ModManager.isThemeInstalled(fileName);
        const label = btn.querySelector(".label-OnWh2") || btn;

        if (installed) {
            btn.classList.remove(CLASSES.INSTALL_BUTTON);
            btn.classList.add(CLASSES.UNINSTALL_BUTTON);
            btn.setAttribute("title", "Uninstall");
            label.textContent = "Uninstall";
        } else {
            btn.classList.remove(CLASSES.UNINSTALL_BUTTON);
            btn.classList.add(CLASSES.INSTALL_BUTTON);
            btn.setAttribute("title", "Install");
            label.textContent = "Install";
        }
    });
}

export async function renderMarketplaceInline(forceReload = false): Promise<void> {
    const container = document.getElementById("enhanced-marketplace-content");
    if (!container) return;

    if (!forceReload && container.getAttribute("data-loaded") === "true") {
        syncMarketplaceInstalledState();
        return;
    }
    if (container.getAttribute("data-loading") === "true") return;

    container.setAttribute("data-loading", "true");
    container.removeAttribute("data-loaded");
    container.innerHTML = getModsTabTemplate();

    setupSearchBar();

    const modsList = document.getElementById("mods-list");
    if (!modsList) {
        container.removeAttribute("data-loading");
        return;
    }

    try {
        const registry = await fetchRegistry();
        if (!document.body.contains(modsList)) return;
        modsList.innerHTML = "";

        if (registry.plugins.length === 0 && registry.themes.length === 0) {
            modsList.innerHTML = `
                <div style="padding: 2.5rem; text-align: center; color: rgba(255,255,255,0.7); font-size: 1.05rem;">
                    No plugins or themes found in the community registry.
                </div>
            `;
            container.setAttribute("data-loaded", "true");
            return;
        }

        const handleAction = async (
            mod: ModMetaData,
            type: "Plugin" | "Theme",
            willInstall: boolean,
            btn: HTMLElement
        ) => {
            const typeLower = type.toLowerCase() as "plugin" | "theme";
            const fileName = Helpers.getFileNameFromUrl(mod.download);
            const label = btn.querySelector(".label-OnWh2") || btn;

            if (willInstall) {
                const prevText = label.textContent;
                label.textContent = "Installing...";
                btn.style.pointerEvents = "none";

                try {
                    const savedPath = await ModManager.downloadMod(mod.download, typeLower);
                    const savedFileName = basename(savedPath);
                    const metaData = ExtractMetaData.extractMetadataFromFile(savedPath);
                    if (metaData && !(typeLower === "theme" && metaData.name.toLowerCase() === "default")) {
                        settingsBuilder.removeItem(savedFileName);
                        settingsBuilder.addItem(typeLower, savedFileName, { ...metaData });
                    }

                    btn.classList.remove(CLASSES.INSTALL_BUTTON);
                    btn.classList.add(CLASSES.UNINSTALL_BUTTON);
                    btn.setAttribute("title", "Uninstall");
                    label.textContent = "Uninstall";
                } catch (err: any) {
                    logger.error(`Failed to install ${mod.name}: ${err?.message || err}`);
                    label.textContent = prevText;
                } finally {
                    btn.style.pointerEvents = "";
                }
            } else {
                const prevText = label.textContent;
                label.textContent = "Uninstalling...";
                btn.style.pointerEvents = "none";

                try {
                    modController.removeModUI(fileName, typeLower);
                    settingsBuilder.removeItem(fileName);

                    btn.classList.remove(CLASSES.UNINSTALL_BUTTON);
                    btn.classList.add(CLASSES.INSTALL_BUTTON);
                    btn.setAttribute("title", "Install");
                    label.textContent = "Install";
                } catch (err: any) {
                    logger.error(`Failed to uninstall ${mod.name}: ${err?.message || err}`);
                    label.textContent = prevText;
                } finally {
                    btn.style.pointerEvents = "";
                }
            }
        };

        for (const plugin of registry.plugins) {
            const fileName = Helpers.getFileNameFromUrl(plugin.download);
            const installed = ModManager.isPluginInstalled(fileName);
            modsList.appendChild(createMarketplaceCard(plugin, "Plugin", installed, handleAction));
        }

        for (const theme of registry.themes) {
            const fileName = Helpers.getFileNameFromUrl(theme.download);
            const installed = ModManager.isThemeInstalled(fileName);
            modsList.appendChild(createMarketplaceCard(theme, "Theme", installed, handleAction));
        }

        container.setAttribute("data-loaded", "true");
    } catch (err: any) {
        logger.error(`Failed to load community marketplace: ${err?.message || err}`);
        if (!document.body.contains(modsList)) return;
        modsList.innerHTML = `
            <div style="padding: 2.5rem; text-align: center; color: #ff6b6b; font-size: 1rem;">
                Failed to load community marketplace: ${err?.message || err}<br><br>
                <button id="marketplace-retry-btn" style="padding: 0.5rem 1rem; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; border: none;">
                    Retry
                </button>
            </div>
        `;
        document.getElementById("marketplace-retry-btn")?.addEventListener("click", () => {
            cachedRegistry = null;
            renderMarketplaceInline(true);
        });
    } finally {
        container.removeAttribute("data-loading");
    }
}

export async function browseMods(): Promise<void> {
    if (!location.hash.startsWith(`${ENHANCED_ROUTE}/marketplace`)) {
        location.hash = `${ENHANCED_ROUTE}/marketplace`;
    }
    await renderMarketplaceInline();
}
