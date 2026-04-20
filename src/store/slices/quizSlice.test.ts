import { describe, it, expect, beforeEach } from 'vitest';
import quizReducer, {
    setInput,
    setTargetChampion,
    addGuess,
    resetQuiz,
    Category,
    GuessResult
} from './quizSlice';
import { ChampionData } from '@/types/champion';

describe('quizSlice', () => {
    const initialState = quizReducer(undefined, { type: 'unknown' });

    const mockChampion: ChampionData = {
        id: 'Aatrox',
        key: '266',
        name: 'Aatrox',
        title: 'the Darkin Blade',
        version: '1',
        image: { full: 'Aatrox.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
        tags: ['Fighter', 'Tank'],
        partype: 'Blood Well',
        stats: {} as any,
        factions: ['runeterra'],
        faction: 'runeterra',
        gender: 'Male',
        species: 'Darkin',
        lanes: ['Top']
    };

    it('should have correct initial state', () => {
        expect(initialState).toEqual({
            targetChampion: null,
            guesses: [],
            input: '',
            isWon: false,
            showSuggestions: false,
            selectedIndex: 0,
            showHelper: false,
            unlockedHints: [],
        });
    });

    it('should update input correctly', () => {
        const nextState = quizReducer(initialState, setInput('Aatr'));
        expect(nextState.input).toBe('Aatr');
    });

    it('should set target champion', () => {
        const nextState = quizReducer(initialState, setTargetChampion(mockChampion));
        expect(nextState.targetChampion).toEqual(mockChampion);
    });

    it('should add a guess', () => {
        const mockGuess: GuessResult = {
            champion: mockChampion,
            gender: 'correct',
            species: 'correct',
            resource: 'correct',
            region: 'correct',
            lane: 'correct',
            role: 'correct',
        };
        const nextState = quizReducer(initialState, addGuess(mockGuess));
        expect(nextState.guesses.length).toBe(1);
        expect(nextState.guesses[0]).toEqual(mockGuess);
    });

    it('should reset quiz completely', () => {
        const modifiedState = {
            ...initialState,
            input: 'Test',
            isWon: true,
            unlockedHints: ['region'] as Category[],
        };

        const nextState = quizReducer(modifiedState, resetQuiz());
        expect(nextState.input).toBe('');
        expect(nextState.isWon).toBe(false);
        expect(nextState.unlockedHints.length).toBe(0);
    });
});
