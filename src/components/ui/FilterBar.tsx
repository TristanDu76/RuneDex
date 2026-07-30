'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export interface ActiveFilters {
    regions: string[];
    races: string[];
    genders: string[];
    resources: string[];
    roles: string[];
}

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterBarProps {
    activeFilters: ActiveFilters;
    onFiltersChange: (filters: ActiveFilters) => void;
    filterOptions: {
        races: FilterOption[];
        genders: FilterOption[];
        regions: FilterOption[];
        resources: FilterOption[];
        roles: FilterOption[];
    };
}

export default function FilterBar({
    activeFilters,
    onFiltersChange,
    filterOptions,
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);
    const mobileFilterCloseRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isMobilePanelOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobilePanelOpen(false);
                mobileFilterTriggerRef.current?.focus();
            }
        };

        mobileFilterCloseRef.current?.focus();
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobilePanelOpen]);

    const closeMobileFilters = () => {
        setIsMobilePanelOpen(false);
        mobileFilterTriggerRef.current?.focus();
    };

    const toggleFilter = (category: keyof ActiveFilters, value: string) => {
        const newFilters = { ...activeFilters };
        const index = newFilters[category].indexOf(value);

        if (index > -1) {
            newFilters[category] = newFilters[category].filter(v => v !== value);
        } else {
            newFilters[category] = [...newFilters[category], value];
        }

        onFiltersChange(newFilters);
    };

    const clearAllFilters = () => {
        onFiltersChange({
            regions: [],
            races: [],
            genders: [],
            resources: [],
            roles: [],
        });
        setOpenDropdown(null);
    };

    const getActiveFilterCount = () => {
        return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
    };

    const getTranslationKey = (category: keyof ActiveFilters) => {
        switch (category) {
            case 'regions': return 'factions';
            case 'races': return 'species';
            case 'genders': return 'gender';
            case 'resources': return 'resource';
            case 'roles': return 'roles';
            default: return category;
        }
    };

    const getOptionLabel = (category: keyof ActiveFilters, option: FilterOption) => {
        const key = `${getTranslationKey(category)}.${option.value}`;
        return t.has(key) ? t(key) : option.label;
    };

    const renderDropdownButton = (
        category: keyof ActiveFilters,
        label: string,
        icon: string,
        options: FilterOption[]
    ) => {
        const activeCount = activeFilters[category].length;
        const isOpen = openDropdown === category;
        const translationKey = getTranslationKey(category);

        if (options.length === 0) return null;

        return (
            <div className="relative" ref={isOpen ? dropdownRef : null}>
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeCount > 0
                        ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                >
                    <span>{icon}</span>
                    <span>{label}</span>
                    {activeCount > 0 && (
                        <span className="bg-gray-900 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            {activeCount}
                        </span>
                    )}
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full mt-2 left-0 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
                        <div className="p-3">
                            {options.map((option) => {
                                const isActive = activeFilters[category].includes(option.value);
                                return (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => toggleFilter(category, option.value)}
                                            className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-700 cursor-pointer"
                                        />
                                        <span className={`flex-1 text-sm ${isActive ? 'text-yellow-400 font-semibold' : 'text-gray-300'
                                            }`}>
                                            {t.has(`${translationKey}.${option.value}`) ? t(`${translationKey}.${option.value}`) : option.label}
                                        </span>
                                        {option.count !== undefined && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : 'bg-gray-700 text-gray-500'
                                                }`}>
                                                {option.count}
                                            </span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderMobileFilterGroup = (
        category: keyof ActiveFilters,
        label: string,
        icon: string,
        options: FilterOption[]
    ) => {
        if (options.length === 0) return null;

        return (
            <section key={category} className="border border-hextech-gold/20 bg-black/20 p-3">
                <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-hextech-gold">
                    <span aria-hidden="true">{icon}</span>
                    {label}
                    {activeFilters[category].length > 0 && (
                        <span className="rounded-full bg-hextech-gold px-2 py-0.5 text-[10px] text-hextech-bg">
                            {activeFilters[category].length}
                        </span>
                    )}
                </h2>
                <div className="grid grid-cols-1 gap-1">
                    {options.map((option) => {
                        const isActive = activeFilters[category].includes(option.value);

                        return (
                            <label
                                key={option.value}
                                className={`flex min-h-10 items-center gap-3 px-2 text-sm transition-colors ${isActive
                                    ? 'bg-hextech-gold/15 text-hextech-gold'
                                    : 'text-gray-300'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => toggleFilter(category, option.value)}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-hextech-gold focus:ring-hextech-gold"
                                />
                                <span className="flex-1">{getOptionLabel(category, option)}</span>
                                {option.count !== undefined && <span className="text-xs text-gray-500">{option.count}</span>}
                            </label>
                        );
                    })}
                </div>
            </section>
        );
    };

    const activeCount = getActiveFilterCount();

    return (
        <div>
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
                {renderDropdownButton('regions', t('filters.region'), '🗺️', filterOptions.regions)}
                {renderDropdownButton('races', t('filters.race'), '🧬', filterOptions.races)}
                {renderDropdownButton('genders', t('filters.gender'), '⚧️', filterOptions.genders)}
                {renderDropdownButton('resources', t('filters.resource'), '⚡', filterOptions.resources)}
                {renderDropdownButton('roles', t('filters.role'), '⚔️', filterOptions.roles)}

                {activeCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
                    >
                        ✕ Effacer
                    </button>
                )}
            </div>

            <div className="sm:hidden">
                <button
                    type="button"
                    ref={mobileFilterTriggerRef}
                    onClick={() => setIsMobilePanelOpen(true)}
                    aria-expanded={isMobilePanelOpen}
                    aria-controls="champion-filters"
                    className="flex min-h-12 items-center gap-2 rounded-lg border border-hextech-gold/40 bg-hextech-panel px-4 text-sm font-semibold text-hextech-gold shadow-[inset_0_0_10px_rgba(56,189,248,0.08)]"
                >
                    <span aria-hidden="true">☷</span>
                    Filtres
                    {activeCount > 0 && (
                        <span className="rounded-full bg-hextech-gold px-2 py-0.5 text-xs text-hextech-bg">{activeCount}</span>
                    )}
                </button>
            </div>

            <div
                id="champion-filters"
                className={`fixed inset-0 z-[100] bg-black/70 p-4 sm:hidden ${isMobilePanelOpen ? 'block' : 'hidden'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Filtres des champions"
            >
                <div className="mx-auto flex h-full max-w-md flex-col border border-hextech-gold/50 bg-hextech-bg shadow-2xl">
                    <div className="flex items-center justify-between border-b border-hextech-gold/30 px-4 py-4">
                        <div>
                            <p className="hex-title text-xl uppercase">Filtres</p>
                            <p className="mt-1 text-xs text-gray-400">{activeCount} actif{activeCount > 1 ? 's' : ''}</p>
                        </div>
                        <button
                            type="button"
                            onClick={closeMobileFilters}
                            ref={mobileFilterCloseRef}
                            className="p-2 text-2xl text-hextech-gold"
                            aria-label="Fermer les filtres"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {renderMobileFilterGroup('regions', t('filters.region'), '🗺️', filterOptions.regions)}
                        {renderMobileFilterGroup('races', t('filters.race'), '🧬', filterOptions.races)}
                        {renderMobileFilterGroup('genders', t('filters.gender'), '⚧️', filterOptions.genders)}
                        {renderMobileFilterGroup('resources', t('filters.resource'), '⚡', filterOptions.resources)}
                        {renderMobileFilterGroup('roles', t('filters.role'), '⚔️', filterOptions.roles)}
                    </div>
                    <div className="flex gap-3 border-t border-hextech-gold/30 p-4">
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            disabled={activeCount === 0}
                            className="min-h-11 flex-1 border border-red-500/40 px-3 text-sm font-semibold text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Effacer
                        </button>
                        <button
                            type="button"
                            onClick={closeMobileFilters}
                            className="min-h-11 flex-1 border border-hextech-gold bg-hextech-gold px-3 text-sm font-semibold text-hextech-bg"
                        >
                            Voir les résultats
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #eab308, #ca8a04);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #fbbf24, #eab308);
                }
            `}</style>
        </div>
    );
}
