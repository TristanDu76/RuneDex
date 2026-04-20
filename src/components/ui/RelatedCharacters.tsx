'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import manifestData from '@/data/manifest.json';

interface RelatedCharactersProps {
    relatedIds: string[];
}

export function RelatedCharacters({ relatedIds }: RelatedCharactersProps) {
    // Gracefully filter out any ids that don't exist in the current manifest
    const relatedChars = relatedIds
        .map((id) => manifestData.characters[id as keyof typeof manifestData.characters])
        .filter(Boolean);

    if (relatedChars.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-gold-400 font-serif">
                Personnages Liés
            </h3>

            <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
            >
                {relatedChars.map((char) => (
                    <Link
                        href={char.type === 'champion' ? `/champions/${char.id}` : `/lore/${char.id}`}
                        key={char.id}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            /* 
                              The Analyst AI idea: "Hextech Shimmer" at hover implicitly 
                              or just a sleek UI card masking a gradient.
                            */
                            className="relative group overflow-hidden rounded-lg border border-yellow-500/20 bg-black/40 shadow-lg shadow-black/50 cursor-pointer w-20 h-20 transition-all duration-300 hover:border-yellow-400/50"
                        >
                            <img
                                src={char.thumbnail}
                                alt={char.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Dark overlay that fades in purely on hover showing the name */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 pb-1">
                                <span className="text-[10px] text-white font-bold tracking-wider truncate w-full text-center drop-shadow-md">
                                    {char.name.toUpperCase()}
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
