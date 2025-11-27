'use client';

import React, { useState } from 'react';
import { ChampionData, LoreCharacter } from '@/types/champion';
import ChampionGrid from '../champions/ChampionGrid';
import LoreGrid from '../lore/LoreGrid';

interface HomeContentProps {
    champions: ChampionData[];
    loreCharacters: LoreCharacter[];
    lang: string;
}

export default function HomeContent({ champions, loreCharacters, lang }: HomeContentProps) {
    const [viewMode, setViewMode] = useState<'champions' | 'lore'>('champions');

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
                        Champions
                    </button>
                    <button
                        onClick={() => setViewMode('lore')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'lore'
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Personnages du Lore
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'champions' ? (
                <ChampionGrid champions={champions} lang={lang} />
            ) : (
                <LoreGrid characters={loreCharacters} lang={lang} />
            )}
        </div>
    );
}
