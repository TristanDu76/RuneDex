import { supabase } from '@/lib/supabase';
import { ChampionData, LoreCharacter } from '@/types/champion';
import { unstable_cache } from 'next/cache';
import { formatRelations, localizeChampion, localizeLoreCharacter, getColName } from './data-utils';

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
        .select('id, key, name, title, image, tags, factions, custom_tags, version, gender, species, partype, lanes, title_en, skins');

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
  ['all-champions-v6'], // Clé de cache mise à jour pour forcer le refresh avec partype
  { revalidate: 3600 } // Revalider toutes les heures (3600s)
);

/**
 * Récupère les détails complets d'un champion depuis Supabase.
 * Utilise le cache de Next.js.
 */
export const fetchChampionDetails = unstable_cache(
  async (championId: string, locale: string = 'fr_FR') => {
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
      champion.related_champions = formatRelations(relationsData || [], locale);

      // 4. Localization
      return localizeChampion(champion, locale);

    } catch (error) {
      console.error(`Erreur inattendue (fetchChampionDetails pour ${championId}) :`, error);
      return null;
    }
  },
  ['champion-details-v5'], // Bump version
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
  ['lore-characters-v7'],
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

      const loreChar = character as LoreCharacter;

      // 3. Formater les relations pour le frontend
      loreChar.related_champions = formatRelations(relationsData || [], locale);

      // 4. Localization
      return localizeLoreCharacter(loreChar, locale);

    } catch (error) {
      console.error(`Erreur inattendue (fetchLoreCharacter pour ${name}) :`, error);
      return null;
    }
  },
  ['lore-character-details-v6'], // Bump version
  { revalidate: 3600 }
);

/**
 * Récupère tous les objets (items) depuis Supabase.
 */
export const fetchItems = unstable_cache(
  async (locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);
    const descCol = getColName('description', locale);
    const plaintextCol = getColName('plaintext', locale);

    const { data, error } = await supabase
      .from('items')
      .select(`
        id,
        name: ${nameCol},
        description: ${descCol},
        plaintext: ${plaintextCol},
        gold_base,
        gold_total,
        gold_sell,
        tags,
        stats,
        image,
        maps
      `)
      .order('gold_total', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }

    return data as any;
  },
  ['items-list-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère tous les artefacts du lore.
 */
export const fetchArtifacts = unstable_cache(
  async (locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);
    const descCol = getColName('description', locale);

    const { data, error } = await supabase
      .from('artifacts')
      .select(`
        id,
        name: ${nameCol},
        description: ${descCol},
        image_url,
        type,
        riot_id
      `)
      .order('name');

    if (error) {
      console.error('Error fetching artifacts:', error);
      return [];
    }

    return data as any;
  },
  ['artifacts-list-v3'],
  { revalidate: 3600 }
);

/**
 * Récupère les détails d'un artefact par son ID.
 */
export const fetchArtifactById = unstable_cache(
  async (id: string, locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);
    const descCol = getColName('description', locale);

    const { data: rawData, error } = await supabase
      .from('artifacts')
      .select(`
        id,
        name: ${nameCol},
        description: ${descCol},
        image_url,
        type,
        riot_id,
        owner:artifact_owners(
            champion:champions(id, name, image, title),
            lore_character:lore_characters(id, name, image),
            relation_type
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching artifact ${id}:`, error);
      return null;
    }

    // Cast to any to avoid ParserError due to dynamic query string
    const data = rawData as any;

    // Helper pour extraire l'objet unique s'il est retourné comme tableau
    const getSingle = (val: any) => Array.isArray(val) ? val[0] : val;

    const ownerData = data.owner?.[0];
    const champion = ownerData ? getSingle(ownerData.champion) : null;
    const loreChar = ownerData ? getSingle(ownerData.lore_character) : null;

    // Aplatir la structure pour le frontend
    const formattedData = {
      ...data,
      owner: ownerData ? {
        name: champion?.name || loreChar?.name,
        image: champion?.image || loreChar?.image,
        title: champion?.title, // Pour les champions
        type: ownerData.relation_type,
        link: champion ? `/champion/${champion.id}` : `/lore/${loreChar?.name}`
      } : null
    };

    return formattedData;
  },
  ['artifact-details-v3'],
  { revalidate: 3600 }
);

/**
 * Récupère toutes les Runes Telluriques (World Runes).
 */
export const fetchRunes = unstable_cache(
  async (locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);
    const descCol = getColName('description', locale);

    const { data, error } = await supabase
      .from('runes')
      .select(`
        id,
        name: ${nameCol},
        description: ${descCol},
        image_url,
        type
      `)
      .order('name');

    if (error) {
      console.error('Error fetching runes:', error);
      return [];
    }

    return data as any;
  },
  ['runes-list-lore-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère les détails d'une rune par son ID.
 */
export const fetchRuneById = unstable_cache(
  async (id: string, locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);
    const descCol = getColName('description', locale);

    const { data, error } = await supabase
      .from('runes')
      .select(`
        id,
        name: ${nameCol},
        description: ${descCol},
        image_url,
        type
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(`Error fetching rune ${id}:`, error);
      return null;
    }

    // Pour l'instant, pas de propriétaire lié dans la table runes, mais on pourrait l'ajouter
    // On simule la structure pour le frontend si besoin
    return { ...(data as any), owner: null };
  },
  ['rune-details-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère les runes précédente et suivante pour la navigation.
 */
export const fetchRuneNeighbors = unstable_cache(
  async (currentId: string, locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);

    // Récupérer toutes les runes triées par nom pour trouver les voisins
    // Ce n'est pas très optimisé pour une grande table, mais pour 5 runes c'est instantané
    const { data } = await supabase
      .from('runes')
      .select(`id, name: ${nameCol}`)
      .order(nameCol);

    const runes = data as { id: string; name: string }[] | null;

    if (!runes) return { prev: null, next: null };

    const currentIndex = runes.findIndex(r => r.id === currentId);
    if (currentIndex === -1) return { prev: null, next: null };

    const prev = currentIndex > 0 ? runes[currentIndex - 1] : runes[runes.length - 1]; // Boucle
    const next = currentIndex < runes.length - 1 ? runes[currentIndex + 1] : runes[0]; // Boucle

    return { prev, next };
  },
  ['rune-neighbors-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère les artefacts liés à un champion.
 */
export const fetchChampionArtifacts = unstable_cache(
  async (championId: string, locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);

    const { data, error } = await supabase
      .from('artifact_owners')
      .select(`
        relation_type,
        artifact:artifacts(
          id,
          name: ${nameCol},
          image_url,
          type
        )
      `)
      .eq('champion_id', championId);

    if (error) {
      console.error(`Error fetching artifacts for champion ${championId}:`, error);
      return [];
    }

    return data.map((item: any) => ({
      ...item.artifact,
      relation_type: item.relation_type
    }));
  },
  ['champion-artifacts-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère les runes liées à un champion.
 */
export const fetchChampionRunes = unstable_cache(
  async (championId: string, locale: string = 'fr_FR') => {
    const nameCol = getColName('name', locale);

    // Note: Cette requête suppose l'existence de la table 'rune_owners'
    const { data, error } = await supabase
      .from('rune_owners')
      .select(`
        relation_type,
        rune:runes(
          id,
          name: ${nameCol},
          image_url,
          type
        )
      `)
      .eq('champion_id', championId);

    if (error) {
      // On ne log pas d'erreur si la table n'existe pas encore pour éviter le spam
      if (error.code !== '42P01') { // 42P01 = undefined_table
        console.error(`Error fetching runes for champion ${championId}:`, error);
      }
      return [];
    }

    return data.map((item: any) => ({
      ...item.rune,
      relation_type: item.relation_type
    }));
  },
  ['champion-runes-v2'],
  { revalidate: 3600 }
);