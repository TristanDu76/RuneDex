// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ChampionGridData } from '@/types/champion';
import ChampionGrid from './ChampionGrid';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string | number>) =>
    values?.count ? `${key}:${values.count}` : key,
}));

vi.mock('./ChampionCard', () => ({
  default: ({ champion }: { champion: ChampionGridData }) => (
    <article data-testid="champion-card">{champion.name}</article>
  ),
}));

vi.mock('../ui/FilterBar', () => ({
  default: () => null,
}));

const champions: ChampionGridData[] = Array.from({ length: 100 }, (_, index) => ({
  id: `Champion${index}`,
  key: `Champion${index}`,
  name: `Champion ${index}`,
  title: 'Test',
  version: '1.0.0',
  image: {
    full: `Champion${index}.png`,
    sprite: 'champion0.png',
    group: 'champion',
    x: 0,
    y: 0,
    w: 48,
    h: 48,
  },
  tags: ['Mage'],
  partype: 'Mana',
}));

describe('ChampionGrid', () => {
  it('renders an initial batch and reveals the remaining cards on demand', () => {
    render(<ChampionGrid champions={champions} />);

    expect(screen.getAllByTestId('champion-card')).toHaveLength(48);
    fireEvent.click(screen.getByRole('button', { name: 'championsGrid.loadMore:48' }));
    expect(screen.getAllByTestId('champion-card')).toHaveLength(96);
    fireEvent.click(screen.getByRole('button', { name: 'championsGrid.loadMore:4' }));
    expect(screen.getAllByTestId('champion-card')).toHaveLength(100);
    expect(screen.queryByRole('button', { name: /championsGrid\.loadMore/ })).toBeNull();
  });
});
