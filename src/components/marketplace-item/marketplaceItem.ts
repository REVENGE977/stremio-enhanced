import TemplateCache from '../../utils/templateCache';
import { CLASSES } from '../../constants';

export interface ModMetaData {
    name: string;
    description: string;
    author: string;
    version?: string;
    preview?: string;
    download: string;
    repo?: string;
}

function escapeHtml(text: string): string {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function getModItemTemplate(
    metaData: ModMetaData,
    type: 'Plugin' | 'Theme',
    installed: boolean
): string {
    const template = TemplateCache.load(__dirname, 'marketplace-item');

    let logoBlock = '';
    if (metaData.preview) {
        logoBlock = `
            <a href="${escapeHtml(metaData.preview)}" target="_blank" rel="noreferrer" style="cursor: zoom-in; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <img class="logo-WrsGF" src="${escapeHtml(metaData.preview)}" alt="${escapeHtml(metaData.name)} Preview" loading="lazy" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;">
            </a>`;
    } else if (type === 'Theme') {
        logoBlock = `
            <svg viewBox="0 0 24 24" style="width: 2.2rem; height: 2.2rem; fill: currentcolor;">
                <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z"></path>
            </svg>`;
    } else {
        logoBlock = `
            <svg viewBox="0 0 24 24" style="width: 2.2rem; height: 2.2rem; fill: currentcolor;">
                <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.49 0 2.7-1.21 2.7-2.7s-1.21-2.7-2.7-2.7z"></path>
            </svg>`;
    }

    let repoBlock = '';
    if (metaData.repo) {
        repoBlock = `
            <a href="${escapeHtml(metaData.repo)}" target="_blank" rel="noreferrer" class="marketplace-repo-btn" style="cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; padding: 0.55rem 1rem; border-radius: 0.35rem; background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.85); font-size: 0.85rem; font-weight: 500; transition: background 0.2s;">
                <svg viewBox="0 0 24 24" style="width: 1.15rem; height: 1.15rem; fill: currentcolor; margin-right: 0.4rem; flex-shrink: 0;">
                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <span>Open repository</span>
            </a>`;
    }

    const actionbtnTitle = installed ? 'Uninstall' : 'Install';
    const actionbtnClass = installed ? CLASSES.UNINSTALL_BUTTON : CLASSES.INSTALL_BUTTON;

    const replacements: Record<string, string> = {
        name: escapeHtml(metaData.name),
        version: escapeHtml(metaData.version || '1.0.0'),
        type,
        description: escapeHtml(metaData.description),
        author: escapeHtml(metaData.author),
        actionbtnTitle,
        actionbtnClass,
        download: escapeHtml(metaData.download),
        logoBlock,
        repoBlock,
    };

    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => replacements[key] ?? '');
}

export function createMarketplaceCard(
    metaData: ModMetaData,
    type: 'Plugin' | 'Theme',
    installed: boolean,
    onAction: (mod: ModMetaData, type: 'Plugin' | 'Theme', willInstall: boolean, btn: HTMLElement) => Promise<void>
): HTMLElement {
    const html = getModItemTemplate(metaData, type, installed);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const card = (wrapper.querySelector('.marketplace-item-card') || wrapper.firstElementChild) as HTMLElement;

    const btn = card.querySelector<HTMLElement>('.modActionBtn');
    if (btn) {
        btn.addEventListener('click', async () => {
            const willInstall = btn.getAttribute('title') === 'Install';
            await onAction(metaData, type, willInstall, btn);
        });
    }

    return card;
}
