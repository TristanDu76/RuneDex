import { ChampionData, ChampionLight, ChampionGridData, LoreCharacter, LoreCharacterLight, ChampionSpell, ChampionSkin, ChampionPassive } from '@/types/champion';
import { formatRelations, localizeChampion, localizeLoreCharacter, getColName } from './data-utils';
import { cachedQuery } from './cache';

// Import JSON data
import championsIndex from '@/data/champions/index.json';
import loreCharactersIndex from '@/data/lore-characters/index.json';
import artifactsIndex from '@/data/artifacts/index.json';
import runesIndex from '@/data/runes/index.json';
import relationsData from '@/data/relations.json';
import artifactOwnersData from '@/data/artifact-owners.json';
import runeOwnersData from '@/data/rune-owners.json';

/**
 * Load a single lore character's data from individual file
 */
const loadLoreCharacterData = async (characterId: string): Promise<LoreCharacter | null> => {
  try {
    const characterData = await import(`@/data/lore-characters/${characterId}.json`);
    return characterData.default as LoreCharacter;
  } catch (error) {
    console.error(`Failed to load lore character ${characterId}:`, error);
    return null;
  }
};

/**
 * Load a single artifact's data from individual file
 */
const loadArtifactData = async (artifactId: string): Promise<any | null> => {
  try {
    const artifactData = await import(`@/data/artifacts/${artifactId}.json`);
    return artifactData.default;
  } catch (error) {
    console.error(`Failed to load artifact ${artifactId}:`, error);
    return null;
  }
};

/**
 * Load a single rune's data from individual file
 */
const loadRuneData = async (runeId: string): Promise<any | null> => {
  try {
    const runeData = await import(`@/data/runes/${runeId}.json`);
    return runeData.default;
  } catch (error) {
    console.error(`Failed to load rune ${runeId}:`, error);
    return null;
  }
};
const loadChampionData = async (championId: string): Promise<ChampionData | null> => {
  try {
    const championData = await import(`@/data/champions/${championId}.json`);
    return championData.default as ChampionData;
  } catch (error) {
    console.error(`Failed to load champion ${championId}:`, error);
    return null;
  }
};

/**
 * Fetches all champions (full data).
 * @deprecated Use fetchAllChampionsLight or fetchAllChampionsGrid to improve performance.
 */
export const fetchAllChampions = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const index = championsIndex as Array<{ id: string; name: string; key: string; image: any }>;

      // Load all champion data files
      const championsPromises = index.map(champ => loadChampionData(champ.id));
      const championsData = await Promise.all(championsPromises);
      const champions = championsData.filter(c => c !== null) as ChampionData[];

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
        const championData = await loadChampionData(championId);
        if (!championData) return null;

        const champion = { ...championData };

        // Get relations for this champion
        const championRelations = (relationsData as any[]).filter(
          (rel: any) => rel.source_champion_id === champion.id
        );

        // Enrich relations with target data
        const enrichedRelations = await Promise.all(championRelations.map(async (rel: any) => {
          const targetChampion = rel.target_champion_id ? await loadChampionData(rel.target_champion_id) : null;
          const targetLore = rel.target_lore_id ? await loadLoreCharacterData(rel.target_lore_id) : null;

          return {
            type: rel.type,
            note_fr: rel.note_fr,
            note_en: rel.note_en,
            target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
            target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
          };
        }));

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
      const index = loreCharactersIndex as Array<{ id: string; name: string; image: any }>;
      const lorePromises = index.map(char => loadLoreCharacterData(char.id));
      const loreData = await Promise.all(lorePromises);
      return loreData.filter(c => c !== null) as LoreCharacter[];
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
      return loreCharactersIndex as LoreCharacterLight[];
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
        const character = await loadLoreCharacterData(name);
        if (!character || character.name.toLowerCase() !== name.toLowerCase()) {
          // Fallback: search in index
          const index = loreCharactersIndex as Array<{ id: string; name: string }>;
          const found = index.find(c => c.name.toLowerCase() === name.toLowerCase());
          if (found) {
            const charData = await loadLoreCharacterData(found.id);
            if (charData) return await enrichLoreCharacter(charData, locale);
          }
          return null;
        }
        return await enrichLoreCharacter(character, locale);
      } catch (error) {
        return null;
      }
    },
    ['lore-character-details', name, locale],
    ['lore', `lore-${name}`]
  );
};

// Helper function to enrich lore character with relations
const enrichLoreCharacter = async (character: LoreCharacter, locale: string) => {

  // Get relations for this lore character
  const loreRelations = (relationsData as any[]).filter(
    (rel: any) => rel.source_lore_id === character.id
  );

  // Enrich relations with target data
  const enrichedRelations = await Promise.all(loreRelations.map(async (rel: any) => {
    const targetChampion = rel.target_champion_id ? await loadChampionData(rel.target_champion_id) : null;
    const targetLore = rel.target_lore_id ? await loadLoreCharacterData(rel.target_lore_id) : null;

    return {
      type: rel.type,
      note_fr: rel.note_fr,
      note_en: rel.note_en,
      target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
      target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
    };
  }));

  const loreChar = { ...character };
  loreChar.related_champions = formatRelations(enrichedRelations, locale);
  return localizeLoreCharacter(loreChar, locale);
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
      const index = artifactsIndex as Array<{ id: string; name: string; image_url: any }>;
      const artifactsPromises = index.map(art => loadArtifactData(art.id));
      const artifactsData = await Promise.all(artifactsPromises);
      const artifacts = artifactsData.filter(a => a !== null);

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
      const artifact = await loadArtifactData(id);
      if (!artifact) return null;

      const ownerData = (artifactOwnersData as any[]).find(ao => ao.artifact_id === id);

      let owner = null;
      if (ownerData) {
        const champion = ownerData.champion_id ? await loadChampionData(ownerData.champion_id) : null;
        const loreChar = ownerData.lore_character_id ? await loadLoreCharacterData(ownerData.lore_character_id) : null;

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
      const index = runesIndex as Array<{ id: string; name: string; image_url: any }>;
      const runesPromises = index.map(rune => loadRuneData(rune.id));
      const runesData = await Promise.all(runesPromises);
      const runes = runesData.filter(r => r !== null);

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
      const rune = await loadRuneData(id);
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
      const index = runesIndex as Array<{ id: string; name: string }>;
      const runes = index.map(r => ({
        id: r.id,
        name: locale.startsWith('en') ? r.name : r.name
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
        .map(async ao => {
          const artifact = await loadArtifactData(ao.artifact_id);
          if (!artifact) return null;

          return {
            id: artifact.id,
            name: locale.startsWith('en') ? artifact.name_en : artifact.name,
            image_url: artifact.image_url,
            type: artifact.type,
            relation_type: ao.relation_type
          };
        });

      const results = await Promise.all(championArtifacts);
      return results.filter(Boolean);
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
        .map(async ro => {
          const rune = await loadRuneData(ro.rune_id);
          if (!rune) return null;

          return {
            id: rune.id,
            name: locale.startsWith('en') ? rune.name_en : rune.name,
            image_url: rune.image_url,
            type: rune.type,
            relation_type: ro.relation_type
          };
        });

      const results = await Promise.all(championRunes);
      return results.filter(Boolean);
    },
    ['champion-runes', championId, locale],
    ['champions', 'runes', `champion-${championId}`]
  );
};