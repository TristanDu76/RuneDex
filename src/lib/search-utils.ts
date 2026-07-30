export interface SearchableEntity {
  id: string;
  name: string;
  name_en?: string;
  name_fr?: string;
  aliases?: string[];
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function compact(value: string): string {
  return value.replace(/\s/g, '');
}

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      const saved = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + Number(left[leftIndex - 1] !== right[rightIndex - 1])
      );
      diagonal = saved;
    }
  }

  return previous[right.length];
}

function getSearchVariants(entity: SearchableEntity): string[] {
  return [entity.name, entity.id, entity.name_en, entity.name_fr, ...(entity.aliases ?? [])]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearchText);
}

export function getSearchRank(entity: SearchableEntity, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return -1;

  const variants = getSearchVariants(entity);
  if (variants.some((value) => value === normalizedQuery)) return 0;
  if (variants.some((value) => value.startsWith(normalizedQuery))) return 1;
  if (variants.some((value) => value.split(' ').some((word) => word.startsWith(normalizedQuery)))) return 2;
  if (variants.some((value) => value.includes(normalizedQuery))) return 3;

  const compactQuery = compact(normalizedQuery);
  if (compactQuery.length >= 6 && variants.some((value) => editDistance(compact(value), compactQuery) <= 1)) return 4;

  return -1;
}

export function matchesSearch(entity: SearchableEntity, query: string): boolean {
  return getSearchRank(entity, query) >= 0;
}
