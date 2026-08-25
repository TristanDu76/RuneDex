import { fetchLoreCharacters } from "@/lib/data";
import LoreGrid from "@/components/lore/LoreGrid";
import { getTranslations } from 'next-intl/server';

interface LorePageProps {
    params: Promise<{ locale: string }>;
}

export default async function LorePage({ params }: LorePageProps) {
    await params;
    const t = await getTranslations('home');

    // Data fetching
    const loreCharacters = await fetchLoreCharacters();
    const sortedLoreCharacters = loreCharacters
        .map(({ id, name, image, faction, species, gender, status }) => ({ id, name, image, faction, species, gender, status }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="min-h-screen bg-transparent p-8 relative pt-24">
            <div className="w-full max-w-7xl mx-auto relative">
                <h1 className="text-5xl font-extrabold text-white mb-10 tracking-tight text-center hex-title drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] uppercase">
                    {t('loreCharacters')}
                </h1>

                <div className="hex-panel p-8">
                    <LoreGrid characters={sortedLoreCharacters} />
                </div>
            </div>
        </main>
    );
}
