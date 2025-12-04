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
  // ... existing code ...
  ['lore-character-details-v5'], // Bump version
  { revalidate: 3600 }
);

/**
 * Récupère tous les objets (items) depuis Supabase.
 */
export const fetchItems = unstable_cache(
  async (locale: string = 'fr_FR') => {
    // Déterminer la langue pour les colonnes traduites
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';
    const descCol = isEnglish ? 'description_en' : 'description';
    const plaintextCol = isEnglish ? 'plaintext_en' : 'plaintext';

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

    return data;
  },
  ['items-list-v1'],
  { revalidate: 3600 }
);

/**
 * Récupère tous les artefacts du lore.
 */
export const fetchArtifacts = unstable_cache(
  async (locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';
    const descCol = isEnglish ? 'description_en' : 'description';

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

    return data;
  },
  ['artifacts-list-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère les détails d'un artefact par son ID.
 */
export const fetchArtifactById = unstable_cache(
  async (id: string, locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';
    const descCol = isEnglish ? 'description_en' : 'description';

    const { data, error } = await supabase
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
  ['artifact-details-v2'],
  { revalidate: 3600 }
);

/**
 * Récupère toutes les Runes Telluriques (World Runes).
 */
export const fetchRunes = unstable_cache(
  async (locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';
    const descCol = isEnglish ? 'description_en' : 'description';

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

    return data;
  },
  ['runes-list-lore-v1'],
  { revalidate: 3600 }
);

/**
 * Récupère les détails d'une rune par son ID.
 */
export const fetchRuneById = unstable_cache(
  async (id: string, locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';
    const descCol = isEnglish ? 'description_en' : 'description';

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

    if (error) {
      console.error(`Error fetching rune ${id}:`, error);
      return null;
    }

    // Pour l'instant, pas de propriétaire lié dans la table runes, mais on pourrait l'ajouter
    // On simule la structure pour le frontend si besoin
    return { ...data, owner: null };
  },
  ['rune-details-v1'],
  { revalidate: 3600 }
);

/**
 * Récupère les runes précédente et suivante pour la navigation.
 */
export const fetchRuneNeighbors = unstable_cache(
  async (currentId: string, locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';

    // Récupérer toutes les runes triées par nom pour trouver les voisins
    // Ce n'est pas très optimisé pour une grande table, mais pour 5 runes c'est instantané
    const { data: runes } = await supabase
      .from('runes')
      .select(`id, name: ${nameCol}`)
      .order(nameCol);

    if (!runes) return { prev: null, next: null };

    const currentIndex = runes.findIndex(r => r.id === currentId);
    if (currentIndex === -1) return { prev: null, next: null };

    const prev = currentIndex > 0 ? runes[currentIndex - 1] : runes[runes.length - 1]; // Boucle
    const next = currentIndex < runes.length - 1 ? runes[currentIndex + 1] : runes[0]; // Boucle

    return { prev, next };
  },
  ['rune-neighbors-v1'],
  { revalidate: 3600 }
);

/**
 * Récupère les artefacts liés à un champion.
 */
export const fetchChampionArtifacts = unstable_cache(
  async (championId: string, locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';

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
  ['champion-artifacts-v1'],
  { revalidate: 3600 }
);

/**
 * Récupère les runes liées à un champion.
 */
export const fetchChampionRunes = unstable_cache(
  async (championId: string, locale: string = 'fr_FR') => {
    const isEnglish = locale.startsWith('en');
    const nameCol = isEnglish ? 'name_en' : 'name';

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
  ['champion-runes-v1'],
  { revalidate: 3600 }
);