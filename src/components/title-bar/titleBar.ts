import { readFileSync } from 'fs';

export function getTitleBarTemplate() {
    let template = readFileSync(__dirname + '/title-bar.html', 'utf8');
    return template;
}