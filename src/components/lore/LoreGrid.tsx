'use client';

import React, { useState, useMemo } from 'react';
import { LoreCharacter } from '@/types/champion';
import LoreCard from './LoreCard';
import { useTranslations } from 'next-intl';

interface LoreGridProps {
    characters: LoreCharacter[];
}

export default function LoreGrid({ characters }: LoreGridProps) {
    const [query, setQuery] = useState('');
    const t = useTranslations();

    const filteredCharacters = useMemo(() => {
        let result = characters;

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((char) =>
                char.name.toLowerCase().includes(lowerQuery) ||
                char.faction?.toLowerCase().includes(lowerQuery) ||
                char.species?.toLowerCase().includes(lowerQuery)
            );
        }

        return result;
    }, [query, characters]);

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <div className="relative w-full lg:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                        className="block w-full pl-11 pr-4 py-3 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 sm:text-sm transition-all shadow-lg"
                        placeholder={t('home.searchPlaceholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Count */}
            {query && (
                <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm">
                        {filteredCharacters.length} {filteredCharacters.length === 1 ? 'personnage trouvé' : 'personnages trouvés'}
                    </p>
                </div>
            )}

            {/* Grid */}
            {filteredCharacters.length > 0 ? (
                <section
                    className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
            gap-6 place-items-center mx-auto
          "
                >
                    {filteredCharacters.map((char) => (
                        <LoreCard
                            key={char.id}
                            character={char}
                        />
                    ))}
                </section>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    <p className="text-xl">{t('home.noResults', { query })}</p>
                </div>
            )}
        </div>
    );
}
