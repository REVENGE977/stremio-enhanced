import Helpers from "../utils/Helpers";
import MetaData from "../interfaces/MetaData";
import { getPluginItemTemplate } from "../components/plugin-item/pluginItem";
import { getThemeItemTemplate } from "../components/theme-item/themeItem";
import { getEnhancedNav } from "../components/enhanced-nav/enhancedNav";
import { getLogger } from "../utils/logger";
import ModManager from "./ModManager";
import { SELECTORS, CLASSES, STORAGE_KEYS } from "../constants";

class Settings {
    private static logger = getLogger("Settings");

    /**
     * Add a new section to the settings panel
     */
    public static addSection(sectionId: string, title: string): void {
        Helpers.waitForElm(SELECTORS.SECTIONS_CONTAINER).then(() => {
            this.logger.info(`Adding section: ${sectionId} with title: ${title}`);
            
            const settingsPanel = document.querySelector(SELECTORS.SECTIONS_CONTAINER);
            if (!settingsPanel) return;

            const sectionElement = document.querySelector(SELECTORS.SECTION);
            const labelElement = document.querySelector(SELECTORS.LABEL);
            
            if (!sectionElement || !labelElement) return;

            const sectionClassName = sectionElement.className;
            const titleClassName = labelElement.className;

            const sectionContainer = document.createElement("div");
            sectionContainer.className = sectionClassName;
            sectionContainer.id = sectionId;

            const sectionTitle = document.createElement("div");
            sectionTitle.className = titleClassName;
            sectionTitle.textContent = title;

            sectionContainer.appendChild(sectionTitle);
            settingsPanel.appendChild(sectionContainer);

            // Add section to nav
            Helpers.waitForElm(SELECTORS.NAV_MENU).then(() => {
                const nav = document.querySelector(SELECTORS.NAV_MENU);
                const shortcutsNav = document.querySelector('[title="Shortcuts"]');

                if (!nav || !shortcutsNav) return;
                if(document.getElementById(`nav-${sectionId}`)) return; // Nav item already exists

                const enhancedNavContainer = document.createElement("div");
                enhancedNavContainer.innerHTML = getEnhancedNav();
                
                nav.insertBefore(enhancedNavContainer, shortcutsNav.nextSibling);
            }).catch(err => this.logger.error(`Failed to add nav: ${err}`));
        }).catch(err => this.logger.error(`Failed to add section: ${err}`));
    }

    /**
     * Add a category within a section
     */
    public static addCategory(title: string, sectionId: string, icon: string): void {
        Helpers.waitForElm(SELECTORS.SECTIONS_CONTAINER).then(() => {
            this.logger.info(`Adding category: ${title} to section: ${sectionId}`);
            
            const categoryElement = document.querySelector(SELECTORS.CATEGORY);
            const categoryTitleElement = document.querySelector(SELECTORS.CATEGORY_LABEL);
            let categoryIconElement = document.querySelector(SELECTORS.CATEGORY_ICON);

            if (!categoryElement || !categoryTitleElement) return;

            const categoryClass = categoryElement.className;
            const categoryTitleClass = categoryTitleElement.className;
            
            let categoryIconClass = '';
            if (categoryIconElement instanceof SVGElement) {
                categoryIconClass = categoryIconElement.className.baseVal;
            } else if (categoryIconElement) {
                categoryIconClass = categoryIconElement.className;
            }
            
            icon = icon.replace(`class="icon"`, `class="${categoryIconClass}"`);

            const section = document.getElementById(sectionId);
            if (!section) return;

            const categoryDiv = document.createElement("div");
            categoryDiv.className = categoryClass;
            
            const titleDiv = document.createElement("div");
            titleDiv.className = categoryTitleClass;
            titleDiv.innerHTML = title;

            const headingDiv = document.createElement("div");
            headingDiv.classList.add(SELECTORS.CATEGORY_HEADING.replace('.', ''));
            headingDiv.innerHTML += icon;
            headingDiv.appendChild(titleDiv);
            
            categoryDiv.appendChild(headingDiv);
            section.appendChild(categoryDiv);
        }).catch(err => this.logger.error(`Failed to add category: ${err}`));
    }

    /**
     * Add a button to the settings
     */
    public static addButton(title: string, id: string, query: string): void {
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
        }).catch(err => this.logger.error(`Failed to add button: ${err}`));
    }

    /**
     * Add a theme or plugin item to the settings
     */
    public static addItem(type: "theme" | "plugin", fileName: string, metaData: MetaData): void {
        this.logger.info(`Adding ${type}: ${fileName}`);
        
        if (type === "theme") {
            Helpers.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
                this.addTheme(fileName, metaData);
            }).catch(err => this.logger.error(`Failed to add theme: ${err}`));
        } else if (type === "plugin") {
            Helpers.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
                this.addPlugin(fileName, metaData);
            }).catch(err => this.logger.error(`Failed to add plugin: ${err}`));
        }        
    }

    private static addPlugin(fileName: string, metaData: MetaData): void {
        const enabledPlugins: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
        );

        const pluginContainer = document.createElement("div");
        pluginContainer.innerHTML = getPluginItemTemplate(fileName, metaData, enabledPlugins.includes(fileName));
        pluginContainer.setAttribute("name", `${fileName}-box`);

        const pluginsCategory = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
        pluginsCategory?.appendChild(pluginContainer);
        
        ModManager.checkForItemUpdates(fileName);
    }

    private static addTheme(fileName: string, metaData: MetaData): void {
        const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);

        const themeContainer = document.createElement("div");
        themeContainer.innerHTML = getThemeItemTemplate(fileName, metaData, currentTheme === fileName);
        themeContainer.setAttribute("name", `${fileName}-box`);

        const themesCategory = document.querySelector(SELECTORS.THEMES_CATEGORY);
        themesCategory?.appendChild(themeContainer);
        
        ModManager.checkForItemUpdates(fileName);
    }

    /**
     * Remove an item from the settings
     */
    public static removeItem(fileName: string): void {
        const element = document.getElementsByName(`${fileName}-box`)[0];
        element?.remove();
    }

    /**
     * Set a navigation element as active
     */
    public static activeSection(element: Element): void {
        // Remove selected class from all nav items
        for (let i = 0; i < 6; i++) {
            const navItem = document.querySelector(`${SELECTORS.NAV_MENU} > div:nth-child(${i})`);
            navItem?.classList.remove(CLASSES.SELECTED);
        }

        element.classList.add(CLASSES.SELECTED);
    }
}

export default Settings;
