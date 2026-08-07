import type { ChampionData } from '@/types/champion';

export interface QuizImage {
    full: string;
}

export interface AbilityQuizSpell {
    name: string;
    image: QuizImage;
}

export interface AbilityQuizPassive {
    name: string;
    image: QuizImage;
}

export interface SkinQuizSkin {
    id: string;
    num: number;
    name: string;
}

type QuizChampionIdentity = {
    id: string;
    name: string;
    version: string;
    image: QuizImage;
};

export type AbilityQuizChampion = QuizChampionIdentity & {
    spells?: AbilityQuizSpell[];
    passive?: AbilityQuizPassive;
};
export type SkinQuizChampion = QuizChampionIdentity & {
    skins?: SkinQuizSkin[];
};
export type ClassicQuizMetadata = Pick<ChampionData, 'id' | 'gender' | 'species' | 'partype' | 'factions' | 'lanes' | 'tags'>;
export type ClassicQuizChampion = QuizChampionIdentity & Omit<ClassicQuizMetadata, 'id'>;
export type SpellType = 'P' | 'Q' | 'W' | 'E' | 'R';

export interface AbilityRound<TChampion extends AbilityQuizChampion> {
    champion: TChampion;
    spell: AbilityQuizSpell | AbilityQuizPassive;
    spellType: SpellType;
    rotation: number;
}

export interface SkinRound<TChampion extends SkinQuizChampion> {
    champion: TChampion;
    skin: SkinQuizSkin;
    mode: 'blur_gray' | 'zoom';
    zoomOrigin: { x: number; y: number };
}

function randomIndex(length: number, random: () => number): number {
    return Math.floor(random() * length);
}

export function createSeededRandom(seed: string): () => number {
    let state = 2166136261;

    for (let index = 0; index < seed.length; index += 1) {
        state ^= seed.charCodeAt(index);
        state = Math.imul(state, 16777619);
    }

    return () => {
        state += 0x6D2B79F5;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}

export function toClassicQuizChampion(champion: ChampionData): ClassicQuizChampion {
    return {
        id: champion.id,
        name: champion.name,
        version: champion.version,
        image: { full: champion.image.full },
        gender: champion.gender,
        species: champion.species,
        partype: champion.partype,
        factions: champion.factions,
        lanes: champion.lanes,
        tags: champion.tags,
    };
}

export function toAbilityQuizChampion(champion: ChampionData): AbilityQuizChampion {
    return {
        id: champion.id,
        name: champion.name,
        version: champion.version,
        image: { full: champion.image.full },
        spells: champion.spells?.map(({ name, image }) => ({ name, image: { full: image.full } })),
        passive: champion.passive ? { name: champion.passive.name, image: { full: champion.passive.image.full } } : undefined,
    };
}

export function toSkinQuizChampion(champion: ChampionData): SkinQuizChampion {
    return {
        id: champion.id,
        name: champion.name,
        version: champion.version,
        image: { full: champion.image.full },
        skins: champion.skins?.map(({ id, num, name }) => ({ id, num, name })),
    };
}

export function isClassicQuizEligible(champion: ClassicQuizMetadata): boolean {
    const hasKnownValue = (value: string | undefined) => Boolean(value && value.toLowerCase() !== 'unknown' && value.toLowerCase() !== 'none');
    const hasKnownList = (values: string[] | undefined) => Boolean(values?.length && values.every((value) => hasKnownValue(value)));

    return hasKnownValue(champion.gender)
        && hasKnownValue(champion.species)
        && hasKnownValue(champion.partype)
        && hasKnownList(champion.factions)
        && hasKnownList(champion.lanes)
        && hasKnownList(champion.tags);
}

export function createAbilityRound<TChampion extends AbilityQuizChampion>(
    champions: TChampion[],
    rotate: boolean,
    random: () => number = Math.random,
): AbilityRound<TChampion> | null {
    const validChampions = champions.filter((champion) => champion.spells && champion.spells.length >= 4 && champion.passive);
    if (validChampions.length === 0) return null;

    const champion = validChampions[randomIndex(validChampions.length, random)];
    const spellIndex = randomIndex(5, random);
    const spellTypes = ['Q', 'W', 'E', 'R'] as const;
    const spellType: SpellType = spellIndex === 4 ? 'P' : spellTypes[spellIndex];
    const spell = spellType === 'P' ? champion.passive! : champion.spells![spellIndex];

    return {
        champion,
        spell,
        spellType,
        rotation: rotate ? randomIndex(4, random) * 90 : 0,
    };
}

export function createSkinRound<TChampion extends SkinQuizChampion>(
    champions: TChampion[],
    random: () => number = Math.random,
): SkinRound<TChampion> | null {
    const validChampions = champions.filter((champion) => champion.skins && champion.skins.length > 0);
    if (validChampions.length === 0) return null;

    const champion = validChampions[randomIndex(validChampions.length, random)];
    const skins = champion.skins!;
    const nonBaseSkins = skins.filter((skin) => skin.num > 0);
    const skinPool = nonBaseSkins.length > 0 ? nonBaseSkins : skins;
    const modes: SkinRound<TChampion>['mode'][] = ['blur_gray', 'zoom'];

    return {
        champion,
        skin: skinPool[randomIndex(skinPool.length, random)],
        mode: modes[randomIndex(modes.length, random)],
        zoomOrigin: {
            x: randomIndex(80, random) + 10,
            y: randomIndex(80, random) + 10,
        },
    };
}

export function createSkinOptions(
    champion: SkinQuizChampion,
    correctSkin: SkinQuizSkin,
    random: () => number = Math.random,
): SkinQuizSkin[] {
    const wrongSkins = (champion.skins ?? [])
        .filter((skin) => skin.id !== correctSkin.id)
        .sort(() => random() - 0.5)
        .slice(0, 3);

    return [correctSkin, ...wrongSkins].sort(() => random() - 0.5);
}
