import TemplateCache from '../../utils/templateCache';

export function getPromptModalTemplate(
    promptId: string, 
    title: string,
    message: string,
    defaultValue?: string
): string {
    const modalId = `prompt-modal-${promptId}`;

    const html = TemplateCache.load(__dirname, 'prompt-modal')
        .replace(/\{\{\s*modalId\s*\}\}/g, modalId)
        .replace(/\{\{\s*title\s*\}\}/g, title)
        .replace(/\{\{\s*message\s*\}\}/g, message)
        .replace(/\{\{\s*defaultValue\s*\}\}/g, defaultValue ?? "");

    return html;
}
