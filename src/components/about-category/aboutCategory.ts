import { readFileSync } from 'fs';

export function getAboutCategoryTemplate(version: string, checkForUpdatesOnStartup: boolean, discordrichpresence: boolean, enableTransparentThemes: boolean) {
    let template = readFileSync(__dirname + '/about-category.html', 'utf8');
    
    template = template.replace("{{ version }}", version);
    template = template.replace("{{ checkForUpdatesOnStartup }}", checkForUpdatesOnStartup ? "checked" : "");
    template = template.replace("{{ discordrichpresence }}", discordrichpresence ? "checked" : "");
    template = template.replace("{{ enableTransparentThemes }}", enableTransparentThemes ? "checked" : "");

    return template;
}