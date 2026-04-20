// src/app/[locale]/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampionsLight, fetchLoreCharactersLight, fetchChampionArtifacts, fetchChampionRunes } from "@/lib/data";
import SkinCarousel from '@/components/champions/SkinCarousel';
import SpellList from '@/components/champions/SpellList';
import ChampionNavigation from '@/components/champions/ChampionNavigation';
import { getTranslations } from 'next-intl/server';
import ChampionRelations from '@/components/champions/ChampionRelations';
import ChampionArtifacts from '@/components/champions/ChampionArtifacts';
import LoreDisplay from '@/components/champions/LoreDisplay';
import ChampionSwipeNavigation from '@/components/champions/ChampionSwipeNavigation';
import championsIndex from '@/data/champions/index.json';
import { routing } from '@/i18n/routing';

// Interface pour les props de la page
interface ChampionPageProps {
  params: Promise<{
    championId: string;
    locale: string;
  }>;
}

// Pré-génère toutes les pages champion au build → zéro rendu dynamique
export async function generateStaticParams() {
  const index = championsIndex as Array<{ id: string; name: string }>;
  const locales = routing.locales;
  return locales.flatMap((locale) =>
    index.map((champ) => ({ locale, championId: champ.id }))
  );
}

import { regionColors, getRoleColor, getSpeciesColor, getGenderColor, getResourceColor } from '@/utils/colors';

// ... (imports)

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { championId, locale } = await params;
  const t = await getTranslations({ locale });
  const tWithHas = t as typeof t & { has?: (key: string) => boolean };

  const translateFallback = (keys: string | string[], fallback: string) => {
    const candidates = Array.isArray(keys) ? keys : [keys];

    for (const key of candidates) {
      if (tWithHas.has && !tWithHas.has(key)) {
        continue;
      }

      try {
        return tWithHas(key);
      } catch {
        // Keep fallback behavior if has() is unavailable or if key resolution fails
      }
    }

    return fallback;
  };

  // Utilise les versions light : aucune donnée lore/spells/skins chargée inutilement
  const allChampions = await fetchAllChampionsLight(locale);
  const loreCharacters = await fetchLoreCharactersLight();
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
    <main className="min-h-screen bg-transparent text-white pb-20 relative">
      <ChampionNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
      />
      <ChampionSwipeNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-6xl mb-2 hex-title">{name}</h1>
          <p className="text-2xl text-hextech-gold font-light uppercase tracking-widest">{title}</p>
        </div>

        {/* Visuals Section: Artifacts - Skins - Runes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 pt-12">
            {[...(championArtifacts || []).map((a: any) => ({ ...a, itemType: 'artifact' })), ...(championRunes || []).map((r: any) => ({ ...r, itemType: 'rune' }))]
              .filter((_, i) => i % 2 === 0)
              .map((item: any) => (
                <div key={`${item.itemType}-${item.id}`} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-hextech-cyan uppercase tracking-wider text-center">{item.name}</span>
                  <a
                    href={`/${locale}/${item.itemType}/${item.id}`}
                    className={`group relative w-full aspect-square hex-panel border overflow-hidden hover:scale-105 hover:border-hextech-cyan transition-all ${item.itemType === 'rune' ? 'rounded-full' : 'rounded-lg'}`}
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
            {skins && <SkinCarousel skins={skins} championId={championDetails.id} />}

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
                  <span className="text-xs font-bold text-hextech-cyan uppercase tracking-wider text-center">{item.name}</span>
                  <a
                    href={`/${locale}/${item.itemType}/${item.id}`}
                    className={`group relative w-full aspect-square hex-panel border overflow-hidden hover:scale-105 hover:border-hextech-cyan transition-all ${item.itemType === 'rune' ? 'rounded-full' : 'rounded-lg'}`}
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
            <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
              <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('filters.role')}</span>
              <div className="flex gap-2">
                {tags.map(tag => (
                  <span key={tag} className={`font-medium ${getRoleColor(tag)}`}>
                    {translateFallback([`roles.${tag}`, `roles.${tag.toLowerCase()}`], tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Régions & Factions */}
          {(() => {
            const KNOWN_REGIONS = ['demacia', 'noxus', 'ionia', 'freljord', 'shurima', 'piltover', 'zaun', 'bilgewater', 'targon', 'ixtal', 'shadow-isles', 'bandle-city', 'void', 'runeterra', 'icathia', 'camavor', 'independent'];
            const allFactions = championDetails.factions || [];
            const charRegions = allFactions.filter(f => KNOWN_REGIONS.includes(f.toLowerCase()));
            const charFactions = allFactions.filter(f => !KNOWN_REGIONS.includes(f.toLowerCase()));

            return (
              <>
                {/* Régions */}
                {charRegions.length > 0 && (
                  <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                    <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.region')}</span>
                    <div className="flex gap-2">
                      {charRegions.map(region => (
                        <span key={region} className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[region.toLowerCase()] || 'text-gray-300'}`}>
                          {translateFallback(`factions.${region.toLowerCase().replace(/\s+/g, '-')}`, region)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Factions */}
                {charFactions.length > 0 && (
                  <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                    <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.faction')}</span>
                    <div className="flex gap-2">
                      {charFactions.map(faction => (
                        <span key={faction} className={`text-sm font-bold px-2 py-0.5 rounded ${regionColors[faction.toLowerCase()] || 'text-gray-300'}`}>
                          {translateFallback(`factions.${faction.toLowerCase().replace(/\s+/g, '-')}`, faction)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Species */}
          {species && (
            <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
              <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.species')}</span>
              <span className={`font-medium ${getSpeciesColor(species)}`}>
                {translateFallback(`species.${species.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}`, species)}
              </span>
            </div>
          )}

          {/* Gender */}
          {gender && (
            <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
              <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.gender')}</span>
              <span className={`font-medium ${getGenderColor(gender)}`}>
                {translateFallback([`gender.${gender}`, `gender.${gender.toLowerCase()}`], gender)}
              </span>
            </div>
          )}

          {/* Resource */}
          {partype && (
            <div className="flex items-center gap-2 hex-panel border border-hextech-gold/30 px-4 py-2 rounded-full shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
              <span className="text-hextech-cyan text-sm uppercase tracking-wider font-semibold">{t('champion.resource')}</span>
              <span className={`font-medium ${getResourceColor(partype)}`}>
                {translateFallback([
                  `resource.${partype}`,
                  `resource.${partype.charAt(0).toUpperCase()}${partype.slice(1)}`,
                  `resource.${partype.toLowerCase()}`
                ], partype)}
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
        <div className="hex-panel p-8">
          <h2 className="text-2xl font-bold text-hextech-gold mb-6 border-b border-hextech-gold/20 pb-4 flex justify-between items-center tracking-widest uppercase">
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