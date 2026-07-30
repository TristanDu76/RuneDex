import { describe, expect, it } from 'vitest';

import { getSearchRank, normalizeSearchText } from './search-utils';

describe('search-utils', () => {
  it('normalizes accents, punctuation and camel-case ids', () => {
    expect(normalizeSearchText('Maître Yi')).toBe('maitre yi');
    expect(normalizeSearchText("Kai'Sa")).toBe('kai sa');
    expect(normalizeSearchText('MasterYi')).toBe('master yi');
  });

  it('finds champions through their localized name, Data Dragon id and a name token', () => {
    const masterYi = { id: 'MasterYi', name: 'Maître Yi' };

    expect(getSearchRank(masterYi, 'maitre yi')).toBeGreaterThanOrEqual(0);
    expect(getSearchRank(masterYi, 'master yi')).toBeGreaterThanOrEqual(0);
    expect(getSearchRank(masterYi, 'yi')).toBeGreaterThanOrEqual(0);
  });

  it('finds compound names despite punctuation and a short spelling mistake', () => {
    expect(getSearchRank({ id: 'XinZhao', name: 'Xin Zhao' }, 'zin zhao')).toBeGreaterThanOrEqual(0);
    expect(getSearchRank({ id: 'Kaisa', name: "Kai'Sa" }, 'kai sa')).toBeGreaterThanOrEqual(0);
    expect(getSearchRank({ id: 'Nunu', name: 'Nunu et Willump' }, 'willump')).toBeGreaterThanOrEqual(0);
  });

  it('uses optional translated aliases when they are available', () => {
    expect(getSearchRank({ id: 'Test', name: 'Nom français', name_en: 'English name' }, 'english name')).toBeGreaterThanOrEqual(0);
  });
});
