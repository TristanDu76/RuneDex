'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { LoreCharacterLight } from '@/types/champion';

interface LoreCardProps {
    character: LoreCharacterLight;
}

export default function LoreCard({ character }: LoreCardProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <Link
            href={`/lore/${character.id || character.name}`}
            className="group relative flex flex-col items-center"
        >
            {/* Image Container avec hover */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700 group-hover:border-yellow-500 transition-colors shadow-lg overflow-hidden bg-gray-800">

                    {/* Skeleton shimmer */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                        aria-hidden="true"
                    >
                        <div className="w-full h-full bg-gray-800 rounded-full" />
                        <div className="absolute inset-0 rounded-full -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />
                    </div>

                    {character.image ? (
                        <Image
                            src={character.image}
                            alt={character.name}
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className={`object-cover transform transition-all duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                            {character.name.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            {/* Nom */}
            <h2 className="text-sm sm:text-base font-bold text-gray-300 group-hover:text-yellow-400 transition-colors text-center leading-tight px-2">
                {character.name}
            </h2>

            {/* Sous-titre */}
            <p className="text-xs text-gray-500 mt-1 text-center truncate max-w-full px-2">
                {(Array.isArray(character.species) ? character.species[0] : character.species)
                    || (Array.isArray(character.faction) ? character.faction[0] : character.faction)
                    || 'Personnage du Lore'}
            </p>
        </Link>
    );
}
