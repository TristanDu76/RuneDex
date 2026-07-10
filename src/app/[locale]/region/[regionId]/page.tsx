import { regions } from '@/data/regions';
import { fetchRegionShard } from '@/lib/data';
import { normalizeRegionToShardKey } from '@/lib/slug-config';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import RegionClient from './RegionClient';

interface RegionPageProps {
    params: Promise<{ locale: string; regionId: string }>;
}

export default async function RegionPage({ params }: RegionPageProps) {
    const { locale, regionId } = await params;
    const normalizedId = normalizeRegionToShardKey(regionId);
    const isEn = locale.startsWith('en');
    const region = regions.find((candidate) => candidate.id === normalizedId);

    if (!region) {
        notFound();
    }

    const shardData = await fetchRegionShard(normalizedId);
    const name = isEn ? region.nameEn : region.name;
    const description = isEn ? region.descriptionEn : region.description;
    const icon = region.icon || '/LogoRuneDex.png';
    const color = region.color;
    const champions = shardData.filter((entry) => entry.type === 'champion');
    const lore = shardData.filter((entry) => entry.type === 'lore');

    return (
        <main className="min-h-screen bg-transparent text-white selection:bg-yellow-500/30">
            <div className="relative flex h-[400px] w-full items-end justify-center overflow-hidden perspective-1000">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-transform duration-[15s] hover:scale-105"
                    style={{ backgroundImage: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }}
                />
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-color-dodge blur-3xl"
                    style={{ background: `radial-gradient(circle at 50% 80%, ${color}88 0%, transparent 60%)` }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                <div className="relative z-20 flex w-full flex-col items-center justify-center p-12 text-center">
                    <div className="mb-4 translate-y-4 rounded-full border border-white/5 bg-black/40 p-4 shadow-2xl backdrop-blur-md">
                        <Image
                            src={icon}
                            alt={name}
                            width={120}
                            height={120}
                            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        />
                    </div>
                    <h1
                        className="bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent md:text-8xl"
                        style={{ backgroundImage: `linear-gradient(to bottom, #fff, ${color})` }}
                    >
                        {name}
                    </h1>
                    <p className="mt-4 text-xl font-medium uppercase tracking-widest text-gray-300">
                        {description}
                    </p>
                </div>
            </div>

            <RegionClient champions={champions} lore={lore} />
        </main>
    );
}
