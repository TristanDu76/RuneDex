// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AbilityQuizClient from './AbilityQuizClient';
import type { AbilityQuizChampion } from '@/lib/quiz-rounds';

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

const annie: AbilityQuizChampion = {
    id: 'Annie',
    name: 'Annie',
    version: '16.1.1',
    image: { full: 'Annie.png' },
    passive: { name: 'Pyromanie', image: { full: 'Annie_Passive.png' } },
    spells: ['Q', 'W', 'E', 'R'].map((name) => ({
        name,
        image: { full: `Annie_${name}.png` },
    })),
};

describe('AbilityQuizClient', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('keeps the spell choices open when Enter repeats after the champion guess', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        render(<AbilityQuizClient champions={[annie]} />);

        const input = await screen.findByPlaceholderText('typePlaceholder');
        fireEvent.change(input, { target: { value: 'Annie' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(await screen.findByText('guessSpell')).toBeTruthy();

        fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', repeat: true });

        expect(screen.getByText('guessSpell')).toBeTruthy();
        expect(screen.queryByText('wrong')).toBeNull();

        fireEvent.keyDown(screen.getByRole('button', { name: '⚫ grayscale ON' }), { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('guessSpell')).toBeTruthy();
        expect(screen.queryByText('wrong')).toBeNull();
    });

});
