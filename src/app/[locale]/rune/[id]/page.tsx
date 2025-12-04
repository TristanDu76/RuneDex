import React from 'react';
import Image from 'next/image';
import { fetchRuneById, fetchRuneNeighbors } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import RuneNavigation from '@/components/runes/RuneNavigation';

interface RunePageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function RunePage({ params }: RunePageProps) {
    const { id, locale } = await params;
    const rune = await fetchRuneById(id, locale);
    const { prev, next } = await fetchRuneNeighbors(id, locale);

    if (!rune) {
        notFound();
    }

    // Nettoyage de la description
    const cleanDescription = (desc: string) => {
        if (!desc) return '';
        let cleaned = desc.replace(/<br>/g, '\n');
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned;
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white pb-20 pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Navigation */}
                <RuneNavigation prevRune={prev} nextRune={next} />

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    {/* Image Section */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-full h-full rounded-2xl border-2 border-blue-600/50 overflow-hidden shadow-2xl bg-gray-800">
                            {rune.image_url ? (
                                <Image
                                    src={rune.image_url}
                                    alt={rune.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                    🔮
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-500 text-xs font-bold uppercase tracking-widest mb-4">
                            {rune.type || 'Rune Tellurique'}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-200 via-blue-400 to-blue-600">
                            {rune.name}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                            <p className="whitespace-pre-line">
                                {cleanDescription(rune.description)}
                            </p>
                        </div>

                        {/* Owner Section */}
                        {rune.name.includes('Inspiration') ? (
                            <div className="mt-12 pt-8 border-t border-gray-800">
                                <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-widest text-sm">
                                    Statut actuel
                                </h3>
                                <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 border-dashed">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-900 text-2xl border-2 border-gray-700 text-gray-500">
                                        ?
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-300">
                                            Localisation Inconnue
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Recherchée par Ryze
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-12 pt-8 border-t border-gray-800">
                                <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-widest text-sm">
                                    Gardée par
                                </h3>
                                <Link
                                    href="/champion/Ryze"
                                    className="group flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:bg-gray-800"
                                >
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-500 transition-colors bg-gray-900">
                                        <Image
                                            src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Ryze.png"
                                            alt="Ryze"
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                            Ryze
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">
                                            Rune Mage
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}
