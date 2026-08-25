'use client';

import { Link } from '@/i18n/routing';
import type { RegionShardEntry } from '@/types/map';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

interface RegionClientProps {
    champions: RegionShardEntry[];
    lore: RegionShardEntry[];
}

export default function RegionClient({ champions, lore }: RegionClientProps) {
    const t = useTranslations('regionDetail');
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<'champions' | 'lore' | 'events'>('champions');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const isEn = locale.startsWith('en');
    const entries = activeTab === 'champions' ? champions : lore;

    return (
        <div className="relative z-30 mx-auto max-w-7xl px-6 py-12">
            <div className="mb-16 flex items-center justify-center gap-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('champions')}
                    className={`border-b-2 pb-2 text-2xl font-bold transition-all ${activeTab === 'champions'
                        ? 'border-yellow-500 text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {t('champions')} ({champions.length})
                </button>
                <button
                    onClick={() => setActiveTab('lore')}
                    className={`border-b-2 pb-2 text-2xl font-bold transition-all ${activeTab === 'lore'
                        ? 'border-yellow-500 text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {t('lore')} ({lore.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`border-b-2 pb-2 text-2xl font-bold transition-all ${activeTab === 'events'
                        ? 'border-yellow-500 text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {t('events')}
                </button>
            </div>

            {(activeTab === 'champions' || activeTab === 'lore') && entries.length > 0 && (
                <div className="mb-6 flex justify-end gap-2" aria-label={isEn ? 'Display mode' : 'Mode d’affichage'}>
                    <button type="button" onClick={() => setView('grid')} className={`rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wider ${view === 'grid' ? 'border-hextech-cyan bg-hextech-cyan/15 text-hextech-cyan' : 'border-gray-700 text-gray-400 hover:text-white'}`}>▦ {isEn ? 'Grid' : 'Grille'}</button>
                    <button type="button" onClick={() => setView('list')} className={`rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wider ${view === 'list' ? 'border-hextech-cyan bg-hextech-cyan/15 text-hextech-cyan' : 'border-gray-700 text-gray-400 hover:text-white'}`}>☷ {isEn ? 'List' : 'Liste'}</button>
                </div>
            )}

            {activeTab === 'champions' && (
                <div className={view === 'grid' ? 'grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid grid-cols-1 gap-3 md:grid-cols-2'}>
                    {champions.map((champion) => (
                        <Link
                            key={`champ-${champion.id}`}
                            href={`/champion/${champion.id}`}
                            className={`group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 transition-all hover:border-yellow-500/50 hover:bg-gray-800 ${view === 'grid' ? 'hover:scale-105' : 'flex items-center gap-4 p-2'}`}
                        >
                            <div className={`relative overflow-hidden ${view === 'grid' ? 'aspect-square' : 'h-16 w-16 shrink-0 rounded-lg'}`}>
                                <Image
                                    src={champion.thumbnail}
                                    alt={champion.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className={`p-4 ${view === 'grid' ? 'text-center' : 'p-1 text-left'}`}>
                                <h3 className="text-lg font-bold text-yellow-500">{champion.name}</h3>
                            </div>
                        </Link>
                    ))}

                    {champions.length === 0 && (
                        <div className="col-span-full py-24 text-center text-lg text-gray-500">
                            {t('noChampions')}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'lore' && (
                <div className={view === 'grid' ? 'grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid grid-cols-1 gap-3 md:grid-cols-2'}>
                    {lore.map((character) => (
                        <Link
                            key={`lore-${character.id}`}
                            href={`/lore/${character.id}`}
                            className={`group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 transition-all hover:border-blue-500/50 hover:bg-gray-800 ${view === 'grid' ? 'hover:scale-105' : 'flex items-center gap-4 p-2'}`}
                        >
                            <div className={`relative flex items-center justify-center overflow-hidden bg-transparent ${view === 'grid' ? 'aspect-square' : 'h-16 w-16 shrink-0 rounded-lg'}`}>
                                <Image
                                    src={character.thumbnail}
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className={`p-4 ${view === 'grid' ? 'text-center' : 'p-1 text-left'}`}>
                                <h3 className="text-lg font-bold text-blue-400">{character.name}</h3>
                            </div>
                        </Link>
                    ))}

                    {lore.length === 0 && (
                        <div className="col-span-full py-24 text-center text-lg text-gray-500">
                            {t('noLore')}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'events' && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-gray-800/30 py-24 text-gray-400">
                    <span className="mb-4 text-6xl">⏳</span>
                    <h2 className="mb-2 text-2xl font-bold text-white">{t('underConstruction')}</h2>
                    <p>{t('eventsComingSoon')}</p>
                </div>
            )}
        </div>
    );
}
