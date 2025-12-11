import TemplateCache from '../../utils/templateCache';

export function getEnhancedNav(): string {
    return TemplateCache.load(__dirname, 'enhanced-nav');
}
