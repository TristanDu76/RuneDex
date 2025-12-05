'use client';

import React, { useState } from 'react';
import { ChampionSpell, ChampionPassive } from '@/types/champion';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SpellListProps {
    spells: ChampionSpell[];
    passive: ChampionPassive;
    version: string;
    partype: string;
}

export default function SpellList({ spells, passive, version, partype }: SpellListProps) {
    const t = useTranslations();
    const [activeIndex, setActiveIndex] = useState(0);

    const getSpellImage = (imageId: string) =>
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${imageId}`;

    const getPassiveImage = (imageId: string) =>
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${imageId}`;

    // Combine passive and spells into one array for the carousel
    const allAbilities = [
        {
            type: 'passive',
            data: passive,
            key: 'P',
            name: passive.name,
            description: passive.description,
            image: getPassiveImage(passive.image.full),
        },
        ...spells.map((spell, index) => ({
            type: 'spell',
            data: spell,
            key: t(['keyboard.inputQ', 'keyboard.inputW', 'keyboard.inputE', 'keyboard.inputR'][index]),
            name: spell.name,
            description: spell.description,
            image: getSpellImage(spell.image.full),
        }))
    ];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? allAbilities.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === allAbilities.length - 1 ? 0 : prev + 1));
    };

    const currentAbility = allAbilities[activeIndex];

    return (
        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 sticky top-8">
            <h2 className="text-lg font-bold text-gray-200 mb-3 border-b border-gray-700 pb-2 flex justify-between items-center">
                <span>{t('champion.spellsTitle')}</span>
            </h2>

            {/* Carousel Navigation */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-3">
                    {allAbilities.map((ability, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`relative group transition-all duration-300 ${activeIndex === index ? 'scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                        >
                            <img
                                src={ability.image}
                                alt={ability.name}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 ${activeIndex === index ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'border-gray-600'}`}
                            />
                            <span className="absolute -bottom-1.5 -right-1.5 bg-gray-900 text-yellow-500 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-700">
                                {ability.key}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="p-1.5 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Active Ability Details */}
            <div className="min-h-[50px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-yellow-500">{currentAbility.name}</h3>
                            <span className="text-xs text-gray-500 font-mono">[{currentAbility.key}]</span>
                        </div>


                        <div
                            className="text-gray-300 leading-relaxed text-sm"
                            dangerouslySetInnerHTML={{ __html: currentAbility.description }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
