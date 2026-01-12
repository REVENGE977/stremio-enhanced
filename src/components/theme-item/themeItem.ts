import TemplateCache from '../../utils/templateCache';
import { MetaData } from '../../interfaces/MetaData';

export function getThemeItemTemplate(
    filename: string, 
    metaData: MetaData,
    applied: boolean
): string {
    let template = TemplateCache.load(__dirname, 'theme-item');
    
    // Replace metadata placeholders
    const metaKeys = ['name', 'description', 'author', 'version'] as const;
    metaKeys.forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        template = template.replace(regex, metaData[key] || '');
    });

    return template
        .replace("{{ disabled }}", applied ? "disabled" : "")
        .replace(/\{\{\s*fileName\s*\}\}/g, filename)
        .replace("{{ label }}", applied ? "Applied" : "Apply")
        .replace("{{ buttonClass }}", applied ? "uninstall-button-container-oV4Yo" : "install-button-container-yfcq5");
}
