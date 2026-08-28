'use client';

import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefreshCw, Eye, Wand2 } from 'lucide-react';
import { createSkinOptions, createSkinRound, moveQuizOptionIndex, type SkinQuizChampion, type SkinQuizSkin } from '@/lib/quiz-rounds';
import { getSearchRank } from '@/lib/search-utils';

interface SkinQuizClientProps {
    champions: SkinQuizChampion[];
}

type QuizMode = 'blur_gray' | 'zoom';

interface GameState {
    champion: SkinQuizChampion | null;
    skin: SkinQuizSkin | null;
    mode: QuizMode;
    phase: 'guess_champion' | 'guess_skin' | 'result';
    score: number;
    streak: number;
    zoomOrigin: { x: number, y: number };
    attempts: number;
    wrongGuesses: string[];
    skinOptions: SkinQuizSkin[];
    lastAnswerCorrect: boolean | null;
}

let cachedSkinGameState: GameState | null = null;

const EMPTY_GAME_STATE: GameState = {
    champion: null,
    skin: null,
    mode: 'blur_gray',
    phase: 'guess_champion',
    score: 0,
    streak: 0,
    zoomOrigin: { x: 50, y: 50 },
    attempts: 0,
    wrongGuesses: [],
    skinOptions: [],
    lastAnswerCorrect: null,
};

export default function SkinQuizClient({ champions }: SkinQuizClientProps) {
    const t = useTranslations('quiz');
    const tChampion = useTranslations('champion');

    // Filter champions for valid skins (must have skins array)
    const validChampions = useMemo(() => {
        return champions.filter(c => c.skins && c.skins.length > 0);
    }, [champions]);
    const [gameState, setGameState] = useState<GameState>(EMPTY_GAME_STATE);
    const [isRoundReady, setIsRoundReady] = useState(false);

    useEffect(() => {
        const previousState = cachedSkinGameState;
        const champion = validChampions.find((candidate) => candidate.id === previousState?.champion?.id) ?? previousState?.champion ?? null;
        const findSkin = (skin: SkinQuizSkin | null | undefined) => champion?.skins?.find((candidate) => candidate.id === skin?.id) ?? skin ?? null;
        const freshRound = createSkinRound(validChampions);

        const nextState = previousState
            ? {
                ...previousState,
                champion,
                skin: findSkin(previousState.skin),
                skinOptions: previousState.skinOptions.map((skin) => findSkin(skin)).filter((skin): skin is SkinQuizSkin => skin !== null),
            }
            : {
                ...EMPTY_GAME_STATE,
                ...freshRound,
                champion: freshRound?.champion ?? null,
                skin: freshRound?.skin ?? null,
                zoomOrigin: freshRound?.zoomOrigin ?? EMPTY_GAME_STATE.zoomOrigin,
            };
        const timer = window.setTimeout(() => {
            setGameState(nextState);
            setIsRoundReady(true);
        }, 0);
        return () => window.clearTimeout(timer);
    }, [validChampions]);
    useEffect(() => {
        if (isRoundReady) cachedSkinGameState = gameState;
    }, [gameState, isRoundReady]);

    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    // Start New Round
    const startRound = useCallback(() => {
        if (validChampions.length === 0) return;

        const round = createSkinRound(validChampions);
        if (!round) return;

        setGameState(prev => ({
            ...prev,
            ...round,
            phase: 'guess_champion',
            attempts: 0,
            wrongGuesses: [],
            skinOptions: [],
            lastAnswerCorrect: null,
        }));

        setInput('');
        setSelectedSkinIndex(0);
        setShowSuggestions(false);

        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [validChampions]);

    // Suggestions Logic
    const filteredChampions = useMemo(() => {
        if (!input) return [];
        const wrongIds = new Set(gameState.wrongGuesses);
        return champions
            .filter(c => !wrongIds.has(c.id) && getSearchRank(c, input) >= 0)
            .sort((a, b) => getSearchRank(a, input) - getSearchRank(b, input) || a.name.localeCompare(b.name))
            .slice(0, 5);
    }, [input, champions, gameState.wrongGuesses]);

    const handleChampionGuess = (guess: SkinQuizChampion) => {
        if (gameState.phase !== 'guess_champion' || !gameState.champion || !gameState.skin) return;

        if (guess.id === gameState.champion.id) {
            // Correct Champion
            const options = createSkinOptions(gameState.champion, gameState.skin);
            setSelectedSkinIndex(0);
            setGameState(prev => ({ ...prev, phase: 'guess_skin', skinOptions: options }));
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

    const handleSkinGuess = useCallback((skin: SkinQuizSkin) => {
        if (gameState.phase !== 'guess_skin' || !gameState.skin) return;

        if (skin.id === gameState.skin.id) {
            // Correct Skin
            setGameState(prev => ({
                ...prev,
                phase: 'result',
                score: prev.score + Math.max(1, 10 - prev.attempts) + (prev.streak * 2),
                streak: prev.streak + 1,
                lastAnswerCorrect: true,
            }));
        } else {
            // Wrong Skin
            setGameState(prev => ({
                ...prev,
                phase: 'result',
                streak: 0,
                lastAnswerCorrect: false,
            }));
        }
    }, [gameState.phase, gameState.skin]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredChampions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (filteredChampions.length > 0) {
                handleChampionGuess(filteredChampions[selectedIndex]);
            }
        }
    };

    useEffect(() => {
        const handleRoundKey = (event: KeyboardEvent) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            const isInteractiveTarget = target?.isContentEditable
                || Boolean(target?.closest('input, textarea, select, button, a, [role="button"]'));
            if (event.repeat || isInteractiveTarget) return;

            if (gameState.phase === 'result' && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                startRound();
                return;
            }
            if (gameState.phase !== 'guess_skin') return;

            const moveUp = event.key === 'ArrowUp' || event.key.toLowerCase() === 'z';
            const moveDown = event.key === 'ArrowDown' || event.key.toLowerCase() === 's';
            if (moveUp || moveDown) {
                event.preventDefault();
                setSelectedSkinIndex((index) => moveQuizOptionIndex(index, moveUp ? -1 : 1, gameState.skinOptions.length));
            } else if (event.key === 'Enter' && gameState.skinOptions[selectedSkinIndex]) {
                event.preventDefault();
                handleSkinGuess(gameState.skinOptions[selectedSkinIndex]);
            }
        };

        window.addEventListener('keydown', handleRoundKey);
        return () => window.removeEventListener('keydown', handleRoundKey);
    }, [gameState.phase, gameState.skinOptions, selectedSkinIndex, handleSkinGuess, startRound]);

    // Image URL
    const getSkinImageUrl = (champion: SkinQuizChampion, skin: SkinQuizSkin) => {
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
                            <p className={`mb-3 text-2xl font-bold ${gameState.lastAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {gameState.lastAnswerCorrect ? `✓ ${t('correct')}` : `✕ ${t('wrong')}`}
                            </p>
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
                            {gameState.skinOptions.map((skin, index) => (
                                <button
                                    key={skin.id}
                                    onClick={() => handleSkinGuess(skin)}
                                    className={`w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-95 text-left flex justify-between items-center ${index === selectedSkinIndex ? 'border-purple-400 ring-1 ring-purple-400/50' : 'border-gray-600'}`}
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
