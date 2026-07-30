import { describe, expect, it } from 'vitest';
import { toPlainText } from './html';

describe('toPlainText', () => {
  it('removes untrusted HTML while preserving line breaks', () => {
    expect(toPlainText('Deals <attention>magic</attention><br>damage<script>alert(1)</script>'))
      .toBe('Deals magic\ndamagealert(1)');
  });
});
