'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChampionSkin } from '@/types/champion';
import { useTranslations } from 'next-intl';

interface SkinCarouselProps {
    skins: ChampionSkin[];
    championId: string;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export default function SkinCarousel({ skins, championId }: SkinCarouselProps) {
    const t = useTranslations('champion');
    const [page, setPage] = useState([0, 0]);
    const [currentIndex, direction] = page;
    const [isPaused, setIsPaused] = useState(false);

    // Calculate the actual skin index based on the infinite page count
    const skinIndex = ((currentIndex % skins.length) + skins.length) % skins.length;
    const currentSkin = skins[skinIndex];
    const skinImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${currentSkin.num}.jpg`;

    const paginate = (newDirection: number) => {
        setPage([currentIndex + newDirection, newDirection]);
    };

    // Auto-play effect
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused]); // Re-run when index changes or pause state changes

    return (
        <div
            className="relative w-full aspect-video mx-auto overflow-hidden rounded-2xl shadow-2xl bg-gray-900 group border border-gray-800"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={currentIndex}
                    src={skinImageUrl}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={currentSkin.name}
                />
            </AnimatePresence>

            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent pointer-events-none" />

            {/* Controls */}
            <button
                onClick={() => paginate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-yellow-500/80 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            <button
                onClick={() => paginate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-yellow-500/80 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>

            {/* Skin Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                <motion.h2
                    key={currentSkin.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide"
                >
                    {currentSkin.name === 'default' ? t('baseSkin') : currentSkin.name}
                </motion.h2>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-4 flex-wrap px-10">
                    {skins.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const direction = idx > skinIndex ? 1 : -1;
                                setPage([page[0] + (idx - skinIndex), direction]);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === skinIndex ? 'bg-yellow-500 w-8' : 'bg-gray-500/50 w-2 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
