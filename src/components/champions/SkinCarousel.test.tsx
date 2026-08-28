// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import SkinCarousel from './SkinCarousel';

vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
    motion: {
        img: ({ alt, className, drag }: { alt: string; className?: string; drag?: string }) => (
            <span role="img" aria-label={alt} className={className} data-drag={drag} />
        ),
        h2: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    },
    useReducedMotion: () => true,
}));

const skins = [
    { id: 'Annie_0', num: 0, name: 'default', chromas: false },
    { id: 'Annie_1', num: 1, name: 'Annie gothique', chromas: false },
];

describe('SkinCarousel', () => {
    it('disables image dragging on mobile and exposes explicit side controls', () => {
        render(<SkinCarousel skins={skins} championId="Annie" />);

        const image = screen.getByRole('img', { name: 'default' });
        expect(image.getAttribute('data-drag')).toBe('x');
        expect(image.className).toContain('pointer-events-none');
        expect(image.className).toContain('md:pointer-events-auto');

        fireEvent.click(screen.getByRole('button', { name: 'next' }));

        expect(screen.getByRole('img', { name: 'Annie gothique' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'previous' })).toBeTruthy();
    });
});
