import React from 'react';
import { ChampionSpell, ChampionPassive } from '@/types/champion';
import { getTranslation } from '@/lib/translations';

interface SpellListProps {
    spells: ChampionSpell[];
    passive: ChampionPassive;
    version: string;
    lang?: string;
}

export default function SpellList({ spells, passive, version, lang = 'fr_FR' }: SpellListProps) {
    const t = getTranslation(lang);

    const getSpellImage = (imageId: string) =>
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${imageId}`;

    const getPassiveImage = (imageId: string) =>
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${imageId}`;

    return (
        <div className="space-y-8">
            {/* Passive */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                    {t.champion.passive}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                        <img
                            src={getPassiveImage(passive.image.full)}
                            alt={passive.name}
                            className="w-16 h-16 rounded border-2 border-yellow-500/50"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-200 mb-1">{passive.name}</h4>
                        <div
                            className="text-gray-400 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: passive.description }}
                        />
                    </div>
                </div>
            </div>

            {/* Spells */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-yellow-500 mb-4 border-b border-gray-700 pb-2">
                    {t.champion.spellsTitle}
                </h3>

                {spells.map((spell, index) => {
                    const keys = ['Q', 'W', 'E', 'R'];
                    return (
                        <div key={spell.id} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-shrink-0 relative">
                                    <img
                                        src={getSpellImage(spell.image.full)}
                                        alt={spell.name}
                                        className="w-16 h-16 rounded border border-gray-600"
                                    />
                                    <span className="absolute -bottom-3 -right-3 bg-gray-900 text-yellow-500 w-8 h-8 flex items-center justify-center rounded-full border border-yellow-600 font-bold shadow-sm">
                                        {keys[index]}
                                    </span>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-200 text-lg">{spell.name}</h4>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3 font-mono">
                                        {spell.cooldownBurn && (
                                            <span className="bg-gray-900/50 px-2 py-1 rounded">
                                                {t.champion.cooldown} <span className="text-gray-300">{spell.cooldownBurn}s</span>
                                            </span>
                                        )}
                                        {spell.costBurn && spell.costBurn !== "0" && (
                                            <span className="bg-gray-900/50 px-2 py-1 rounded">
                                                {t.champion.cost} <span className="text-gray-300">{spell.costBurn}</span>
                                            </span>
                                        )}
                                        {spell.rangeBurn && spell.rangeBurn !== "0" && (
                                            <span className="bg-gray-900/50 px-2 py-1 rounded">
                                                {t.champion.range} <span className="text-gray-300">{spell.rangeBurn}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="text-gray-400 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: spell.description }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
