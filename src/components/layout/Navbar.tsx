'use client';

import React from 'react';
import Image from 'next/image';
import GlobalSearch from './GlobalSearch';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

import { ChampionData, LoreCharacter } from '@/types/champion';

interface NavbarProps {
    champions: ChampionData[];
    loreCharacters: LoreCharacter[];
}

export default function Navbar({ champions, loreCharacters }: NavbarProps) {
    const pathname = usePathname();
    const locale = useLocale();

    // Hide navbar on home page
    if (pathname === '/') {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-lg h-16">
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
                            className="text-2xl font-extrabold text-yellow-500 tracking-tighter"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                            RuneDex
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <GlobalSearch champions={champions} loreCharacters={loreCharacters} />
                </div>

                {/* Right: Language Switcher */}
                <div className="flex items-center gap-4">
                    {/* Mobile Search Icon placeholder if needed, but for now let's keep it simple */}

                    <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
                        <Link
                            href={pathname}
                            locale="fr"
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${locale === 'fr'
                                ? 'bg-gray-700 text-yellow-500 shadow-sm'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            FR
                        </Link>
                        <Link
                            href={pathname}
                            locale="en"
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${locale === 'en'
                                ? 'bg-gray-700 text-yellow-500 shadow-sm'
                                : 'text-gray-400 hover:text-gray-200'
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
