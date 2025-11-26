import { supabase } from '@/lib/supabase';
import { ChampionData } from '@/types/champion';
import { unstable_cache } from 'next/cache';

/**
 * Récupère tous les champions depuis la base de données Supabase.
 * Utilise le cache de Next.js pour éviter de rappeler la DB inutilement.
 */
export const fetchAllChampions = unstable_cache(
  async (locale: string = 'fr_FR') => {
    try {
      // On sélectionne uniquement les champs nécessaires pour la grille
      const { data, error } = await supabase
        .from('champions')
        .select('id, key, name, title, image, tags, factions, custom_tags, version');

      if (error) {
        console.error("Erreur Supabase (fetchAllChampions) :", error);
        return [];
      }

      return data as ChampionData[];

    } catch (error) {
      console.error("Erreur inattendue (fetchAllChampions) :", error);
      return [];
    }
  },
  ['all-champions'], // Clé de cache
  { revalidate: 3600 } // Revalider toutes les heures (3600s)
);

/**
 * Récupère les détails complets d'un champion depuis Supabase.
 * Utilise le cache de Next.js.
 */
export const fetchChampionDetails = unstable_cache(
  async (championId: string, version: string, locale: string = 'fr_FR') => {
    try {
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .eq('id', championId)
        .single();

      if (error) {
        console.error(`Erreur Supabase (fetchChampionDetails pour ${championId}) :`, error);
        return null;
      }

      return data as ChampionData;

    } catch (error) {
      console.error(`Erreur inattendue (fetchChampionDetails pour ${championId}) :`, error);
      return null;
    }
  },
  ['champion-details'], // Clé de cache (sera combinée avec les arguments automatiquement)
  { revalidate: 3600 } // Revalider toutes les heures
);