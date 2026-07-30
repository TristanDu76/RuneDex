import { describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (query: () => Promise<unknown>) => query,
}));

import {
  fetchAbilityQuizChampions,
  fetchArtifactById,
  fetchRegionShard,
  fetchRuneById,
  fetchSkinQuizChampions,
} from './data';
import versionData from '@/data/version.json';
import championsIndex from '@/data/champions/index.json';

describe('entity owners', () => {
  it('normalizes a champion artifact owner for display', async () => {
    const artifact = await fetchArtifactById('dead_man_s_plate');

    expect(artifact?.owner).toEqual({
      name: 'Gangplank',
      image: `https://ddragon.leagueoflegends.com/cdn/${versionData.version}/img/champion/Gangplank.png`,
      title: 'Fléau des mers',
      type: 'associated',
      link: '/champion/Gangplank',
    });
  });

  it('resolves the owner declared for a rune', async () => {
    const rune = await fetchRuneById('rune_of_sorcery');

    expect(rune?.owner).toEqual({
      name: 'Ryze',
      image: `https://ddragon.leagueoflegends.com/cdn/${versionData.version}/img/champion/Ryze.png`,
      title: 'Mage runique',
      type: 'guardian',
      link: '/champion/Ryze',
    });
  });

  it('keeps a rune without an owner explicitly unassigned', async () => {
    const rune = await fetchRuneById('rune_of_inspiration');

    expect(rune?.owner).toBeNull();
  });
});

describe('fetchRegionShard', () => {
  it('returns no data for an empty region id', async () => {
    await expect(fetchRegionShard('')).resolves.toEqual([]);
  });

  it.each([
    ['shadow-isles', 'shadow-isles'],
    ['shadowisles', 'shadow-isles'],
    ['bandle-city', 'bandle-city'],
    ['bandlecity', 'bandle-city'],
  ])('loads %s from the %s shard', async (regionId, expectedFactionKey) => {
    const shard = await fetchRegionShard(regionId);

    expect(shard).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ factionKey: expectedFactionKey }),
      ])
    );
  });

  it.each([
    '../package',
    '..%2Fpackage',
    '%2E%2E%2Fpackage',
    '..%252Fpackage',
  ])('does not read outside the shard directory for encoded traversal input %s', async (regionId) => {
    await expect(fetchRegionShard(regionId)).resolves.toEqual([]);
  });
});

describe('quiz catalogs', () => {
  it('returns only the data required by ability and skin quizzes', async () => {
    const [abilityChampions, skinChampions] = await Promise.all([
      fetchAbilityQuizChampions(),
      fetchSkinQuizChampions(),
    ]);

    expect(abilityChampions).toHaveLength(championsIndex.length);
    expect(skinChampions).toHaveLength(championsIndex.length);
    expect(abilityChampions.find((champion) => champion.spells?.length)).toEqual(
      expect.objectContaining({
        image: expect.objectContaining({ full: expect.any(String) }),
        spells: expect.arrayContaining([
          expect.objectContaining({ image: expect.objectContaining({ full: expect.any(String) }) }),
        ]),
      })
    );
    expect(skinChampions.find((champion) => champion.skins?.length)).toEqual(
      expect.objectContaining({
        image: expect.objectContaining({ full: expect.any(String) }),
        skins: expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String), num: expect.any(Number) }),
        ]),
      })
    );
    expect(abilityChampions[0]).not.toHaveProperty('lore');
    expect(abilityChampions[0]).not.toHaveProperty('stats');
    expect(skinChampions[0]).not.toHaveProperty('lore');
    expect(skinChampions[0]).not.toHaveProperty('stats');
  });
});
