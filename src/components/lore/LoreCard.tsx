import React from 'react';
import { Link } from '@/i18n/routing';
import { LoreCharacter } from '@/types/champion';

interface LoreCardProps {
    character: LoreCharacter;
}

export default function LoreCard({ character }: LoreCardProps) {
    return (
        <Link
            href={`/lore/${character.name}`}
            className="group relative flex flex-col items-center"
        >
            {/* Image Container with Hover Effect */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700 group-hover:border-yellow-500 transition-colors shadow-lg overflow-hidden bg-gray-800">
                    {character.image ? (
                        <img
                            src={character.image}
                            alt={character.name}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                            {character.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Faction Icon/Border could go here */}
            </div>

            {/* Name */}
            <h2 className="text-sm sm:text-base font-bold text-gray-300 group-hover:text-yellow-400 transition-colors text-center leading-tight px-2">
                {character.name}
            </h2>

            {/* Subtitle (Species/Faction) */}
            <p className="text-xs text-gray-500 mt-1 text-center truncate max-w-full px-2">
                {character.species || character.faction || 'Personnage du Lore'}
            </p>
        </Link>
    );
}
