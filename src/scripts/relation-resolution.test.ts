import { describe, expect, it } from 'vitest';

import { resolveRelationTarget } from './relation-resolution.mjs';

const characters = {
  aurelionsol: { id: 'aurelionsol', name: 'Aurelion Sol' },
  jarvaniv: { id: 'jarvaniv', name: 'Jarvan IV' },
  renata: { id: 'renata', name: 'Renata Glasc' },
  xinzhao: { id: 'xinzhao', name: 'Xin Zhao' },
};

describe('resolveRelationTarget', () => {
  it('resolves unique canonical ids that differ only by separators', () => {
    expect(resolveRelationTarget('xin-zhao', characters)).toBe('xinzhao');
    expect(resolveRelationTarget('aurelion-sol', characters)).toBe('aurelionsol');
  });

  it('resolves a unique canonical display name when no id matches', () => {
    expect(resolveRelationTarget('renata-glasc', characters)).toBe('renata');
  });

  it('leaves targets without a unique canonical match unresolved', () => {
    expect(resolveRelationTarget('wolf', characters)).toBeNull();
    expect(resolveRelationTarget('jar van', { 'jar-van': { id: 'jar-van', name: 'Jar Van' }, jarvan: { id: 'jarvan', name: 'Jarvan' } })).toBeNull();
  });
});
