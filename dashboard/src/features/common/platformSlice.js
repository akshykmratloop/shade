import { createSlice } from '@reduxjs/toolkit'

const platform = new Set(["RESOURCE", "DIFFERENCE", "EDIT"])

export const platformSlice = createSlice({
    name: 'platform',
    initialState: {
        platform: ""
    },
    reducers: {
        setPlatform: (state, action) => {
            if (platform.has(action.payload)) {
                state.platform = action.payload
            }
        },
    }
})

export const { setPlatform } = platformSlice.actions

export default platformSlice.reducer