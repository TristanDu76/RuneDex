import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChampionLight, LoreCharacterLight } from '@/types/champion';

type SearchResult =
    | { type: 'champion'; data: ChampionLight }
    | { type: 'lore'; data: LoreCharacterLight };

interface SearchState {
    query: string;
    isOpen: boolean;
    isMobileOpen: boolean;
    selectedIndex: number;
    results: SearchResult[];
}

const initialState: SearchState = {
    query: '',
    isOpen: false,
    isMobileOpen: false,
    selectedIndex: -1,
    results: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        setIsOpen(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload;
            if (!action.payload) {
                state.selectedIndex = -1;
            }
        },
        setIsMobileOpen(state, action: PayloadAction<boolean>) {
            state.isMobileOpen = action.payload;
        },
        setSelectedIndex(state, action: PayloadAction<number>) {
            state.selectedIndex = action.payload;
        },
        setResults(state, action: PayloadAction<SearchResult[]>) {
            state.results = action.payload;
        },
        closeSearch(state) {
            state.isOpen = false;
            state.isMobileOpen = false;
            state.selectedIndex = -1;
            state.query = '';
        }
    },
});

export const {
    setQuery,
    setIsOpen,
    setIsMobileOpen,
    setSelectedIndex,
    setResults,
    closeSearch
} = searchSlice.actions;

export default searchSlice.reducer;
