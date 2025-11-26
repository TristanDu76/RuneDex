'use client';

import React, { useState, useMemo } from 'react';
import { ChampionData } from '@/types/champion';
import ChampionCard from './ChampionCard';
import { getTranslation } from '@/lib/translations';

interface ChampionGridProps {
    champions: ChampionData[];
    lang?: string;
}

export default function ChampionGrid({ champions, lang = 'fr_FR' }: ChampionGridProps) {
    const [query, setQuery] = useState('');
    const t = getTranslation(lang);

    const filteredChampions = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        if (!lowerQuery) return champions;

        return champions.filter((champion) => {
            // Recherche dans le nom et le titre
            if (champion.name.toLowerCase().includes(lowerQuery)) return true;
            if (champion.title.toLowerCase().includes(lowerQuery)) return true;

            // Recherche dans les factions (DB)
            if (champion.factions?.some(f => f.toLowerCase().includes(lowerQuery))) return true;

            // Recherche dans les tags personnalisés (DB)
            if (champion.custom_tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

            // Recherche dans les tags officiels (Riot)
            if (champion.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

            return false;
        });
    }, [query, champions]);

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-12">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 sm:text-sm transition-colors shadow-lg"
                    placeholder={t.home.searchPlaceholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Grid */}
            {filteredChampions.length > 0 ? (
                <section
                    className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
            gap-6 justify-center items-center
          "
                >
                    {filteredChampions.map((champion) => (
                        <ChampionCard
                            key={champion.id}
                            champion={champion}
                            lang={lang}
                        />
                    ))}
                </section>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    <p className="text-xl">{t.home.noResults.replace('{query}', query)}</p>
                </div>
            )}
        </div>
    );
}
