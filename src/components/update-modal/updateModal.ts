import { marked } from "marked";
import TemplateCache from "../../utils/templateCache";
import Updater from "../../core/Updater";

export async function getUpdateModalTemplate(): Promise<string> {
    let template = TemplateCache.load(__dirname, 'update-modal');
    
    const releaseNotes = await Updater.getReleaseNotes();
    const markdown = await marked(releaseNotes, { gfm: true, breaks: true });

    const currentVersion = Updater.getCurrentVersion();
    const latestVersion = await Updater.getLatestVersion();

    return template
        .replace("{{ releaseNotes }}", markdown)
        .replace(/\{\{\s*currentVersion\s*\}\}/g, currentVersion)
        .replace(/\{\{\s*newVersion\s*\}\}/g, latestVersion);
}
