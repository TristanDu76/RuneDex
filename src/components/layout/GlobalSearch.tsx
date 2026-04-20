import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '@/i18n/routing';
import { ChampionLight, LoreCharacterLight } from '@/types/champion';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, setResults, setIsOpen, setIsMobileOpen, setSelectedIndex, closeSearch } from '@/store/slices/searchSlice';
interface GlobalSearchProps {
    champions: ChampionLight[];
    loreCharacters: LoreCharacterLight[];
}

type SearchResult =
    | { type: 'champion'; data: ChampionLight }
    | { type: 'lore'; data: LoreCharacterLight };

export default function GlobalSearch({ champions, loreCharacters }: GlobalSearchProps) {
    const dispatch = useAppDispatch();
    const { query, results, isOpen, isMobileOpen, selectedIndex } = useAppSelector(state => state.search);
    const [mounted, setMounted] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const t = useTranslations();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const lowerQuery = query.toLowerCase();

            const filteredChampions = champions
                .filter(c => c.name.toLowerCase().startsWith(lowerQuery))
                .map(c => ({ type: 'champion' as const, data: c }));

            const filteredLore = loreCharacters
                .filter(c => c.name.toLowerCase().startsWith(lowerQuery))
                .map(c => ({ type: 'lore' as const, data: c }));

            // Combine and limit
            const combined = [...filteredChampions, ...filteredLore].slice(0, 8);

            dispatch(setResults(combined));
            dispatch(setIsOpen(true));
            dispatch(setSelectedIndex(-1)); // Reset selection
        } else {
            dispatch(setResults([]));
            dispatch(setIsOpen(false));
            dispatch(setSelectedIndex(-1));
        }
    }, [query, champions, loreCharacters, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                dispatch(setIsOpen(false));
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (result: SearchResult) => {
        let url = '';
        if (result.type === 'champion') {
            url = `/champion/${result.data.id}`;
        } else {
            // Lore character
            url = `/lore/${result.data.id || result.data.name}`;
        }

        router.push(url);
        dispatch(closeSearch());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            dispatch(setSelectedIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            dispatch(setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : results.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;
            if (results[indexToSelect]) {
                handleSelect(results[indexToSelect]);
            }
        }
    };

    return (
        <div ref={wrapperRef}>
            {/* Desktop Search Bar */}
            <div className="relative hidden sm:block w-48 md:w-80">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-hextech-gold/30 rounded-full leading-5 bg-hextech-panel text-white placeholder-gray-500 focus:outline-none focus:bg-[#0f172a] focus:border-hextech-cyan focus:ring-1 focus:ring-hextech-cyan sm:text-sm transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                        placeholder={t('home.searchPlaceholder')}
                        value={query}
                        onChange={(e) => dispatch(setQuery(e.target.value))}
                        onFocus={() => query.length > 0 && dispatch(setIsOpen(true))}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {isOpen && results.length > 0 && (
                    <div className="absolute z-[100] mt-2 w-full hex-panel border border-hextech-gold/40 shadow-2xl">
                        <ul>
                            {results.map((result, index) => (
                                <li
                                    key={`${result.type}-${result.data.id}`}
                                    onClick={() => handleSelect(result)}
                                    onMouseEnter={() => dispatch(setSelectedIndex(index))}
                                    className={`cursor-pointer px-4 py-3 text-gray-200 flex items-center gap-3 transition-all border-b border-hextech-gold/10 last:border-0 ${index === selectedIndex ? 'bg-hextech-cyan/20 border-l-2 border-l-hextech-cyan text-white' : 'hover:bg-hextech-cyan/10 hover:pr-2'
                                        }`}
                                >
                                    {result.type === 'champion' ? (
                                        <img
                                            src={`https://ddragon.leagueoflegends.com/cdn/${(result.data as ChampionLight).version}/img/champion/${(result.data as ChampionLight).image.full}`}
                                            alt={result.data.name}
                                            className="w-8 h-8 rounded-full border border-hextech-gold/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-hextech-gold/50 bg-hextech-panel flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                                            {(result.data as LoreCharacterLight).image ? (
                                                <img src={(result.data as LoreCharacterLight).image!} alt={result.data.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-hextech-gold">?</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${index === selectedIndex ? 'text-hextech-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : ''}`}>{result.data.name}</span>
                                        <span className="text-[10px] text-hextech-gold/70 tracking-widest uppercase">{result.type === 'champion' ? 'Champion' : 'Lore'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile Search Trigger */}
            <button
                className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => dispatch(setIsMobileOpen(true))}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Mobile Search Overlay (Portal) */}
            {isMobileOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] bg-hextech-bg/95 backdrop-blur-md flex flex-col p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-hextech-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                autoFocus
                                className="block w-full pl-10 pr-3 py-3 border border-hextech-gold/40 rounded-full leading-5 bg-hextech-panel text-white placeholder-gray-500 focus:outline-none focus:border-hextech-cyan focus:ring-1 focus:ring-hextech-cyan text-base shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                                placeholder={t('home.searchPlaceholder')}
                                value={query}
                                onChange={(e) => dispatch(setQuery(e.target.value))}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            onClick={() => dispatch(setIsMobileOpen(false))}
                            className="text-gray-400 hover:text-white font-medium"
                        >
                            Fermer
                        </button>
                    </div>

                    {/* Mobile Results */}
                    {results.length > 0 ? (
                        <div className="flex-grow overflow-y-auto hex-panel border border-hextech-gold/30 shadow-2xl">
                            <ul>
                                {results.map((result, index) => (
                                    <li
                                        key={`${result.type}-${result.data.id}`}
                                        onClick={() => handleSelect(result)}
                                        className={`cursor-pointer px-4 py-4 text-gray-200 flex items-center gap-4 border-b border-hextech-gold/20 last:border-0 transition-colors ${index === selectedIndex ? 'bg-hextech-cyan/20 border-l-2 border-l-hextech-cyan' : 'hover:bg-hextech-cyan/10'
                                            }`}
                                    >
                                        {result.type === 'champion' ? (
                                            <img
                                                src={`https://ddragon.leagueoflegends.com/cdn/${(result.data as ChampionLight).version}/img/champion/${(result.data as ChampionLight).image.full}`}
                                                alt={result.data.name}
                                                className="w-12 h-12 rounded-full border-2 border-hextech-gold"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full border border-gray-600 bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {(result.data as LoreCharacterLight).image ? (
                                                    <img src={(result.data as LoreCharacterLight).image!} alt={result.data.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-500">?</span>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-lg font-semibold">{result.data.name}</span>
                                            <span className="text-sm text-gray-500 uppercase">{result.type === 'champion' ? 'Champion' : 'Lore'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        query.length > 0 && (
                            <div className="text-center text-gray-400 mt-8">
                                <p>{t('home.noResults', { query })}</p>
                            </div>
                        )
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
