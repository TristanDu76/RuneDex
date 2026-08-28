// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Navbar from './Navbar';

vi.mock('next/image', () => ({
    default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock('./GlobalSearch', () => ({
    default: () => <div>search</div>,
}));

vi.mock('@/i18n/routing', () => ({
    Link: (props: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; locale?: string }) => (
        <a href={props.href} className={props.className} onClick={props.onClick}>{props.children}</a>
    ),
    usePathname: () => '/champions',
}));

afterEach(cleanup);

describe('Navbar', () => {
    it('exposes the site menu from the desktop header', () => {
        render(<Navbar locale="fr" />);

        const trigger = screen.getByRole('button', { name: 'Ouvrir la navigation' });
        expect(trigger.className).not.toContain('md:hidden');

        fireEvent.click(trigger);

        expect(screen.getByRole('button', { name: 'Fermer la navigation' })).toBeTruthy();
        const menu = document.getElementById('mobile-site-navigation');
        expect(menu).not.toBeNull();
        expect(menu?.className).not.toContain('md:hidden');
        expect(screen.getByRole('link', { name: /Carte/ })).toBeTruthy();
    });

    it('uses English labels in the desktop menu', () => {
        render(<Navbar locale="en" />);

        fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));

        expect(screen.getByRole('button', { name: 'Close navigation' })).toBeTruthy();
        expect(screen.getByRole('link', { name: /Map/ })).toBeTruthy();
        expect(screen.getByRole('link', { name: /Items/ })).toBeTruthy();
        expect(screen.queryByRole('link', { name: /Carte/ })).toBeNull();
    });
});
