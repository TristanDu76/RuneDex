import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const PAGE_SIZE = 48;

interface LoreGridState {
    query: string;
    visibleCount: number;
}

const initialState: LoreGridState = {
    query: '',
    visibleCount: PAGE_SIZE,
};

const loreGridSlice = createSlice({
    name: 'loreGrid',
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
            state.visibleCount = PAGE_SIZE; // reset count on search
        },
        loadMore(state, action: PayloadAction<number>) {
            state.visibleCount = Math.min(state.visibleCount + PAGE_SIZE, action.payload);
        },
    },
});

export const { setQuery, loadMore } = loreGridSlice.actions;
export default loreGridSlice.reducer;
