import TemplateCache from "../../../../utils/templateCache";

export async function getTrackEntryTemplate(sub_id: string, title:string, source:string, type:string): Promise<string> {
    let template = TemplateCache.load(__dirname, 'track-entry');
    
    return template
        .replace("{{ sub_id }}", sub_id)
        .replace("{{ title }}", title)
        .replace("{{ source }}", source)
        .replace("{{ type }}", type);
}
