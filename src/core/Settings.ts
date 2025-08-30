import Helpers from "../utils/Helpers";
import MetaData from "../interfaces/MetaData"
import { getPluginItemTemplate } from "../components/plugin-item/pluginItem";
import { getThemeItemTemplate } from "../components/theme-item/themeItem";
import { getEnhancedNav } from "../components/enhanced-nav/enhancedNav";
import { getLogger } from "../utils/logger";
import ModManager from "./ModManager";

class Settings {
    private static logger = getLogger("Settings");

    public static addSection(sectionid:string, title:string) {
        Helpers.waitForElm(`[class^="sections-container-"]`).then(() => {
            this.logger.info("Adding section: " + sectionid + " with title: " + title);
            // add section to settings panel
            const settingsPanel = document.querySelector(`[class^="sections-container-"]`);

            const sectionClassName = document.querySelector(`[class^="section-"]`).className;
            const titleClassName = document.querySelector(`[class^="label-wXG3e"]`).className;

            const sectionContainer = document.createElement("div");
            sectionContainer.className = sectionClassName;
            sectionContainer.id = sectionid;

            const sectionTitle = document.createElement("div");
            sectionTitle.className = titleClassName;
            sectionTitle.textContent = title;

            sectionContainer.appendChild(sectionTitle);

            settingsPanel.appendChild(sectionContainer);

            // add section to nav
            Helpers.waitForElm(`.menu-xeE06`).then(() => {
                const nav = document.querySelector(`.menu-xeE06`);
                const shortcutsNav = document.querySelector('[title="Shortcuts"]');

                const enhancedNavContainer = document.createElement("div");
                enhancedNavContainer.innerHTML = getEnhancedNav();
                
                nav.insertBefore(enhancedNavContainer, shortcutsNav.nextSibling);
            });
        })
    }

    public static addCategory(title:string, sectionid:string, icon:string) {
        Helpers.waitForElm(`[class^="sections-container-"]`).then(() => {
            this.logger.info("Adding category: " + title + " to section: " + sectionid);
            const categoryClass = document.querySelector(`.category-GP0hI`).className;
            const categoryTitleClass = document.querySelector(`.label-N_O2v`).className;
            let categoryIconClass:any = document.querySelector(`.icon-oZoyV`);

            if (categoryIconClass instanceof SVGElement) {
                categoryIconClass = categoryIconClass.className.baseVal;
            } else if (categoryIconClass) {
                categoryIconClass = categoryIconClass.className;
            }
            
            icon = icon.replace(`class="icon"`, `class="${categoryIconClass}"`);

            const section = document.getElementById(sectionid);

            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add(categoryClass);
            
            const titleDiv = document.createElement("div");
            titleDiv.classList.add(categoryTitleClass);
            titleDiv.innerHTML = title;

            const headingDiv = document.createElement("div");
            headingDiv.classList.add("heading-XePFl");
            headingDiv.innerHTML += icon;
            headingDiv.appendChild(titleDiv);
            
            categoryDiv.appendChild(headingDiv);
            section.appendChild(categoryDiv);
        })
    }

    public static addButton(title:string, id:string, query:string) {
        Helpers.waitForElm(query).then(() => {
            const element = document.querySelector(query);

            const optionDiv = document.createElement("div");
            optionDiv.classList.add("option-vFOAS");

            const contentDiv = document.createElement("div");
            contentDiv.classList.add("content-P2T0i");

            const buttonDiv = document.createElement("div");
            buttonDiv.setAttribute("tabindex", "0");
            buttonDiv.setAttribute("title", title);
            buttonDiv.classList.add("button-DNmYL", "button-container-zVLH6", "button");
            buttonDiv.id = id;
            buttonDiv.textContent = title;

            contentDiv.appendChild(buttonDiv);

            optionDiv.appendChild(contentDiv);

            element.appendChild(optionDiv);
        })
    }

    public static addItem(type: "theme" | "plugin", fileName:string, metaData:MetaData) {
        // let addonClasses = this.getAddonClasses().replace(/\./g, "").trim();

        this.logger.info("Adding " + type + ": " + fileName);
        if (type == "theme") {
            Helpers.waitForElm('#enhanced > div:nth-child(2)').then(() => {
                this.addTheme(fileName, metaData);
            })
        } else if (type == "plugin") {
            Helpers.waitForElm('#enhanced > div:nth-child(3)').then(() => {
                this.addPlugin(fileName, metaData);
            })
        }        
    }

    private static addPlugin(fileName:string, metaData:{name:string, description:string, author:string, version:string}) {
        let enabledPlugins = JSON.parse(localStorage.getItem("enabledPlugins"));

        const pluginContainer = document.createElement("div");
        pluginContainer.innerHTML = getPluginItemTemplate(fileName, metaData, enabledPlugins.includes(fileName));
        pluginContainer.setAttribute("name", `${fileName}-box`);

        document.querySelector(`#enhanced > div:nth-child(3)`).appendChild(pluginContainer);
        ModManager.checkForItemUpdates(fileName);
    }

    private static addTheme(fileName:string, metaData:{name:string, description:string, author:string, version:string}) {
        let currentTheme = localStorage.getItem("currentTheme");

        const themeContainer = document.createElement("div");
        themeContainer.innerHTML = getThemeItemTemplate(fileName, metaData, currentTheme == fileName);
        themeContainer.setAttribute("name", `${fileName}-box`);

        document.querySelector(`#enhanced > div:nth-child(2)`).appendChild(themeContainer);
        ModManager.checkForItemUpdates(fileName);
    }

    public static removeItem(fileName:string) {
        document.getElementsByName(`${fileName}-box`)[0].remove();
    }

    public static activeSection(element:Element) {
        for (let i = 0; i < 6; i++) {
            try {
                document.querySelector(`.menu-xeE06 > div:nth-child(${i})`).classList.remove("selected-S7SeK"); 
            }catch {}
        }

        element.classList.add("selected-S7SeK");
    }
}

export default Settings;