'use client';

import { Link } from '@/i18n/routing';
import type { RegionShardEntry } from '@/types/map';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface RegionClientProps {
    champions: RegionShardEntry[];
    lore: RegionShardEntry[];
}

export default function RegionClient({ champions, lore }: RegionClientProps) {
    const t = useTranslations('regionDetail');
    const [activeTab, setActiveTab] = useState<'champions' | 'lore' | 'events'>('champions');

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

            {activeTab === 'champions' && (
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {champions.map((champion) => (
                        <Link
                            key={`champ-${champion.id}`}
                            href={`/champion/${champion.id}`}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 transition-all hover:scale-105 hover:border-yellow-500/50 hover:bg-gray-800"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={champion.thumbnail}
                                    alt={champion.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-4 text-center">
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
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {lore.map((character) => (
                        <Link
                            key={`lore-${character.id}`}
                            href={`/lore/${character.id}`}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-gray-800"
                        >
                            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-transparent">
                                <Image
                                    src={character.thumbnail}
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-4 text-center">
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
