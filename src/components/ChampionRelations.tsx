import React from 'react';
import { championRelations } from '@/lib/championRelations';
import { getChampionTags } from '@/lib/championTags';

interface ChampionRelationsProps {
    championName: string;
    championDetails: any;
    allChampions: any[];
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
    const relations = championRelations[championName] || [];
    const apiRelated = championDetails.relatedChampions || [];

    // Combine logic:
    // If we have manual relations, use them.
    // If NOT, convert API relations to a compatible format and use them.

    let displayRelations: { champion: string; type: string; note?: string }[] = [];

    if (relations.length > 0) {
        displayRelations = [...relations];
    } else if (apiRelated.length > 0) {
        // Fallback: Convert API relations to generic 'related' type
        displayRelations = apiRelated.map((rel: any) => ({
            champion: rel.name,
            type: 'related',
            note: undefined
        }));
    }

    // Expansion des relations de type 'faction'
    // Si une relation est de type 'faction', on ajoute tous les champions de cette faction
    const factionRelations = displayRelations.filter(r => r.type === 'faction');
    factionRelations.forEach(rel => {
        const targetFaction = rel.champion.toLowerCase();
        const factionMembers = allChampions.filter(c => {
            const tags = getChampionTags(c.name);
            // On vérifie si le tag correspond à la faction demandée
            return tags.includes(targetFaction) && c.name !== championName;
        });

        factionMembers.forEach(member => {
            // On ajoute seulement si le champion n'est pas déjà dans la liste
            if (!displayRelations.some(r => r.champion === member.name)) {
                displayRelations.push({
                    champion: member.name,
                    type: 'faction-member',
                    note: undefined
                });
            }
        });
    });

    // On retire les relations de type 'faction' originales pour ne garder que les membres
    displayRelations = displayRelations.filter(r => r.type !== 'faction');

    if (displayRelations.length === 0) return null;

    // Couleurs et icônes par catégorie de type
    const getTypeStyle = (type: string) => {
        // Famille
        if (['sibling', 'parent', 'child', 'spouse', 'ancestor', 'descendant', 'adoptive-family', 'family'].includes(type)) {
            return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: '👨‍👩‍👧‍👦' };
        }
        // Romance
        if (['lover', 'ex-lover', 'unrequited-love'].includes(type)) {
            return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '💕' };
        }
        // Amitié & Alliance
        if (['friend', 'mentor', 'student', 'ally', 'comrade', 'faction-member'].includes(type)) {
            return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '🤝' };
        }
        // Hostilité
        if (['enemy', 'nemesis', 'betrayed', 'betrayer', 'victim', 'killer', 'hunts'].includes(type)) {
            return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '⚔️' };
        }
        // Rivalité
        if (['rival'].includes(type)) {
            return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🔥' };
        }
        // Autre / API Fallback
        if (type === 'related') {
            return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: '🔗' };
        }
        // Complexe & Autres
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💔' };
    };

    // Fonction pour obtenir la région principale d'un champion
    const getRegion = (champName: string): string => {
        const tags = getChampionTags(champName);
        // Liste des régions connues (basée sur championTags.ts)
        const regions = [
            'darkin', // Priorité pour les Darkin
            'demacia', 'noxus', 'ionia', 'freljord', 'shurima',
            'piltover', 'zaun', 'bilgewater', 'targon', 'ixtal',
            'shadow-isles', 'bandle-city', 'void', 'runeterra'
        ];

        // Chercher la première région trouvée dans les tags
        const foundRegion = tags.find(tag => regions.includes(tag));

        // Cas spéciaux ou PNJ si pas de tag trouvé
        if (!foundRegion) {
            // Essayer de déduire pour certains PNJ connus si pas dans tags
            if (['Silco', 'Vander'].includes(champName)) return 'zaun';
            if (['Ambessa', 'Général Du Couteau', 'Boram Darkwill'].includes(champName)) return 'noxus';
            if (['Isolde'].includes(champName)) return 'shadow-isles';
            if (['Avarosa', 'Serylda'].includes(champName)) return 'freljord';
            if (['Kusho', 'Elder Souma', 'Yunara'].includes(champName)) return 'ionia';
            if (['Setaka', 'Myisha', 'Shadya'].includes(champName)) return 'shurima';
            if (['Durand', 'Tiana Crownguard', 'Jarvan III'].includes(champName)) return 'demacia';
            return 'autre';
        }
        return foundRegion;
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
                            {(t.factions as any)[region] || region.charAt(0).toUpperCase() + region.slice(1)}
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
                                                        <span>{(t.relationTypes as any)[rel.type] || rel.type}</span>
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Personnage du lore</p>
                                                {rel.note && (
                                                    <p className="text-xs text-gray-400 mt-0.5 italic">"{rel.note}"</p>
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
                                                        {style.icon} {(t.relationTypes as any)[rel.type] || rel.type}
                                                    </span>
                                                </div>
                                                {rel.note && (
                                                    <p className="text-xs text-gray-400 mt-1 italic whitespace-normal break-words">"{rel.note}"</p>
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
