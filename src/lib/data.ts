import { supabase } from '@/lib/supabase';
import { ChampionData, LoreCharacter } from '@/types/champion';
import { unstable_cache } from 'next/cache';

/**
 * Récupère tous les champions depuis la base de données Supabase.
 * Utilise le cache de Next.js pour éviter de rappeler la DB inutilement.
 */
export const fetchAllChampions = unstable_cache(
  async (locale: string = 'fr_FR') => {
    try {
      // On sélectionne uniquement les champs nécessaires pour la grille
      // Ajout de title_en pour la traduction
      const { data, error } = await supabase
        .from('champions')
        .select('id, key, name, title, image, tags, factions, custom_tags, version, gender, species, partype');

      if (error) {
        console.error("Erreur Supabase (fetchAllChampions) :", error);
        return [];
      }

      const champions = data as ChampionData[];

      // Si locale est en_US, on utilise le titre anglais
      if (locale === 'en_US') {
        return champions.map(c => ({
          ...c,
          title: c.title_en || c.title
        }));
      }

      return champions;

    } catch (error) {
      console.error("Erreur inattendue (fetchAllChampions) :", error);
      return [];
    }
  },
  ['all-champions-v4'], // Clé de cache mise à jour pour forcer le refresh avec partype
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

      const champion = data as ChampionData;

      // Si la locale est en_US, on remplace les champs par leur version anglaise si elle existe
      if (locale === 'en_US') {
        if (champion.title_en) champion.title = champion.title_en;
        if (champion.lore_en) champion.lore = champion.lore_en;
        if (champion.blurb_en) champion.blurb = champion.blurb_en;
        if (champion.spells_en) champion.spells = champion.spells_en;
        if (champion.passive_en) champion.passive = champion.passive_en;
        if (champion.tags_en) champion.tags = champion.tags_en;
      }

      return champion;

    } catch (error) {
      console.error(`Erreur inattendue (fetchChampionDetails pour ${championId}) :`, error);
      return null;
    }
  },
  ['champion-details-v3'], // Clé de cache mise à jour
  { revalidate: 3600 } // Revalider toutes les heures
);

/**
 * Récupère tous les personnages du lore depuis Supabase.
 */
export const fetchLoreCharacters = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('lore_characters')
        .select('*');

      if (error) {
        // Si la table n'existe pas encore, on ne plante pas, on retourne vide
        console.warn("Erreur Supabase (fetchLoreCharacters) - Table peut-être manquante :", error.message);
        return [];
      }

      return data as LoreCharacter[];

    } catch (error) {
      console.error("Erreur inattendue (fetchLoreCharacters) :", error);
      return [];
    }
  },
  ['lore-characters-v3'],
  { revalidate: 3600 }
);