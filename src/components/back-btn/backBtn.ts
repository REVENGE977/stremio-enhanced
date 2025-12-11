import TemplateCache from '../../utils/templateCache';

export function getBackButton(): string {
    return TemplateCache.load(__dirname, 'back-btn');
}
