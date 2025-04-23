import { createSlice } from '@reduxjs/toolkit'

export const navBarSlice = createSlice({
    name: 'navbar',
    initialState: {
        pageType: "",  // current  title state management
        pageTag: "",   // right drawer state management for opening closing
    },
    reducers: {

        updateType: (state, action) => {
            state.pageType = action.payload
        },

        updateTag: (state, action) => {
            state.pageTag = action.payload
        },

    }
})

export const { updateType, updateTag } = navBarSlice.actions

export default navBarSlice.reducer