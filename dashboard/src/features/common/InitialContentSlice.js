import { createSlice } from '@reduxjs/toolkit'

export const InitialValue = createSlice({
    name: 'InitialContentValue',
    initialState: {
        InitialValue: {}
    },
    reducers: {
        saveInitialContentValue: (state, action) => {

            state.InitialValue = action.payload
        },

        clearDraftAction: (state, action) => {
            state.InitialValue = {}
        },

    }
})

export const { saveInitialContentValue, clearInitialValueAction } = InitialValue.actions

export default InitialValue.reducer