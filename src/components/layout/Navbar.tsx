'use client';

import React from 'react';
import Image from 'next/image';
import GlobalSearch from './GlobalSearch';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

import { ChampionLight, LoreCharacterLight } from '@/types/champion';

interface NavbarProps {
    champions: ChampionLight[];
    loreCharacters: LoreCharacterLight[];
}

export default function Navbar({ champions, loreCharacters }: NavbarProps) {
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations();

    // Hide navbar logic removed - always show now

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-hextech-bg/90 backdrop-blur-lg border-b border-hextech-gold/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Left: Logo */}
                <div className="flex-shrink-0 flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/LogoRuneDex.png"
                            alt="RuneDex Logo"
                            width={50}
                            height={50}
                            className="h-10 w-auto object-contain"
                        />
                        <span
                            className="text-2xl hex-title tracking-[0.2em] relative"
                        >
                            RuneDex
                            <span className="absolute -inset-1 blur-sm bg-hextech-cyan/20 z-[-1] rounded-full"></span>
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <GlobalSearch champions={champions} loreCharacters={loreCharacters} />



                </div>

                {/* Right: Language Switcher & Mobile Map */}
                <div className="flex items-center gap-4">
                    {/* Mobile Map Icon */}
                    <Link
                        href="/map"
                        className={`md:hidden p-2 rounded-lg transition-all border ${pathname === '/map'
                            ? 'bg-hextech-cyan/20 border-hextech-cyan text-hextech-cyan shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-hextech-panel hover:border-hextech-gold/30'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2l6 3 5.447-2.724A2 2 0 0122 4.172v8.711a2 2 0 01-1.553 1.894L15 18l-6 2z" />
                        </svg>
                    </Link>

                    <div className="flex items-center bg-hextech-panel rounded-lg p-1 border border-hextech-gold/30 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
                        <Link
                            href={pathname}
                            locale="fr"
                            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all uppercase tracking-wider ${locale === 'fr'
                                ? 'bg-hextech-cyan/20 text-hextech-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                                : 'text-gray-400 hover:text-hextech-gold'
                                }`}
                        >
                            FR
                        </Link>
                        <Link
                            href={pathname}
                            locale="en"
                            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all uppercase tracking-wider ${locale === 'en'
                                ? 'bg-hextech-cyan/20 text-hextech-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                                : 'text-gray-400 hover:text-hextech-gold'
                                }`}
                        >
                            EN
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
