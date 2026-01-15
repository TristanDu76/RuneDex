import MapClient from '@/components/map/MapClient';
import { getTranslations } from 'next-intl/server';

interface MapPageProps {
    params: Promise<{ locale: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'map' });

    return (
        <main className="min-h-screen bg-gray-900 text-white relative flex flex-col">
            {/* Header */}
            <div className="w-full p-6 flex flex-col items-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                    {t('title')}
                </h1>
                <p className="text-gray-400 text-center max-w-2xl">
                    {t('subtitle')}
                </p>
            </div>

            {/* Map */}
            <div className="flex-1 flex items-center justify-center p-4">
                <MapClient locale={locale} />
            </div>
        </main>
    );
}
