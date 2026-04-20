import { fetchAllChampionsGrid } from "@/lib/data";
import ChampionGrid from "@/components/champions/ChampionGrid";
import { getTranslations } from 'next-intl/server';

interface ChampionsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ChampionsPage({ params }: ChampionsPageProps) {
    const { locale } = await params;
    const t = await getTranslations('home');

    // Data fetching
    const champions = await fetchAllChampionsGrid(locale);
    const sortedChampions = champions.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="min-h-screen bg-transparent p-8 relative pt-24">
            <div className="w-full max-w-7xl mx-auto relative">
                <h1 className="text-5xl font-extrabold text-white mb-10 tracking-tight text-center hex-title drop-shadow-[0_0_15px_rgba(0,0,0,1)] uppercase">
                    {t('champions')}
                </h1>

                <div className="hex-panel p-8">
                    <ChampionGrid champions={sortedChampions} />
                </div>
            </div>
        </main>
    );
}
