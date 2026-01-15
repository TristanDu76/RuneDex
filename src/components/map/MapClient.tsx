'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { X } from 'lucide-react';

interface Region {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    color: string;
    // SVG path coordinates (simplified polygons for each region)
    // Format: "x1,y1 x2,y2 x3,y3 ..." (percentage-based)
    polygon: string;
}

// Image dimensions: 9181 x 5880
const IMAGE_WIDTH = 9181;
const IMAGE_HEIGHT = 5880;

// Helper function to convert absolute coords to percentage
const coordsToPercentage = (coords: string): string => {
    const points = coords.split(',').map(Number);
    const percentagePoints: string[] = [];

    for (let i = 0; i < points.length; i += 2) {
        const x = (points[i] / IMAGE_WIDTH * 100).toFixed(2);
        const y = (points[i + 1] / IMAGE_HEIGHT * 100).toFixed(2);
        percentagePoints.push(`${x},${y}`);
    }

    return percentagePoints.join(' ');
};

const regions: Region[] = [
    {
        id: 'demacia',
        name: 'Demacia',
        nameEn: 'Demacia',
        description: 'Royaume de justice et d\'honneur',
        descriptionEn: 'Kingdom of justice and honor',
        color: '#C8AA6E',
        polygon: '2599,2101 2640,2174 2672,2190 2729,2230 2729,2271 2786,2287 2826,2328 2843,2376 2867,2417 2859,2457 2835,2498 2786,2498 2680,2474 2640,2466 2608,2425 2535,2433 2478,2425 2397,2441 2348,2433 2332,2474 2324,2571 2291,2587 2307,2636 2243,2701 2307,2774 2332,2790 2389,2782 2413,2822 2389,2782 2389,2879 2340,2887 2324,2928 2291,2887 2243,2847 2218,2806 2153,2806 2097,2822 2072,2863 2015,2839 1959,2806 1902,2749 1845,2758 1796,2733 1723,2717 1691,2676 1723,2644 1675,2620 1659,2587 1659,2506 1723,2514 1740,2563 1796,2595 1910,2555 1878,2514 1902,2466 1853,2449 1756,2441 1707,2425 1659,2328 1691,2279 1723,2222 1772,2190 1845,2190 1886,2157 1934,2149 1934,2125 1991,2109 2056,2084 2113,2101 2170,2133 2218,2109 2283,2149 2356,2149 2397,2133 2437,2157 2510,2141 2551,2109'
    },
    {
        id: 'shurima',
        name: 'Shurima',
        nameEn: 'Shurima',
        description: 'Empire du désert',
        descriptionEn: 'Desert empire',
        color: '#E0C48A',
        polygon: '2794,3788 2810,3723 2851,3682 2891,3633 2932,3569 3037,3520 3127,3512 3224,3528 3248,3601 3297,3682 3467,3731 3532,3682 3613,3617 3613,3528 3565,3471 3589,3439 3654,3471 3694,3447 3743,3471 3767,3528 3824,3536 3865,3496 3897,3414 3954,3439 3970,3528 4035,3544 4140,3487 4254,3560 4400,3455 4449,3487 4457,3544 4546,3625 4611,3633 4627,3585 4692,3609 4749,3788 4692,3893 4749,4104 4919,4242 4911,4355 4789,4396 4724,4453 4627,4477 4578,4542 4481,4574 4424,4542 4400,4704 4303,4680 4221,4712 4173,4745 4059,4720 3800,4818 3719,4834 3638,4891 3548,5061 3492,5028 3459,4882 3354,4801 3346,4712 3216,4599 3273,4517 3256,4453 3208,4428 3216,4347 3191,4298 3127,4307 2972,4096 2867,4104 2891,4047 2883,3885 2851,3836'
    }
    // TODO: Add other regions here with their coordinates from image-map.net
];

interface MapClientProps {
    locale: string;
}

export default function MapClient({ locale }: MapClientProps) {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const router = useRouter();

    const handleRegionClick = (region: Region) => {
        setSelectedRegion(region);
    };

    const handleViewChampions = () => {
        if (selectedRegion) {
            router.push(`/?region=${selectedRegion.id}`);
        }
    };

    const isEn = locale.startsWith('en');

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Map Container */}
            <div className="relative w-full max-w-6xl aspect-video">
                {/* Base Map Image */}
                <Image
                    src="/images/runeterra-map.png"
                    alt="Carte de Runeterra"
                    fill
                    className="object-contain rounded-2xl"
                    priority
                />

                {/* SVG Overlay for Interactive Regions */}
                <svg
                    viewBox="0 0 9181 5880"
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: 'none' }}
                >
                    {regions.map((region) => (
                        <motion.polygon
                            key={region.id}
                            points={region.polygon}
                            fill={region.color}
                            fillOpacity={hoveredRegion === region.id ? 0.5 : 0.2}
                            stroke={region.color}
                            strokeWidth="0.5"
                            className="cursor-pointer transition-all"
                            style={{ pointerEvents: 'auto' }}
                            onMouseEnter={() => setHoveredRegion(region.id)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            onClick={() => handleRegionClick(region)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </svg>

                {/* Region Labels (on hover) */}
                {hoveredRegion && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/50 pointer-events-none">
                        <p className="text-yellow-400 font-bold text-lg">
                            {regions.find(r => r.id === hoveredRegion)?.[isEn ? 'nameEn' : 'name']}
                        </p>
                    </div>
                )}
            </div>

            {/* Region Detail Panel */}
            <AnimatePresence>
                {selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedRegion(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 shadow-2xl relative"
                            style={{ borderColor: selectedRegion.color }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedRegion(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Region Name */}
                            <h2
                                className="text-4xl font-bold mb-4"
                                style={{ color: selectedRegion.color }}
                            >
                                {selectedRegion[isEn ? 'nameEn' : 'name']}
                            </h2>

                            {/* Region Description */}
                            <p className="text-gray-300 mb-6 text-lg">
                                {selectedRegion[isEn ? 'descriptionEn' : 'description']}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={handleViewChampions}
                                className="w-full py-3 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                style={{ backgroundColor: selectedRegion.color }}
                            >
                                {isEn ? 'View Champions' : 'Voir les Champions'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
