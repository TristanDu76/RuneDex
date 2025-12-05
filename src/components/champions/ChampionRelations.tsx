'use client';

import React, { useRef } from 'react';
import { ChampionData, LoreCharacter } from '@/types/champion';
import { getTypeStyle } from '@/utils/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChampionRelationsProps {
    championName: string;
    championDetails: ChampionData;
    allChampions: ChampionData[];
    loreCharacters: LoreCharacter[];
    locale: string;
    latestVersion: string;
}

const RelationCard = ({ rel, allChampions, loreCharacters, t, locale, latestVersion, className = "" }: any) => {
    const relChamp = allChampions.find((c: any) => c.name === rel.champion);
    const style = getTypeStyle(rel.type);
    const cardClasses = `flex-shrink-0 snap-start flex flex-col gap-3 p-4 rounded-xl border ${style.bg} ${style.border} hover:bg-gray-700/50 transition-all group ${className || 'w-full sm:w-64'}`;

    // PNJ ou Champion non trouvé dans l'API
    if (!relChamp) {
        const loreChar = loreCharacters.find((c: any) => c.name === rel.champion);

        return (
            <a
                href={`/${locale}/lore/${rel.champion}`}
                className={`${cardClasses} opacity-90 hover:opacity-100`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 border-2 ${style.border} shrink-0 overflow-hidden`}>
                        {loreChar && loreChar.image ? (
                            <img src={loreChar.image} alt={loreChar.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-gray-500">?</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <span className={`block text-sm font-bold ${style.text} truncate`}>{rel.champion}</span>
                        <span className="text-xs text-gray-400">{t('home.loreCharacters')}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {rel.note && (
                        <p className="text-xs text-gray-400 italic line-clamp-2">
                            &quot;{typeof rel.note === 'object' && rel.note !== null ? (rel.note as any)[locale === 'fr' ? 'fr' : 'en'] || (rel.note as any)['en'] : rel.note}&quot;
                        </p>
                    )}
                </div>
            </a>
        );
    }

    // Champion jouable
    return (
        <a
            href={`/${locale}/champion/${relChamp.id}`}
            className={cardClasses}
        >
            <div className="flex items-center gap-3">
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${relChamp.image.full}`}
                    alt={rel.champion}
                    className={`w-12 h-12 rounded-full border-2 ${style.border} shadow-sm`}
                />
                <div className="min-w-0">
                    <span className={`block text-sm font-bold ${style.text} truncate`}>{rel.champion}</span>
                    <span className="text-xs text-gray-400">{t('home.champions')}</span>
                </div>
            </div>

            <div className="mt-auto">
                {rel.note && (
                    <p className="text-xs text-gray-400 italic line-clamp-2">
                        &quot;{typeof rel.note === 'object' && rel.note !== null ? (rel.note as any)[locale === 'fr' ? 'fr' : 'en'] || (rel.note as any)['en'] : rel.note}&quot;
                    </p>
                )}
            </div>
        </a>
    );
};

const RelationGroup = ({ title, relations, allChampions, loreCharacters, t, locale, latestVersion }: any) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700 pb-1 mb-3 flex items-center gap-2">
                {title}
            </h3>

            <div className="flex items-center gap-2">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="p-2 rounded-full bg-gray-800 border border-gray-700 text-yellow-500 hover:bg-gray-700 transition-colors shrink-0"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x flex-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {relations.map((rel: any) => (
                        <RelationCard
                            key={rel.champion}
                            rel={rel}
                            allChampions={allChampions}
                            loreCharacters={loreCharacters}
                            t={t}
                            locale={locale}
                            latestVersion={latestVersion}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="p-2 rounded-full bg-gray-800 border border-gray-700 text-yellow-500 hover:bg-gray-700 transition-colors shrink-0"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default function ChampionRelations({
    championName,
    championDetails,
    allChampions,
    loreCharacters,
    locale,
    latestVersion
}: ChampionRelationsProps) {
    const t = useTranslations();
    // Utilisation des relations stockées en base de données
    const relations = championDetails.related_champions || [];
    const apiRelated = (championDetails.relatedChampions || []) as { name: string; slug: string; image?: string }[];

    let displayRelations: { champion: string; type: string; note?: string }[] = [];

    if (relations.length > 0) {
        displayRelations = [...relations];
    } else if (apiRelated.length > 0) {
        // Fallback
        displayRelations = apiRelated.map((rel: { name: string; slug: string; image?: string }) => ({
            champion: rel.name,
            type: 'related',
            note: undefined
        }));
    }

    // Expansion des relations de type 'faction'
    const factionRelations = displayRelations.filter(r => r.type === 'faction');
    factionRelations.forEach(rel => {
        const targetFaction = rel.champion.toLowerCase();
        const factionMembers = allChampions.filter(c => {
            return c.factions?.includes(targetFaction) && c.name !== championName;
        });

        factionMembers.forEach(member => {
            if (!displayRelations.some(r => r.champion === member.name)) {
                displayRelations.push({
                    champion: member.name,
                    type: 'faction-member',
                    note: undefined
                });
            }
        });
    });

    displayRelations = displayRelations.filter(r => r.type !== 'faction');

    if (displayRelations.length === 0) return null;

    // Grouper par type de relation
    const groupedRelations: Record<string, typeof displayRelations> = {};

    displayRelations.forEach(rel => {
        const type = rel.type;
        if (!groupedRelations[type]) {
            groupedRelations[type] = [];
        }
        groupedRelations[type].push(rel);
    });

    const priorityOrder = [
        'family', 'brother', 'sister', 'father', 'mother', 'son', 'daughter',
        'ally', 'friend', 'mentor', 'student',
        'rival', 'enemy', 'nemesis',
        'related'
    ];

    const sortedTypes = Object.keys(groupedRelations).sort((a, b) => {
        const indexA = priorityOrder.indexOf(a);
        const indexB = priorityOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    const SPARSE_THRESHOLD = 3;
    const denseTypes = sortedTypes.filter(type => groupedRelations[type].length > SPARSE_THRESHOLD);
    const sparseTypes = sortedTypes.filter(type => groupedRelations[type].length <= SPARSE_THRESHOLD);

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm mt-8">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('champion.relatedChampions')}
            </h2>

            <div className="space-y-12">
                {/* Dense Categories (Carousel) */}
                {denseTypes.map((type) => (
                    <RelationGroup
                        key={type}
                        title={
                            <>
                                <span className="text-yellow-500">{getTypeStyle(type).icon}</span>
                                {t(`relationTypes.${type}`) || type}
                            </>
                        }
                        relations={groupedRelations[type]}
                        allChampions={allChampions}
                        loreCharacters={loreCharacters}
                        t={t}
                        locale={locale}
                        latestVersion={latestVersion}
                    />
                ))}

                {/* Sparse Categories (Grid) */}
                {sparseTypes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sparseTypes.map((type) => (
                            <div key={type} className="flex flex-col gap-3">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-1 flex items-center gap-2">
                                    <span className="text-yellow-500">{getTypeStyle(type).icon}</span>
                                    {t(`relationTypes.${type}`) || type}
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {groupedRelations[type].map((rel) => (
                                        <RelationCard
                                            key={rel.champion}
                                            rel={rel}
                                            allChampions={allChampions}
                                            loreCharacters={loreCharacters}
                                            t={t}
                                            locale={locale}
                                            latestVersion={latestVersion}
                                            className="w-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
