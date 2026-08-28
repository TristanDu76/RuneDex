'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GlobalSearch from './GlobalSearch';
import { Link, usePathname } from '@/i18n/routing';
interface NavbarProps {
    locale: string;
}

const MOBILE_NAV_ITEMS = [
    { href: '/', labelFr: 'Carte', labelEn: 'Map', icon: '🗺️' },
    { href: '/rune', labelFr: 'Runes', labelEn: 'Runes', icon: '🔮' },
    { href: '/artifact', labelFr: 'Objets', labelEn: 'Items', icon: '🗡️' },
    { href: '/quiz', labelFr: 'Quiz', labelEn: 'Quiz', icon: '🎮' },
];

export default function Navbar({ locale }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCharactersOpen, setIsCharactersOpen] = useState(false);

    // Hide navbar logic removed - always show now

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-hextech-bg/90 backdrop-blur-lg border-b border-hextech-gold/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-16 transition-all duration-300">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">

                {/* Left: Logo */}
                <div className="flex flex-shrink-0 items-center gap-2 sm:gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
                    >
                        <Image
                            src="/LogoRuneDex.png"
                            alt="RuneDex Logo"
                            width={50}
                            height={50}
                            className="h-8 w-auto object-contain sm:h-10"
                        />
                        <span
                            className="relative text-lg hex-title tracking-[0.12em] sm:text-2xl sm:tracking-[0.2em]"
                        >
                            RuneDex
                            <span className="absolute -inset-1 blur-sm bg-hextech-cyan/20 z-[-1] rounded-full"></span>
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <GlobalSearch locale={locale} />



                </div>

                {/* Right: Language Switcher & Mobile Navigation */}
                <div className="flex items-center gap-1.5 sm:gap-4">

                    <div className="flex items-center bg-hextech-panel rounded-lg p-1 border border-hextech-gold/30 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
                        <Link
                            href={pathname}
                            locale="fr"
                            className={`px-2 py-1 text-sm font-semibold uppercase tracking-wider transition-all sm:px-3 ${locale === 'fr'
                                ? 'bg-hextech-cyan/20 text-hextech-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                                : 'text-gray-400 hover:text-hextech-gold'
                                }`}
                        >
                            FR
                        </Link>
                        <Link
                            href={pathname}
                            locale="en"
                            className={`px-2 py-1 text-sm font-semibold uppercase tracking-wider transition-all sm:px-3 ${locale === 'en'
                                ? 'bg-hextech-cyan/20 text-hextech-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                                : 'text-gray-400 hover:text-hextech-gold'
                                }`}
                        >
                            EN
                        </Link>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center border border-hextech-gold/30 text-hextech-gold transition-colors hover:bg-hextech-panel"
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-site-navigation"
                        aria-label={isMobileMenuOpen
                            ? (locale === 'en' ? 'Close navigation' : 'Fermer la navigation')
                            : (locale === 'en' ? 'Open navigation' : 'Ouvrir la navigation')}
                    >
                        <span className="text-xl" aria-hidden="true">☰</span>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div id="mobile-site-navigation" className="fixed inset-x-0 top-16 z-[60] border-b border-hextech-gold/30 bg-hextech-bg/98 p-4 shadow-2xl backdrop-blur md:absolute md:inset-x-auto md:right-4 md:w-80 md:border md:border-hextech-gold/30">
                    <div className="mx-auto grid max-w-md gap-2">
                        {MOBILE_NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex min-h-12 items-center gap-3 border px-4 text-sm font-semibold uppercase tracking-wider transition-colors ${pathname === item.href
                                    ? 'border-hextech-cyan bg-hextech-cyan/15 text-hextech-cyan'
                                    : 'border-hextech-gold/25 bg-hextech-panel text-hextech-gold'
                                }`}
                            >
                                <span aria-hidden="true">{item.icon}</span>
                                {locale === 'en' ? item.labelEn : item.labelFr}
                            </Link>
                        ))}
                        <div className="border border-hextech-gold/25 bg-hextech-panel">
                            <button
                                type="button"
                                onClick={() => setIsCharactersOpen((open) => !open)}
                                aria-expanded={isCharactersOpen}
                                className="flex min-h-12 w-full items-center gap-3 px-4 text-left text-sm font-semibold uppercase tracking-wider text-hextech-gold"
                            >
                                <span aria-hidden="true">👥</span>
                                {locale === 'en' ? 'Characters' : 'Personnages'}
                                <span className="ml-auto text-hextech-cyan" aria-hidden="true">{isCharactersOpen ? '−' : '+'}</span>
                            </button>
                            {isCharactersOpen && (
                                <div className="grid gap-1 border-t border-hextech-gold/20 p-2 pl-8">
                                    <Link href="/champions" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-hextech-cyan">
                                        {locale === 'en' ? 'Champions' : 'Champions'}
                                    </Link>
                                    <Link href="/lore" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-hextech-cyan">
                                        {locale === 'en' ? 'Lore characters' : 'Personnages du lore'}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
