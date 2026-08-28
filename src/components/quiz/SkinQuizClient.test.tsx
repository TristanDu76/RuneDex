// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SkinQuizClient from './SkinQuizClient';
import type { SkinQuizChampion } from '@/lib/quiz-rounds';

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

const rammus: SkinQuizChampion = {
    id: 'Rammus',
    name: 'Rammus',
    version: '16.1.1',
    image: { full: 'Rammus.png' },
    skins: [
        { id: 'Rammus_1', num: 1, name: 'Rammus royal' },
        { id: 'Rammus_2', num: 2, name: 'Rammus de chrome' },
        { id: 'Rammus_3', num: 3, name: 'Rammus fondu' },
        { id: 'Rammus_4', num: 4, name: 'Rammus astronaute' },
    ],
};

describe('SkinQuizClient', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('keeps the skin choices open when Enter repeats after the champion guess', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        render(<SkinQuizClient champions={[rammus]} />);

        const input = await screen.findByPlaceholderText('typePlaceholder');
        fireEvent.change(input, { target: { value: 'Rammus' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(await screen.findByText('guessSkin')).toBeTruthy();

        fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', repeat: true });

        expect(screen.getByText('guessSkin')).toBeTruthy();
        expect(screen.queryByText('wrong')).toBeNull();

        fireEvent.keyDown(screen.getByRole('button', { name: 'Rammus royal' }), { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('guessSkin')).toBeTruthy();
        expect(screen.queryByText('wrong')).toBeNull();
    });

});
