import { unstable_cache } from 'next/cache';

/**
 * Wrapper générique pour le cache Next.js (unstable_cache).
 * Permet de standardiser la gestion des clés et des tags.
 * 
 * @param queryFn La fonction asynchrone qui récupère les données
 * @param keyParts Les parties uniques de la clé de cache (ex: ['champions', locale])
 * @param tags Les tags pour l'invalidation (ex: ['champions'])
 * @param revalidate Durée de validité en secondes (défaut: 1h)
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
