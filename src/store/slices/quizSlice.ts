import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ClassicQuizChampion } from '@/lib/quiz-rounds';

export type Category = 'gender' | 'species' | 'resource' | 'region' | 'lane' | 'role';

export interface GuessResult {
    champion: ClassicQuizChampion;
    gender: 'correct' | 'incorrect';
    species: 'correct' | 'incorrect' | 'partial';
    resource: 'correct' | 'incorrect';
    region: 'correct' | 'incorrect' | 'partial';
    lane: 'correct' | 'incorrect' | 'partial';
    role: 'correct' | 'incorrect' | 'partial';
}

interface QuizState {
    targetChampion: ClassicQuizChampion | null;
    guesses: GuessResult[];
    input: string;
    isWon: boolean;
    showSuggestions: boolean;
    selectedIndex: number;
    showHelper: boolean;
    unlockedHints: Category[];
}

const initialState: QuizState = {
    targetChampion: null,
    guesses: [],
    input: '',
    isWon: false,
    showSuggestions: false,
    selectedIndex: 0,
    showHelper: false,
    unlockedHints: [],
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setTargetChampion(state, action: PayloadAction<ClassicQuizChampion>) {
            state.targetChampion = action.payload;
        },
        addGuess(state, action: PayloadAction<GuessResult>) {
            state.guesses.unshift(action.payload);
        },
        setInput(state, action: PayloadAction<string>) {
            state.input = action.payload;
        },
        setIsWon(state, action: PayloadAction<boolean>) {
            state.isWon = action.payload;
        },
        setShowSuggestions(state, action: PayloadAction<boolean>) {
            state.showSuggestions = action.payload;
        },
        setSelectedIndex(state, action: PayloadAction<number>) {
            state.selectedIndex = action.payload;
        },
        setShowHelper(state, action: PayloadAction<boolean>) {
            state.showHelper = action.payload;
        },
        addUnlockedHint(state, action: PayloadAction<Category>) {
            if (!state.unlockedHints.includes(action.payload)) {
                state.unlockedHints.push(action.payload);
            }
        },
        setUnlockedHints(state, action: PayloadAction<Category[]>) {
            state.unlockedHints = action.payload;
        },
        resetQuiz(state) {
            state.targetChampion = null;
            state.guesses = [];
            state.input = '';
            state.isWon = false;
            state.showSuggestions = false;
            state.selectedIndex = 0;
            state.showHelper = false;
            state.unlockedHints = [];
        }
    },
});

export const {
    setTargetChampion,
    addGuess,
    setInput,
    setIsWon,
    setShowSuggestions,
    setSelectedIndex,
    setShowHelper,
    addUnlockedHint,
    setUnlockedHints,
    resetQuiz
} = quizSlice.actions;

export default quizSlice.reducer;
