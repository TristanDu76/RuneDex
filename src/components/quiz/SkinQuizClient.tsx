'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ChampionData, ChampionSkin } from '@/types/champion';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefreshCw, Eye, Wand2 } from 'lucide-react';

interface SkinQuizClientProps {
    champions: ChampionData[];
}

type QuizMode = 'blur_gray' | 'zoom';

interface GameState {
    champion: ChampionData | null;
    skin: ChampionSkin | null;
    mode: QuizMode;
    phase: 'guess_champion' | 'guess_skin' | 'result';
    score: number;
    streak: number;
    zoomOrigin: { x: number, y: number };
    attempts: number;
    wrongGuesses: string[];
}

export default function SkinQuizClient({ champions }: SkinQuizClientProps) {
    const t = useTranslations('quiz');
    const tChampion = useTranslations('champion');

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        champion: null,
        skin: null,
        mode: 'blur_gray',
        phase: 'guess_champion',
        score: 0,
        streak: 0,
        zoomOrigin: { x: 50, y: 50 },
        attempts: 0,
        wrongGuesses: []
    });

    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [skinOptions, setSkinOptions] = useState<ChampionSkin[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    // Filter champions for valid skins (must have skins array)
    const validChampions = useMemo(() => {
        return champions.filter(c => c.skins && c.skins.length > 0);
    }, [champions]);

    // Start New Round
    const startRound = () => {
        if (validChampions.length === 0) return;

        const randomChamp = validChampions[Math.floor(Math.random() * validChampions.length)];
        // Prefer non-base skins (num > 0), but fallback to base if only 1 skin
        const skins = randomChamp.skins || [];
        const nonBaseSkins = skins.filter(s => s.num > 0);
        const targetSkin = nonBaseSkins.length > 0
            ? nonBaseSkins[Math.floor(Math.random() * nonBaseSkins.length)]
            : skins[0];

        const modes: QuizMode[] = ['blur_gray', 'zoom'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];

        setGameState(prev => ({
            ...prev,
            champion: randomChamp,
            skin: targetSkin,
            mode: randomMode,
            phase: 'guess_champion',
            zoomOrigin: {
                x: Math.floor(Math.random() * 80) + 10, // 10% to 90%
                y: Math.floor(Math.random() * 80) + 10
            },
            attempts: 0,
            wrongGuesses: []
        }));

        setInput('');
        setSkinOptions([]);
        setShowSuggestions(false);

        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Initial Start
    useEffect(() => {
        startRound();
    }, []);

    // Prepare Skin Options when entering guess_skin phase
    useEffect(() => {
        if (gameState.phase === 'guess_skin' && gameState.champion && gameState.skin) {
            const allSkins = gameState.champion.skins || [];
            const correctSkin = gameState.skin;

            // Get 3 random wrong skins
            const wrongSkins = allSkins
                .filter(s => s.id !== correctSkin.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const options = [correctSkin, ...wrongSkins].sort(() => 0.5 - Math.random());
            setSkinOptions(options);
        }
    }, [gameState.phase, gameState.champion, gameState.skin]);

    // Suggestions Logic
    const filteredChampions = useMemo(() => {
        if (!input) return [];
        const wrongIds = new Set(gameState.wrongGuesses);
        return champions
            .filter(c => !wrongIds.has(c.id) && c.name.toLowerCase().includes(input.toLowerCase()))
            .slice(0, 5);
    }, [input, champions, gameState.wrongGuesses]);

    const handleChampionGuess = (guess: ChampionData) => {
        if (gameState.phase !== 'guess_champion' || !gameState.champion) return;

        if (guess.id === gameState.champion.id) {
            // Correct Champion
            setGameState(prev => ({ ...prev, phase: 'guess_skin' }));
            setInput('');
        } else {
            // Wrong Champion
            setGameState(prev => ({
                ...prev,
                streak: 0,
                attempts: prev.attempts + 1,
                wrongGuesses: [...prev.wrongGuesses, guess.id]
            }));
            setInput('');
            // Optional: Shake animation or toast
        }
        setShowSuggestions(false);
    };

    const handleSkinGuess = (skin: ChampionSkin) => {
        if (gameState.phase !== 'guess_skin' || !gameState.skin) return;

        if (skin.id === gameState.skin.id) {
            // Correct Skin
            setGameState(prev => ({
                ...prev,
                phase: 'result',
                score: prev.score + Math.max(1, 10 - prev.attempts) + (prev.streak * 2),
                streak: prev.streak + 1
            }));
        } else {
            // Wrong Skin
            setGameState(prev => ({
                ...prev,
                phase: 'result',
                streak: 0
            }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredChampions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredChampions.length > 0) {
                handleChampionGuess(filteredChampions[selectedIndex]);
            }
        }
    };

    // Image URL
    const getSkinImageUrl = (champion: ChampionData, skin: ChampionSkin) => {
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`;
    };

    // Style Calculation
    const getImageStyle = () => {
        if (gameState.phase === 'result') return {};

        const { mode, attempts, zoomOrigin } = gameState;

        if (mode === 'zoom') {
            // Start at 3.5, decrease by 0.35 per attempt, min 1.0
            const scale = Math.max(1.0, 3.5 - (attempts * 0.35));
            return {
                transform: `scale(${scale})`,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
            };
        }

        if (mode === 'blur_gray') {
            // Blur: Start at 15px, decrease by 3px per attempt, min 0
            const blur = Math.max(0, 10 - (attempts * 2));

            // Grayscale: Start at 100%, decrease by 20% per attempt, min 0%
            // This allows colors to appear gradually
            const grayscale = Math.max(0, 1 - (attempts * 0.2));

            return {
                filter: `blur(${blur}px) grayscale(${grayscale})`,
                transform: 'scale(1.1)' // Slight zoom to hide blur edges
            };
        }

        return {};
    };

    if (validChampions.length === 0) return <div className="text-white text-center mt-10">No champions with skins found. Please check database.</div>;

    if (!gameState.champion || !gameState.skin) return <div className="text-white">{t('loading')}</div>;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">

            {/* Score Board */}
            <div className="flex gap-8 text-xl font-bold text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="text-yellow-500">{t('score')}:</span>
                    <span>{gameState.score}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500">{t('streak')}:</span>
                    <span>{gameState.streak}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-red-400">{t('attempts')}:</span>
                    <span>{gameState.attempts}</span>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">

                {/* Image Layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image
                        src={getSkinImageUrl(gameState.champion, gameState.skin)}
                        alt="Guess the skin"
                        fill
                        className="object-cover transition-all duration-700"
                        style={getImageStyle()}
                    />
                </div>

                {/* Mode Indicator */}
                {gameState.phase !== 'result' && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-bold border border-white/10 flex items-center gap-2 z-10">
                        {gameState.mode === 'blur_gray' && <Eye size={16} className="text-blue-400" />}
                        {gameState.mode === 'zoom' && <Wand2 size={16} className="text-purple-400" />}
                        {gameState.mode === 'blur_gray' && t('modeBlur')}
                        {gameState.mode === 'zoom' && t('modeZoom')}
                    </div>
                )}

                {/* Result Overlay */}
                {gameState.phase === 'result' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 items-center text-center z-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-2">{gameState.champion.name}</h2>
                            <p className="text-xl text-yellow-400 mb-6">{gameState.skin.name === 'default' ? tChampion('baseSkin') : gameState.skin.name}</p>
                            <button
                                onClick={startRound}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-colors shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw size={20} />
                                {t('nextRound')}
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="w-full max-w-md relative z-20">
                {gameState.phase === 'guess_champion' && (
                    <div className="relative">
                        <h3 className="text-center text-lg font-medium text-gray-300 mb-2">{t('guessChampion')}</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setShowSuggestions(true);
                                setSelectedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={t('typePlaceholder')}
                            className="w-full py-4 px-6 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 shadow-lg text-lg"
                        />

                        {/* Suggestions */}
                        {showSuggestions && input && (
                            <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-xl mt-2 shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50">
                                {filteredChampions.map((c, idx) => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleChampionGuess(c)}
                                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors text-left ${idx === selectedIndex ? 'bg-gray-700 border-l-4 border-purple-500' : ''}`}
                                    >
                                        <Image
                                            src={`https://ddragon.leagueoflegends.com/cdn/${c.version}/img/champion/${c.image.full}`}
                                            alt={c.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <span className="text-white font-medium">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {gameState.phase === 'guess_skin' && (
                    <div className="w-full">
                        <h3 className="text-center text-lg font-medium text-gray-300 mb-4">{t('guessSkin')}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {skinOptions.map((skin) => (
                                <button
                                    key={skin.id}
                                    onClick={() => handleSkinGuess(skin)}
                                    className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-95 text-left flex justify-between items-center"
                                >
                                    <span>{skin.name === 'default' ? tChampion('baseSkin') : skin.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
