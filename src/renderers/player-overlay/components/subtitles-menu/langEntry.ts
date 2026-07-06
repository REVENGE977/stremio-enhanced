import TemplateCache from "../../../../utils/templateCache";

export async function getLangEntryTemplate(title: string, lang:string): Promise<string> {
    let template = TemplateCache.load(__dirname, 'lang-entry');
    
    return template
        .replace(/\{\{\s*title\s*\}\}/g, title)
        .replace("{{ lang }}", lang);
}
