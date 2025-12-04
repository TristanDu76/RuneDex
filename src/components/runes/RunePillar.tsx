import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface RunePillarProps {
    rune: any;
}

// Mapping des couleurs et styles par Rune
const RUNE_STYLES: Record<string, { color: string; gradient: string; shadow: string }> = {
    'Rune de Précision': {
        color: '#C8AA6E',
        gradient: 'from-[#C8AA6E]/20 via-[#C8AA6E]/5 to-transparent',
        shadow: 'hover:shadow-[#C8AA6E]/50'
    },
    'Rune of Precision': {
        color: '#C8AA6E',
        gradient: 'from-[#C8AA6E]/20 via-[#C8AA6E]/5 to-transparent',
        shadow: 'hover:shadow-[#C8AA6E]/50'
    },
    'Rune de Domination': {
        color: '#DC4C64',
        gradient: 'from-[#DC4C64]/20 via-[#DC4C64]/5 to-transparent',
        shadow: 'hover:shadow-[#DC4C64]/50'
    },
    'Rune of Domination': {
        color: '#DC4C64',
        gradient: 'from-[#DC4C64]/20 via-[#DC4C64]/5 to-transparent',
        shadow: 'hover:shadow-[#DC4C64]/50'
    },
    'Rune de Sorcellerie': {
        color: '#6C75F5',
        gradient: 'from-[#6C75F5]/20 via-[#6C75F5]/5 to-transparent',
        shadow: 'hover:shadow-[#6C75F5]/50'
    },
    'Rune of Sorcery': {
        color: '#6C75F5',
        gradient: 'from-[#6C75F5]/20 via-[#6C75F5]/5 to-transparent',
        shadow: 'hover:shadow-[#6C75F5]/50'
    },
    'Rune de Volonté': {
        color: '#A1D586',
        gradient: 'from-[#A1D586]/20 via-[#A1D586]/5 to-transparent',
        shadow: 'hover:shadow-[#A1D586]/50'
    },
    'Rune of Resolve': {
        color: '#A1D586',
        gradient: 'from-[#A1D586]/20 via-[#A1D586]/5 to-transparent',
        shadow: 'hover:shadow-[#A1D586]/50'
    },
    'Rune d\'Inspiration': {
        color: '#49AAB9',
        gradient: 'from-[#49AAB9]/20 via-[#49AAB9]/5 to-transparent',
        shadow: 'hover:shadow-[#49AAB9]/50'
    },
    'Rune of Inspiration': {
        color: '#49AAB9',
        gradient: 'from-[#49AAB9]/20 via-[#49AAB9]/5 to-transparent',
        shadow: 'hover:shadow-[#49AAB9]/50'
    },
};

export default function RunePillar({ rune }: RunePillarProps) {
    const style = RUNE_STYLES[rune.name] || {
        color: '#9CA3AF',
        gradient: 'from-gray-500/20 via-gray-500/5 to-transparent',
        shadow: 'hover:shadow-gray-500/50'
    };

    // Nettoyer le nom pour l'affichage (enlever "Rune de " ou "Rune of ")
    const displayName = rune.name.replace(/Rune (de |d'|of )/i, '').toUpperCase();

    return (
        <Link
            href={`/rune/${rune.id}`}
            className={`group relative flex flex-col items-center justify-end h-[500px] w-full overflow-hidden border-x border-gray-800/50 bg-gray-900/80 transition-all duration-500 ${style.shadow} hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-linear-to-b ${style.gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />

            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/80 to-transparent z-10" />

            {/* Rune Image (Icon) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {rune.image_url ? (
                    <Image
                        src={rune.image_url}
                        alt={rune.name}
                        fill
                        className="object-contain"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🔮</div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="relative z-20 pb-12 text-center w-full bg-linear-to-t from-black via-black/80 to-transparent pt-20">
                <h2
                    className="text-xl font-bold tracking-[0.2em] transition-colors duration-300"
                    style={{ color: style.color }}
                >
                    {displayName}
                </h2>

                {/* Decorative Line */}
                <div
                    className="w-1 h-8 mx-auto mt-4 rounded-full opacity-50 group-hover:h-12 group-hover:opacity-100 transition-all duration-300"
                    style={{ backgroundColor: style.color }}
                />
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 transition-colors pointer-events-none" />
        </Link>
    );
}
