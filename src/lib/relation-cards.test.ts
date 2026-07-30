import { describe, expect, it } from 'vitest';

import { buildRelationCards } from './relation-cards';

describe('buildRelationCards', () => {
    it('builds only the displayable relation cards with their resolved targets', () => {
        const cards = buildRelationCards({
            championName: 'Annie',
            championId: 'annie',
            locale: 'fr',
            relations: [
                { champion: 'Amumu', type: 'friend' },
                { champion: 'Demacia', type: 'faction' },
            ],
            allChampions: [
                { id: 'amumu', name: 'Amumu', factions: ['shurima'] },
                { id: 'garen', name: 'Garen', factions: ['demacia'] },
            ],
            loreCharacters: [
                { id: 'cithria', name: 'Cithria', faction: 'demacia', related_characters: ['Annie'], image: 'https://wiki.leagueoflegends.com/en-us/images/Cithria.png' },
            ],
        });

        expect(cards).toEqual([
            expect.objectContaining({ champion: 'Amumu', type: 'friend', href: '/fr/champion/amumu', isLore: false }),
            expect.objectContaining({ champion: 'Garen', type: 'faction-member', href: '/fr/champion/garen', isLore: false }),
            expect.objectContaining({ champion: 'Cithria', type: 'faction-member', href: '/fr/lore/cithria', isLore: true }),
        ]);
    });
});
