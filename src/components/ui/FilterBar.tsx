'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getTranslation } from '@/lib/translations';

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
    lang?: string;
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
    lang = 'fr_FR',
    activeFilters,
    onFiltersChange,
    filterOptions,
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = getTranslation(lang);

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

    const renderDropdownButton = (
        category: keyof ActiveFilters,
        label: string,
        icon: string,
        options: FilterOption[]
    ) => {
        const activeCount = activeFilters[category].length;
        const isOpen = openDropdown === category;

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
                                            {option.label}
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

    const activeCount = getActiveFilterCount();

    return (
        <div className="flex flex-wrap items-center gap-2">
            {renderDropdownButton('regions', t.filters.region, '🗺️', filterOptions.regions)}
            {renderDropdownButton('races', t.filters.race, '🧬', filterOptions.races)}
            {renderDropdownButton('genders', t.filters.gender, '⚧️', filterOptions.genders)}
            {renderDropdownButton('resources', t.filters.resource, '⚡', filterOptions.resources)}
            {renderDropdownButton('roles', t.filters.role, '⚔️', filterOptions.roles)}

            {activeCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors border border-red-500/30 text-sm"
                >
                    ✕ Effacer
                </button>
            )}

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
