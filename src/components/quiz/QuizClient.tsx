'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ChampionData } from '@/types/champion';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, HelpCircle, X, Lightbulb } from 'lucide-react';

interface QuizClientProps {
    champions: ChampionData[];
}

interface GuessResult {
    champion: ChampionData;
    gender: 'correct' | 'incorrect';
    species: 'correct' | 'incorrect' | 'partial';
    resource: 'correct' | 'incorrect';
    region: 'correct' | 'incorrect' | 'partial';
    lane: 'correct' | 'incorrect' | 'partial';
    role: 'correct' | 'incorrect' | 'partial';
}

type Category = 'gender' | 'species' | 'resource' | 'region' | 'lane' | 'role';

export default function QuizClient({ champions }: QuizClientProps) {
    const [targetChampion, setTargetChampion] = useState<ChampionData | null>(null);
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [input, setInput] = useState('');
    const [isWon, setIsWon] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showHelper, setShowHelper] = useState(false);
    const [unlockedHints, setUnlockedHints] = useState<Set<Category>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const t = useTranslations();

    // Initialize random champion
    useEffect(() => {
        if (champions.length > 0) {
            const random = champions[Math.floor(Math.random() * champions.length)];
            setTargetChampion(random);
            console.log('Target:', random.name);
        }
    }, [champions]);

    const filteredChampions = useMemo(() => {
        if (!input) return [];
        const guessedIds = new Set(guesses.map(g => g.champion.id));
        return champions
            .filter(c => !guessedIds.has(c.id) && c.name.toLowerCase().includes(input.toLowerCase()))
            .slice(0, 5);
    }, [input, champions, guesses]);

    // Reset selected index when input changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [input]);

    const normalize = (val: string | undefined): string => {
        if (!val || val === 'None') return '';
        return val.trim().toLowerCase();
    };

    const checkMatch = (target: string | string[] | undefined, guess: string | string[] | undefined): 'correct' | 'incorrect' | 'partial' => {
        const targetArr = (Array.isArray(target) ? target : [target || ''])
            .map(s => normalize(s))
            .filter(s => s !== '');

        const guessArr = (Array.isArray(guess) ? guess : [guess || ''])
            .map(s => normalize(s))
            .filter(s => s !== '');

        if (targetArr.length === 0 || guessArr.length === 0) return 'incorrect';

        const allTargetInGuess = targetArr.every(t => guessArr.includes(t));
        const allGuessInTarget = guessArr.every(g => targetArr.includes(g));

        if (allTargetInGuess && allGuessInTarget) return 'correct';

        const intersection = targetArr.filter(t => guessArr.includes(t));
        if (intersection.length > 0) return 'partial';

        return 'incorrect';
    };

    const handleGuess = (champion: ChampionData) => {
        if (!targetChampion || isWon) return;

        const newGuess: GuessResult = {
            champion,
            gender: checkMatch(targetChampion.gender, champion.gender) as 'correct' | 'incorrect',
            species: checkMatch(targetChampion.species, champion.species),
            resource: checkMatch(targetChampion.partype, champion.partype) as 'correct' | 'incorrect',
            region: checkMatch(targetChampion.factions, champion.factions),
            lane: checkMatch(targetChampion.lanes, champion.lanes),
            role: checkMatch(targetChampion.tags, champion.tags),
        };

        const newGuesses = [newGuess, ...guesses];
        setGuesses(newGuesses);
        setInput('');
        setShowSuggestions(false);
        setSelectedIndex(0);

        // Hint Logic: Every 5 guesses, unlock a random category
        if (newGuesses.length % 5 === 0) {
            unlockRandomHint(newGuesses);
        }

        if (champion.id === targetChampion.id) {
            setIsWon(true);
        }

        // Keep focus on input
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const unlockRandomHint = (currentGuesses: GuessResult[]) => {
        // Max 3 hints allowed
        if (unlockedHints.size >= 3) return;

        const categories: Category[] = ['gender', 'species', 'resource', 'region', 'lane', 'role'];

        // Priority 1: Categories neither unlocked nor guessed correctly
        let availableCategories = categories.filter(cat => {
            if (unlockedHints.has(cat)) return false;
            // Check if user already found it
            const found = currentGuesses.some(g => g[cat] === 'correct');
            return !found;
        });

        // Priority 2: Fallback to any locked category if all were guessed correctly
        if (availableCategories.length === 0) {
            availableCategories = categories.filter(cat => !unlockedHints.has(cat));
        }

        if (availableCategories.length > 0) {
            const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
            setUnlockedHints(prev => new Set(prev).add(randomCat));
        }
    };

    // Retroactive Hint Check (Safety Net)
    useEffect(() => {
        const expectedHints = Math.min(3, Math.floor(guesses.length / 5));
        if (unlockedHints.size < expectedHints) {
            setUnlockedHints(prev => {
                const newSet = new Set(prev);
                let needed = expectedHints - newSet.size;
                const categories: Category[] = ['gender', 'species', 'resource', 'region', 'lane', 'role'];

                while (needed > 0) {
                    // Try to find categories not yet guessed correctly
                    let candidates = categories.filter(cat => {
                        if (newSet.has(cat)) return false;
                        const found = guesses.some(g => g[cat] === 'correct');
                        return !found;
                    });

                    // Fallback
                    if (candidates.length === 0) {
                        candidates = categories.filter(cat => !newSet.has(cat));
                    }

                    if (candidates.length === 0) break;

                    const randomCat = candidates[Math.floor(Math.random() * candidates.length)];
                    newSet.add(randomCat);
                    needed--;
                }
                return newSet;
            });
        }
    }, [guesses, unlockedHints.size]);

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
                handleGuess(filteredChampions[selectedIndex]);
            }
        }
    };

    const getColor = (status: 'correct' | 'incorrect' | 'partial') => {
        switch (status) {
            case 'correct': return 'bg-green-600 border-green-500';
            case 'partial': return 'bg-orange-500 border-orange-400';
            case 'incorrect': return 'bg-red-600 border-red-500';
            default: return 'bg-gray-700 border-gray-600';
        }
    };

    const translateValue = (category: 'gender' | 'species' | 'resource' | 'roles' | 'factions' | 'lanes', value: string) => {
        return t(`${category}.${value}`);
    };

    const formatList = (list: string[] | undefined, category: 'roles' | 'factions' | 'lanes') => {
        if (!list || list.length === 0) return 'N/A';
        return list.map(item => translateValue(category, item)).join(', ');
    };

    // Helper Logic
    const getClues = () => {
        const clues = {
            gender: null as string | null,
            species: null as string | null,
            resource: null as string | null,
            regions: new Set<string>(),
            lanes: new Set<string>(),
            roles: new Set<string>(),
            isRegionCorrect: false,
            isLaneCorrect: false,
            isRoleCorrect: false,
        };

        if (!targetChampion) return clues;

        // 1. Apply Unlocked Hints (Strictly Target Data)
        if (unlockedHints.has('gender')) clues.gender = targetChampion.gender || 'Unknown';
        if (unlockedHints.has('species')) clues.species = targetChampion.species || 'Unknown';
        if (unlockedHints.has('resource')) clues.resource = targetChampion.partype;
        if (unlockedHints.has('region')) {
            targetChampion.factions?.forEach(f => clues.regions.add(f));
            clues.isRegionCorrect = true;
        }
        if (unlockedHints.has('lane')) {
            targetChampion.lanes?.forEach(l => clues.lanes.add(l));
            clues.isLaneCorrect = true;
        }
        if (unlockedHints.has('role')) {
            targetChampion.tags.forEach(r => clues.roles.add(r));
            clues.isRoleCorrect = true;
        }

        // 2. Apply Correct Guesses (Strictly Target Data)
        // If we found the correct value in a previous guess, we show it.
        // We do NOT pollute this with partial guesses anymore.

        const correctRegionGuess = guesses.find(g => g.region === 'correct');
        if (correctRegionGuess) {
            correctRegionGuess.champion.factions?.forEach(f => clues.regions.add(f));
            clues.isRegionCorrect = true;
        }

        const correctLaneGuess = guesses.find(g => g.lane === 'correct');
        if (correctLaneGuess) {
            correctLaneGuess.champion.lanes?.forEach(l => clues.lanes.add(l));
            clues.isLaneCorrect = true;
        }

        const correctRoleGuess = guesses.find(g => g.role === 'correct');
        if (correctRoleGuess) {
            correctRoleGuess.champion.tags.forEach(r => clues.roles.add(r));
            clues.isRoleCorrect = true;
        }

        guesses.forEach(g => {
            if (g.gender === 'correct') clues.gender = g.champion.gender || 'Unknown';
            if (g.species === 'correct') clues.species = g.champion.species || 'Unknown';
            if (g.resource === 'correct') clues.resource = g.champion.partype;
        });

        return clues;
    };

    const clues = getClues();
    const attemptsUntilHint = 5 - (guesses.length % 5);

    if (champions.length === 0) return <div className="text-white text-center mt-10">{t('quiz.noChampions')}</div>;
    if (!targetChampion) return <div className="text-white text-center mt-10">{t('quiz.loading')}</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex gap-4 relative">

            {/* Helper Panel (Toggleable Side Panel) */}
            <AnimatePresence>
                {showHelper && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="fixed left-4 top-24 w-64 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-2xl z-40 hidden lg:block"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2">
                                <HelpCircle size={20} />
                                Clues
                            </h3>
                            <button onClick={() => setShowHelper(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-5 text-sm">
                            {[
                                { id: 'gender', label: t('champion.gender'), val: clues.gender ? translateValue('gender', clues.gender) : '???', correct: !!clues.gender },
                                { id: 'species', label: t('champion.species'), val: clues.species ? translateValue('species', clues.species) : '???', correct: !!clues.species },
                                { id: 'resource', label: t('champion.resource'), val: clues.resource ? translateValue('resource', clues.resource) : '???', correct: !!clues.resource },
                            ].map((item) => (
                                <div key={item.id}>
                                    <span className="text-gray-500 block text-xs uppercase font-bold mb-1 tracking-wider flex items-center gap-2">
                                        {item.label}
                                        {unlockedHints.has(item.id as Category) && <Lightbulb size={12} className="text-yellow-500" />}
                                    </span>
                                    <span className={`text-base font-medium ${item.correct ? "text-green-400" : "text-gray-600"}`}>
                                        {item.val}
                                    </span>
                                </div>
                            ))}

                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold mb-1 tracking-wider flex items-center gap-2">
                                    {t('champion.region')}
                                    {unlockedHints.has('region') && <Lightbulb size={12} className="text-yellow-500" />}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {clues.regions.size > 0 ? Array.from(clues.regions).map(r => (
                                        <span
                                            key={r}
                                            className={`px-2 py-0.5 rounded text-xs font-medium border ${clues.isRegionCorrect ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-orange-400 bg-orange-400/10 border-orange-400/20'}`}
                                        >
                                            {translateValue('factions', r)}
                                        </span>
                                    )) : (unlockedHints.has('region') || clues.isRegionCorrect ? (
                                        <span className="px-2 py-0.5 rounded text-xs font-medium border text-green-400 bg-green-400/10 border-green-400/20">
                                            {translateValue('factions', 'runeterra')}
                                        </span>
                                    ) : <span className="text-gray-600">???</span>)}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold mb-1 tracking-wider flex items-center gap-2">
                                    Lane
                                    {unlockedHints.has('lane') && <Lightbulb size={12} className="text-yellow-500" />}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {clues.lanes.size > 0 ? Array.from(clues.lanes).map(r => (
                                        <span
                                            key={r}
                                            className={`px-2 py-0.5 rounded text-xs font-medium border ${clues.isLaneCorrect ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-orange-400 bg-orange-400/10 border-orange-400/20'}`}
                                        >
                                            {translateValue('lanes', r)}
                                        </span>
                                    )) : <span className="text-gray-600">???</span>}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold mb-1 tracking-wider flex items-center gap-2">
                                    {t('filters.role')}
                                    {unlockedHints.has('role') && <Lightbulb size={12} className="text-yellow-500" />}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {clues.roles.size > 0 ? Array.from(clues.roles).map(r => (
                                        <span
                                            key={r}
                                            className={`px-2 py-0.5 rounded text-xs font-medium border ${clues.isRoleCorrect ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-orange-400 bg-orange-400/10 border-orange-400/20'}`}
                                        >
                                            {translateValue('roles', r)}
                                        </span>
                                    )) : <span className="text-gray-600">???</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Helper Toggle Button */}
            <button
                onClick={() => setShowHelper(!showHelper)}
                className={`fixed left-4 top-24 z-30 p-2 rounded-full shadow-lg transition-all hidden lg:flex items-center justify-center ${showHelper ? 'opacity-0 pointer-events-none' : 'bg-gray-800 text-yellow-500 border border-yellow-500/30 hover:bg-gray-700'}`}
            >
                <span className="text-xl">?</span>
            </button>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center gap-6 w-full">

                {/* Hint Progress & Unlocked Hints Display */}
                <div className="w-full max-w-lg flex flex-col gap-3">
                    {/* Progress Bar - Only show if less than 3 hints unlocked */}
                    {unlockedHints.size < 3 && (
                        <>
                            <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                                <span>{t('quiz.nextHint')} {attemptsUntilHint} {t('quiz.attempts')}</span>
                                <span>{unlockedHints.size} / 3 {t('quiz.unlockedHints')}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <motion.div
                                    className="h-full bg-yellow-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((5 - attemptsUntilHint) / 5) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </>
                    )}

                    {/* Unlocked Hints Cards */}
                    {unlockedHints.size > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            {Array.from(unlockedHints).map(cat => {
                                let label = '';
                                let val: string | React.ReactNode = '???';

                                switch (cat) {
                                    case 'gender': label = t('champion.gender'); val = clues.gender ? translateValue('gender', clues.gender) : '???'; break;
                                    case 'species': label = t('champion.species'); val = clues.species ? translateValue('species', clues.species) : '???'; break;
                                    case 'resource': label = t('champion.resource'); val = clues.resource ? translateValue('resource', clues.resource) : '???'; break;
                                    case 'region':
                                        label = t('champion.region');
                                        val = clues.regions.size > 0
                                            ? Array.from(clues.regions).map(r => translateValue('factions', r)).join(', ')
                                            : translateValue('factions', 'runeterra');
                                        break;
                                    case 'lane': label = 'Lane'; val = Array.from(clues.lanes).map(l => translateValue('lanes', l)).join(', '); break;
                                    case 'role': label = t('filters.role'); val = Array.from(clues.roles).map(r => translateValue('roles', r)).join(', '); break;
                                }

                                return (
                                    <motion.div
                                        key={cat}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 flex flex-col items-center text-center"
                                    >
                                        <span className="text-[10px] text-yellow-500 font-bold uppercase mb-1 flex items-center gap-1">
                                            <Lightbulb size={10} /> {label}
                                        </span>
                                        <span className="text-xs font-medium text-white truncate w-full">
                                            {val}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative w-full max-w-lg z-50">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('quiz.typePlaceholder')}
                        className="w-full py-3 px-5 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:border-yellow-500 shadow-lg text-sm transition-all focus:ring-2 focus:ring-yellow-500/20"
                        disabled={isWon}
                    />

                    {/* Suggestions */}
                    {showSuggestions && input && (
                        <div ref={suggestionsRef} className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-xl mt-2 shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                            {filteredChampions.map((c, idx) => (
                                <button
                                    key={c.id}
                                    onClick={() => handleGuess(c)}
                                    className={`w-full flex items-center gap-3 p-2 hover:bg-gray-700 transition-colors text-left ${idx === selectedIndex ? 'bg-gray-700 border-l-4 border-yellow-500' : ''}`}
                                >
                                    <Image
                                        src={`https://ddragon.leagueoflegends.com/cdn/${c.version}/img/champion/${c.image.full}`}
                                        alt={c.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <span className="text-white font-medium text-sm">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Win Message */}
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center p-6 bg-green-900/50 border border-green-500 rounded-xl backdrop-blur-sm w-full max-w-lg"
                    >
                        <h2 className="text-3xl font-bold text-green-400 mb-2">{t('quiz.victory')}</h2>
                        <p className="text-lg text-gray-200">The champion was <span className="font-bold text-yellow-400">{targetChampion.name}</span></p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full transition-colors font-bold shadow-lg hover:shadow-green-500/20"
                        >
                            {t('quiz.playAgain')}
                        </button>
                    </motion.div>
                )}

                {/* Guesses Grid */}
                <div className="w-full overflow-x-auto pb-4">
                    <div className="min-w-[800px] flex flex-col gap-2 mx-auto">
                        {/* Header */}
                        <div className="grid grid-cols-7 gap-2 text-center text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">
                            <div>Champion</div>
                            <div>{t('champion.gender')}</div>
                            <div>{t('champion.species')}</div>
                            <div>{t('champion.resource')}</div>
                            <div>{t('champion.region')}</div>
                            <div>Lane</div>
                            <div>{t('filters.role')}</div>
                        </div>

                        <AnimatePresence>
                            {guesses.map((guess, idx) => (
                                <motion.div
                                    key={guess.champion.id + idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="grid grid-cols-7 gap-2"
                                >
                                    {/* Champion Image */}
                                    <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-700 shadow-sm mx-auto w-16 h-16">
                                        <Image
                                            src={`https://ddragon.leagueoflegends.com/cdn/${guess.champion.version}/img/champion/${guess.champion.image.full}`}
                                            alt={guess.champion.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Attributes */}
                                    {[
                                        {
                                            val: translateValue('gender', guess.champion.gender || 'Unknown'),
                                            status: guess.gender
                                        },
                                        {
                                            val: translateValue('species', guess.champion.species || 'Unknown'),
                                            status: guess.species
                                        },
                                        {
                                            val: translateValue('resource', guess.champion.partype === 'None' ? 'Manaless' : guess.champion.partype),
                                            status: guess.resource
                                        },
                                        {
                                            val: formatList(guess.champion.factions, 'factions'),
                                            status: guess.region
                                        },
                                        {
                                            val: formatList(guess.champion.lanes, 'lanes'),
                                            status: guess.lane
                                        },
                                        {
                                            val: formatList(guess.champion.tags, 'roles'),
                                            status: guess.role
                                        },
                                    ].map((attr, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-center p-1 text-center text-xs font-medium text-white rounded-md border shadow-sm transition-colors duration-500 ${getColor(attr.status)}`}
                                        >
                                            {attr.val}
                                        </div>
                                    ))}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
