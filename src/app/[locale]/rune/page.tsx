import { fetchRunes } from "@/lib/data";
import RunePillar from "@/components/runes/RunePillar";
import GalleryNav from "@/components/layout/GalleryNav";
import { getTranslations } from 'next-intl/server';

interface RunesPageProps {
    params: Promise<{ locale: string }>;
}

export default async function RunesPage({ params }: RunesPageProps) {
    const { locale } = await params;
    const t = await getTranslations('home');

    // Data fetching
    const runes = await fetchRunes(locale);

    return (
        <main className="min-h-screen bg-transparent p-8 relative pt-24">
            <div className="w-full max-w-7xl mx-auto relative">
                <h1 className="text-4xl font-bold text-purple-500 text-center tracking-tight mb-8" style={{ textShadow: '0 4px 20px rgba(168, 85, 247, 0.2)' }}>
                    {t('runes')}
                </h1>

                {/* <GalleryNav /> */}

                <div className="flex flex-col md:flex-row justify-center items-stretch w-full max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-md h-auto md:h-[600px]">
                    {runes.map((rune: any) => (
                        <div
                            key={rune.id}
                            className="flex-1 min-w-[60px] md:min-w-[100px] border-r border-white/5 last:border-r-0 transition-[flex-grow] duration-500 ease-in-out hover:flex-[2]"
                        >
                            <RunePillar rune={rune} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
