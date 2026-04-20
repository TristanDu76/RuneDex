import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
    expandedSidebarItem: string | null;
    sidebarSearchQuery: string;
    hoveredRegion: string | null;
    selectedRegionId: string | null;
}

const initialState: MapState = {
    expandedSidebarItem: null,
    sidebarSearchQuery: '',
    hoveredRegion: null,
    selectedRegionId: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setExpandedSidebarItem(state, action: PayloadAction<string | null>) {
            state.expandedSidebarItem = action.payload;
        },
        setSidebarSearchQuery(state, action: PayloadAction<string>) {
            state.sidebarSearchQuery = action.payload;
        },
        setHoveredRegion(state, action: PayloadAction<string | null>) {
            state.hoveredRegion = action.payload;
        },
        setSelectedRegionId(state, action: PayloadAction<string | null>) {
            state.selectedRegionId = action.payload;
        },
    },
});

export const {
    setExpandedSidebarItem,
    setSidebarSearchQuery,
    setHoveredRegion,
    setSelectedRegionId,
} = mapSlice.actions;

export default mapSlice.reducer;
