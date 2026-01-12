import { readFileSync } from "fs";
import {
    MetaData,
    MetadataKey,
    REQUIRED_METADATA_KEYS,
    ALL_METADATA_KEYS,
} from "../interfaces/MetaData";
import logger from "./logger";

class ExtractMetaData {
    /**
     * Parse metadata from a comment block in the format:
     * /** @key value *\/
    */
    private static parseMetadataFromContent(content: string): MetaData | null {
        const blockMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
        if (!blockMatch) return null;

        const result: Partial<MetaData> = {};
        const tagRegex = /@(\w+)\s+([^\n\r]+)/g;

        for (const [, rawKey, rawValue] of blockMatch[1].matchAll(tagRegex)) {
            if (!ALL_METADATA_KEYS.includes(rawKey as MetadataKey)) continue;

            const key = rawKey as MetadataKey;

            if (result[key] !== undefined) continue;

            result[key] = rawValue.trim();
        }

        for (const key of REQUIRED_METADATA_KEYS) {
            if (!result[key]) return null;
        }

        return result as MetaData;
    }

    public static extractMetadataFromFile(filePath: string): MetaData | null {
        try {
            const fileContent = readFileSync(filePath, 'utf8');
            const metadata = this.parseMetadataFromContent(fileContent);
            
            if (!metadata) {
                logger.error('Metadata comments not found in the file: ' + filePath);
            }
            
            return metadata;
        } catch (error) {
            logger.error('Error reading the file: ' + (error as Error).message);
            return null;
        }
    }

    public static extractMetadataFromText(textContent: string): MetaData | null {
        const metadata = this.parseMetadataFromContent(textContent);
        
        if (!metadata) {
            logger.error('Comment block not found in the provided text');
        }
        
        return metadata;
    }
}

export default ExtractMetaData;