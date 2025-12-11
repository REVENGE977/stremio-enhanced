import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Simple template caching utility
 * Templates are read from disk once and cached for subsequent use
 */
class TemplateCache {
    private static cache = new Map<string, string>();

    /**
     * Load a template from disk or return cached version
     * @param componentDir - The directory containing the template
     * @param templateName - The name of the HTML file (without extension)
     */
    public static load(componentDir: string, templateName: string): string {
        const cacheKey = `${componentDir}/${templateName}`;
        
        if (!this.cache.has(cacheKey)) {
            const templatePath = join(componentDir, `${templateName}.html`);
            this.cache.set(cacheKey, readFileSync(templatePath, 'utf8'));
        }
        
        return this.cache.get(cacheKey)!;
    }

    /**
     * Clear the template cache
     * Useful for development/hot-reloading
     */
    public static clear(): void {
        this.cache.clear();
    }
}

export default TemplateCache;

