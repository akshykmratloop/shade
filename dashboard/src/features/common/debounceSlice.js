import { createSlice } from '@reduxjs/toolkit'

const debounce = createSlice({
    name: "debounce",
    initialState: {
        debounce: false
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        stopButtons: (state, action) => {
            state.debounce = action.payload;
        }
    }
})

export const { stopButtons } = debounce.actions;

export default debounce.reducer;