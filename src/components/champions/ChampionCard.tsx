// src/components/ChampionCard.tsx
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChampionData } from '@/types/champion';

interface ChampionCardProps {
  champion: ChampionData;
}

const getChampionImageURL = (version: string, imageId: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${imageId}.png`;
};

export default function ChampionCard({ champion }: ChampionCardProps) {
  const imageUrl = getChampionImageURL(champion.version, champion.id);

  // L'URL de la page détaillée : /champion/Aatrox (Link adds locale)
  const href = `/champion/${champion.id}`;

  return (
    // On enveloppe toute la carte dans le composant Link
    <Link
      href={href}
      className="
        group relative w-40 h-40 overflow-hidden rounded-lg 
        shadow-lg transition-transform duration-300 hover:scale-[1.03]
        border border-gray-700 hover:border-yellow-500 block 
      "
    >
      {/* L'image du champion */}
      <Image
        src={imageUrl}
        alt={`Portrait de ${champion.name}`}
        width={160}
        height={160}
        className="object-cover transition-opacity duration-500 group-hover:opacity-80"
      />

      {/* Le nom du champion en bas de la carte (overlay) */}
      <div
        className="
          absolute bottom-0 w-full p-2 text-center 
          bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent 
          text-white text-sm font-semibold 
        "
      >
        {champion.name}
      </div>
    </Link>
  );
}