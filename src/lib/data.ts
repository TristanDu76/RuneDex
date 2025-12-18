import { supabase } from '@/lib/supabase';
import { ChampionData, LoreCharacter } from '@/types/champion';
import { formatRelations, localizeChampion, localizeLoreCharacter, getColName } from './data-utils';
import { cachedQuery } from './cache';

/**
 * Récupère tous les champions depuis la base de données Supabase.
 */
export const fetchAllChampions = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      try {
        const { data, error } = await supabase
          .from('champions')
          .select('id, key, name, title, image, tags, factions, custom_tags, version, gender, species, partype, lanes, title_en, skins, spells, passive');

        if (error) {
          console.error("Erreur Supabase (fetchAllChampions) :", error);
          return [];
        }

        const champions = data as ChampionData[];

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
    ['all-champions', locale], // Clé unique incluant la locale
    ['champions'] // Tag pour invalidation globale
  );
};

/**
 * Récupère les détails complets d'un champion.
 */
export const fetchChampionDetails = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      try {
        const { data: championData, error } = await supabase
          .from('champions')
          .select('*')
          .eq('id', championId)
          .single();

        if (error || !championData) return null;

        const champion = championData as ChampionData;

        const { data: relationsData } = await supabase
          .from('relations')
          .select(`
            type,
            note_fr,
            note_en,
            target_champion:champions!target_champion_id(name, image),
            target_lore:lore_characters!target_lore_id(name, image)
          `)
          .eq('source_champion_id', champion.id);

        champion.related_champions = formatRelations(relationsData || [], locale);
        return localizeChampion(champion, locale);
      } catch (error) {
        console.error(`Erreur (fetchChampionDetails ${championId}) :`, error);
        return null;
      }
    },
    ['champion-details', championId, locale],
    ['champions', `champion-${championId}`]
  );
};

/**
 * Récupère tous les personnages du lore.
 */
export const fetchLoreCharacters = async () => {
  return cachedQuery(
    async () => {
      try {
        const { data, error } = await supabase.from('lore_characters').select('*');
        if (error) return [];
        return data as LoreCharacter[];
      } catch (error) {
        return [];
      }
    },
    ['lore-characters'],
    ['lore']
  );
};

/**
 * Récupère les détails d'un personnage du lore.
 */
export const fetchLoreCharacter = async (name: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      try {
        const { data: character, error } = await supabase
          .from('lore_characters')
          .select('*')
          .ilike('name', name)
          .single();

        if (error || !character) return null;

        const { data: relationsData } = await supabase
          .from('relations')
          .select(`
            type,
            note_fr,
            note_en,
            target_champion:champions!target_champion_id(name, image),
            target_lore:lore_characters!target_lore_id(name, image)
          `)
          .eq('source_lore_id', character.id);

        const loreChar = character as LoreCharacter;
        loreChar.related_champions = formatRelations(relationsData || [], locale);
        return localizeLoreCharacter(loreChar, locale);
      } catch (error) {
        return null;
      }
    },
    ['lore-character-details', name, locale],
    ['lore', `lore-${name}`]
  );
};

/**
 * Récupère tous les objets (items).
 */
export const fetchItems = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

          image,
          maps
        `)
        .order('gold_total', { ascending: false });

      if (error) return [];
      return data as any;
    },
    ['items-list', locale],
    ['items']
  );
};

/**
 * Récupère tous les artefacts.
 */
export const fetchArtifacts = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

      if (error) return [];
      return data as any;
    },
    ['artifacts-list', locale],
    ['artifacts']
  );
};

/**
 * Récupère les détails d'un artefact.
 */
export const fetchArtifactById = async (id: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

      if (error) return null;

      const data = rawData as any;
      const getSingle = (val: any) => Array.isArray(val) ? val[0] : val;
      const ownerData = data.owner?.[0];
      const champion = ownerData ? getSingle(ownerData.champion) : null;
      const loreChar = ownerData ? getSingle(ownerData.lore_character) : null;

      return {
        ...data,
        owner: ownerData ? {
          name: champion?.name || loreChar?.name,
          image: champion?.image || loreChar?.image,
          title: champion?.title,
          type: ownerData.relation_type,
          link: champion ? `/champion/${champion.id}` : `/lore/${loreChar?.name}`
        } : null
      };
    },
    ['artifact-details', id, locale],
    ['artifacts', `artifact-${id}`]
  );
};

/**
 * Récupère toutes les Runes.
 */
export const fetchRunes = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

      if (error) return [];
      return data as any;
    },
    ['runes-list', locale],
    ['runes']
  );
};

/**
 * Récupère les détails d'une rune.
 */
export const fetchRuneById = async (id: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

      if (error || !data) return null;
      return { ...(data as any), owner: null };
    },
    ['rune-details', id, locale],
    ['runes', `rune-${id}`]
  );
};

/**
 * Récupère les voisins d'une rune.
 */
export const fetchRuneNeighbors = async (currentId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const nameCol = getColName('name', locale);
      const { data } = await supabase
        .from('runes')
        .select(`id, name: ${nameCol}`)
        .order(nameCol);

      const runes = data as { id: string; name: string }[] | null;
      if (!runes) return { prev: null, next: null };

      const currentIndex = runes.findIndex(r => r.id === currentId);
      if (currentIndex === -1) return { prev: null, next: null };

      const prev = currentIndex > 0 ? runes[currentIndex - 1] : runes[runes.length - 1];
      const next = currentIndex < runes.length - 1 ? runes[currentIndex + 1] : runes[0];

      return { prev, next };
    },
    ['rune-neighbors', currentId, locale],
    ['runes']
  );
};

/**
 * Récupère les artefacts d'un champion.
 */
export const fetchChampionArtifacts = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
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

      if (error) return [];
      return data.map((item: any) => ({
        ...item.artifact,
        relation_type: item.relation_type
      }));
    },
    ['champion-artifacts', championId, locale],
    ['champions', 'artifacts', `champion-${championId}`]
  );
};

/**
 * Récupère les runes d'un champion.
 */
export const fetchChampionRunes = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const nameCol = getColName('name', locale);
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

      if (error) return [];
      return data.map((item: any) => ({
        ...item.rune,
        relation_type: item.relation_type
      }));
    },
    ['champion-runes', championId, locale],
    ['champions', 'runes', `champion-${championId}`]
  );
};