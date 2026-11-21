/**
 * Styles for the Stremio Enhanced settings pages.
 *
 * Stremio's own class names carry a build hash (e.g. "option-vFOAS") that changes whenever Stremio
 * Web updates, which broke these pages before. The page layout copies Stremio's class names at
 * runtime (see settingsBuilder), and the option rows, buttons and links use the stable classes
 * below. Colours use Stremio Web 5.1's variable names, with the older names as fallbacks.
 */
export const SETTINGS_STYLE_ID = "enhanced-settings-style";

export const SETTINGS_STYLES = `
.enhanced-page-container { display: none; }
.enhanced-open .enhanced-page-container { display: block; }
.enhanced-open [class*="pane-"] > :not(.enhanced-page-container) { display: none !important; }

#enhanced[data-show="themes"] > .enhanced-category:not([data-category="themes"]),
#enhanced[data-show="plugins"] > .enhanced-category:not([data-category="plugins"]),
#enhanced[data-show="marketplace"] > .enhanced-category:not([data-category="marketplace"]),
#enhanced[data-show="about"] > .enhanced-category:not([data-category="about"]) { display: none; }

.enhanced-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.1rem;
    margin-bottom: 0.5rem;
    border-radius: var(--border-radius, 0.75rem);
    background: var(--surface-background-color, var(--overlay-color, rgba(255, 255, 255, 0.05)));
}
.enhanced-option-heading { flex: 1; min-width: 0; }
.enhanced-option-label {
    color: var(--foreground-color-primary, var(--primary-foreground-color, rgba(255, 255, 255, 0.9)));
    font-size: 1rem;
}
.enhanced-option-content { flex: none; display: flex; align-items: center; gap: 0.5rem; }

.enhanced-option-content .button,
.enhanced-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 1.2rem;
    border-radius: 2rem;
    background: var(--surface-background-color, var(--overlay-color, rgba(255, 255, 255, 0.08)));
    color: var(--foreground-color-primary, var(--primary-foreground-color, #fff));
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}
.enhanced-option-content .button:hover,
.enhanced-button:hover { background: var(--accent-color, var(--primary-accent-color, #7b5bf5)); }

.enhanced-link {
    display: block;
    padding: 0.8rem 1rem;
    border-radius: var(--border-radius, 0.75rem);
    background: var(--surface-background-color, var(--overlay-color, rgba(255, 255, 255, 0.05)));
    cursor: pointer;
}
.enhanced-link a { color: inherit; text-decoration: none; }
.enhanced-link-label { color: var(--foreground-color-primary, var(--primary-foreground-color, #fff)); font-weight: 600; }
.enhanced-link:hover { background: var(--accent-color, var(--primary-accent-color, #7b5bf5)); }

.marketplace-item-card {
    transition: border-color 0.2s, background-color 0.2s;
}
.marketplace-item-card:hover {
    border-color: rgba(255, 255, 255, 0.16) !important;
    background-color: rgba(255, 255, 255, 0.06) !important;
}
.marketplace-title {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: unset !important;
    word-break: break-word !important;
    max-width: none !important;
}
.marketplace-repo-btn:hover {
    background: rgba(255, 255, 255, 0.16) !important;
    color: #fff !important;
}
.modActionBtn {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease-in-out;
}
.modActionBtn.install-button-container-yfcq5 {
    background-color: var(--action-background-color, var(--action-color, var(--accent-color, var(--primary-accent-color, #735bf2))));
    color: #fff;
}
.modActionBtn.install-button-container-yfcq5:hover {
    filter: brightness(1.1);
}
.modActionBtn.uninstall-button-container-oV4Yo {
    background-color: rgba(220, 38, 38, 0.78);
    color: #fff;
}
.modActionBtn.uninstall-button-container-oV4Yo:hover {
    background-color: rgba(220, 38, 38, 0.95);
}
.logo-WrsGF {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
`;
