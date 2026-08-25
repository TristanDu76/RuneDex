'use client';

import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { LoreCharacterLight } from '@/types/champion';
import LoreCard from './LoreCard';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, loadMore, PAGE_SIZE } from '@/store/slices/loreGridSlice';
import { matchesSearch } from '@/lib/search-utils';

interface LoreGridProps {
    characters: LoreCharacterLight[];
}

export default function LoreGrid({ characters }: LoreGridProps) {
    const dispatch = useAppDispatch();
    const { query, visibleCount } = useAppSelector((state) => state.loreGrid);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    const locale = useLocale();
    const isEn = locale.startsWith('en');
    const [faction, setFaction] = useState('');
    const [species, setSpecies] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');

    const valuesFor = useCallback((field: 'faction' | 'species' | 'gender' | 'status') => {
        const values = characters.flatMap((character) => {
            const value = character[field];
            return Array.isArray(value) ? value : value ? [value] : [];
        });
        return [...new Set(values)].sort((left, right) => left.localeCompare(right));
    }, [characters]);

    const factionOptions = useMemo(() => valuesFor('faction'), [valuesFor]);
    const speciesOptions = useMemo(() => valuesFor('species'), [valuesFor]);
    const genderOptions = useMemo(() => valuesFor('gender'), [valuesFor]);
    const statusOptions = useMemo(() => valuesFor('status'), [valuesFor]);

    // Réinitialise le compteur si la recherche change
    // La logique de reset est dans le reducer setQuery de RTK

    const filteredCharacters = useMemo(() => {
        return characters.filter((character) => {
            const matchesValue = (value: string | string[] | undefined, expected: string) =>
                !expected || (Array.isArray(value) ? value : [value]).includes(expected);

            return (!query || matchesSearch(character, query))
                && matchesValue(character.faction ?? character.factions, faction)
                && matchesValue(character.species, species)
                && matchesValue(character.gender, gender)
                && matchesValue(character.status, status);
        });
    }, [query, characters, faction, species, gender, status]);

    // Personnages visibles à l'écran
    const visibleCharacters = useMemo(
        () => filteredCharacters.slice(0, visibleCount),
        [filteredCharacters, visibleCount]
    );

    const hasMore = visibleCount < filteredCharacters.length;

    // Intersection Observer : charge le prochain batch quand la sentinelle est visible
    const handleLoadMore = useCallback(() => {
        dispatch(loadMore(filteredCharacters.length));
    }, [filteredCharacters.length, dispatch]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    handleLoadMore();
                }
            },
            { rootMargin: '300px' } // Précharge 300px avant d'atteindre le bas
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [handleLoadMore]);

    return (
        <div className="w-full">
            {/* Barre de recherche */}
            <div className="mb-5 flex justify-center">
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
                        onChange={(e) => dispatch(setQuery(e.target.value))}
                    />
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                    [isEn ? 'Region' : 'Région', faction, setFaction, factionOptions],
                    [isEn ? 'Species' : 'Race', species, setSpecies, speciesOptions],
                    [isEn ? 'Gender' : 'Genre', gender, setGender, genderOptions],
                    [isEn ? 'Status' : 'Statut', status, setStatus, statusOptions],
                ].map(([label, value, setValue, options]) => (
                    <label key={label as string} className="text-xs uppercase tracking-wider text-gray-400">
                        {label as string}
                        <select
                            className="mt-1 block w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm normal-case tracking-normal text-gray-200 focus:border-hextech-cyan focus:outline-none"
                            value={value as string}
                            onChange={(event) => (setValue as (value: string) => void)(event.target.value)}
                        >
                            <option value="">{isEn ? 'All' : 'Tous'}</option>
                            {(options as string[]).map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </label>
                ))}
            </div>

            {/* Compteur résultats */}
            {query && (
                <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm">
                        {filteredCharacters.length}{' '}
                        {filteredCharacters.length === 1 ? 'personnage trouvé' : 'personnages trouvés'}
                    </p>
                </div>
            )}

            {/* Compteur de chargement progressif (sans recherche) */}
            {!query && (
                <div className="text-center mb-4">
                    <p className="text-gray-600 text-xs">
                        {visibleCharacters.length} / {filteredCharacters.length} personnages
                    </p>
                </div>
            )}

            {/* Grille */}
            {filteredCharacters.length > 0 ? (
                <>
                    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 place-items-center mx-auto">
                        {visibleCharacters.map((char) => (
                            <LoreCard key={char.id} character={char} />
                        ))}

                        {/* Cartes skeleton "à venir" pour indiquer qu'il y a plus */}
                        {hasMore && Array.from({ length: Math.min(8, filteredCharacters.length - visibleCount) }).map((_, i) => (
                            <div key={`skeleton-${i}`} className="flex flex-col items-center gap-3 w-full">
                                <div
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-800 animate-pulse"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                />
                                <div className="w-20 h-3 rounded bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 60 + 80}ms` }} />
                                <div className="w-14 h-2 rounded bg-gray-700 animate-pulse" style={{ animationDelay: `${i * 60 + 160}ms` }} />
                            </div>
                        ))}
                    </section>

                    {/* Sentinelle invisible — déclenchée par l'Intersection Observer */}
                    {hasMore && (
                        <div ref={sentinelRef} className="h-4 mt-8" aria-hidden="true" />
                    )}

                    {/* Message de fin */}
                    {!hasMore && filteredCharacters.length > PAGE_SIZE && (
                        <p className="text-center text-gray-600 text-sm mt-8">
                            ✓ Tous les {filteredCharacters.length} personnages chargés
                        </p>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    <p className="text-xl">{t('home.noResults', { query })}</p>
                </div>
            )}
        </div>
    );
}
