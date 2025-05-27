import { createSlice } from '@reduxjs/toolkit'

export const navBarSlice = createSlice({
    name: 'navbar',
    initialState: {
        resourceType: "",  // current  title state management
        resourceTag: "",   // right drawer state management for opening closing
        name: "Pages"
    },
    reducers: {

        updateType: (state, action) => {
            state.resourceType = action.payload
        },

        updateTag: (state, action) => {
            state.resourceTag = action.payload
        },
        updateName: (state, action) => {
            state.name = action.payload
        }
    }
})

export const { updateType, updateTag, updateName } = navBarSlice.actions

export default navBarSlice.reducer