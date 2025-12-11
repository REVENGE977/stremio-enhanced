import TemplateCache from '../../utils/templateCache';

export function getModsTabTemplate(): string {
    return TemplateCache.load(__dirname, 'mods-tab');
}
