import type { ChampionLight, LoreCharacterLight } from '@/types/champion';
import { getSearchRank } from './search-utils';

export type SearchResult =
  | { type: 'champion'; data: ChampionLight }
  | { type: 'lore'; data: LoreCharacterLight };

interface SearchCatalogOptions {
  query: string;
  champions: ChampionLight[];
  loreCharacters: LoreCharacterLight[];
}

type RankedSearchResult = SearchResult & { rank: number };

export function searchCatalog({ query, champions, loreCharacters }: SearchCatalogOptions): SearchResult[] {
  const candidates: RankedSearchResult[] = [
    ...champions.map((data) => ({ type: 'champion' as const, data })),
    ...loreCharacters.map((data) => ({ type: 'lore' as const, data })),
  ].flatMap((result) => {
    const rank = getSearchRank(result.data, query);
    return rank >= 0 ? [{ ...result, rank }] : [];
  });

  return candidates
    .sort((left, right) => left.rank - right.rank || left.data.name.localeCompare(right.data.name))
    .slice(0, 8)
    .map(({ rank, ...result }): SearchResult => {
      void rank;
      return result;
    });
}
