import TemplateCache from '../../utils/templateCache';

export function getTitleBarTemplate(): string {
    return TemplateCache.load(__dirname, 'title-bar');
}
