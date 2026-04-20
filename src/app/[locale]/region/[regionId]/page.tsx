import { fetchAllChampionsGrid, fetchLoreCharactersLight, fetchRegionShard } from "@/lib/data";
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RegionClient from './RegionClient';

// Données statiques pour l'affichage de la région
const REGION_INFO: Record<string, { name: string; nameEn: string; icon: string; color: string; descFr: string; descEn: string; bgImage?: string }> = {
    'demacia': { name: 'Demacia', nameEn: 'Demacia', icon: '/images/Demacia.png', color: '#e6f3ce', descFr: 'Fier Royaume Militaire Légaliste', descEn: 'Proud Lawful Military Kingdom' },
    'noxus': { name: 'Noxus', nameEn: 'Noxus', icon: '/images/Noxus.png', color: '#d10000', descFr: 'Empire Méritocratique Agressif', descEn: 'Aggressive Meritocratic Empire' },
    'freljord': { name: 'Freljord', nameEn: 'Freljord', icon: '/images/Freljord.png', color: '#b9e2ff', descFr: 'Terres glacées et tribus anciennes', descEn: 'Frozen lands and ancient tribes' },
    'shurima': { name: 'Shurima', nameEn: 'Shurima', icon: '/images/Shurima.png', color: '#ebc443', descFr: 'Ancien Empire Désertique Déchu', descEn: 'Ancient Fallen Desert Empire' },
    'ixtal': { name: 'Ixtal', nameEn: 'Ixtal', icon: '/images/Ixtal.png', color: '#1d9719', descFr: 'Jungle Élémentaire Isolée', descEn: 'Secluded Elemental Jungle' },
    'piltover': { name: 'Piltover', nameEn: 'Piltover', icon: '/images/Piltover.png', color: '#f5a623', descFr: 'Cité Prospère d\'Innovation', descEn: 'Wealthy City of Innovation' },
    'zaun': { name: 'Zaun', nameEn: 'Zaun', icon: '/images/Zaun.png', color: '#f5a623', descFr: 'Ville Basse Industrielle Polluée', descEn: 'Polluted Industrial Undercity' },
    'ionia': { name: 'Ionia', nameEn: 'Ionia', icon: '/images/Ionia.png', color: '#a82fee', descFr: 'Terres Magiques et Pacifiques', descEn: 'Peaceful Magical Lands' },
    'bilgewater': { name: 'Bilgewater', nameEn: 'Bilgewater', icon: '/images/Bilgewater.png', color: '#1a7a8f', descFr: 'Port de Pirates Indépendant', descEn: 'Independent Pirate Port' },
    'shadowisles': { name: 'Îles Obscures', nameEn: 'Shadow Isles', icon: '/images/ShadowIsles.png', color: '#1db597', descFr: 'Terre Maudite', descEn: 'Cursed Land' },
    'targon': { name: 'Targon', nameEn: 'Targon', icon: '/images/Targon.png', color: '#443bc2', descFr: 'Montagne Céleste', descEn: 'Celestial Mountain' },
    'bandlecity': { name: 'Bandle', nameEn: 'Bandle City', icon: '/images/BandleCity.png', color: '#9dcc2e', descFr: 'Le Foyer des Yordles', descEn: 'Home of the Yordles' },
    'runeterra': { name: 'Runeterra', nameEn: 'Runeterra', icon: '/LogoRuneDex.png', color: '#ffffff', descFr: 'Le Monde Entier', descEn: 'The Entire World' },
};

interface RegionPageProps {
    params: Promise<{ locale: string; regionId: string }>;
}

export default async function RegionPage({ params }: RegionPageProps) {
    const { locale, regionId } = await params;

    // Normalisation de l'ID (certains ont des majuscules ou espaces)
    const normalizedId = regionId.toLowerCase().replace(/[^a-z]/g, '');
    const isEn = locale.startsWith('en');

    // Fallback info si on n'a pas la région configurée
    const rInfo = REGION_INFO[normalizedId] || {
        name: regionId,
        nameEn: regionId,
        icon: '/images/Runeterra.png',
        color: '#6b7280',
        descFr: 'Région Inconnue',
        descEn: 'Unknown Region'
    };

    // 1. Fetching des personnages via le shard de la région
    const shardData = await fetchRegionShard(normalizedId);

    const regionChampions = shardData
        .filter((c: any) => c.type === 'champion')
        .map((c: any) => ({
            ...c,
            image: { full: c.thumbnail?.split('/').pop() || (c.id + '.png') }
        }));

    const regionLore = shardData
        .filter((c: any) => c.type === 'lore')
        .map((l: any) => ({
            ...l,
            image: l.thumbnail
        }));

    return (
        <main className="min-h-screen bg-transparent text-white selection:bg-yellow-500/30">
            {/* HERO BANNER SECTION */}
            <div className="relative w-full h-[400px] overflow-hidden flex items-end justify-center perspective-1000">
                {/* Background Gradient/Image */}
                <div
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform hover:scale-105 duration-[15s]"
                    style={{
                        backgroundImage: rInfo.bgImage ? `url(${rInfo.bgImage})` : 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
                    }}
                />

                {/* Magic Glow reflecting the Region Color */}
                <div
                    className="absolute inset-0 z-0 opacity-30 mix-blend-color-dodge blur-3xl pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 80%, ${rInfo.color}88 0%, transparent 60%)`
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

                <div className="relative z-20 flex flex-col items-center justify-center p-12 w-full text-center">
                    <div className="mb-4 translate-y-4 shadow-2xl rounded-full bg-black/40 p-4 border border-white/5 backdrop-blur-md">
                        {rInfo.icon && (
                            <Image
                                src={rInfo.icon}
                                alt={rInfo.name}
                                width={120}
                                height={120}
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            />
                        )}
                    </div>
                    <h1
                        className="text-6xl md:text-8xl font-black uppercase tracking-tight text-transparent bg-clip-text"
                        style={{ backgroundImage: `linear-gradient(to bottom, #fff, ${rInfo.color})` }}
                    >
                        {isEn ? rInfo.nameEn : rInfo.name}
                    </h1>
                    <p className="mt-4 text-xl tracking-widest text-gray-300 font-medium uppercase">
                        {isEn ? rInfo.descEn : rInfo.descFr}
                    </p>
                </div>
            </div>

            <RegionClient locale={locale} champions={regionChampions} lore={regionLore} />
        </main>
    );
}
