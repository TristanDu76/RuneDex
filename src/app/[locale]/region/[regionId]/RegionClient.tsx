"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RegionClientProps {
    locale: string;
    champions: any[];
    lore: any[];
}

export default function RegionClient({ locale, champions, lore }: RegionClientProps) {
    const [activeTab, setActiveTab] = useState<'champions' | 'lore' | 'events'>('champions');

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-30">
            {/* Tab Navigation */}
            <div className="flex items-center justify-center gap-8 mb-16 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('champions')}
                    className={`text-2xl font-bold transition-all ${activeTab === 'champions'
                        ? 'text-white border-b-2 border-yellow-500 pb-2'
                        : 'text-gray-500 hover:text-gray-300 pb-2 border-b-2 border-transparent'
                        }`}
                >
                    Champions ({champions.length})
                </button>
                <button
                    onClick={() => setActiveTab('lore')}
                    className={`text-2xl font-bold transition-all ${activeTab === 'lore'
                        ? 'text-white border-b-2 border-yellow-500 pb-2'
                        : 'text-gray-500 hover:text-gray-300 pb-2 border-b-2 border-transparent'
                        }`}
                >
                    Lore ({lore.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`text-2xl font-bold transition-all ${activeTab === 'events'
                        ? 'text-white border-b-2 border-yellow-500 pb-2'
                        : 'text-gray-500 hover:text-gray-300 pb-2 border-b-2 border-transparent'
                        }`}
                >
                    Événements
                </button>
            </div>

            {/* TAB: CHAMPIONS */}
            {activeTab === 'champions' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {champions.map(champ => (
                        <Link
                            key={`champ-${champ.id}`}
                            href={`/${locale}/champion/${champ.id}`}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all hover:scale-105 hover:border-yellow-500/50"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <Image
                                    src={`https://ddragon.leagueoflegends.com/cdn/${champ.version || '15.23.1'}/img/champion/${champ.image?.full || champ.id + '.png'}`}
                                    alt={champ.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-bold text-lg text-yellow-500">{champ.name}</h3>
                                <p className="text-sm text-gray-400 capitalize">{champ.tags?.[0] || 'Inconnu'}</p>
                            </div>
                        </Link>
                    ))}

                    {champions.length === 0 && (
                        <div className="col-span-full text-center py-24 text-gray-500 text-lg">
                            Aucun champion connu trouvé pour cette région.
                        </div>
                    )}
                </div>
            )}

            {/* TAB: LORE */}
            {activeTab === 'lore' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {lore.map(personage => (
                        <Link
                            key={`lore-${personage.id || personage.name}`}
                            href={`/${locale}/lore/${personage.id || encodeURIComponent(personage.name)}`}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all hover:scale-105 hover:border-blue-500/50"
                        >
                            <div className="aspect-square relative overflow-hidden bg-transparent flex items-center justify-center">
                                {personage.image ? (
                                    <Image
                                        src={personage.image.url || personage.image}
                                        alt={personage.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-gray-600 text-4xl">?</div>
                                )}
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-bold text-lg text-blue-400">{personage.name}</h3>
                                {personage.status && (
                                    <p className="text-sm text-gray-400 capitalize">{personage.status}</p>
                                )}
                            </div>
                        </Link>
                    ))}

                    {lore.length === 0 && (
                        <div className="col-span-full text-center py-24 text-gray-500 text-lg">
                            Aucun personnage du Lore connu trouvé pour cette région.
                        </div>
                    )}
                </div>
            )}

            {/* TAB: EVENTS */}
            {activeTab === 'events' && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400 border border-dashed border-gray-700 rounded-2xl bg-gray-800/30">
                    <span className="text-6xl mb-4">⏳</span>
                    <h2 className="text-2xl font-bold text-white mb-2">En construction</h2>
                    <p>La frise chronologique des événements de la région arrivera bientôt.</p>
                </div>
            )}
        </div>
    );
}
