import { fetchRunes } from "@/lib/data";
import RunePillar from "@/components/runes/RunePillar";
import { getTranslations } from 'next-intl/server';

interface RunesPageProps {
    params: Promise<{ locale: string }>;
}

export default async function RunesPage({ params }: RunesPageProps) {
    const { locale } = await params;
    const t = await getTranslations('home');
    const isEn = locale.startsWith('en');

    // Data fetching
    const runes = await fetchRunes(locale);

    return (
        <main className="min-h-screen bg-transparent p-8 relative pt-24">
            <div className="w-full max-w-7xl mx-auto relative">
                <p className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-hextech-cyan">{isEn ? 'Runeterra system' : 'Système de Runeterra'}</p>
                <h1 className="text-4xl font-bold text-purple-500 text-center tracking-tight mb-3" style={{ textShadow: '0 4px 20px rgba(168, 85, 247, 0.2)' }}>
                    {t('runes')}
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-6 text-slate-400">
                    {isEn ? 'Choose a rune path to discover its keystones and the champions bound to it.' : 'Choisissez une voie runique pour découvrir ses pierres angulaires et les champions qui lui sont liés.'}
                </p>

                {/* <GalleryNav /> */}

                <div className="flex flex-col md:flex-row justify-center items-stretch w-full max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-md h-auto md:h-[600px]">
                    {runes.map((rune) => (
                        <div
                            key={rune.id}
                            className="flex-1 min-w-[60px] md:min-w-[100px] border-r border-white/5 last:border-r-0 transition-[flex-grow] duration-500 ease-in-out hover:flex-[2]"
                        >
                            <RunePillar rune={rune} />
                        </div>
                    ))}
                </div>
                <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-slate-500">{isEn ? 'Hover or select a path to explore it' : 'Survolez ou sélectionnez une voie pour l’explorer'}</p>
            </div>
        </main>
    );
}
