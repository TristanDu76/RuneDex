import { fetchArtifacts } from "@/lib/data";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import GalleryNav from "@/components/layout/GalleryNav";
import { getTranslations } from 'next-intl/server';

interface ArtifactsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ArtifactsPage({ params }: ArtifactsPageProps) {
    const { locale } = await params;
    const t = await getTranslations('home');

    // Data fetching
    const artifacts = await fetchArtifacts(locale);

    return (
        <main className="min-h-screen bg-transparent p-8 relative pt-24">
            <div className="w-full max-w-7xl mx-auto relative">
                <h1 className="text-4xl font-bold text-yellow-500 text-center tracking-tight mb-8" style={{ textShadow: '0 4px 20px rgba(234, 179, 8, 0.2)' }}>
                    {t('artifacts')}
                </h1>

                {/* <GalleryNav /> */}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 place-items-center mx-auto bg-gray-800/20 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-2xl">
                    {artifacts.map((artifact: any) => (
                        <ArtifactCard key={artifact.id} artifact={artifact} />
                    ))}
                </div>
            </div>
        </main>
    );
}
