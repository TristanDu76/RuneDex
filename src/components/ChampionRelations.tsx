import React from 'react';
import { ChampionData } from '@/types/champion';

interface ChampionRelationsProps {
    championName: string;
    championDetails: ChampionData;
    allChampions: ChampionData[];
    t: any;
    locale: string;
    latestVersion: string;
}

export default function ChampionRelations({
    championName,
    championDetails,
    allChampions,
    t,
    locale,
    latestVersion
}: ChampionRelationsProps) {
    // Utilisation des relations stockées en base de données
    const relations = championDetails.related_champions || [];
    const apiRelated = championDetails.relatedChampions || [];

    let displayRelations: { champion: string; type: string; note?: string }[] = [];

    if (relations.length > 0) {
        displayRelations = [...relations];
    } else if (apiRelated.length > 0) {
        // Fallback: Convert API relations to generic 'related' type
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
            // On vérifie si le champion appartient à la faction (via la colonne factions de la DB)
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

    // On retire les relations de type 'faction' originales
    displayRelations = displayRelations.filter(r => r.type !== 'faction');

    if (displayRelations.length === 0) return null;

    // Couleurs et icônes par catégorie de type
    const getTypeStyle = (type: string) => {
        if (['sibling', 'parent', 'child', 'spouse', 'ancestor', 'descendant', 'adoptive-family', 'family'].includes(type)) {
            return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: '👨‍👩‍👧‍👦' };
        }
        if (['lover', 'ex-lover', 'unrequited-love'].includes(type)) {
            return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '💕' };
        }
        if (['friend', 'mentor', 'student', 'ally', 'comrade', 'faction-member'].includes(type)) {
            return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '🤝' };
        }
        if (['enemy', 'nemesis', 'betrayed', 'betrayer', 'victim', 'killer', 'hunts', 'hunted-by', 'corrupted', 'corrupted-by'].includes(type)) {
            return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '⚔️' };
        }
        if (['rival'].includes(type)) {
            return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🔥' };
        }
        if (type === 'related') {
            return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: '🔗' };
        }
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💔' };
    };

    // Fonction pour obtenir la région principale d'un champion
    const getRegion = (champName: string): string => {
        // 1. Chercher le champion dans la liste chargée depuis la DB
        const champ = allChampions.find(c => c.name === champName || c.id === champName);

        if (champ && champ.factions && champ.factions.length > 0) {
            return champ.factions[0];
        }

        // 2. Fallback pour les PNJ ou si pas de faction trouvée
        // (On garde la logique hardcodée pour les PNJ importants qui ne sont pas dans la table champions)
        if (['Silco', 'Vander', 'Zaahen'].includes(champName)) return 'zaun';
        if (['Ambessa', 'Général Du Couteau', 'Boram Darkwill'].includes(champName)) return 'noxus';
        if (['Isolde', 'Vilemaw', 'Maître Kindred'].includes(champName)) return 'shadow-isles';
        if (['Avarosa', 'Serylda'].includes(champName)) return 'freljord';
        if (['Kusho', 'Elder Souma', 'Yunara'].includes(champName)) return 'ionia';
        if (['Setaka', 'Myisha', 'Shadya'].includes(champName)) return 'shurima';
        if (['Durand', 'Tiana Crownguard', 'Jarvan III'].includes(champName)) return 'demacia';
        if (['Ashlesh', 'Tybaulk'].includes(champName)) return 'runeterra';

        return 'autre';
    };

    // Grouper par région
    const groupedRelations: Record<string, typeof displayRelations> = {};

    displayRelations.forEach(rel => {
        const region = getRegion(rel.champion);
        if (!groupedRelations[region]) {
            groupedRelations[region] = [];
        }
        groupedRelations[region].push(rel);
    });

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm mt-8">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t.champion.relatedChampions}
            </h2>

            <div className="space-y-8">
                {Object.entries(groupedRelations).map(([region, regionRelations]) => (
                    <div key={region} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700 pb-1 mb-3">
                            {/* Traduction de la région si possible, sinon formatage simple */}
                            {(t.factions as Record<string, string>)[region] || region.charAt(0).toUpperCase() + region.slice(1)}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {regionRelations.map((rel) => {
                                const relChamp = allChampions.find((c) => c.name === rel.champion);
                                const style = getTypeStyle(rel.type);

                                // PNJ ou Champion non trouvé dans l'API
                                if (!relChamp) {
                                    return (
                                        <div key={rel.champion} className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border} opacity-80`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 border-2 ${style.border} shrink-0`}>
                                                <span className="text-xs font-bold text-gray-500">?</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-sm font-medium ${style.text}`}>{rel.champion}</span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${style.bg} ${style.border} ${style.text} border`}>
                                                        <span>{style.icon}</span>
                                                        <span>{(t.relationTypes as Record<string, string>)[rel.type] || rel.type}</span>
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Personnage du lore</p>
                                                {rel.note && (
                                                    <p className="text-xs text-gray-400 mt-0.5 italic">&quot;{rel.note}&quot;</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                // Champion jouable - lien cliquable
                                return (
                                    <div key={rel.champion} className="flex items-start gap-3">
                                        <a
                                            href={`/champion/${relChamp.id}?lang=${locale}`}
                                            className={`flex items-center gap-3 hover:bg-gray-700/50 px-3 py-2 rounded-lg border transition-all group flex-1 ${style.bg} ${style.border}`}
                                        >
                                            <img
                                                src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${relChamp.image.full}`}
                                                alt={rel.champion}
                                                className={`w-10 h-10 rounded-full border-2 ${style.border} group-hover:scale-110 transition-transform shadow-sm`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-sm ${style.text} group-hover:text-white font-bold truncate`}>{rel.champion}</span>
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-semibold ${style.bg} ${style.border} ${style.text} border`}>
                                                        {style.icon} {(t.relationTypes as Record<string, string>)[rel.type] || rel.type}
                                                    </span>
                                                </div>
                                                {rel.note && (
                                                    <p className="text-xs text-gray-400 mt-1 italic whitespace-normal break-words">&quot;{rel.note}&quot;</p>
                                                )}
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
