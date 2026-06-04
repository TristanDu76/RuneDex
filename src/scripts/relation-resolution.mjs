function compact(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function uniqueMatch(ids) {
  return ids.length === 1 ? ids[0] : null;
}

export function resolveRelationTarget(targetId, characters) {
  if (characters[targetId]) return targetId;

  const normalizedTarget = compact(targetId);
  const ids = Object.keys(characters);
  const idMatch = uniqueMatch(ids.filter((id) => compact(id) === normalizedTarget));
  if (idMatch) return idMatch;

  return uniqueMatch(ids.filter((id) => compact(characters[id].name) === normalizedTarget));
}
