// src/app/[locale]/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampions, fetchLoreCharacters } from "@/lib/data";
import SkinCarousel from '@/components/champions/SkinCarousel';
import SpellList from '@/components/champions/SpellList';
import ChampionNavigation from '@/components/champions/ChampionNavigation';
import { getTranslations } from 'next-intl/server';
import ChampionRelations from '@/components/champions/ChampionRelations';

// Interface pour les props de la page
interface ChampionPageProps {
  params: Promise<{
    championId: string;
    locale: string;
  }>;
}

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { championId, locale } = await params;
  const t = await getTranslations({ locale });

  // ASTUCE: On récupère la version la plus récente en appelant la liste de champions
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

  // 1. Récupération des données DETAILED spécifiques au champion
  const championDetails = await fetchChampionDetails(championId, latestVersion, locale);

  if (!championDetails) {
    return <main className="text-white p-8">Champion non trouvé ou erreur de données.</main>;
  }

  // 2. Préparation des données pour l'affichage
  const { name, title, lore, blurb, skins, spells, passive, partype, gender, species, tags } = championDetails;

  const regionColors: Record<string, string> = {
    demacia: 'text-blue-300 border-blue-500/30 bg-blue-900/20',
    noxus: 'text-red-400 border-red-500/30 bg-red-900/20',
    ionia: 'text-pink-300 border-pink-500/30 bg-pink-900/20',
    freljord: 'text-cyan-300 border-cyan-500/30 bg-cyan-900/20',
    shurima: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20',
    piltover: 'text-amber-300 border-amber-500/30 bg-amber-900/20',
    zaun: 'text-green-400 border-green-500/30 bg-green-900/20',
    bilgewater: 'text-orange-400 border-orange-500/30 bg-orange-900/20',
    targon: 'text-purple-300 border-purple-500/30 bg-purple-900/20',
    ixtal: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20',
    'shadow-isles': 'text-teal-300 border-teal-500/30 bg-teal-900/20',
    'bandle-city': 'text-lime-300 border-lime-500/30 bg-lime-900/20',
    void: 'text-violet-400 border-violet-500/30 bg-violet-900/20',
    runeterra: 'text-gray-300 border-gray-500/30 bg-gray-900/20',
    darkin: 'text-red-500 border-red-600/30 bg-red-950/40',
  };

  // Helper pour les couleurs de rôle
  const getRoleColor = (r: string) => {
    const role = r.toLowerCase();
    if (role === 'mage') return 'text-blue-400';
    if (role === 'assassin') return 'text-red-400';
    if (role === 'fighter' || role === 'combattant') return 'text-orange-400';
    if (role === 'tank') return 'text-green-400';
    if (role === 'marksman' || role === 'tireur') return 'text-cyan-400';
    if (role === 'support') return 'text-teal-400';
    return 'text-gray-300';
  };

  // Helper pour les couleurs d'espèces
  const getSpeciesColor = (s: string) => {
    const species = s.toLowerCase();
    if (species.includes('human')) return 'text-amber-200';
    if (species.includes('yordle')) return 'text-orange-300';
    if (species.includes('vastaya')) return 'text-pink-300';
    if (species.includes('void')) return 'text-violet-400';
    if (species.includes('undead') || species.includes('revenant') || species.includes('wraith')) return 'text-teal-400';
    if (species.includes('darkin')) return 'text-red-500';
    if (species.includes('god') || species.includes('spirit') || species.includes('celestial') || species.includes('aspect')) return 'text-cyan-300';
    if (species.includes('golem') || species.includes('construct') || species.includes('cyborg')) return 'text-gray-400';
    if (species.includes('dragon')) return 'text-red-400';
    if (species.includes('demon')) return 'text-red-600';
    return 'text-gray-200';
  };

  // Helper pour les couleurs de genre
  const getGenderColor = (g: string) => {
    const gender = g.toLowerCase();
    if (gender === 'male') return 'text-blue-300';
    if (gender === 'female') return 'text-pink-300';
    return 'text-purple-300';
  };

  // Helper pour les couleurs de ressource
  const getResourceColor = (r: string) => {
    const resource = r.toLowerCase();
    if (resource.includes('mana')) return 'text-blue-400';
    if (resource.includes('energy') || resource.includes('énergie')) return 'text-yellow-400';
    if (resource.includes('rage') || resource.includes('fury') || resource.includes('fureur')) return 'text-red-400';
    if (resource.includes('health') || resource.includes('vie') || resource.includes('pv')) return 'text-green-400';
    if (resource.includes('heat') || resource.includes('chaleur')) return 'text-orange-400';
    if (resource.includes('grit') || resource.includes('courage')) return 'text-orange-300';
    if (resource.includes('flow') || resource.includes('flux')) return 'text-cyan-300';
    if (resource.includes('shield') || resource.includes('bouclier')) return 'text-gray-300';
    if (resource.includes('none') || resource.includes('aucun') || resource.includes('manaless')) return 'text-gray-400';
    return 'text-gray-300';
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20 relative">
      <ChampionNavigation
        prevChampionId={prevChampion.id}
        nextChampionId={nextChampion.id}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section with Carousel */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">{name}</h1>
            <p className="text-2xl text-yellow-500 font-light uppercase tracking-widest">{title}</p>
          </div>

          {skins && <SkinCarousel skins={skins} championId={championId} />}

          {/* Info Bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Lore */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2 flex justify-between items-center">
                <span>{t('champion.loreTitle')}</span>
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-justify mb-8">
                {lore || blurb}
              </p>

              {/* Relations typées depuis notre base de données OU API Fallback */}
              <ChampionRelations
                championName={name}
                championDetails={championDetails}
                allChampions={allChampions}
                loreCharacters={loreCharacters}
                t={t}
                locale={locale}
                latestVersion={latestVersion}
              />
            </div>
          </div>

          {/* Right Column: Spells */}
          <div className="lg:col-span-2">
            {spells && passive && (
              <SpellList spells={spells} passive={passive} version={latestVersion} partype={partype} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}