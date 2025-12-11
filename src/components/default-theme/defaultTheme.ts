import TemplateCache from '../../utils/templateCache';

export function getDefaultThemeTemplate(applied: boolean): string {
    const template = TemplateCache.load(__dirname, 'default-theme');

    return template
        .replace("{{ disabled }}", applied ? "disabled" : "")
        .replace("{{ label }}", applied ? "Applied" : "Apply")
        .replace("{{ backgroundColor }}", applied ? "var(--overlay-color)" : "var(--secondary-accent-color)");
}
