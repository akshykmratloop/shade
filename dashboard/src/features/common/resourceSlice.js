import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    resourceId: "",
    resourceName: "",
    showVersions: false
}

export const versionSlice = createSlice({
    name: 'resource',
    initialState,
    reducers: {
        updateResourceId: (state, action) => {
            state.resourceId = action.payload.id
            state.resourceName = action.payload.name
            // state.showVersions = true
        },
        // closeVersions: (state, action) => {
        //     state.showVersions = false
        // }
    }
})

export const { updateResourceId, closeVersions } = versionSlice.actions

export default versionSlice.reducer