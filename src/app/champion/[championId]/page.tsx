// src/app/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampions } from "@/lib/data";
import SkinCarousel from '@/components/SkinCarousel';
import SpellList from '@/components/SpellList';
import ChampionNavigation from '@/components/ChampionNavigation';
import { getTranslation } from '@/lib/translations';
import { championRelations } from '@/lib/championRelations';

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
  const { name, title, lore, blurb, skins, spells, passive, partype } = championDetails;

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
              <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2 flex justify-between items-center">
                <span>{t.champion.loreTitle}</span>
                {championDetails.faction && (
                  <span className="text-sm font-normal text-yellow-500 bg-gray-900/50 px-3 py-1 rounded-full border border-yellow-500/30">
                    {(t.factions as any)[championDetails.faction] || championDetails.faction.toUpperCase()}
                  </span>
                )}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-justify mb-8">
                {lore || blurb}
              </p>

              {/* Relations typées depuis notre base de données */}
              {(() => {
                const relations = championRelations[name] || [];
                const apiRelated = championDetails.relatedChampions || [];

                // Couleurs et icônes par catégorie de type
                const getTypeStyle = (type: string) => {
                  // Famille
                  if (['sibling', 'parent', 'child', 'spouse', 'ancestor', 'descendant', 'adoptive-family'].includes(type)) {
                    return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: '👨‍👩‍👧‍👦' };
                  }
                  // Romance
                  if (['lover', 'ex-lover', 'unrequited-love'].includes(type)) {
                    return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '💕' };
                  }
                  // Amitié & Alliance
                  if (['friend', 'mentor', 'student', 'ally', 'comrade'].includes(type)) {
                    return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '🤝' };
                  }
                  // Hostilité
                  if (['enemy', 'nemesis', 'betrayed', 'betrayer', 'victim', 'killer'].includes(type)) {
                    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '⚔️' };
                  }
                  // Rivalité
                  if (['rival'].includes(type)) {
                    return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🔥' };
                  }
                  // Complexe & Autres
                  return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💔' };
                };

                const hasRelations = relations.length > 0;
                const hasApiRelations = apiRelated.length > 0;

                if (!hasRelations && !hasApiRelations) return null;

                return (
                  <div className="mt-8 border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-4">{t.champion.relatedChampions}</h3>

                    {/* Relations typées */}
                    {hasRelations && (
                      <div className="space-y-3">
                        {relations.map((rel) => {
                          const relChamp = allChampions.find(c => c.name === rel.champion);
                          const style = getTypeStyle(rel.type);

                          // Si le champion n'existe pas dans la liste (personnage non-jouable du lore)
                          if (!relChamp) {
                            return (
                              <div key={rel.champion} className="flex items-start gap-3">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${style.bg} ${style.border} flex-1 opacity-75`}>
                                  <div className={`w-8 h-8 rounded-full border-2 ${style.border} ${style.bg} flex items-center justify-center`}>
                                    <span className="text-xs">{style.icon}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm ${style.text} font-medium italic`}>{rel.champion}</span>
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${style.bg} ${style.border} ${style.text} border`}>
                                        <span>{style.icon}</span>
                                        <span>{(t.relationTypes as any)[rel.type]}</span>
                                      </span>
                                    </div>
                                    {rel.note && (
                                      <p className="text-xs text-gray-400 mt-1 italic">{rel.note}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">Personnage du lore</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Champion jouable - lien cliquable
                          return (
                            <div key={rel.champion} className="flex items-start gap-3">
                              <a
                                href={`/champion/${relChamp.id}?lang=${locale}`}
                                className={`flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg border transition-colors group flex-1 ${style.bg} ${style.border}`}
                              >
                                <img
                                  src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${relChamp.image.full}`}
                                  alt={rel.champion}
                                  className={`w-8 h-8 rounded-full border-2 ${style.border} group-hover:scale-110 transition-transform`}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm ${style.text} group-hover:text-white font-medium`}>{rel.champion}</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${style.bg} ${style.border} ${style.text} border`}>
                                      <span>{style.icon}</span>
                                      <span>{(t.relationTypes as any)[rel.type]}</span>
                                    </span>
                                  </div>
                                  {rel.note && (
                                    <p className="text-xs text-gray-400 mt-1 italic">{rel.note}</p>
                                  )}
                                </div>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Fallback: Relations de l'API (non typées) */}
                    {!hasRelations && hasApiRelations && (
                      <div className="flex flex-wrap gap-3">
                        {apiRelated.map((rel) => {
                          const relChamp = allChampions.find(c => c.name === rel.name);
                          if (!relChamp) return null;

                          return (
                            <a
                              key={rel.slug}
                              href={`/champion/${relChamp.id}?lang=${locale}`}
                              className="flex items-center gap-2 bg-gray-900/50 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700 transition-colors group"
                            >
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${relChamp.image.full}`}
                                alt={rel.name}
                                className="w-6 h-6 rounded-full border border-gray-600 group-hover:border-yellow-500"
                              />
                              <span className="text-sm text-gray-300 group-hover:text-white">{rel.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Column: Spells */}
          <div className="lg:col-span-2">
            {spells && passive && (
              <SpellList spells={spells} passive={passive} version={latestVersion} lang={locale} partype={partype} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}