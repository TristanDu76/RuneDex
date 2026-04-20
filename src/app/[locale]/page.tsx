// src/app/[locale]/page.tsx
import { routing } from '@/i18n/routing';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: 'RuneDex - Carte Interactive de Runeterra',
  description: 'Explorez la carte interactive de Runeterra et découvrez les champions par région.',
};

// Pré-génère les pages d'accueil pour chaque locale au build
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0c0905]">
      <LeafletMapWrapper locale={locale} />
    </main>
  );
}
