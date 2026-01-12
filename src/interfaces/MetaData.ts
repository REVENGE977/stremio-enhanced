/**
 * Metadata structure for plugins and themes
 * Extracted from JSDoc-style comments in mod files
 */
export interface MetaData {
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

export type MetadataKey = keyof MetaData;

export const REQUIRED_METADATA_KEYS = [
    "name",
    "description",
    "author",
    "version",
] as const satisfies readonly MetadataKey[];

export const ALL_METADATA_KEYS = [
    "name",
    "description",
    "author",
    "version",
    "updateUrl",
    "source",
    "license",
    "homepage",
] as const satisfies readonly MetadataKey[];
