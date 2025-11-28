'use client';

import React, { useState } from 'react';
import { ChampionData, LoreCharacter } from '@/types/champion';
import ChampionGrid from '../champions/ChampionGrid';
import LoreGrid from '../lore/LoreGrid';
import { useTranslations } from 'next-intl';

interface HomeContentProps {
    champions: ChampionData[];
    loreCharacters: LoreCharacter[];
}

export default function HomeContent({ champions, loreCharacters }: HomeContentProps) {
    const [viewMode, setViewMode] = useState<'champions' | 'lore'>('champions');
    const t = useTranslations('home');

    return (
        <div className="w-full">
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-800 p-1 rounded-full border border-gray-700 flex">
                    <button
                        onClick={() => setViewMode('champions')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'champions'
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {t('champions')}
                    </button>
                    <button
                        onClick={() => setViewMode('lore')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'lore'
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {t('loreCharacters')}
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'champions' ? (
                <ChampionGrid champions={champions} />
            ) : (
                <LoreGrid characters={loreCharacters} />
            )}
        </div>
    );
}
