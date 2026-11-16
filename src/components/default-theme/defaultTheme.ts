import TemplateCache from '../../utils/templateCache';

export function getDefaultThemeTemplate(applied: boolean): string {
    const template = TemplateCache.load(__dirname, 'default-theme');

    return template
        .replace("{{ disabled }}", applied ? "disabled" : "")
        .replace("{{ label }}", applied ? "Applied" : "Apply")
        .replace("{{ backgroundColor }}", applied ? "var(--surface-background-color, var(--overlay-color))" : "var(--action-color, var(--secondary-accent-color))");
}
