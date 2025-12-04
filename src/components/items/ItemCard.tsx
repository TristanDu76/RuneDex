import React from 'react';
import Image from 'next/image';

interface ItemCardProps {
    item: any;
    version: string;
}

export default function ItemCard({ item, version }: ItemCardProps) {
    // Nettoyage de la description (Riot utilise des balises HTML spéciales)
    const cleanDescription = (desc: string) => {
        if (!desc) return '';
        // Remplace les balises <br> par des sauts de ligne
        let cleaned = desc.replace(/<br>/g, '\n');
        // Supprime les balises <attention> (souvent utilisées pour les passifs uniques)
        // On pourrait aussi les styliser différemment
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned;
    };

    return (
        <div className="group relative bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-700/50 transition-all hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] flex flex-col items-center gap-2 cursor-pointer">

            {/* Image */}
            <div className="relative w-12 h-12 rounded border border-gray-600 group-hover:border-yellow-500 transition-colors overflow-hidden">
                <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                />
            </div>

            {/* Nom */}
            <h3 className="text-xs font-bold text-gray-300 text-center group-hover:text-yellow-400 line-clamp-2 h-8 flex items-center justify-center">
                {item.name}
            </h3>

            {/* Prix */}
            <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium bg-yellow-900/10 px-2 py-0.5 rounded border border-yellow-900/20">
                <span>{item.gold_total}</span>
                <span className="text-[10px]">G</span>
            </div>

            {/* Tooltip (Affiché au survol) */}
            <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-gray-900 border border-yellow-600/50 rounded-lg shadow-2xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden group-hover:block">
                <div className="text-sm font-bold text-yellow-400 mb-1">{item.name}</div>
                <div className="text-xs text-yellow-600 mb-2">Coût: {item.gold_total} ({item.gold_sell})</div>

                {/* Stats */}
                {item.stats && Object.keys(item.stats).length > 0 && (
                    <div className="mb-3 space-y-0.5">
                        {Object.entries(item.stats).map(([key, value]) => (
                            <div key={key} className="text-xs text-blue-300">
                                +{value} {key.replace(/Flat|Mod|Percent/g, '')}
                            </div>
                        ))}
                    </div>
                )}

                {/* Description HTML brute (rendue proprement) */}
                <div
                    className="text-xs text-gray-300 leading-relaxed [&>mainText]:text-gray-300 [&>stats]:text-blue-300 [&>attention]:text-white [&>passive]:text-yellow-200 [&>active]:text-yellow-200"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
            </div>
        </div>
    );
}
