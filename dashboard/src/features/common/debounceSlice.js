import { createSlice } from '@reduxjs/toolkit'

const debounce = createSlice({
    name: "debounce",
    initialState: {
        debounce: false
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        switchDebounce: (state, action) => {
            state.debounce = action.payload;
        }
    }
})

export const { switchDebounce } = debounce.actions;

export default debounce.reducer;