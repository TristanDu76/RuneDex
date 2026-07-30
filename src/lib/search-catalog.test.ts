import { describe, expect, it } from 'vitest';

import { searchCatalog } from './search-catalog';

describe('searchCatalog', () => {
  it('keeps localized matching and ranks exact results ahead of partial matches', () => {
    const results = searchCatalog({
      query: 'maitre yi',
      champions: [
        { id: 'MasterYi', key: '11', name: 'Maître Yi', title: '', version: '1', image: { full: 'MasterYi.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 } },
        { id: 'YiHelper', key: '12', name: 'Yi Helper', title: '', version: '1', image: { full: 'YiHelper.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 } },
      ],
      loreCharacters: [],
    });

    expect(results.map((result) => result.data.id)).toEqual(['MasterYi']);
  });

  it('limits results after combining champions and lore characters', () => {
    const results = searchCatalog({
      query: 'a',
      champions: Array.from({ length: 5 }, (_, index) => ({
        id: `Champion${index}`,
        key: String(index),
        name: `A Champion ${index}`,
        title: '',
        version: '1',
        image: { full: `Champion${index}.png`, sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
      })),
      loreCharacters: Array.from({ length: 5 }, (_, index) => ({
        id: `lore-${index}`,
        name: `A Lore ${index}`,
        faction: '',
      })),
    });

    expect(results).toHaveLength(8);
  });
});
