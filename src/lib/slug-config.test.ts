import { describe, expect, it } from 'vitest';

import { slugify } from './slug-config';

describe('slugify', () => {
  it('falls back to unknown when normalization removes every character', () => {
    expect(slugify('---')).toBe('unknown');
    expect(slugify('!!!')).toBe('unknown');
  });
});
