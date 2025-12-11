/**
 * Metadata structure for plugins and themes
 * Extracted from JSDoc-style comments in mod files
 */
interface MetaData {
    /** Display name of the mod */
    name: string;
    /** Brief description of what the mod does */
    description: string;
    /** Author/creator of the mod */
    author: string;
    /** Semantic version string (e.g., "1.0.0") */
    version: string;
    /** URL to check for updates (optional) */
    updateUrl?: string;
    /** Source code repository URL (optional) */
    source?: string;
    /** License type (optional) */
    license?: string;
    /** Homepage/documentation URL (optional) */
    homepage?: string;
}

export default MetaData;
