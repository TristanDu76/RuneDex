/**
 * SHARED CONSTANTS FOR RUNEDEX
 * ═════════════════════════════════════════════════════════════════
 * Isomorphic configuration used by BOTH:
 * - Build scripts (generate-manifest.mjs, validate-integrity.mjs)
 * - Frontend (MapClient.tsx, API routes, etc)
 *
 * ⚠️  GOLDEN RULE: If you modify this file, REBUILD and VALIDATE!
 */

/**
 * Region ID → Shard File Key mapping
 * Some regions have special naming (e.g., "Shadow Isles" → "shadow-isles")
 * This map ensures consistent lookup across build and frontend
 */
export const REGION_TO_SHARD_MAP = {
    // Standard regions (ID = shard key)
    // demacia, noxus, ionia, freljord, piltover, zaun, shurima, targon, etc.
    
    // Special cases (ID ≠ shard key)
    shadowisles: 'shadow-isles',
    'shadow-isles': 'shadow-isles'
} as const;

/**
 * SLUGIFICATION CONFIGURATION
 * Applied consistently across all systems
 */
export const SLUG_CONFIG = {
    minLength: 1,
    maxLength: 255,
    allowedPattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    description: 'kebab-case (lowercase letters, numbers, hyphens only)'
} as const;

/**
 * Normalize region/faction name to shard file key (isomorphic)
 * Used by: generate-manifest.mjs, MapClient.tsx
 * 
 * @param regionId Raw region ID
 * @returns Normalized shard key (guaranteed kebab-case, lowercase)
 */
export function normalizeRegionToShardKey(regionId: string): string {
    if (!regionId) return 'unknown';
    
    // First try direct mapping
    const mapped = REGION_TO_SHARD_MAP[regionId.toLowerCase() as keyof typeof REGION_TO_SHARD_MAP];
    if (mapped) return mapped;
    
    // Fall back to standard slugification
    return slugify(regionId);
}

/**
 * Universal SLUGIFY function (isomorphic)
 * Used by: generate-manifest.mjs, MapClient.tsx, utils
 * 
 * CRITICAL: Must match exactly between build and frontend
 * 
 * @param text Input string to slugify
 * @returns kebab-case string
 */
export function slugify(text: string): string {
    if (!text) return 'unknown';

    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars (special chars, accents)
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

/**
 * Normalize faction/species/gender for i18n key lookups
 * Handles complex patterns: "Human (, Jun)" → "human"
 * 
 * @param text Raw faction/species/gender name
 * @returns Slugified key for translation
 */
export function normalizeKey(text: string): string {
    if (!text) return 'unknown';

    // Remove parenthetical content and take first part before comma
    const base = text
        .split(',')[0]
        .trim()
        .replace(/\s*\([^)]*\)/g, '')
        .trim();

    return slugify(base);
}

/**
 * Validate that an ID conforms to kebab-case format
 * @param id String to validate
 * @returns true if valid, false otherwise
 */
export function isValidKebabCase(id: string): boolean {
    return SLUG_CONFIG.allowedPattern.test(id.toLowerCase());
}
