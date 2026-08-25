import { describe, expect, it } from 'vitest';

import {
    createAbilityRound,
    isClassicQuizEligible,
    createSkinOptions,
    createSkinRound,
    createSeededRandom,
    selectClassicQuizTarget,
    toAbilityQuizChampion,
    toClassicQuizChampion,
    toSkinQuizChampion,
    type AbilityQuizChampion,
    type SkinQuizChampion,
} from './quiz-rounds';
import type { ChampionData } from '@/types/champion';

const image = {
    full: 'icon.png',
    sprite: 'sprite.png',
    group: 'group',
    x: 0,
    y: 0,
    w: 48,
    h: 48,
};

const spells = ['Q', 'W', 'E', 'R'].map((id) => ({
    id,
    name: id,
    description: '',
    tooltip: '',
    maxrank: 1,
    cooldown: [],
    cooldownBurn: '',
    cost: [],
    costBurn: '',
    range: [],
    rangeBurn: '',
    image,
}));

const abilityChampion: AbilityQuizChampion = {
    id: 'annie',
    name: 'Annie',
    version: '16.1.1',
    image: { full: 'icon.png' },
    spells,
    passive: { name: 'Pyromania', image: { full: 'icon.png' } },
};

const skinChampion: SkinQuizChampion = {
    id: 'annie',
    name: 'Annie',
    version: '16.1.1',
    image: { full: 'icon.png' },
    skins: [
        { id: 'annie-default', num: 0, name: 'default' },
        { id: 'annie-1', num: 1, name: 'Goth Annie' },
        { id: 'annie-2', num: 2, name: 'Red Riding Annie' },
        { id: 'annie-3', num: 3, name: 'Annie in Wonderland' },
        { id: 'annie-4', num: 4, name: 'Prom Queen Annie' },
    ],
};

function sequence(values: number[]) {
    let index = 0;
    return () => values[index++] ?? 0;
}

describe('quiz round helpers', () => {
    it('creates reproducible random sequences from the same seed', () => {
        const left = createSeededRandom('ability-round');
        const right = createSeededRandom('ability-round');

        expect([left(), left(), left()]).toEqual([right(), right(), right()]);
    });

    it('projects each quiz payload to the fields it actually needs', () => {
        const champion: ChampionData = {
            id: 'annie',
            key: '1',
            name: 'Annie',
            title: 'the Dark Child',
            version: '16.1.1',
            image,
            tags: ['Mage'],
            partype: 'Mana',
            factions: ['noxus'],
            gender: 'Female',
            species: 'Human',
            lanes: ['mid'],
            spells,
            passive: { name: 'Pyromania', description: '', image },
            skins: skinChampion.skins?.map(({ id, num, name }) => ({ id, num, name, chromas: false })),
            lore: 'Large lore payload that must not reach a quiz client.',
            related_characters: ['Morgana'],
        };

        expect(toClassicQuizChampion(champion)).toEqual({
            id: 'annie', name: 'Annie', version: '16.1.1', image: { full: 'icon.png' },
            tags: ['Mage'], partype: 'Mana', factions: ['noxus'],
            gender: 'Female', species: 'Human', lanes: ['mid'],
        });
        expect(toAbilityQuizChampion(champion)).toEqual({
            id: 'annie', name: 'Annie', version: '16.1.1', image: { full: 'icon.png' },
            spells: spells.map(({ name, image: spellImage }) => ({ name, image: { full: spellImage.full } })),
            passive: { name: 'Pyromania', image: { full: 'icon.png' } },
        });
        expect(toSkinQuizChampion(champion)).toEqual({
            id: 'annie', name: 'Annie', version: '16.1.1', image: { full: 'icon.png' },
            skins: skinChampion.skins?.map(({ id, num, name }) => ({ id, num, name })),
        });
    });

    it('excludes champions with placeholder metadata from the classic quiz', () => {
        expect(isClassicQuizEligible({
            id: 'locke',
            gender: 'Unknown',
            species: 'Unknown',
            partype: 'Mana',
            factions: ['unknown'],
            lanes: [],
            tags: ['Assassin', 'Mage'],
        })).toBe(false);

        expect(isClassicQuizEligible({
            id: 'annie',
            gender: 'Female',
            species: 'Human',
            partype: 'Mana',
            factions: ['noxus'],
            lanes: ['mid'],
            tags: ['Mage'],
        })).toBe(true);
    });

    it('keeps the same classic target when a localized catalogue is replaced', () => {
        const english = { ...abilityChampion, gender: 'Male', species: 'Human', partype: 'Mana', factions: ['ionia'], lanes: ['jungle'], tags: ['Assassin'] };
        const french = { ...english, name: 'Maître Yi' };

        expect(selectClassicQuizTarget(english, [french])).toEqual(french);
        expect(selectClassicQuizTarget(null, [french], () => 0)).toEqual(french);
    });

    it('returns no ability round when no champion has a full spell set', () => {
        expect(createAbilityRound([], true)).toBeNull();
    });

    it('can select a passive ability and respects disabled rotation', () => {
        const round = createAbilityRound([abilityChampion], false, sequence([0, 0.99]));

        expect(round).toMatchObject({
            champion: abilityChampion,
            spell: abilityChampion.passive,
            spellType: 'P',
            rotation: 0,
        });
    });

    it('prefers a non-base skin and creates unique options including the correct skin', () => {
        const round = createSkinRound([skinChampion], sequence([0, 0, 0, 0]));

        expect(round?.skin.num).toBeGreaterThan(0);

        const options = createSkinOptions(skinChampion, round!.skin, sequence([0.9, 0.1, 0.8, 0.2]));

        expect(options).toHaveLength(4);
        expect(options.filter((skin) => skin.id === round!.skin.id)).toHaveLength(1);
        expect(options.every((skin) => skinChampion.skins?.some(({ id }) => id === skin.id))).toBe(true);
    });

    it('falls back to the base skin when it is the only choice', () => {
        const onlyBase: SkinQuizChampion = {
            id: 'base-only',
            name: 'Base only',
            version: '16.1.1',
            image: { full: 'base-only.png' },
            skins: [{ id: 'base-only-default', num: 0, name: 'default' }],
        };

        const round = createSkinRound([onlyBase], () => 0);

        expect(round?.skin).toEqual(onlyBase.skins?.[0]);
        expect(createSkinOptions(onlyBase, round!.skin)).toEqual([onlyBase.skins![0]]);
    });
});
