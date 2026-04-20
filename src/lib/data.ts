import { ChampionData, ChampionLight, ChampionGridData, LoreCharacter, LoreCharacterLight, ChampionSpell, ChampionSkin, ChampionPassive } from '@/types/champion';
import { formatRelations, localizeChampion, localizeLoreCharacter, getColName } from './data-utils';
import { cachedQuery } from './cache';

// Import JSON data
import championsIndex from '@/data/champions/index.json';
import loreCharactersIndex from '@/data/lore-characters/index.json';
import artifactsIndex from '@/data/artifacts/index.json';
import runesIndex from '@/data/runes/index.json';
import summaryCharacters from '@/data/champions-summary.json';
import relationsData from '@/data/relations.json';
import artifactOwnersData from '@/data/artifact-owners.json';
import runeOwnersData from '@/data/rune-owners.json';
import { Relation } from '@/types/relations';
import fs from 'fs';
import path from 'path';

/**
 * Load a single lore character's data from individual file
 */
const loadLoreCharacterData = async (characterId: string): Promise<LoreCharacter | null> => {
  if (!characterId) return null;
  const safeId = characterId.toLowerCase();
  try {
    const characterData = await import(`@/data/lore-characters/${safeId}.json`);
    return characterData.default as LoreCharacter;
  } catch (error) {
    // Fail silently, error logging is handled by the caller if needed
    return null;
  }
};

/**
 * Load a single artifact's data from individual file
 */
const loadArtifactData = async (artifactId: string): Promise<any | null> => {
  if (!artifactId) return null;
  const safeId = artifactId.toLowerCase();
  try {
    const artifactData = await import(`@/data/artifacts/${safeId}.json`);
    return artifactData.default;
  } catch (error) {
    return null;
  }
};

/**
 * Load a single rune's data from individual file
 */
const loadRuneData = async (runeId: string): Promise<any | null> => {
  if (!runeId) return null;
  const safeId = runeId.toLowerCase();
  try {
    const runeData = await import(`@/data/runes/${safeId}.json`);
    return runeData.default;
  } catch (error) {
    return null;
  }
};

const loadChampionData = async (championId: string): Promise<ChampionData | null> => {
  if (!championId) return null;
  // Champions IDs are typically TitleCase in the filesystem
  // We try exact match first, then fall back to found in the index
  try {
    const championData = await import(`@/data/champions/${championId}.json`);
    return championData.default as ChampionData;
  } catch (error) {
    // If not found, check the index to find the correct ID
    const index = championsIndex as Array<{ id: string; name: string }>;
    const found = index.find(c => c.id.toLowerCase() === championId.toLowerCase());
    if (found && found.id !== championId) {
      try {
        const charData = await import(`@/data/champions/${found.id}.json`);
        return charData.default as ChampionData;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

const normalizeEntityLookupKey = (value: string): string => {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const buildFallbackRelationsFromRaw = async (
  rawRelated: any[] | undefined,
  locale: string
): Promise<Array<{ champion: string; type: string; note?: string; image?: any }>> => {
  if (!Array.isArray(rawRelated) || rawRelated.length === 0) return [];

  const fallback = await Promise.all(rawRelated.map(async (entry: any) => {
    const isString = typeof entry === 'string';
    const rawId = isString ? entry : (entry?.id || '');
    if (!rawId) return null;

    const normalizedId = normalizeEntityLookupKey(rawId);
    const relationType = isString ? 'related' : (entry.relation || 'related');
    const relationNote = isString
      ? undefined
      : (locale.startsWith('en') ? entry.note_en : entry.note_fr) || entry.note_en || entry.note_fr;

    const preferredType = isString ? undefined : entry.type;

    let champion = null as ChampionData | null;
    let lore = null as LoreCharacter | null;

    if (preferredType === 'champion') {
      champion = await loadChampionData(normalizedId);
      if (!champion) lore = await loadLoreCharacterData(normalizedId);
    } else if (preferredType === 'lore') {
      lore = await loadLoreCharacterData(normalizedId);
      if (!lore) champion = await loadChampionData(normalizedId);
    } else {
      champion = await loadChampionData(normalizedId);
      if (!champion) lore = await loadLoreCharacterData(normalizedId);
    }

    return {
      champion: champion?.name || lore?.name || rawId,
      type: relationType,
      note: relationNote,
      image: champion?.image || lore?.image
    };
  }));

  return fallback.filter(Boolean) as Array<{ champion: string; type: string; note?: string; image?: any }>;
};

const mergeRelationsByChampion = (
  primary: Array<{ champion: string; type: string; note?: string; image?: any }>,
  secondary: Array<{ champion: string; type: string; note?: string; image?: any }>
) => {
  const mergedMap = new Map<string, { champion: string; type: string; note?: string; image?: any }>();

  // Process both lists, but keep only the "best" entry for each champion
  // Order matters: secondary (local JSON) usually has better notes than primary (relations.json)
  [...primary, ...secondary].forEach((rel) => {
    const key = rel.champion.toLowerCase();
    const existing = mergedMap.get(key);

    if (!existing || (!existing.note && rel.note)) {
      mergedMap.set(key, rel);
    }
  });

  return Array.from(mergedMap.values());
};

/**
 * Internal helper to load all champion data without caching.
 * Used by legacy functions that still need full list.
 */
const loadAllChampionsRaw = async (locale: string = 'fr_FR') => {
  const index = championsIndex as Array<{ id: string; name: string; key: string; image: any }>;
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
      tags: (c as any).tags_en || c.tags,
      skins: (c as any).skins_en || c.skins
    }));
  }

  return champions;
};

/**
 * Fetches all champions (full data).
 * @deprecated Use fetchAllChampionsLight or fetchAllChampionsGrid to improve performance.
 * Warning: This functionality is too heavy for Next.js cache (>2MB).
 */
export const fetchAllChampions = async (locale: string = 'fr_FR') => {
  // We prefer NOT to cache the huge full list to avoid "items over 2MB" error.
  // If this is needed cached, it must be broken down.
  // For now, we return the raw data directly to avoid the error,
  // assuming callers handle the performance hit or use the optimized functions below.
  return loadAllChampionsRaw(locale);
};

export const fetchAllChampionsLight = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      // Using pre-compiled summary instead of heavy Promise.all(loadAll)
      const champions = summaryCharacters as any[];
      return champions.map((c: any): ChampionLight => ({
        id: c.id,
        key: c.key,
        name: locale.startsWith('en') && c.name_en ? c.name_en : c.name,
        title: locale.startsWith('en') && c.title_en ? c.title_en : c.title,
        version: c.version,
        image: c.image
      }));
    },
    ['all-champions-light', locale],
    ['champions']
  );
};

export const fetchAllChampionsGrid = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      const champions = summaryCharacters as any[];
      return champions.map((c: any): ChampionGridData => ({
        id: c.id,
        key: c.key,
        name: locale.startsWith('en') && c.name_en ? c.name_en : c.name,
        title: locale.startsWith('en') && c.title_en ? c.title_en : c.title,
        version: c.version,
        image: c.image,
        tags: c.tags,
        partype: locale.startsWith('en') && c.partype_en ? c.partype_en : c.partype,
        info: c.info,
        stats: c.stats,
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

        // Import the new relations utilities
        const { getRelationsForEntity, getRelationNote } = await import('@/lib/relations-utils');

        // Get relations for this champion using the new system
        const allRelations = relationsData as Relation[];
        const championRelations = getRelationsForEntity(allRelations, champion.id, 'champion');

        // Enrich relations with target data
        const enrichedRelations = await Promise.all(championRelations.map(async (relInfo) => {
          const { relation, isEntityA, relationType, targetId, targetType } = relInfo;

          const targetChampion = targetType === 'champion' ? await loadChampionData(targetId) : null;
          const targetLore = targetType === 'lore' ? await loadLoreCharacterData(targetId) : null;

          // The relation type describes what the TARGET is from the perspective of the current entity
          const displayType = relationType;

          return {
            type: displayType,
            note_fr: getRelationNote(relation, isEntityA, relationType, 'fr_FR'),
            note_en: getRelationNote(relation, isEntityA, relationType, 'en_US'),
            target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
            target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
          };
        }));

        const relationsFromTable = formatRelations(enrichedRelations, locale);
        const relationsFromRaw = await buildFallbackRelationsFromRaw((champion as any).related_characters, locale);
        champion.related_champions = mergeRelationsByChampion(relationsFromTable, relationsFromRaw);
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
        const nameLower = name.toLowerCase();

        // Check if loaded character matches by ID or Name
        if (character && (character.id.toLowerCase() === nameLower || character.name.toLowerCase() === nameLower)) {
          return await enrichLoreCharacter(character, locale);
        }

        // Fallback: search in index by ID or Name
        const index = loreCharactersIndex as Array<{ id: string; name: string }>;
        const found = index.find(c =>
          c.id.toLowerCase() === nameLower ||
          c.name.toLowerCase() === nameLower
        );

        if (found) {
          const charData = await loadLoreCharacterData(found.id);
          if (charData) return await enrichLoreCharacter(charData, locale);
        }
        return null;
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

  // Import the new relations utilities
  const { getRelationsForEntity, getRelationNote } = await import('@/lib/relations-utils');

  // Get relations for this lore character using the new system
  const allRelations = relationsData as Relation[];
  const loreRelations = getRelationsForEntity(allRelations, character.id, 'lore');

  // Enrich relations with target data
  const enrichedRelations = await Promise.all(loreRelations.map(async (relInfo) => {
    const { relation, isEntityA, relationType, targetId, targetType } = relInfo;

    const targetChampion = targetType === 'champion' ? await loadChampionData(targetId) : null;
    const targetLore = targetType === 'lore' ? await loadLoreCharacterData(targetId) : null;

    // IMPORTANT: Always show the ORIGINAL relation type (what entity_a is)
    const displayType = relation.relation_type;

    return {
      type: displayType,
      note_fr: getRelationNote(relation, isEntityA, relationType, 'fr_FR'),
      note_en: getRelationNote(relation, isEntityA, relationType, 'en_US'),
      target_champion: targetChampion ? { name: targetChampion.name, image: targetChampion.image } : null,
      target_lore: targetLore ? { name: targetLore.name, image: targetLore.image } : null
    };
  }));

  const loreChar = { ...character };
  const relationsFromTable = formatRelations(enrichedRelations, locale);
  const relationsFromRaw = await buildFallbackRelationsFromRaw((loreChar as any).related_characters, locale);
  loreChar.related_champions = mergeRelationsByChampion(relationsFromTable, relationsFromRaw);
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
/**
 * Fetches regional shard data containing all characters (champions + lore).
 */
export const fetchRegionShard = async (regionId: string) => {
  return cachedQuery(
    async () => {
      try {
        const normalizedId = regionId.toLowerCase().replace(/[^a-z]/g, "");
        const filePath = path.join(process.cwd(), "src/data/shards", `${normalizedId}.json`);

        if (!fs.existsSync(filePath)) {
          return [];
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error fetching shard for ${regionId}:`, error);
        return [];
      }
    },
    ["region-shard", regionId],
    ["shards", `shard-${regionId}`]
  );
};


