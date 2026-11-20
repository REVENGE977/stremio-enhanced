import { isPlayerRoute, updateCanvasVisibility } from './mpvShellBridge';

let isTransparent = false;
let isEnforcing = false;
const modifiedElements = new Set<HTMLElement>();
let observer: MutationObserver | null = null;

export function enforcePlayerTransparency(force?: boolean): void {
    if (isEnforcing) return;
    isEnforcing = true;

    try {
        const shouldBeTransparent = force !== undefined ? force : isPlayerRoute();
        const html = document.documentElement;
        const body = document.body;
        const app = document.getElementById('app');
        const playerContainer = shouldBeTransparent
            ? document.querySelector<HTMLElement>('[class*="player-container"]')
            : null;
        const videoContainer = shouldBeTransparent && playerContainer
            ? playerContainer.querySelector<HTMLElement>('[class*="video-container"]')
            : null;

        if (shouldBeTransparent) {
            if (!html || !body) return;
            isTransparent = true;

            const makeTransparent = (el: HTMLElement) => {
                if (el.style.getPropertyValue('background-color') !== 'transparent') {
                    el.style.setProperty('background', 'transparent', 'important');
                    el.style.setProperty('background-color', 'transparent', 'important');
                }
                modifiedElements.add(el);
            };

            makeTransparent(html);
            makeTransparent(body);
            if (app) {
                makeTransparent(app);
                app.style.position = 'relative';
                app.style.zIndex = '1';
            }

            if (playerContainer) {
                makeTransparent(playerContainer);
                let curr = playerContainer.parentElement;
                while (curr && curr !== body && curr !== html) {
                    makeTransparent(curr);
                    curr = curr.parentElement;
                }
            }
            if (videoContainer) {
                makeTransparent(videoContainer);
            }
        } else if (isTransparent) {
            isTransparent = false;
            modifiedElements.forEach(el => {
                try {
                    el.style.removeProperty('background');
                    el.style.removeProperty('background-color');
                } catch {
                    // Ignore detached element errors
                }
            });
            modifiedElements.clear();

            html?.style.removeProperty('background');
            html?.style.removeProperty('background-color');
            body?.style.removeProperty('background');
            body?.style.removeProperty('background-color');
            if (app) {
                app.style.removeProperty('background');
                app.style.removeProperty('background-color');
                app.style.removeProperty('position');
                app.style.removeProperty('z-index');
            }
        }

        updateCanvasVisibility();
    } finally {
        isEnforcing = false;
    }
}

export function setupTransparencyBridge(): void {
    enforcePlayerTransparency();

    window.addEventListener('hashchange', () => enforcePlayerTransparency());
    window.addEventListener('popstate', () => enforcePlayerTransparency());

    const attachObserver = () => {
        if (observer) return;
        const target = document.documentElement || document.body;
        if (!target) return;

        observer = new MutationObserver(() => {
            enforcePlayerTransparency();
        });

        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style'],
        });
    };

    if (document.documentElement || document.body) {
        attachObserver();
    } else {
        document.addEventListener('DOMContentLoaded', attachObserver, { once: true });
    }
}
