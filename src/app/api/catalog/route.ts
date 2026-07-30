import { NextResponse } from 'next/server';

import { fetchAllChampionsLight, fetchLoreCharactersLight } from '@/lib/data';
import { searchCatalog } from '@/lib/search-catalog';

const MAX_QUERY_LENGTH = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr';

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: 'Query is too long' }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const [champions, loreCharacters] = await Promise.all([
    fetchAllChampionsLight(locale),
    fetchLoreCharactersLight(),
  ]);

  return NextResponse.json(
    { results: searchCatalog({ query, champions, loreCharacters }) },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
  );
}
