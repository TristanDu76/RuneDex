import { unstable_cache } from 'next/cache';

/**
 * Generic wrapper for Next.js cache (unstable_cache).
 * Standardizes cache key and tag management.
 * 
 * @param queryFn The async function that fetches the data
 * @param keyParts Unique parts of the cache key (e.g., ['champions', locale])
 * @param tags Tags for invalidation (e.g., ['champions'])
 * @param revalidate Validity duration in seconds (default: 1h)
 */
export async function cachedQuery<T>(
    queryFn: () => Promise<T>,
    keyParts: string[],
    tags: string[] = [],
    revalidate: number = 3600
): Promise<T> {
    return unstable_cache(
        queryFn,
        keyParts,
        {
            tags,
            revalidate
        }
    )();
}
