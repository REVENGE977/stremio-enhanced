import Helpers from "../../../utils/Helpers";
import { MetaData } from "../../../interfaces/MetaData";
import { getPluginItemTemplate } from "../../../components/plugin-item/pluginItem";
import { getThemeItemTemplate } from "../../../components/theme-item/themeItem";
import { getLogger } from "../../../utils/logger";
import { SELECTORS, CLASSES, STORAGE_KEYS, FILE_EXTENSIONS, ENHANCED_ROUTE } from "../../../constants";
import { settingsAPI } from "../../api/settings";
import { modController } from "../mod/modController";
import { SETTINGS_STYLES, SETTINGS_STYLE_ID } from "./settingsStyles";

const logger = getLogger("SettingsBuilder");

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}

// Stremio's class names carry a build hash ("group-d0WuG") that changes with every Stremio Web
// update, so its elements are found by their stable prefix, and new elements copy the class
// names of Stremio's own ones. That keeps the Enhanced pages looking native after updates.
const classOf = (el: Element | null | undefined): string => el?.getAttribute("class") ?? "";

// Stremio's "selected" class for sidebar items (also hashed), read from whichever item has it.
function selectedClass(): string {
    for (const item of Array.from(document.querySelectorAll(`${SELECTORS.NAV_MENU} a`))) {
        const found = Array.from(item.classList).find((c) => c.startsWith("selected-"));
        if (found) return found;
    }
    return CLASSES.SELECTED;
}

export const settingsBuilder = {
    /**
     * Add the styles the Enhanced pages need (once).
     */
    injectStyles: (): void => {
        if (document.getElementById(SETTINGS_STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = SETTINGS_STYLE_ID;
        style.textContent = SETTINGS_STYLES;
        document.head.appendChild(style);
    },

    /**
     * Add a page to the settings panel. It lives next to Stremio's own settings page and is
     * shown instead of it while the address is #/settings/enhanced (see updateRoute).
     */
    addSection: (sectionId: string, title: string): void => {
        Helpers.waitForElm(SELECTORS.SETTINGS_PAGE).then(() => {
            if (document.getElementById(sectionId)) return;
            logger.info(`Adding section: ${sectionId} with title: ${title}`);
            settingsBuilder.injectStyles();

            const pane = document.querySelector(SELECTORS.SETTINGS_PANE);
            const stremioContainer = document.querySelector(SELECTORS.SETTINGS_PAGE_CONTAINER);
            const stremioPage = document.querySelector(SELECTORS.SETTINGS_PAGE);
            if (!pane || !stremioPage) return;
            const stremioHead = stremioPage.firstElementChild;

            const container = document.createElement("div");
            container.className = `${classOf(stremioContainer)} enhanced-page-container`;

            const page = document.createElement("div");
            page.className = classOf(stremioPage);
            page.id = sectionId;

            const head = document.createElement("div");
            head.className = classOf(stremioHead);
            const heading = document.createElement("h1");
            heading.className = classOf(stremioHead?.querySelector("h1"));
            heading.textContent = title;
            head.appendChild(heading);

            page.appendChild(head);
            container.appendChild(page);
            pane.appendChild(container);
            settingsBuilder.updateRoute();
        }).catch(err => logger.error(`Failed to add section: ${err}`));
    },

    /**
     * Add a group of links to the settings sidebar, like Stremio's "Preferences" or "Help" groups.
     * Each item opens #/settings/enhanced/<id>. It goes above the last group ("Help").
     */
    addNavGroup: (title: string, items: NavItem[]): void => {
        Helpers.waitForElm(SELECTORS.NAV_GROUP).then(() => {
            if (document.querySelector("[data-enhanced-nav]")) return;
            const nav = document.querySelector(SELECTORS.NAV_MENU);
            const groups = Array.from(document.querySelectorAll(SELECTORS.NAV_GROUP));
            const sampleGroup = groups[0];
            const sampleItem = sampleGroup?.querySelector("a");
            if (!nav || !sampleGroup || !sampleItem) return;

            const group = document.createElement("div");
            group.className = classOf(sampleGroup);
            group.setAttribute("data-enhanced-nav", "");

            const label = document.createElement("div");
            label.className = classOf(sampleGroup.firstElementChild);
            label.textContent = title;
            group.appendChild(label);

            const itemClass = Array.from(sampleItem.classList).filter((c) => !c.startsWith("selected-")).join(" ");
            const iconClass = classOf(sampleItem.querySelector("svg"));
            const labelClass = classOf(sampleItem.querySelector("div"));

            for (const item of items) {
                const link = document.createElement("a");
                link.className = itemClass;
                link.href = `${ENHANCED_ROUTE}/${item.id}`;
                link.setAttribute("data-enhanced-item", item.id);
                link.innerHTML = item.icon.replace(`class="icon"`, `class="${iconClass}"`);
                const text = document.createElement("div");
                text.className = labelClass;
                text.textContent = item.label;
                link.appendChild(text);
                group.appendChild(link);
            }

            nav.insertBefore(group, groups[groups.length - 1]);
            settingsBuilder.updateRoute();
        }).catch(err => logger.error(`Failed to add nav group: ${err}`));
    },

    /**
     * Show the Enhanced page (and highlight its sidebar item) while the address is
     * #/settings/enhanced[/<id>]; otherwise leave Stremio's own page alone.
     */
    updateRoute: (): void => {
        const content = document.querySelector(SELECTORS.SETTINGS_CONTENT);
        if (!content) return;
        const match = location.hash.match(/^#\/settings\/enhanced(?:\/([a-z]+))?/);
        const current = match ? (match[1] || "themes") : "";
        const selected = selectedClass();

        content.classList.toggle("enhanced-open", !!match);
        const page = document.getElementById("enhanced");
        if (page) page.setAttribute("data-show", current);

        for (const link of Array.from(document.querySelectorAll("[data-enhanced-item]"))) {
            link.classList.toggle(selected, link.getAttribute("data-enhanced-item") === current);
        }
        // Stremio shows its first page for addresses it doesn't know; unhighlight its item.
        if (match) {
            for (const link of Array.from(document.querySelectorAll(`${SELECTORS.NAV_MENU} a:not([data-enhanced-item])`))) {
                link.classList.remove(selected);
            }
        }
    },

    /**
     * Add a category (Themes, Plugins, About) to a page, styled like Stremio's own sections.
     * The category's icon is shown on its sidebar item instead.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addCategory: (title: string, sectionId: string, _icon: string): void => {
        Helpers.waitForElm(`#${sectionId}`).then(() => {
            logger.info(`Adding category: ${title} to section: ${sectionId}`);
            const section = document.getElementById(sectionId);
            if (!section) return;
            const sample = document.querySelector(SELECTORS.SETTINGS_GROUP);

            const category = document.createElement("div");
            category.className = `${classOf(sample)} enhanced-category`;
            category.setAttribute("data-category", title.toLowerCase());

            const heading = document.createElement("div");
            heading.className = classOf(sample?.firstElementChild);
            const headingTitle = document.createElement("h2");
            headingTitle.className = classOf(sample?.querySelector("h2"));
            headingTitle.textContent = title;
            heading.appendChild(headingTitle);

            category.appendChild(heading);
            section.appendChild(category);
        }).catch(err => logger.error(`Failed to add category: ${err}`));
    },

    /**
     * Add a button to the settings
     */
    addButton: (title: string, id: string, query: string): void => {
        Helpers.waitForElm(query).then(() => {
            const element = document.querySelector(query);
            if (!element) return;

            const optionDiv = document.createElement("div");
            optionDiv.classList.add(CLASSES.OPTION);

            const contentDiv = document.createElement("div");
            contentDiv.classList.add(CLASSES.CONTENT);

            const buttonDiv = document.createElement("div");
            buttonDiv.setAttribute("tabindex", "0");
            buttonDiv.setAttribute("title", title);
            buttonDiv.classList.add(CLASSES.BUTTON, CLASSES.BUTTON_CONTAINER, "button");
            buttonDiv.id = id;
            buttonDiv.textContent = title;

            contentDiv.appendChild(buttonDiv);
            optionDiv.appendChild(contentDiv);
            element.appendChild(optionDiv);
        }).catch(err => logger.error(`Failed to add button: ${err}`));
    },

    /**
     * Add a theme or plugin item to the settings
     */
    addItem: (type: "theme" | "plugin", fileName: string, metaData: MetaData): void => {
        logger.info(`Adding ${type}: ${fileName}`);
        
        if (type === "theme") {
            Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
                settingsBuilder._addTheme(fileName, metaData);
            }).catch(err => logger.error(`Failed to add theme: ${err}`));
        } else if (type === "plugin") {
            Helpers.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
                settingsBuilder._addPlugin(fileName, metaData);
            }).catch(err => logger.error(`Failed to add plugin: ${err}`));
        }        
    },

    /**
     * Remove an item from the settings
     */
    removeItem: (fileName: string): void => {
        const element = document.getElementsByName(`${fileName}-box`)[0];
        element?.remove();
    },

    _addPlugin: async (fileName: string, metaData: MetaData): Promise<void> => {
        const enabledPlugins: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
        );

        const pluginContainer = document.createElement("div");
        pluginContainer.innerHTML = getPluginItemTemplate(fileName, metaData, enabledPlugins.includes(fileName));
        pluginContainer.setAttribute("name", `${fileName}-box`);

        document.querySelector(SELECTORS.PLUGINS_CATEGORY)?.appendChild(pluginContainer);

        if(await settingsAPI.getRegisteredSettings(fileName.split(FILE_EXTENSIONS.PLUGIN)[0]) != null) {
            let optionBtn = document.getElementById(`${fileName}-settings`);
            if(optionBtn) optionBtn.style.display = "flex";
        }
        
        modController.checkForItemUpdatesUI(fileName);
    },

    _addTheme: (fileName: string, metaData: MetaData): void => {
        const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);

        const themeContainer = document.createElement("div");
        themeContainer.innerHTML = getThemeItemTemplate(fileName, metaData, currentTheme === fileName);
        themeContainer.setAttribute("name", `${fileName}-box`);

        document.querySelector(SELECTORS.THEMES_CATEGORY)?.appendChild(themeContainer);
        
        modController.checkForItemUpdatesUI(fileName);
    }
};