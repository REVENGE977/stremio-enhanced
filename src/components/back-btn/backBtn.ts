import { readFileSync } from 'fs';

export function getBackButton() {
    let template = readFileSync(__dirname + '/back-btn.html', 'utf8');
    return template;
}