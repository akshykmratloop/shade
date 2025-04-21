import { createSlice } from '@reduxjs/toolkit'
import undoable from 'redux-undo'

const imagesSlice = createSlice({
    name: "Images",
    initialState: {
        images: {
            
        }
    },
    reducers: {
        updateImages: (state, action) => {
            state.images[action.payload.section] = action.payload.src
        },
        removeImages: (state, action) => {
            state.images[action.payload.section] = ""
        },
    }
})

export const { updateImages, removeImages } = imagesSlice.actions;
const imagesReducer = imagesSlice.reducer
export default undoable(imagesReducer);