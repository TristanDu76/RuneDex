import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface ArtifactCardProps {
    artifact: any;
}

export default function ArtifactCard({ artifact }: ArtifactCardProps) {
    // Nettoyage de la description HTML
    const cleanDescription = (desc: string) => {
        if (!desc) return '';
        let cleaned = desc.replace(/<br>/g, '\n');
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned;
    };

    const linkHref = artifact.type === 'World Rune'
        ? `/rune/${artifact.id}`
        : `/artifact/${artifact.id}`;

    return (
        <Link
            href={linkHref}
            className="group relative flex flex-col items-center cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-lg border-2 border-yellow-900/50 group-hover:border-yellow-500 transition-colors shadow-lg overflow-hidden bg-gray-900">
                    {artifact.image_url ? (
                        <Image
                            src={artifact.image_url}
                            alt={artifact.name}
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            🔮
                        </div>
                    )}
                </div>
            </div>

            {/* Name */}
            <h2 className="text-sm sm:text-base font-bold text-gray-300 group-hover:text-yellow-400 transition-colors text-center leading-tight px-2">
                {artifact.name}
            </h2>

            {/* Type */}
            <p className="text-xs text-yellow-600/80 mt-1 text-center font-medium uppercase tracking-wider">
                {artifact.type || 'Artefact'}
            </p>

            {/* Tooltip Description */}
            <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-gray-900 border border-yellow-600/50 rounded-lg shadow-2xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden group-hover:block">
                <div className="text-sm font-bold text-yellow-400 mb-2">{artifact.name}</div>
                <div className="text-xs text-gray-300 leading-relaxed line-clamp-6">
                    {cleanDescription(artifact.description)}
                </div>
            </div>
        </Link>
    );
}
