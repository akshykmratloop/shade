import { createSlice } from '@reduxjs/toolkit'

export const saveDraft = createSlice({
    name: 'saveDraft',
    initialState: {
        saveDraft: {}
    },
    reducers: {
        saveDraftAction: (state, action) => {



            console.log(action.payload)

            state.saveDraft = action.payload
        },

        clearDraftAction: (state, action) => {
            state.saveDraft = {}
        },

    }
})

export const { saveDraftAction, clearDraftAction } = saveDraft.actions

export default saveDraft.reducer