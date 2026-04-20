import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import searchReducer from './slices/searchSlice';
import quizReducer from './slices/quizSlice';
import loreGridReducer from './slices/loreGridSlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        search: searchReducer,
        quiz: quizReducer,
        loreGrid: loreGridReducer,
        map: mapReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
