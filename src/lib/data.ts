import {
  ChampionData,
  ChampionGridData,
  ChampionImage,
  ChampionLight,
  LoreCharacter,
  LoreCharacterLight,
  RelatedCharacterDisplay,
  RelatedCharacterEntry
} from '@/types/champion';
import { formatRelations, localizeChampion, localizeLoreCharacter } from './data-utils';
import { cachedQuery } from './cache';
import { normalizeRegionToShardKey } from './slug-config';
import {
  type AbilityQuizChampion,
  type ClassicQuizChampion,
  type SkinQuizChampion,
} from './quiz-rounds';

// Import JSON data
import championsIndex from '@/data/champions/index.json';
import loreCharactersIndex from '@/data/lore-characters/index.json';
import artifactsIndex from '@/data/artifacts/index.json';
import runesIndex from '@/data/runes/index.json';
import summaryCharacters from '@/data/champions-summary.json';
import quizAbilityCharacters from '@/data/quiz-ability.json';
import quizSkinCharacters from '@/data/quiz-skins.json';
import relationsData from '@/data/relations.json';
import artifactOwnersData from '@/data/artifact-owners.json';
import runeOwnersData from '@/data/rune-owners.json';
import { Relation } from '@/types/relations';
import type { RegionShardEntry } from '@/types/map';
import type { ArtifactListItem, ChampionArtifact, ChampionRune, RuneListItem } from '@/types/items';
import fs from 'fs';
import path from 'path';

const SHARDS_DIRECTORY = path.resolve(process.cwd(), 'src/data/shards');

interface ArtifactData {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  type: string;
  riot_id?: string;
}

interface RuneData {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  type: string;
}

interface OwnerReferenceData {
  champion_id: string | null;
  lore_character_id: string | null;
  relation_type: string;
}

interface ArtifactOwnerData extends OwnerReferenceData {
  artifact_id: string;
}

interface RuneOwnerData extends OwnerReferenceData {
  rune_id: string;
}

interface EntityOwner {
  name: string;
  image?: string;
  title?: string;
  type: string;
  link: string;
}

type ChampionSummaryData = ChampionGridData & {
  name_en?: string;
  title_en?: string;
  partype_en?: string;
};

/**
 * Load a single lore character's data from individual file
 */
const loadLoreCharacterData = async (characterId: string): Promise<LoreCharacter | null> => {
  if (!characterId) return null;
  const safeId = characterId.toLowerCase();
  try {
    const characterData = await import(`@/data/lore-characters/${safeId}.json`);
    return characterData.default as LoreCharacter;
  } catch {
    // Fail silently, error logging is handled by the caller if needed
    return null;
  }
};

/**
 * Load a single artifact's data from individual file
 */
const loadArtifactData = async (artifactId: string): Promise<ArtifactData | null> => {
  if (!artifactId) return null;
  const safeId = artifactId.toLowerCase();
  try {
    const artifactData = await import(`@/data/artifacts/${safeId}.json`);
    return artifactData.default as ArtifactData;
  } catch {
    return null;
  }
};

/**
 * Load a single rune's data from individual file
 */
const loadRuneData = async (runeId: string): Promise<RuneData | null> => {
  if (!runeId) return null;
  const safeId = runeId.toLowerCase();
  try {
    const runeData = await import(`@/data/runes/${safeId}.json`);
    return runeData.default as RuneData;
  } catch {
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
  } catch {
    // If not found, check the index to find the correct ID
    const index = championsIndex as Array<{ id: string; name: string }>;
    const found = index.find(c => c.id.toLowerCase() === championId.toLowerCase());
    if (found && found.id !== championId) {
      try {
        const charData = await import(`@/data/champions/${found.id}.json`);
        return charData.default as ChampionData;
      } catch {
        return null;
      }
    }
    return null;
  }
};

const getChampionPortraitUrl = (champion: ChampionData): string | undefined => {
  if (!champion.version || !champion.image?.full) return undefined;

  return `https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/champion/${champion.image.full}`;
};

const resolveEntityOwner = async (
  ownerData: OwnerReferenceData,
  locale: string
): Promise<EntityOwner | null> => {
  const [champion, loreCharacter] = await Promise.all([
    ownerData.champion_id ? loadChampionData(ownerData.champion_id) : null,
    ownerData.lore_character_id ? loadLoreCharacterData(ownerData.lore_character_id) : null,
  ]);

  if (champion) {
    return {
      name: champion.name,
      image: getChampionPortraitUrl(champion),
      title: locale.startsWith('en') ? champion.title_en || champion.title : champion.title,
      type: ownerData.relation_type,
      link: `/champion/${champion.id}`,
    };
  }

  if (loreCharacter) {
    return {
      name: loreCharacter.name,
      image: loreCharacter.image || undefined,
      type: ownerData.relation_type,
      link: `/lore/${loreCharacter.id}`,
    };
  }

  return null;
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
  rawRelated: RelatedCharacterEntry[] | undefined,
  locale: string
): Promise<RelatedCharacterDisplay[]> => {
  if (!Array.isArray(rawRelated) || rawRelated.length === 0) return [];

  const fallback = await Promise.all(rawRelated.map(async (entry) => {
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

  return fallback.filter((relation): relation is NonNullable<typeof relation> => relation !== null);
};

const mergeRelationsByChampion = (
  primary: RelatedCharacterDisplay[],
  secondary: RelatedCharacterDisplay[]
) => {
  const mergedMap = new Map<string, RelatedCharacterDisplay>();

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
  const index = championsIndex as Array<{ id: string; name: string; key: string; image: ChampionImage }>;
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

export const fetchClassicQuizChampions = async (locale: string = 'fr_FR'): Promise<ClassicQuizChampion[]> => {
  return cachedQuery(
    async () => {
      const champions = summaryCharacters as Array<ChampionSummaryData & Pick<ChampionData, 'gender' | 'species' | 'factions' | 'lanes' | 'tags'>>;

      return champions.map((champion) => ({
        id: champion.id,
        name: locale.startsWith('en') && champion.name_en ? champion.name_en : champion.name,
        version: champion.version,
        image: { full: champion.image.full },
        gender: champion.gender,
        species: champion.species,
        partype: locale.startsWith('en') && champion.partype_en ? champion.partype_en : champion.partype,
        factions: champion.factions,
        lanes: champion.lanes,
        tags: champion.tags,
      }));
    },
    ['classic-quiz-champions', locale],
    ['champions']
  );
};

export const fetchAbilityQuizChampions = async (locale: string = 'fr_FR'): Promise<AbilityQuizChampion[]> => {
  return cachedQuery(
    async () => quizAbilityCharacters.map((champion) => ({
      id: champion.id, name: champion.name, version: champion.version, image: champion.image,
      spells: locale.startsWith('en') ? champion.spells_en ?? champion.spells : champion.spells,
      passive: locale.startsWith('en') ? champion.passive_en ?? champion.passive : champion.passive,
    })),
    ['ability-quiz-champions', locale],
    ['champions']
  );
};

export const fetchSkinQuizChampions = async (locale: string = 'fr_FR'): Promise<SkinQuizChampion[]> => {
  return cachedQuery(
    async () => quizSkinCharacters.map((champion) => ({
      id: champion.id, name: champion.name, version: champion.version, image: champion.image,
      skins: locale.startsWith('en') ? champion.skins_en ?? champion.skins : champion.skins,
    })),
    ['skin-quiz-champions', locale],
    ['champions']
  );
};

export const fetchAllChampionsLight = async (locale: string = 'fr_FR') => {
  return cachedQuery(
    async () => {
      // Using pre-compiled summary instead of heavy Promise.all(loadAll)
      const champions = summaryCharacters as ChampionSummaryData[];
      return champions.map((c): ChampionLight => ({
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
      const champions = summaryCharacters as ChampionSummaryData[];
      return champions.map((c): ChampionGridData => ({
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
        const relationsFromRaw = await buildFallbackRelationsFromRaw(champion.related_characters, locale);
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
      const index = loreCharactersIndex as LoreCharacterLight[];
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
      } catch {
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
  const relationsFromRaw = await buildFallbackRelationsFromRaw(loreChar.related_characters, locale);
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
export const fetchArtifacts = async (locale: string = 'fr_FR'): Promise<ArtifactListItem[]> => {
  return cachedQuery<ArtifactListItem[]>(
    async () => {
      const index = artifactsIndex as Array<{ id: string; name: string; image_url: string }>;
      const artifactsPromises = index.map(art => loadArtifactData(art.id));
      const artifactsData = await Promise.all(artifactsPromises);
      const artifacts = artifactsData.filter(a => a !== null);

      return artifacts.map(artifact => ({
        id: artifact.id,
        name: locale.startsWith('en') ? artifact.name_en || artifact.name : artifact.name,
        description: locale.startsWith('en')
          ? artifact.description_en || artifact.description
          : artifact.description,
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

      const ownerData = (artifactOwnersData as ArtifactOwnerData[])
        .find(ao => ao.artifact_id === id);
      const owner = ownerData ? await resolveEntityOwner(ownerData, locale) : null;

      return {
        id: artifact.id,
        name: locale.startsWith('en') ? artifact.name_en || artifact.name : artifact.name,
        description: locale.startsWith('en')
          ? artifact.description_en || artifact.description
          : artifact.description,
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
export const fetchRunes = async (locale: string = 'fr_FR'): Promise<RuneListItem[]> => {
  return cachedQuery<RuneListItem[]>(
    async () => {
      const index = runesIndex as Array<{ id: string; name: string; image_url: string }>;
      const runesPromises = index.map(rune => loadRuneData(rune.id));
      const runesData = await Promise.all(runesPromises);
      const runes = runesData.filter(r => r !== null);

      return runes.map(rune => ({
        id: rune.id,
        name: locale.startsWith('en') ? rune.name_en || rune.name : rune.name,
        description: locale.startsWith('en') ? rune.description_en || rune.description : rune.description,
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

      const ownerData = (runeOwnersData as RuneOwnerData[])
        .find(ro => ro.rune_id === id);
      const owner = ownerData ? await resolveEntityOwner(ownerData, locale) : null;

      return {
        id: rune.id,
        name: locale.startsWith('en') ? rune.name_en || rune.name : rune.name,
        description: locale.startsWith('en') ? rune.description_en || rune.description : rune.description,
        image_url: rune.image_url,
        type: rune.type,
        owner
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
export const fetchChampionArtifacts = async (championId: string, locale: string = 'fr_FR'): Promise<ChampionArtifact[]> => {
  return cachedQuery<ChampionArtifact[]>(
    async () => {
      const championArtifacts = (artifactOwnersData as ArtifactOwnerData[])
        .filter(ao => ao.champion_id === championId)
        .map(async ao => {
          const artifact = await loadArtifactData(ao.artifact_id);
          if (!artifact) return null;

          return {
            id: artifact.id,
            name: locale.startsWith('en') ? artifact.name_en || artifact.name : artifact.name,
            image_url: artifact.image_url,
            type: artifact.type,
            relation_type: ao.relation_type
          };
        });

      const results = await Promise.all(championArtifacts);
      return results.filter((artifact): artifact is ChampionArtifact => artifact !== null);
    },
    ['champion-artifacts', championId, locale],
    ['champions', 'artifacts', `champion-${championId}`]
  );
};

/**
 * Fetches runes of a champion.
 */
export const fetchChampionRunes = async (championId: string, locale: string = 'fr_FR'): Promise<ChampionRune[]> => {
  return cachedQuery<ChampionRune[]>(
    async () => {
      const championRunes = (runeOwnersData as RuneOwnerData[])
        .filter(ro => ro.champion_id === championId)
        .map(async ro => {
          const rune = await loadRuneData(ro.rune_id);
          if (!rune) return null;

          return {
            id: rune.id,
            name: locale.startsWith('en') ? rune.name_en || rune.name : rune.name,
            image_url: rune.image_url,
            type: rune.type,
            relation_type: ro.relation_type
          };
        });

      const results = await Promise.all(championRunes);
      return results.filter((rune): rune is ChampionRune => rune !== null);
    },
    ['champion-runes', championId, locale],
    ['champions', 'runes', `champion-${championId}`]
  );
};
/**
 * Fetches regional shard data containing all characters (champions + lore).
 */
export const fetchRegionShard = async (regionId: string): Promise<RegionShardEntry[]> => {
  return cachedQuery(
    async () => {
      try {
        if (!regionId) return [];

        const normalizedId = normalizeRegionToShardKey(regionId);
        const filePath = path.resolve(SHARDS_DIRECTORY, `${normalizedId}.json`);
        const relativePath = path.relative(SHARDS_DIRECTORY, filePath);

        if (
          relativePath === '..' ||
          relativePath.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relativePath)
        ) {
          return [];
        }

        if (!fs.existsSync(filePath)) {
          return [];
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent) as RegionShardEntry[];
      } catch (error) {
        console.error(`Error fetching shard for ${regionId}:`, error);
        return [];
      }
    },
    ["region-shard", regionId],
    ["shards", `shard-${regionId}`]
  );
};
