'use client';

import React, { useState } from 'react';
import { ChampionData, ChampionGridData, LoreCharacter } from '@/types/champion';
import ChampionGrid from '../champions/ChampionGrid';
import LoreGrid from '../lore/LoreGrid';
import ArtifactCard from '../artifacts/ArtifactCard';
import RunePillar from '../runes/RunePillar';
import { useTranslations } from 'next-intl';

interface HomeContentProps {
    champions: ChampionGridData[];
    loreCharacters: LoreCharacter[];
    artifacts: any[];
    runes: any[];
}

export default function HomeContent({ champions, loreCharacters, artifacts, runes }: HomeContentProps) {
    const [viewMode, setViewMode] = useState<'champions' | 'lore' | 'artifacts' | 'runes'>('champions');
    const t = useTranslations('home');

    return (
        <div className="w-full">
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-800 p-1 rounded-full border border-gray-700 flex flex-wrap justify-center gap-1">
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
                    <button
                        onClick={() => setViewMode('artifacts')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'artifacts'
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {t('artifacts')}
                    </button>
                    <button
                        onClick={() => setViewMode('runes')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'runes'
                            ? 'bg-yellow-500 text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {t('runes')}
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'champions' && (
                <ChampionGrid champions={champions} />
            )}

            {viewMode === 'lore' && (
                <LoreGrid characters={loreCharacters} />
            )}

            {viewMode === 'artifacts' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 place-items-center mx-auto">
                    {artifacts.map((artifact: any) => (
                        <ArtifactCard key={artifact.id} artifact={artifact} />
                    ))}
                </div>
            )}

            {viewMode === 'runes' && (
                <div className="flex flex-col md:flex-row justify-center items-stretch w-full max-w-6xl mx-auto overflow-hidden rounded-xl border border-gray-800 shadow-2xl bg-black h-auto md:h-[500px]">
                    {runes.map((rune: any) => (
                        <div
                            key={rune.id}
                            className="flex-1 min-w-[60px] md:min-w-[100px] border-r border-gray-800 last:border-r-0 transition-[flex-grow] duration-500 ease-in-out hover:flex-[2]"
                        >
                            <RunePillar rune={rune} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
