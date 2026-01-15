import { ChampionData, ChampionLight, ChampionGridData, LoreCharacter, LoreCharacterLight, ChampionSpell, ChampionSkin, ChampionPassive } from '@/types/champion';
import { formatRelations, localizeChampion, localizeLoreCharacter, getColName } from './data-utils';
import { cachedQuery } from './cache';

// Import JSON data
import championsData from '@/data/champions.json';
import loreCharactersData from '@/data/lore-characters.json';
import artifactsData from '@/data/artifacts.json';
import runesData from '@/data/runes.json';
import relationsData from '@/data/relations.json';
import artifactOwnersData from '@/data/artifact-owners.json';
import runeOwnersData from '@/data/rune-owners.json';

/**
 * Fetches all champions (full data).
 * @deprecated Use fetchAllChampionsLight or fetchAllChampionsGrid to improve performance.
 */
export const fetchAllChampions = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const champions = championsData as ChampionData[];

      if (locale.startsWith('en')) {
        return champions.map(c => ({
          ...c,
          title: c.title_en || c.title,
          lore: c.lore_en || c.lore,
          spells: c.spells_en || c.spells,
          passive: c.passive_en || c.passive,
          tags: c.tags_en || c.tags,
          skins: c.skins_en || c.skins
        }));
      }

      return champions;
    },
    ['all-champions', locale],
    ['champions']
  );
};

/**
 * Fetches a lightweight version of champions for search bar and navigation.
 * Excludes lore, spells, skins, stats, info.
 */
export const fetchAllChampionsLight = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const champions = await fetchAllChampions(locale);
      return champions.map((c: ChampionData): ChampionLight => ({
        id: c.id,
        key: c.key,
        name: c.name,
        title: c.title,
        version: c.version,
        image: c.image
      }));
    },
    ['all-champions-light', locale],
    ['champions']
  );
};

/**
 * Fetches data needed for the champion grid (filtering).
 * Excludes lore, spells, skins.
 */
export const fetchAllChampionsGrid = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const champions = await fetchAllChampions(locale);
      return champions.map((c: ChampionData): ChampionGridData => ({
        id: c.id,
        key: c.key,
        name: c.name,
        title: c.title,
        version: c.version,
        image: c.image,
        tags: c.tags,
        partype: c.partype,
        info: (c as any).info,
        stats: (c as any).stats,
        factions: c.factions,
        faction: c.faction,
        gender: c.gender,
        species: c.species,
        lanes: c.lanes
      }));
    },
    ['all-champions-grid', locale],
    ['champions']
  );
};

/**
 * Fetches complete details of a champion.
 */
export const fetchChampionDetails = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      try {
        const championData = (championsData as ChampionData[]).find(c => c.id === championId);
        if (!championData) return null;

        const champion = { ...championData };

        // Get relations for this champion
        const championRelations = (relationsData as any[]).filter(
          (rel: any) => rel.source_champion_id === champion.id
        );

        // Enrich relations with target data
        const enrichedRelations = championRelations.map((rel: any) => {
          const targetChampion = (championsData as ChampionData[]).find(
            c => c.id === rel.target_champion_id
          );
          const targetLore = (loreCharactersData as LoreCharacter[]).find(
            l => l.id === rel.target_lore_id
          );

          return {
            type: rel.type,
            note_fr: rel.note_fr,
            note_en: rel.note_en,
            target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
            target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
          };
        });

        champion.related_champions = formatRelations(enrichedRelations, locale);
        return localizeChampion(champion, locale);
      } catch (error) {
        console.error(`Error (fetchChampionDetails ${championId}):`, error);
        return null;
      }
    },
    ['champion-details', championId, locale],
    ['champions', `champion-${championId}`]
  );
};

/**
 * Fetches all lore characters.
 */
export const fetchLoreCharacters = async () => {
  return cachedQuery(
    async () => {
      return loreCharactersData as LoreCharacter[];
    },
    ['all-lore-characters'],
    ['lore']
  );
};

/**
 * Fetches a lightweight version of lore characters (name + image).
 */
export const fetchLoreCharactersLight = async () => {
  return cachedQuery(
    async () => {
      const chars = loreCharactersData as LoreCharacter[];
      return chars.map((c): LoreCharacterLight => ({
        id: c.id,
        name: c.name,
        image: c.image
      }));
    },
    ['all-lore-characters-light'],
    ['lore_characters']
  );
};


/**
 * Fetches details of a lore character.
 */
export const fetchLoreCharacter = async (name: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      try {
        const character = (loreCharactersData as LoreCharacter[]).find(
          c => c.name.toLowerCase() === name.toLowerCase()
        );

        if (!character) return null;

        // Get relations for this lore character
        const loreRelations = (relationsData as any[]).filter(
          (rel: any) => rel.source_lore_id === character.id
        );

        // Enrich relations with target data
        const enrichedRelations = loreRelations.map((rel: any) => {
          const targetChampion = (championsData as ChampionData[]).find(
            c => c.id === rel.target_champion_id
          );
          const targetLore = (loreCharactersData as LoreCharacter[]).find(
            l => l.id === rel.target_lore_id
          );

          return {
            type: rel.type,
            note_fr: rel.note_fr,
            note_en: rel.note_en,
            target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
            target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
          };
        });

        const loreChar = { ...character };
        loreChar.related_champions = formatRelations(enrichedRelations, locale);
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
 * Fetches all items.
 */
export const fetchItems = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      // Items are not in the current data export
      // This can be implemented when items data is added
      return [];
    },
    ['items-list', locale],
    ['items']
  );
};

/**
 * Fetches all artifacts.
 */
export const fetchArtifacts = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const artifacts = artifactsData as any[];

      return artifacts.map(artifact => ({
        id: artifact.id,
        name: locale.startsWith('en') ? artifact.name_en : artifact.name,
        description: locale.startsWith('en') ? artifact.description_en : artifact.description,
        image_url: artifact.image_url,
        type: artifact.type,
        riot_id: artifact.riot_id
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    ['artifacts-list', locale],
    ['artifacts']
  );
};

/**
 * Fetches details of an artifact.
 */
export const fetchArtifactById = async (id: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const artifact = (artifactsData as any[]).find(a => a.id === id);
      if (!artifact) return null;

      const ownerData = (artifactOwnersData as any[]).find(ao => ao.artifact_id === id);

      let owner = null;
      if (ownerData) {
        const champion = (championsData as ChampionData[]).find(c => c.id === ownerData.champion_id);
        const loreChar = (loreCharactersData as LoreCharacter[]).find(l => l.id === ownerData.lore_character_id);

        owner = {
          name: champion?.name || loreChar?.name,
          image: champion?.image || loreChar?.image,
          title: champion?.title,
          type: ownerData.relation_type,
          link: champion ? `/champion/${champion.id}` : `/lore/${loreChar?.name}`
        };
      }

      return {
        id: artifact.id,
        name: locale.startsWith('en') ? artifact.name_en : artifact.name,
        description: locale.startsWith('en') ? artifact.description_en : artifact.description,
        image_url: artifact.image_url,
        type: artifact.type,
        riot_id: artifact.riot_id,
        owner
      };
    },
    ['artifact-details', id, locale],
    ['artifacts', `artifact-${id}`]
  );
};

/**
 * Fetches all runes.
 */
export const fetchRunes = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const runes = runesData as any[];

      return runes.map(rune => ({
        id: rune.id,
        name: locale.startsWith('en') ? rune.name_en : rune.name,
        description: locale.startsWith('en') ? rune.description_en : rune.description,
        image_url: rune.image_url,
        type: rune.type
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    ['runes-list', locale],
    ['runes']
  );
};

/**
 * Fetches details of a rune.
 */
export const fetchRuneById = async (id: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const rune = (runesData as any[]).find(r => r.id === id);
      if (!rune) return null;

      return {
        id: rune.id,
        name: locale.startsWith('en') ? rune.name_en : rune.name,
        description: locale.startsWith('en') ? rune.description_en : rune.description,
        image_url: rune.image_url,
        type: rune.type,
        owner: null
      };
    },
    ['rune-details', id, locale],
    ['runes', `rune-${id}`]
  );
};

/**
 * Fetches neighbors of a rune.
 */
export const fetchRuneNeighbors = async (currentId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const runes = (runesData as any[]).map(r => ({
        id: r.id,
        name: locale.startsWith('en') ? r.name_en : r.name
      })).sort((a, b) => a.name.localeCompare(b.name));

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
 * Fetches artifacts of a champion.
 */
export const fetchChampionArtifacts = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const championArtifacts = (artifactOwnersData as any[])
        .filter(ao => ao.champion_id === championId)
        .map(ao => {
          const artifact = (artifactsData as any[]).find(a => a.id === ao.artifact_id);
          if (!artifact) return null;

          return {
            id: artifact.id,
            name: locale.startsWith('en') ? artifact.name_en : artifact.name,
            image_url: artifact.image_url,
            type: artifact.type,
            relation_type: ao.relation_type
          };
        })
        .filter(Boolean);

      return championArtifacts;
    },
    ['champion-artifacts', championId, locale],
    ['champions', 'artifacts', `champion-${championId}`]
  );
};

/**
 * Fetches runes of a champion.
 */
export const fetchChampionRunes = async (championId: string, locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const championRunes = (runeOwnersData as any[])
        .filter(ro => ro.champion_id === championId)
        .map(ro => {
          const rune = (runesData as any[]).find(r => r.id === ro.rune_id);
          if (!rune) return null;

          return {
            id: rune.id,
            name: locale.startsWith('en') ? rune.name_en : rune.name,
            image_url: rune.image_url,
            type: rune.type,
            relation_type: ro.relation_type
          };
        })
        .filter(Boolean);

      return championRunes;
    },
    ['champion-runes', championId, locale],
    ['champions', 'runes', `champion-${championId}`]
  );
};