import MapClient from '@/components/map/MapClient';
import { getTranslations } from 'next-intl/server';

interface MapPageProps {
    params: Promise<{ locale: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'map' });

    return (
        <main className="h-screen w-screen overflow-hidden bg-gray-900">
            <MapClient locale={locale} />
        </main>
    );
}
