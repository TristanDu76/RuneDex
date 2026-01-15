// src/app/[locale]/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampions, fetchLoreCharacters, fetchChampionArtifacts, fetchChampionRunes } from "@/lib/data";
import SkinCarousel from '@/components/champions/SkinCarousel';
import SpellList from '@/components/champions/SpellList';
import ChampionNavigation from '@/components/champions/ChampionNavigation';
import { getTranslations } from 'next-intl/server';
import ChampionRelations from '@/components/champions/ChampionRelations';
import ChampionArtifacts from '@/components/champions/ChampionArtifacts';
import LoreDisplay from '@/components/champions/LoreDisplay';
import ChampionSwipeNavigation from '@/components/champions/ChampionSwipeNavigation';

// Interface pour les props de la page
interface ChampionPageProps {
  params: Promise<{
    championId: string;
    locale: string;
  }>;
}

import { regionColors, getRoleColor, getSpeciesColor, getGenderColor, getResourceColor } from '@/utils/colors';

// ... (imports)

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { championId, locale } = await params;
  const t = await getTranslations({ locale });

  // TIP: We fetch the latest version by calling the champion list
  const allChampions = await fetchAllChampions(locale);
  const loreCharacters = await fetchLoreCharacters();
  // console.log('Lore Characters in Page:', JSON.stringify(loreCharacters, null, 2));
  const latestVersion = allChampions.length > 0 ? allChampions[0].version : '15.23.1';

  // Tri des champions pour la navigation (A-Z)
  const sortedChampions = allChampions.sort((a, b) => a.name.localeCompare(b.name));
  const currentIndex = sortedChampions.findIndex(c => c.id === championId);

  // Gestion circulaire (si on est au début, on va à la fin, et inversement)
  const prevChampion = currentIndex > 0 ? sortedChampions[currentIndex - 1] : sortedChampions[sortedChampions.length - 1];
  const nextChampion = currentIndex < sortedChampions.length - 1 ? sortedChampions[currentIndex + 1] : sortedChampions[0];

  // 1. Fetching DETAILED data specific to the champion
  const championDetails = await fetchChampionDetails(championId, locale);
  const championArtifacts = await fetchChampionArtifacts(championId, locale);
  const championRunes = await fetchChampionRunes(championId, locale);

  if (!championDetails) {
    return <main className="text-white p-8">Champion non trouvé ou erreur de données.</main>;
  }

  // 2. Preparing data for display
  const { name, title, lore, skins, spells, passive, partype, gender, species, tags } = championDetails;


  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20 relative">
      <ChampionNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
      />
      <ChampionSwipeNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">{name}</h1>
          <p className="text-2xl text-yellow-500 font-light uppercase tracking-widest">{title}</p>
        </div>

        {/* Visuals Section: Artifacts - Skins - Runes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 pt-12">
            {[...(championArtifacts || []).map((a: any) => ({ ...a, itemType: 'artifact' })), ...(championRunes || []).map((r: any) => ({ ...r, itemType: 'rune' }))]
              .filter((_, i) => i % 2 === 0)
              .map((item: any) => (
                <div key={`${item.itemType}-${item.id}`} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{item.name}</span>
                  <a
                    href={`/${locale}/${item.itemType}/${item.id}`}
                    className={`group relative w-full aspect-square bg-gray-800 border border-gray-700 overflow-hidden hover:border-${item.itemType === 'artifact' ? 'yellow' : 'blue'}-500 transition-all ${item.itemType === 'rune' ? 'rounded-full' : 'rounded-lg'}`}
                    title={item.name}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">?</div>
                    )}
                  </a>
                </div>
              ))}
          </div>

          {/* Center Column: Skins Carousel */}
          <div className="lg:col-span-8 w-full">
            {skins && <SkinCarousel skins={skins} championId={championId} />}

            {/* Mobile Artifacts/Runes (visible only on small screens) */}
            <div className="lg:hidden flex justify-center gap-4 mt-4 flex-wrap">
              {championArtifacts?.map((a: any) => (
                <a key={a.id} href={`/${locale}/artifact/${a.id}`} className="w-12 h-12 rounded border border-gray-600 overflow-hidden">
                  <img src={a.image_url} alt={a.name} className="w-full h-full object-cover" />
                </a>
              ))}
              {championRunes?.map((r: any) => (
                <a key={r.id} href={`/${locale}/rune/${r.id}`} className="w-12 h-12 rounded-full border border-gray-600 overflow-hidden">
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 pt-12">
            {[...(championArtifacts || []).map((a: any) => ({ ...a, itemType: 'artifact' })), ...(championRunes || []).map((r: any) => ({ ...r, itemType: 'rune' }))]
              .filter((_, i) => i % 2 !== 0)
              .map((item: any) => (
                <div key={`${item.itemType}-${item.id}`} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{item.name}</span>
                  <a
                    href={`/${locale}/${item.itemType}/${item.id}`}
                    className={`group relative w-full aspect-square bg-gray-800 border border-gray-700 overflow-hidden hover:border-${item.itemType === 'artifact' ? 'yellow' : 'blue'}-500 transition-all ${item.itemType === 'rune' ? 'rounded-full' : 'rounded-lg'}`}
                    title={item.name}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">?</div>
                    )}
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Roles */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t('filters.role')}</span>
              <div className="flex gap-2">
                {tags.map(tag => (
                  <span key={tag} className={`font-medium ${getRoleColor(tag)}`}>
                    {t(`roles.${tag}`) || tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Factions */}
          {championDetails.factions && championDetails.factions.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t('champion.region')}</span>
              <div className="flex gap-2">
                {championDetails.factions.map(faction => (
                  <span key={faction} className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[faction.toLowerCase()] || 'text-gray-300'}`}>
                    {t(`factions.${faction}`) || faction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Species */}
          {species && (
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t('champion.species')}</span>
              <span className={`font-medium ${getSpeciesColor(species)}`}>
                {t(`species.${species}`) || species}
              </span>
            </div>
          )}

          {/* Gender */}
          {gender && (
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t('champion.gender')}</span>
              <span className={`font-medium ${getGenderColor(gender)}`}>
                {t(`gender.${gender}`) || gender}
              </span>
            </div>
          )}

          {/* Resource */}
          {partype && (
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{t('champion.resource')}</span>
              <span className={`font-medium ${getResourceColor(partype)}`}>
                {t(`resource.${partype}`) || partype}
              </span>
            </div>
          )}
        </div>

        {/* Spells Section */}
        {spells && passive && (
          <div className="w-full">
            <SpellList spells={spells} passive={passive} version={latestVersion} partype={partype} />
          </div>
        )}

        {/* Lore Section */}
        <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2 flex justify-between items-center">
            <span>{t('champion.loreTitle')}</span>
          </h2>
          <LoreDisplay lore={lore || ''} showMoreText={t('champion.showMore')} showLessText={t('champion.showLess')} />
        </div>

        {/* Relations Section */}
        <div className="w-full">
          <ChampionRelations
            championName={name}
            championDetails={championDetails}
            allChampions={allChampions}
            loreCharacters={loreCharacters}
            locale={locale}
            latestVersion={latestVersion}
          />
        </div>

      </div>
    </main>
  );
}