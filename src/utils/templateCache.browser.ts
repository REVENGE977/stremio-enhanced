import modsTab from '../components/mods-tab/mods-tab.html';
import modsItem from '../components/mods-item/mods-item.html';
import aboutCategory from '../components/about-category/about-category.html';
import defaultTheme from '../components/default-theme/default-theme.html';
import backBtn from '../components/back-btn/back-btn.html';
import titleBar from '../components/title-bar/title-bar.html';

const templates: Record<string, string> = {
    'mods-tab': modsTab,
    'mods-item': modsItem,
    'about-category': aboutCategory,
    'default-theme': defaultTheme,
    'back-btn': backBtn,
    'title-bar': titleBar,
};

class TemplateCache {
    public static load(dir: string, name: string): string {
        // We ignore dir in browser build
        return templates[name] || "";
    }
}

export default TemplateCache;
