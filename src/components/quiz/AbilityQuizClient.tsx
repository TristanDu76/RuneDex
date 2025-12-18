'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ChampionData, ChampionSpell, ChampionPassive } from '@/types/champion';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefreshCw, Zap } from 'lucide-react';

interface AbilityQuizClientProps {
    champions: ChampionData[];
}

type SpellType = 'P' | 'Q' | 'W' | 'E' | 'R';

interface GameState {
    champion: ChampionData | null;
    spell: ChampionSpell | ChampionPassive | null;
    spellType: SpellType | null;
    phase: 'guess_champion' | 'guess_spell' | 'result';
    score: number;
    streak: number;
    attempts: number;
    wrongGuesses: string[];
    rotation: number;
}

export default function AbilityQuizClient({ champions }: AbilityQuizClientProps) {
    const t = useTranslations('quiz');

    // Difficulty Settings
    const [settings, setSettings] = useState({
        grayscale: true,
        rotate: true
    });

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        champion: null,
        spell: null,
        spellType: null,
        phase: 'guess_champion',
        score: 0,
        streak: 0,
        attempts: 0,
        wrongGuesses: [],
        rotation: 0
    });

    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    // Filter champions for valid spells
    const validChampions = useMemo(() => {
        return champions.filter(c => c.spells && c.spells.length > 0 && c.passive);
    }, [champions]);

    // Start New Round
    const startRound = () => {
        if (validChampions.length === 0) return;

        const randomChamp = validChampions[Math.floor(Math.random() * validChampions.length)];

        // Pick random spell (0-3 for QWER, 4 for Passive)
        const spellIndex = Math.floor(Math.random() * 5);
        let targetSpell: ChampionSpell | ChampionPassive;
        let type: SpellType;

        if (spellIndex === 4) {
            targetSpell = randomChamp.passive!;
            type = 'P';
        } else {
            targetSpell = randomChamp.spells![spellIndex];
            const types: SpellType[] = ['Q', 'W', 'E', 'R'];
            type = types[spellIndex];
        }

        // Random rotation if enabled (0, 90, 180, 270)
        const rotation = settings.rotate ? Math.floor(Math.random() * 4) * 90 : 0;

        setGameState(prev => ({
            ...prev,
            champion: randomChamp,
            spell: targetSpell,
            spellType: type,
            phase: 'guess_champion',
            attempts: 0,
            wrongGuesses: [],
            rotation
        }));

        setInput('');
        setShowSuggestions(false);

        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Initial Start
    useEffect(() => {
        startRound();
    }, []); // Settings apply to next round only

    // Suggestions Logic
    const filteredChampions = useMemo(() => {
        if (!input) return [];
        const wrongIds = new Set(gameState.wrongGuesses);
        return champions
            .filter(c => !wrongIds.has(c.id) && c.name.toLowerCase().startsWith(input.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 5);
    }, [input, champions, gameState.wrongGuesses]);

    const handleChampionGuess = (guess: ChampionData) => {
        if (gameState.phase !== 'guess_champion' || !gameState.champion) return;

        if (guess.id === gameState.champion.id) {
            // Correct Champion -> Move to Spell Guess
            setGameState(prev => ({
                ...prev,
                phase: 'guess_spell'
            }));
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
        }
        setShowSuggestions(false);
    };

    const handleSpellGuess = (guessedType: SpellType) => {
        if (gameState.phase !== 'guess_spell' || !gameState.spellType) return;

        if (guessedType === gameState.spellType) {
            // Correct Spell
            setGameState(prev => ({
                ...prev,
                phase: 'result',
                score: prev.score + Math.max(1, 10 - prev.attempts) + (prev.streak * 2),
                streak: prev.streak + 1
            }));
        } else {
            // Wrong Spell -> Reset streak but maybe let them try again? Or fail?
            // Let's say wrong spell guess breaks streak but finishes round
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
    const getSpellImageUrl = (champion: ChampionData, spell: ChampionSpell | ChampionPassive, type: SpellType) => {
        if (type === 'P') {
            return `https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/passive/${spell.image.full}`;
        } else {
            return `https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/spell/${spell.image.full}`;
        }
    };

    // Image Style
    const getImageStyle = () => {
        const style: React.CSSProperties = {
            transition: 'all 0.5s ease'
        };

        if (gameState.phase !== 'result') {
            if (settings.grayscale) {
                style.filter = 'grayscale(100%)';
            }
            if (settings.rotate) {
                style.transform = `rotate(${gameState.rotation}deg)`;
            }
        }

        return style;
    };

    if (validChampions.length === 0) return <div className="text-white text-center mt-10">No champions with spells found. Please check database.</div>;

    if (!gameState.champion || !gameState.spell) return <div className="text-white">{t('loading')}</div>;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">

            {/* Settings Toggles */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setSettings(s => ({ ...s, grayscale: !s.grayscale }))}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${settings.grayscale ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                >
                    {settings.grayscale ? '⚫ ' + t('grayscale') + ' ON' : '⚪ ' + t('grayscale') + ' OFF'}
                </button>
                <button
                    onClick={() => setSettings(s => ({ ...s, rotate: !s.rotate }))}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${settings.rotate ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                >
                    {settings.rotate ? '🔄 ' + t('rotate') + ' ON' : '🔄 ' + t('rotate') + ' OFF'}
                </button>
            </div>

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
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 mx-auto">

                {/* Image Layer */}
                <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-600 shadow-inner bg-black">
                        <Image
                            src={getSpellImageUrl(gameState.champion, gameState.spell, gameState.spellType!)}
                            alt="Guess the ability"
                            fill
                            className="object-cover"
                            style={getImageStyle()}
                        />
                    </div>
                </div>

                {/* Result Overlay */}
                {gameState.phase === 'result' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-center z-20 p-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            {/* Success/Failure Message */}
                            <div className={`text-3xl font-bold mb-3 ${gameState.streak > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {gameState.streak > 0 ? `✅ ${t('correct')}` : `❌ ${t('wrong')}`}
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">{gameState.champion.name}</h2>
                            <p className="text-sm text-yellow-400 mb-1 font-bold">
                                {gameState.spellType === 'P' ? 'Passive' : `Spell ${gameState.spellType}`}
                            </p>
                            <p className="text-xs text-gray-300 mb-4 line-clamp-2 px-2">
                                {gameState.spell.name}
                            </p>
                            <button
                                onClick={startRound}
                                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-colors shadow-lg flex items-center gap-2 mx-auto text-sm"
                            >
                                <RefreshCw size={16} />
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
                            className="w-full py-4 px-6 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 shadow-lg text-lg"
                        />

                        {/* Suggestions */}
                        {showSuggestions && input && (
                            <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-xl mt-2 shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50">
                                {filteredChampions.map((c, idx) => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleChampionGuess(c)}
                                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors text-left ${idx === selectedIndex ? 'bg-gray-700 border-l-4 border-blue-500' : ''}`}
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

                {gameState.phase === 'guess_spell' && (
                    <div className="w-full">
                        <h3 className="text-center text-lg font-medium text-gray-300 mb-4">{t('guessSpell')}</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {(['P', 'Q', 'W', 'E', 'R'] as SpellType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleSpellGuess(type)}
                                    className="aspect-square rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
