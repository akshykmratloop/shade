import { createSlice } from '@reduxjs/toolkit'

const homeContentSlice = createSlice({
    name: "HomeContent",
    initialState: {
        home: {}
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        updateContent: (state, action) => {
            state.home = action.payload;
        },
        updateSpecificContent: (state, action) => {
            console.log(action.payload)
            console.log(state.home)
            state.home[action?.payload.section][action?.payload?.title][action?.payload.lan] = action.payload.value
        }
    }
})

export const { updateContent, updateSpecificContent } = homeContentSlice.actions;
const homeContentReducer = homeContentSlice.reducer
export default homeContentReducer;