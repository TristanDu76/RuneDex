import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChampionData } from '@/types/champion';
import { fetchAllChampions } from '@/lib/data';
import { getTranslation } from '@/lib/translations';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ChampionData[]>([]);
    const [champions, setChampions] = useState<ChampionData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'fr_FR';
    const t = getTranslation(lang);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch champions once on mount
    useEffect(() => {
        const loadChampions = async () => {
            const data = await fetchAllChampions(lang);
            setChampions(data);
        };
        loadChampions();
    }, [lang]);

    useEffect(() => {
        if (query.length > 0) {
            const lowerQuery = query.toLowerCase();
            const filtered = champions.filter(c =>
                c.name.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered.slice(0, 5)); // Limit to 5 results
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, champions]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (championId: string) => {
        const url = lang ? `/champion/${championId}?lang=${lang}` : `/champion/${championId}`;
        router.push(url);
        setQuery('');
        setIsOpen(false);
        setIsMobileOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && results.length > 0) {
            handleSelect(results[0].id);
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 sm:text-sm transition-colors"
                        placeholder={t.search.placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 0 && setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {isOpen && results.length > 0 && (
                    <div className="absolute z-[100] mt-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                        <ul>
                            {results.map((champion) => (
                                <li
                                    key={champion.id}
                                    onClick={() => handleSelect(champion.id)}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-700 text-gray-200 flex items-center gap-3 transition-colors"
                                >
                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/champion/${champion.image.full}`}
                                        alt={champion.name}
                                        className="w-8 h-8 rounded-full border border-gray-600"
                                    />
                                    <span>{champion.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile Search Trigger */}
            <button
                className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsMobileOpen(true)}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Mobile Search Overlay (Portal) */}
            {isMobileOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] bg-gray-900/95 backdrop-blur-sm flex flex-col p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                autoFocus
                                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-base"
                                placeholder={t.search.placeholder}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="text-gray-400 hover:text-white font-medium"
                        >
                            Fermer
                        </button>
                    </div>

                    {/* Mobile Results */}
                    {results.length > 0 ? (
                        <div className="flex-grow overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
                            <ul>
                                {results.map((champion) => (
                                    <li
                                        key={champion.id}
                                        onClick={() => handleSelect(champion.id)}
                                        className="cursor-pointer px-4 py-3 hover:bg-gray-700 text-gray-200 flex items-center gap-4 border-b border-gray-700 last:border-0"
                                    >
                                        <img
                                            src={`https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/champion/${champion.image.full}`}
                                            alt={champion.name}
                                            className="w-12 h-12 rounded-full border border-gray-600"
                                        />
                                        <span className="text-lg font-semibold">{champion.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        query.length > 0 && (
                            <div className="text-center text-gray-400 mt-8">
                                <p>{t.search.noResults}</p>
                            </div>
                        )
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
