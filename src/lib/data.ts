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
        .select('id, key, name, title, image, tags, factions, custom_tags, version, gender, species, partype, lanes');

      if (error) {
        console.error("Erreur Supabase (fetchAllChampions) :", error);
        return [];
      }

      const champions = data as ChampionData[];

      // Si locale est en_US ou en, on utilise le titre anglais
      if (locale.startsWith('en')) {
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
  ['all-champions-v5'], // Clé de cache mise à jour pour forcer le refresh avec partype
  { revalidate: 3600 } // Revalider toutes les heures (3600s)
);

/**
 * Récupère les détails complets d'un champion depuis Supabase.
 * Utilise le cache de Next.js.
 */
export const fetchChampionDetails = unstable_cache(
  async (championId: string, version: string, locale: string = 'fr_FR') => {
    try {
      // 1. Récupérer le champion
      const { data: championData, error } = await supabase
        .from('champions')
        .select('*')
        .eq('id', championId)
        .single();

      if (error || !championData) {
        console.error(`Erreur Supabase (fetchChampionDetails pour ${championId}) :`, error);
        return null;
      }

      const champion = championData as ChampionData;

      // 2. Récupérer les relations depuis la table 'relations'
      // On cherche toutes les relations où ce champion est la SOURCE
      const { data: relationsData, error: relError } = await supabase
        .from('relations')
        .select(`
          type,
          note_fr,
          note_en,
          target_champion:champions!target_champion_id(name, image),
          target_lore:lore_characters!target_lore_id(name, image)
        `)
        .eq('source_champion_id', champion.id);

      if (relError) {
        console.error("Erreur récupération relations champion :", relError);
      }

      // 3. Formater les relations pour le frontend
      const formattedRelations = (relationsData || []).map((rel: any) => {
        const isChampion = !!rel.target_champion;
        const target = isChampion ? rel.target_champion : rel.target_lore;

        return {
          champion: target?.name || 'Inconnu',
          type: rel.type,
          note: locale.startsWith('en') ? rel.note_en : rel.note_fr,
          image: target?.image
        };
      });

      // @ts-ignore - On force le type
      champion.related_champions = formattedRelations;

      // Si la locale est en_US ou en, on remplace les champs par leur version anglaise si elle existe
      if (locale.startsWith('en')) {
        if (champion.title_en) champion.title = champion.title_en;
        if (champion.lore_en) champion.lore = champion.lore_en;
        if (champion.blurb_en) champion.blurb = champion.blurb_en;
        if (champion.spells_en) champion.spells = champion.spells_en;
        if (champion.passive_en) champion.passive = champion.passive_en;
        if (champion.tags_en) champion.tags = champion.tags_en;
        if (champion.skins_en) champion.skins = champion.skins_en;
      }

      return champion;

    } catch (error) {
      console.error(`Erreur inattendue (fetchChampionDetails pour ${championId}) :`, error);
      return null;
    }
  },
  ['champion-details-v4'], // Bump version
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
  ['lore-characters-v6'],
  { revalidate: 3600 }
);

/**
 * Récupère les détails d'un personnage du lore par son nom, AVEC ses relations.
 */
export const fetchLoreCharacter = unstable_cache(
  async (name: string, locale: string = 'fr_FR') => {
    try {
      // 1. Récupérer le personnage
      const { data: character, error } = await supabase
        .from('lore_characters')
        .select('*')
        .ilike('name', name)
        .single();

      if (error || !character) {
        console.error(`Erreur Supabase (fetchLoreCharacter pour ${name}) :`, error);
        return null;
      }

      // 2. Récupérer les relations depuis la table 'relations'
      // On cherche toutes les relations où ce personnage est la SOURCE
      const { data: relationsData, error: relError } = await supabase
        .from('relations')
        .select(`
          type,
          note_fr,
          note_en,
          target_champion:champions!target_champion_id(name, image),
          target_lore:lore_characters!target_lore_id(name, image)
        `)
        .eq('source_lore_id', character.id);

      if (relError) {
        console.error("Erreur récupération relations :", relError);
      }

      // 3. Formater les relations pour le frontend
      const formattedRelations = (relationsData || []).map((rel: any) => {
        const isChampion = !!rel.target_champion;
        const target = isChampion ? rel.target_champion : rel.target_lore;

        return {
          champion: target?.name || 'Inconnu', // Le nom de la cible
          type: rel.type,
          note: locale.startsWith('en') ? rel.note_en : rel.note_fr,
          // On ajoute l'image directement ici si besoin, ou on laisse le composant gérer
          image: target?.image
        };
      });

      const loreChar = character as LoreCharacter;
      // @ts-ignore - On force le type car on a enrichi les relations
      loreChar.related_champions = formattedRelations;

      // Localization
      if (locale.startsWith('en')) {
        if (loreChar.description_en) loreChar.description = loreChar.description_en;
      }

      return loreChar;

    } catch (error) {
      console.error(`Erreur inattendue (fetchLoreCharacter pour ${name}) :`, error);
      return null;
    }
  },
  ['lore-character-details-v5'], // Bump version
  { revalidate: 3600 }
);