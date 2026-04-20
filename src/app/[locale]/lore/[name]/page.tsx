import React from 'react';
import { fetchLoreCharacter, fetchAllChampionsLight, fetchLoreCharactersLight } from "@/lib/data";
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ChampionRelations from '@/components/champions/ChampionRelations';
import { ChampionData } from '@/types/champion';
import LoreNavigation from '@/components/lore/LoreNavigation';

interface LorePageProps {
    params: Promise<{
        name: string;
        locale: string;
    }>;
}

import { regionColors, getSpeciesColor, getGenderColor, getStatusColor } from '@/utils/colors';

// ... (imports)

export default async function LorePage({ params }: LorePageProps) {
    const { name, locale } = await params;
    // Decode the name from URL (e.g. "Kusho" or "Kusho%20Master")
    const decodedName = decodeURIComponent(name);

    const t = await getTranslations({ locale });
    const tWithHas = t as typeof t & { has?: (key: string) => boolean };

    const translateFallback = (keys: string | string[], fallback: string) => {
        const candidates = Array.isArray(keys) ? keys : [keys];

        for (const key of candidates) {
            if (tWithHas.has && !tWithHas.has(key)) {
                continue;
            }

            try {
                return tWithHas(key);
            } catch {
                // Keep fallback behavior if has() is unavailable or if key resolution fails
            }
        }

        return fallback;
    };

    const character = await fetchLoreCharacter(decodedName, locale);
    const allChampions = await fetchAllChampionsLight(locale);
    const loreCharacters = await fetchLoreCharactersLight();

    if (!character) {
        notFound();
    }

    const pickFirst = (value?: string | string[] | null): string => {
        if (Array.isArray(value)) return value[0] || '';
        return value || '';
    };

    const allFactions = Array.isArray(character.faction) ? character.faction : (character.faction ? [character.faction] : []);
    const speciesValue = pickFirst(character.species as string | string[] | null);
    const genderValue = pickFirst(character.gender as string | string[] | null);
    const statusValue = character.status ? character.status.toLowerCase() : null;
    const formatSpecies = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    const speciesI18nKey = speciesValue ? formatSpecies(speciesValue) : '';
    const genderI18nKey = genderValue.toLowerCase();

    // Sort lore characters alphabetically
    const sortedLore = loreCharacters.sort((a, b) => a.name.localeCompare(b.name));
    const currentIndex = sortedLore.findIndex(c => c.name === character.name);

    // Circular navigation
    const prevLore = currentIndex > 0 ? sortedLore[currentIndex - 1] : sortedLore[sortedLore.length - 1];
    const nextLore = currentIndex < sortedLore.length - 1 ? sortedLore[currentIndex + 1] : sortedLore[0];

    // Determine latest version from champions list
    const latestVersion = allChampions.length > 0 ? allChampions[0].version : '13.24.1';

    // Adapt LoreCharacter to ChampionData for the relations component
    // We only need related_champions and basic info
    const championDetailsAdapter: ChampionData = {
        id: character.id,
        key: '',
        name: character.name,
        title: 'Lore Character',

        tags: [],
        partype: '',

        version: latestVersion,
        image: { full: '', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
        related_champions: character.related_champions,
        factions: allFactions,
    };


    return (
        <main className="min-h-screen bg-transparent text-white pb-20 relative">
            <LoreNavigation
                prevLoreName={prevLore.id || prevLore.name}
                nextLoreName={nextLore.id || nextLore.name}
            />

            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-20">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="relative w-[600px] h-[320px] max-w-full mx-auto mb-8 rounded-3xl overflow-hidden border-2 border-hextech-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] group hover:shadow-[0_0_50px_rgba(0,229,255,0.4)] hover:border-hextech-cyan transition-all duration-500">
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

                    <h1 className="text-5xl mb-2 hex-title">{character.name}</h1>
                    <p className="text-xl text-hextech-gold font-light uppercase tracking-widest">{t('home.loreCharacters')}</p>
                </div>

                {/* Info Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {(() => {
                        const KNOWN_REGIONS = ['demacia', 'noxus', 'ionia', 'freljord', 'shurima', 'piltover', 'zaun', 'bilgewater', 'targon', 'ixtal', 'shadow-isles', 'bandle-city', 'void', 'runeterra', 'icathia', 'camavor', 'independent'];

                        let displayOrigin = character.origin_region;
                        let displayRegion = character.region ? [character.region] : [];
                        let displayFactions = allFactions;

                        // Éviter les doublons: si l'origine et la région actuelle sont les mêmes, on cache l'origine
                        if (displayOrigin && character.region && displayOrigin.toLowerCase() === character.region.toLowerCase()) {
                            displayOrigin = undefined;
                        }

                        // Fallback pour les anciens JSON sans origin_region / region explicites
                        if (!character.region && !character.origin_region) {
                            displayRegion = allFactions.filter(f => KNOWN_REGIONS.includes(f.toLowerCase()));
                            displayFactions = allFactions.filter(f => !KNOWN_REGIONS.includes(f.toLowerCase()));
                        }

                        // Éviter les doublons entres Factions et Régions affichées
                        displayFactions = displayFactions.filter(f => {
                            const fLow = f.toLowerCase();
                            const matchesRegion = displayRegion.some(r => r.toLowerCase() === fLow);
                            const matchesOrigin = displayOrigin && displayOrigin.toLowerCase() === fLow;
                            return !matchesRegion && !matchesOrigin;
                        });

                        return (
                            <>
                                {/* Région d'origine */}
                                {displayOrigin && (
                                    <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                                        <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.origin_region')}</span>
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[displayOrigin.toLowerCase()] || 'text-gray-300'}`}>
                                            {translateFallback(`factions.${displayOrigin.toLowerCase().replace(/\s+/g, '-')}`, displayOrigin)}
                                        </span>
                                    </div>
                                )}

                                {/* Région Actuelle */}
                                {displayRegion.length > 0 && (
                                    <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                                        <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.region')}</span>
                                        <div className="flex gap-2">
                                            {displayRegion.map(region => (
                                                <span key={region} className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[region.toLowerCase()] || 'text-gray-300'}`}>
                                                    {translateFallback(`factions.${region.toLowerCase().replace(/\s+/g, '-')}`, region)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Factions */}
                                {displayFactions.length > 0 && (
                                    <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                                        <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.faction')}</span>
                                        <div className="flex gap-2">
                                            {displayFactions.map(faction => (
                                                <span key={faction} className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[faction.toLowerCase()] || 'text-gray-300'}`}>
                                                    {translateFallback(`factions.${faction.toLowerCase().replace(/\s+/g, '-')}`, faction)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}

                    {/* Species */}
                    {speciesValue && (
                        <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                            <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.species')}</span>
                            <span className={`font-medium ${getSpeciesColor(speciesValue)}`}>
                                {translateFallback(`species.${speciesI18nKey}`, speciesValue)}
                            </span>
                        </div>
                    )}

                    {/* Gender */}
                    {genderValue && (
                        <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                            <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.gender')}</span>
                            <span className={`font-medium ${getGenderColor(genderValue)}`}>
                                {translateFallback([`gender.${genderI18nKey}`, `gender.${genderValue}`], genderValue)}
                            </span>
                        </div>
                    )}

                    {/* Status */}
                    {statusValue && (
                        <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                            <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.status')}</span>
                            <span className={`font-bold ${getStatusColor(statusValue)}`}>
                                {translateFallback(`status.${statusValue}`, statusValue)}
                            </span>
                        </div>
                    )}

                </div>

                {/* Description / Lore */}
                {character.description && (
                    <div className="hex-panel p-8 mb-12">
                        <h2 className="text-2xl font-bold text-hextech-gold mb-6 flex items-center gap-2 border-b border-hextech-gold/20 pb-4">
                            <svg className="w-6 h-6 text-hextech-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {t('champion.loreTitle')}
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
                    locale={locale}
                    latestVersion={latestVersion}
                />

            </div>
        </main>
    );
}
