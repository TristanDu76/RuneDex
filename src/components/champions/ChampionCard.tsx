// src/components/champions/ChampionCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChampionLight } from '@/types/champion';

interface ChampionCardProps {
  champion: ChampionLight;
}

const getChampionImageURL = (version: string, imageId: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${imageId}.png`;
};

export default function ChampionCard({ champion }: ChampionCardProps) {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = getChampionImageURL(champion.version, champion.id);
  const href = `/champion/${champion.id}`;

  return (
    <Link
      href={href}
      className="group relative w-40 h-40 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.03] border border-gray-700 hover:border-yellow-500 block"
    >
      {/* Skeleton shimmer — visible tant que l'image n'est pas chargée */}
      <div
        className={`absolute inset-0 bg-gray-800 transition-opacity duration-300 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />
      </div>

      {/* Image réelle */}
      <Image
        src={imageUrl}
        alt={`Portrait de ${champion.name}`}
        width={160}
        height={160}
        className={`object-cover transition-all duration-500 group-hover:opacity-80 ${loaded ? 'opacity-100' : 'opacity-0'
          }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />

      {/* Nom en overlay */}
      <div className="absolute bottom-0 w-full p-2 text-center bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent text-white text-sm font-semibold">
        {champion.name}
      </div>
    </Link>
  );
}