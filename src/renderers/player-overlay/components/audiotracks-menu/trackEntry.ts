import TemplateCache from "../../../../utils/templateCache";

export async function getAudioTrackEntryTemplate(track_id: string, title:string, lang:string): Promise<string> {
    let template = TemplateCache.load(__dirname, 'track-entry');
    
    return template
        .replace("{{ track_id }}", track_id)
        .replace(/\{\{\s*title\s*\}\}/g, title)
        .replace(/\{\{\s*lang\s*\}\}/g, lang)
}
