// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AbilityQuizClient from './AbilityQuizClient';
import SkinQuizClient from './SkinQuizClient';
import type { AbilityQuizChampion, SkinQuizChampion } from '@/lib/quiz-rounds';

vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

vi.mock('next/image', () => ({
    default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
}));

const names = [
    { id: 'KSante', name: "K'Santé" },
    { id: 'RekSai', name: "Rek'Sai" },
    { id: 'MasterYi', name: 'Maître Yi' },
];

const abilityChampions: AbilityQuizChampion[] = names.map((champion) => ({
    ...champion,
    version: '16.1.1',
    image: { full: `${champion.id}.png` },
    passive: { name: 'Passive', image: { full: 'Passive.png' } },
    spells: ['Q', 'W', 'E', 'R'].map((name) => ({ name, image: { full: `${champion.id}_${name}.png` } })),
}));

const skinChampions: SkinQuizChampion[] = names.map((champion) => ({
    ...champion,
    version: '16.1.1',
    image: { full: `${champion.id}.png` },
    skins: [{ id: `${champion.id}_1`, num: 1, name: `${champion.name} skin` }],
}));

const cases = [
    ['ksante', "K'Santé"],
    ['reksai', "Rek'Sai"],
    ['maitre yi', 'Maître Yi'],
    ['yi', 'Maître Yi'],
] as const;

describe('quiz champion search', () => {
    afterEach(cleanup);

    it.each(cases)('finds %s in the ability quiz', async (query, expectedName) => {
        render(<AbilityQuizClient champions={abilityChampions} />);

        const input = await screen.findByPlaceholderText('typePlaceholder');
        fireEvent.change(input, { target: { value: query } });

        expect(await screen.findByText(expectedName)).toBeTruthy();
    });

    it.each(cases)('finds %s in the skin quiz', async (query, expectedName) => {
        render(<SkinQuizClient champions={skinChampions} />);

        const input = await screen.findByPlaceholderText('typePlaceholder');
        fireEvent.change(input, { target: { value: query } });

        expect(await screen.findByText(expectedName)).toBeTruthy();
    });
});
