import { createSlice } from '@reduxjs/toolkit'

export const routeSlice = createSlice({
    name: 'navbar',
    initialState: {
        list: [],  // current  title state management
        pageTag: "",   // right drawer state management for opening closing
    },
    reducers: {

        updateRouteLists: (state, action) => {
            let list = action.payload.map(e => {
                if (e.resourceType === "MAIN_PAGE") {
                    return e.slug
                } else {
                    return e.id
                }
            })
            state.list = list
        },



    }
})

export const { updateRouteLists } = routeSlice.actions

export default routeSlice.reducer