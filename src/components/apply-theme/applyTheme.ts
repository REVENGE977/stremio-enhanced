import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { join } from 'path';
import Properties from '../../core/Properties';

export function getApplyThemeTemplate(): string {
    // Note: This loads a .js file, not HTML, so we don't use template cache
    const template = readFileSync(join(__dirname, 'apply-theme.js'), 'utf8');
    const themeBaseURL = pathToFileURL(Properties.themesPath).toString();

    return template.replace("{{ themesPath }}", themeBaseURL);
}
