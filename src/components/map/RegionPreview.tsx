'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useGetRegionShardQuery } from '@/store/api';

interface Character {
    id: string;
    name: string;
    thumbnail: string;
    type: string;
}

interface RegionPreviewProps {
    regionId: string;
    name: string;
    description: string;
    icon: string;
    onClose: () => void;
    locale: string;
}

export default function RegionPreview({ regionId, name, description, icon, onClose, locale }: RegionPreviewProps) {
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const { data: shardData, isLoading: loading } = useGetRegionShardQuery(regionId, { skip: !regionId });

    useEffect(() => {
        if (shardData) {
            const validCharacters = shardData.filter((c: any) => c.thumbnail);
            const shuffled = [...validCharacters].sort(() => Math.random() - 0.5);
            setCharacters(shuffled);
        }
    }, [shardData]);

    const handleGoToPage = () => {
        router.push(`/region/${regionId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-lg hex-panel rounded-2xl p-6 overflow-hidden border-2"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Image src={icon} alt="" width={120} height={120} className="grayscale brightness-200" />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                        <Image src={icon} alt={name} fill className="object-contain" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{name}</h2>
                        <p className="text-white/60 text-sm line-clamp-2">{description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Fast Scrolling Icons */}
                <div className="relative h-16 overflow-hidden bg-hextech-cyan/5 rounded-xl flex items-center group/scroll border border-hextech-gold/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                    {!loading && characters.length > 0 ? (
                        <div className="flex whitespace-nowrap">
                            <motion.div
                                className="flex gap-3 px-3"
                                animate={{ x: [0, -(characters.length * 52)] }}
                                transition={{
                                    duration: characters.length * 0.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                {characters.map((char) => (
                                    <div key={char.id} className="w-12 h-12 relative flex-shrink-0 rounded-full overflow-hidden border-2 border-hextech-gold/50 hover:border-hextech-cyan shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-colors cursor-help group/icon">
                                        <Image
                                            src={char.thumbnail}
                                            alt={char.name}
                                            fill
                                            className="object-cover group-hover/icon:scale-110 transition-transform duration-300"
                                            sizes="48px"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover/icon:opacity-20 transition-opacity" />
                                    </div>
                                ))}
                                {/* Duplicate for continuity */}
                                {characters.map((char) => (
                                    <div key={`${char.id}-dup`} className="w-12 h-12 relative flex-shrink-0 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                                        <Image
                                            src={char.thumbnail}
                                            alt={char.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    ) : loading ? (
                        <div className="w-full h-full flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span className="text-white/40 text-xs uppercase tracking-tighter">Chargement...</span>
                        </div>
                    ) : (
                        <div className="w-full text-center text-white/20 text-xs uppercase tracking-widest font-medium">
                            Aucun personnage repertorié
                        </div>
                    )}

                    {/* Shadow overlays for depth */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
                </div>

                <button
                    onClick={handleGoToPage}
                    className="w-full py-3 bg-hextech-bg text-hextech-gold border border-hextech-gold/40 shadow-[inset_0_0_15px_rgba(212,175,55,0.2)] font-bold rounded-xl hover:bg-hextech-cyan/20 hover:text-white hover:border-hextech-cyan transition-all duration-300 flex items-center justify-center gap-2 group tracking-wider uppercase"
                >
                    Explorer la région
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
}
