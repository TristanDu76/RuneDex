/**
 * Re-export from centralized config for isomorphic usage
 * This ensures build scripts and frontend use IDENTICAL functions
 */
export { slugify, normalizeKey, normalizeRegionToShardKey, isValidKebabCase } from '../lib/slug-config';
