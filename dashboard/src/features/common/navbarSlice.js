import { createSlice } from '@reduxjs/toolkit'

export const navBarSlice = createSlice({
    name: 'navbar',
    initialState: {
        resourceType: "",  // current  title state management
        resourceTag: "",   // right drawer state management for opening closing
    },
    reducers: {

        updateType: (state, action) => {
            state.resourceType = action.payload
        },

        updateTag: (state, action) => {
            state.resourceTag = action.payload
        },

    }
})

export const { updateType, updateTag } = navBarSlice.actions

export default navBarSlice.reducer