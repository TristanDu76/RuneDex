import React from 'react';
import { fetchLoreCharacter, fetchAllChampions, fetchLoreCharacters } from "@/lib/data";
import { getTranslation } from '@/lib/translations';
import { notFound } from 'next/navigation';
import ChampionRelations from '@/components/champions/ChampionRelations';
import { ChampionData } from '@/types/champion';

interface LorePageProps {
    params: Promise<{
        name: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LorePage({ params, searchParams }: LorePageProps) {
    const { name } = await params;
    // Decode the name from URL (e.g. "Kusho" or "Kusho%20Master")
    const decodedName = decodeURIComponent(name);

    const { lang } = await searchParams;
    const locale = (lang as string) || 'fr_FR';
    const t = getTranslation(locale);

    const character = await fetchLoreCharacter(decodedName, locale);
    const allChampions = await fetchAllChampions(locale);
    const loreCharacters = await fetchLoreCharacters();

    if (!character) {
        notFound();
    }

    // Determine latest version from champions list
    const latestVersion = allChampions.length > 0 ? allChampions[0].version : '13.24.1';

    // Adapt LoreCharacter to ChampionData for the relations component
    // We only need related_champions and basic info
    const championDetailsAdapter: ChampionData = {
        id: character.id,
        key: '',
        name: character.name,
        title: 'Lore Character',
        blurb: '',
        tags: [],
        partype: '',
        info: { attack: 0, defense: 0, magic: 0, difficulty: 0 },
        version: latestVersion,
        image: { full: '', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
        related_champions: character.related_champions,
        factions: character.faction ? [character.faction] : [],
    };

    // Helper pour les couleurs de faction (réutilisé de champion page)
    const regionColors: Record<string, string> = {
        demacia: 'text-blue-300 border-blue-500/30 bg-blue-900/20',
        noxus: 'text-red-400 border-red-500/30 bg-red-900/20',
        ionia: 'text-pink-300 border-pink-500/30 bg-pink-900/20',
        freljord: 'text-cyan-300 border-cyan-500/30 bg-cyan-900/20',
        shurima: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20',
        piltover: 'text-amber-300 border-amber-500/30 bg-amber-900/20',
        zaun: 'text-green-400 border-green-500/30 bg-green-900/20',
        bilgewater: 'text-orange-400 border-orange-500/30 bg-orange-900/20',
        targon: 'text-purple-300 border-purple-500/30 bg-purple-900/20',
        ixtal: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20',
        'shadow-isles': 'text-teal-300 border-teal-500/30 bg-teal-900/20',
        'bandle-city': 'text-lime-300 border-lime-500/30 bg-lime-900/20',
        void: 'text-violet-400 border-violet-500/30 bg-violet-900/20',
        runeterra: 'text-gray-300 border-gray-500/30 bg-gray-900/20',
        darkin: 'text-red-500 border-red-600/30 bg-red-950/40',
    };

    // Helper pour les couleurs d'espèces
    const getSpeciesColor = (s: string) => {
        const species = s.toLowerCase();
        if (species.includes('human')) return 'text-amber-200';
        if (species.includes('yordle')) return 'text-orange-300';
        if (species.includes('vastaya')) return 'text-pink-300';
        if (species.includes('void')) return 'text-violet-400';
        if (species.includes('undead') || species.includes('revenant') || species.includes('wraith')) return 'text-teal-400';
        if (species.includes('darkin')) return 'text-red-500';
        if (species.includes('god') || species.includes('spirit') || species.includes('celestial') || species.includes('aspect')) return 'text-cyan-300';
        if (species.includes('golem') || species.includes('construct') || species.includes('cyborg')) return 'text-gray-400';
        if (species.includes('dragon')) return 'text-red-400';
        if (species.includes('demon')) return 'text-red-600';
        return 'text-gray-200';
    };

    const getGenderColor = (g: string) => {
        const gender = g.toLowerCase();
        if (gender === 'male') return 'text-blue-300';
        if (gender === 'female') return 'text-pink-300';
        return 'text-purple-300';
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white pb-20 relative">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-20">

                {/* Header */}
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="relative w-72 h-72 mx-auto mb-8 rounded-3xl overflow-hidden border-4 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] group hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500">
                        {character.image ? (
                            <img
                                src={character.image}
                                alt={character.name}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl text-gray-600 font-bold">
                                {character.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">{character.name}</h1>
                    <p className="text-xl text-yellow-500 font-light uppercase tracking-widest">Personnage du Lore</p>
                </div>

                {/* Info Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {/* Faction */}
                    {character.faction && (
                        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                            <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t.champion.region}</span>
                            <span className={`font-bold ${regionColors[character.faction.toLowerCase()] || 'text-gray-300'}`}>
                                {(t.factions as any)[character.faction] || character.faction}
                            </span>
                        </div>
                    )}

                    {/* Species */}
                    {character.species && (
                        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                            <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t.champion.species}</span>
                            <span className={`font-medium ${getSpeciesColor(character.species)}`}>
                                {(t.species as any)[character.species] || character.species}
                            </span>
                        </div>
                    )}

                    {/* Gender */}
                    {character.gender && (
                        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                            <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t.champion.gender}</span>
                            <span className={`font-medium ${getGenderColor(character.gender)}`}>
                                {(t.gender as any)[character.gender] || character.gender}
                            </span>
                        </div>
                    )}
                </div>

                {/* Description / Lore */}
                {character.description && (
                    <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm mb-12">
                        <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {t.champion.loreTitle}
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 leading-relaxed text-lg italic">
                                &quot;{character.description}&quot;
                            </p>
                        </div>
                    </div>
                )}

                {/* Relations */}
                <ChampionRelations
                    championName={character.name}
                    championDetails={championDetailsAdapter}
                    allChampions={allChampions}
                    loreCharacters={loreCharacters}
                    t={t}
                    locale={locale}
                    latestVersion={latestVersion}
                />

            </div>
        </main>
    );
}
