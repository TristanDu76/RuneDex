// src/app/[locale]/page.tsx
import { fetchAllChampions, fetchLoreCharacters } from "@/lib/data";
import HomeContent from "@/components/layout/HomeContent";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from 'next-intl/server';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  // 1. Récupération des données (s'exécute côté serveur)
  const champions = await fetchAllChampions(locale);
  const loreCharacters = await fetchLoreCharacters();

  // Tri optionnel pour le fun, par ordre alphabétique du nom
  const sortedChampions = champions.sort((a, b) => a.name.localeCompare(b.name));
  const sortedLoreCharacters = loreCharacters.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-gray-900 p-8 relative">
      {/* Centered Container for all content */}
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Language Switcher - Positioned absolutely within centered container */}
        <div className="absolute top-0 right-0">
          <LanguageSwitcher />
        </div>

        {/* --- Header/Titre --- */}
        <div className="flex flex-col items-center justify-center mb-8 mt-8">
          <Image
            src="/LogoRuneDex.png"
            alt="RuneDex Logo"
            width={400}
            height={150}
            className="w-auto h-32 object-contain mb-4"
            priority
          />
          <h1 className="text-6xl font-bold text-yellow-500 text-center tracking-tight" style={{ textShadow: '0 4px 20px rgba(234, 179, 8, 0.2)' }}>
            RuneDex
          </h1>
          <Link
            href="/quiz"
            className="mt-6 px-6 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-600/50 rounded-full text-yellow-400 font-medium transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>🎮</span> {t('playQuiz')}
          </Link>
        </div>

        {/* --- Contenu Principal (Grilles) --- */}
        <HomeContent
          champions={sortedChampions}
          loreCharacters={sortedLoreCharacters}
        />
      </div>

      {/* Note : Le composant Image de Next.js gère la mise en cache des images de Riot */}
    </main>
  );
}