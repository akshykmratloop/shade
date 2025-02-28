import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: {
        isCollapsed: window.innerWidth < 900, // Initialize based on screen size
    },
    reducers: {
        toggleSidebar: (state) => {
            state.isCollapsed = !state.isCollapsed;
        },
        setSidebarState: (state, action) => {
            state.isCollapsed = action.payload;
        }
    }
});

export const { toggleSidebar, setSidebarState } = sidebarSlice.actions;
export default sidebarSlice.reducer;
