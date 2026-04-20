'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function GalleryNav() {
    const t = useTranslations('home');
    const pathname = usePathname();

    const navItems = [
        { id: 'champions', label: t('champions'), href: '/champions' },
        { id: 'lore', label: t('loreCharacters'), href: '/lore' },
        { id: 'artifact', label: t('artifacts'), href: '/artifact' },
        { id: 'rune', label: t('runes'), href: '/rune' },
    ];

    return (
        <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex flex-wrap justify-center gap-1 shadow-xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.id}
                            href={item.href as any}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                    ? 'bg-yellow-500 text-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-white/10 mx-2 self-center hidden sm:block" />

                <Link
                    href="/map"
                    className="px-8 py-2.5 rounded-full text-sm font-bold text-yellow-500 hover:bg-yellow-500/10 transition-all flex items-center gap-2 border border-yellow-500/20 group"
                >
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2l6 3 5.447-2.724A2 2 0 0122 4.172v8.711a2 2 0 01-1.553 1.894L15 18l-6 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20V6m6 12V3" />
                    </svg>
                    {t('map.title')}
                </Link>
            </div>
        </div>
    );
}
