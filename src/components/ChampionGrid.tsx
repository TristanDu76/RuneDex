'use client';

import React, { useState, useMemo } from 'react';
import { ChampionData } from '@/types/champion';
import ChampionCard from './ChampionCard';
import FilterBar, { ActiveFilters, FilterOption } from './FilterBar';
import { getTranslation } from '@/lib/translations';

interface ChampionGridProps {
    champions: ChampionData[];
    lang?: string;
}

export default function ChampionGrid({ champions, lang = 'fr_FR' }: ChampionGridProps) {
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        regions: [],
        races: [],
        genders: [],
        resources: [],
        roles: [],
    });
    const t = getTranslation(lang);

    // Generate filter options with counts
    const filterOptions = useMemo(() => {
        const races = new Map<string, number>();
        const genders = new Map<string, number>();
        const regions = new Map<string, number>();
        const resources = new Map<string, number>();
        const roles = new Map<string, number>();

        champions.forEach((champion) => {
            // Race (species)
            if (champion.species) {
                races.set(champion.species, (races.get(champion.species) || 0) + 1);
            }

            // Gender
            if (champion.gender) {
                genders.set(champion.gender, (genders.get(champion.gender) || 0) + 1);
            }

            // Regions (factions)
            champion.factions?.forEach((faction) => {
                regions.set(faction, (regions.get(faction) || 0) + 1);
            });

            // Resources (partype)
            if (champion.partype) {
                resources.set(champion.partype, (resources.get(champion.partype) || 0) + 1);
            }

            // Roles (tags)
            champion.tags?.forEach((tag) => {
                roles.set(tag, (roles.get(tag) || 0) + 1);
            });
        });

        const mapToOptions = (map: Map<string, number>): FilterOption[] =>
            Array.from(map.entries())
                .map(([value, count]) => ({ value, label: value, count }))
                .sort((a, b) => b.count - a.count);

        return {
            races: mapToOptions(races),
            genders: mapToOptions(genders),
            regions: mapToOptions(regions),
            resources: mapToOptions(resources),
            roles: mapToOptions(roles),
        };
    }, [champions]);

    const filteredChampions = useMemo(() => {
        let result = champions;

        // Apply filters with adaptive AND/OR logic
        const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

        if (hasActiveFilters) {
            result = result.filter((champion) => {
                // Check regions (adaptive logic)
                if (activeFilters.regions.length > 0) {
                    if (activeFilters.regions.length <= 2) {
                        // AND logic: champion must have ALL selected regions
                        const hasAllRegions = activeFilters.regions.every(region =>
                            champion.factions?.includes(region)
                        );
                        if (!hasAllRegions) return false;
                    } else {
                        // OR logic: champion must have AT LEAST ONE selected region
                        const hasAnyRegion = champion.factions?.some(faction =>
                            activeFilters.regions.includes(faction)
                        );
                        if (!hasAnyRegion) return false;
                    }
                }

                // Check races (adaptive logic)
                if (activeFilters.races.length > 0) {
                    if (activeFilters.races.length <= 2) {
                        // AND logic: for single value fields, just check if it matches
                        if (!champion.species || !activeFilters.races.includes(champion.species)) {
                            return false;
                        }
                    } else {
                        // OR logic: champion must have one of the selected races
                        if (!champion.species || !activeFilters.races.includes(champion.species)) {
                            return false;
                        }
                    }
                }

                // Check genders (adaptive logic)
                if (activeFilters.genders.length > 0) {
                    if (activeFilters.genders.length <= 2) {
                        // AND logic
                        if (!champion.gender || !activeFilters.genders.includes(champion.gender)) {
                            return false;
                        }
                    } else {
                        // OR logic
                        if (!champion.gender || !activeFilters.genders.includes(champion.gender)) {
                            return false;
                        }
                    }
                }

                // Check resources (adaptive logic)
                if (activeFilters.resources.length > 0) {
                    if (activeFilters.resources.length <= 2) {
                        // AND logic
                        if (!champion.partype || !activeFilters.resources.includes(champion.partype)) {
                            return false;
                        }
                    } else {
                        // OR logic
                        if (!champion.partype || !activeFilters.resources.includes(champion.partype)) {
                            return false;
                        }
                    }
                }

                // Check roles (adaptive logic)
                if (activeFilters.roles.length > 0) {
                    if (activeFilters.roles.length <= 2) {
                        // AND logic: champion must have ALL selected roles
                        const hasAllRoles = activeFilters.roles.every(role =>
                            champion.tags?.includes(role)
                        );
                        if (!hasAllRoles) return false;
                    } else {
                        // OR logic: champion must have AT LEAST ONE selected role
                        const hasAnyRole = champion.tags?.some(tag =>
                            activeFilters.roles.includes(tag)
                        );
                        if (!hasAnyRole) return false;
                    }
                }

                return true;
            });
        }

        // Apply search query
        const lowerQuery = query.toLowerCase();
        if (lowerQuery) {
            result = result.filter((champion) => {
                // Recherche dans le nom et le titre
                if (champion.name.toLowerCase().includes(lowerQuery)) return true;
                if (champion.title.toLowerCase().includes(lowerQuery)) return true;

                // Recherche dans les factions (DB)
                if (champion.factions?.some(f => f.toLowerCase().includes(lowerQuery))) return true;

                // Recherche dans le genre et l'espèce (DB)
                if (champion.gender?.toLowerCase().includes(lowerQuery)) return true;
                if (champion.species?.toLowerCase().includes(lowerQuery)) return true;

                // Recherche dans les tags personnalisés (DB)
                if (champion.custom_tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

                // Recherche dans les tags officiels (Riot)
                if (champion.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

                return false;
            });
        }

        return result;
    }, [query, champions, activeFilters]);

    return (
        <div className="w-full">{/* Removed max-w-7xl mx-auto - handled by parent */}
            {/* Unified Search and Filter Bar */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-4">
                    {/* Search Bar - Fixed width, centered */}
                    <div className="relative w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 sm:text-sm transition-all shadow-lg"
                            placeholder={t.home.searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Buttons - Centered */}
                    <div className="flex-shrink-0">
                        <FilterBar
                            lang={lang}
                            activeFilters={activeFilters}
                            onFiltersChange={setActiveFilters}
                            filterOptions={filterOptions}
                        />
                    </div>
                </div>

                {/* Active Filters Display */}
                {Object.values(activeFilters).some(arr => arr.length > 0) && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Filtres actifs:
                        </span>
                        {Object.entries(activeFilters).map(([category, values]) =>
                            values.map((value: string) => {
                                const toggleFilter = (cat: string, val: string) => {
                                    const newFilters = { ...activeFilters };
                                    const key = cat as keyof ActiveFilters;
                                    newFilters[key] = newFilters[key].filter(v => v !== val);
                                    setActiveFilters(newFilters);
                                };

                                return (
                                    <span
                                        key={`${category}-${value}`}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
                                    >
                                        {value}
                                        <button
                                            onClick={() => toggleFilter(category, value)}
                                            className="hover:text-yellow-300 transition-colors font-bold"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {(Object.values(activeFilters).some(arr => arr.length > 0) || query) && (
                <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm">
                        {filteredChampions.length} {filteredChampions.length === 1 ? 'champion trouvé' : 'champions trouvés'}
                    </p>
                </div>
            )}

            {/* Grid */}
            {filteredChampions.length > 0 ? (
                <section
                    className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
            gap-6 place-items-center mx-auto
          "
                >
                    {filteredChampions.map((champion) => (
                        <ChampionCard
                            key={champion.id}
                            champion={champion}
                            lang={lang}
                        />
                    ))}
                </section>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    <p className="text-xl">{t.home.noResults.replace('{query}', query)}</p>
                </div>
            )}
        </div>
    );
}
