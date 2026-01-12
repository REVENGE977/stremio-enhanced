import TemplateCache from '../../utils/templateCache';
import { MetaData } from '../../interfaces/MetaData';

export function getPluginItemTemplate(
    filename: string, 
    metaData: MetaData,
    checked: boolean
): string {
    let template = TemplateCache.load(__dirname, 'plugin-item');
    
    // Replace metadata placeholders
    const metaKeys = ['name', 'description', 'author', 'version'] as const;
    metaKeys.forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        template = template.replace(regex, metaData[key] || '');
    });

    return template
        .replace("{{ checked }}", checked ? "checked" : "")
        .replace(/\{\{\s*fileName\s*\}\}/g, filename);
}
