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

    const linkHref = artifact.type === 'home.worldRunes'
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
                {artifact.type || 'home.artifacts'}
            </p>
        </Link>
    );
}
