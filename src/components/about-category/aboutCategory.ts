import TemplateCache from '../../utils/templateCache';

export function getAboutCategoryTemplate(
    version: string, 
    checkForUpdatesOnStartup: boolean, 
    discordRichPresence: boolean, 
    enableTransparentThemes: boolean
): string {
    let template = TemplateCache.load(__dirname, 'about-category');
    
    return template
        .replace("{{ version }}", version)
        .replace("{{ checkForUpdatesOnStartup }}", checkForUpdatesOnStartup ? "checked" : "")
        .replace("{{ discordrichpresence }}", discordRichPresence ? "checked" : "")
        .replace("{{ enableTransparentThemes }}", enableTransparentThemes ? "checked" : "");
}
