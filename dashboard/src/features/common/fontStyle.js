import { createSlice } from '@reduxjs/toolkit'

const fontFamily = createSlice({
    name: "fontStyle",
    initialState: {
        regular: "bankgothic-medium-dt",
        light: "bank-light"
    },
    reducers: {
        changefont: (state, action) => {
            state[action.payload.regularKey] = action.payload.regular
            state[action.payload.lightKey] = action.payload.light
        }
    }
})

export const { changefont } = fontFamily.actions;

export default fontFamily.reducer;