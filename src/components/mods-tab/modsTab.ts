import { readFileSync } from 'fs';

export function getModsTabTemplate() {
    let template = readFileSync(__dirname + '/mods-tab.html', 'utf8');
    return template;
}