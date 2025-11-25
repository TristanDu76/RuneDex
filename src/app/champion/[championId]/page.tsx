// src/app/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampions } from "@/lib/data";
import SkinCarousel from '@/components/SkinCarousel';
import SpellList from '@/components/SpellList';
import ChampionNavigation from '@/components/ChampionNavigation';
import { getTranslation } from '@/lib/translations';

// Interface pour les props de la page
interface ChampionPageProps {
  params: Promise<{
    championId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChampionPage({ params, searchParams }: ChampionPageProps) {
  const { championId } = await params;
  const { lang } = await searchParams;
  const locale = (lang as string) || 'fr_FR';
  const t = getTranslation(locale);

  // ASTUCE: On récupère la version la plus récente en appelant la liste de champions
  const allChampions = await fetchAllChampions(locale);
  const latestVersion = allChampions.length > 0 ? allChampions[0].version : '15.23.1';

  // Tri des champions pour la navigation (A-Z)
  const sortedChampions = allChampions.sort((a, b) => a.name.localeCompare(b.name));
  const currentIndex = sortedChampions.findIndex(c => c.id === championId);

  // Gestion circulaire (si on est au début, on va à la fin, et inversement)
  const prevChampion = currentIndex > 0 ? sortedChampions[currentIndex - 1] : sortedChampions[sortedChampions.length - 1];
  const nextChampion = currentIndex < sortedChampions.length - 1 ? sortedChampions[currentIndex + 1] : sortedChampions[0];

  // 1. Récupération des données DETAILED spécifiques au champion
  const championDetails = await fetchChampionDetails(championId, latestVersion, locale);

  if (!championDetails) {
    return <main className="text-white p-8">Champion non trouvé ou erreur de données.</main>;
  }

  // 2. Préparation des données pour l'affichage
  const { name, title, lore, blurb, skins, spells, passive } = championDetails;

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20 relative">
      <ChampionNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
        lang={lang as string}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section with Carousel */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">{name}</h1>
            <p className="text-2xl text-yellow-500 font-light uppercase tracking-widest">{title}</p>
          </div>

          {skins && <SkinCarousel skins={skins} championId={championId} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Lore */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
                {t.champion.loreTitle}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                {lore || blurb}
              </p>
            </div>
          </div>

          {/* Right Column: Spells */}
          <div className="lg:col-span-2">
            {spells && passive && (
              <SpellList spells={spells} passive={passive} version={latestVersion} lang={locale} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}