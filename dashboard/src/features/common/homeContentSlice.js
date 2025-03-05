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
            state.home[action?.payload.section][action?.payload?.title][action?.payload.lan] = action.payload.value
        },
        updateSelectedContent: (state, action) => {
            // Create a Map to store selected items with their index for ordering
            const selectedMap = new Map(
                action.payload.selected
                    ?.filter(e => e.display)
                    .map((item, index) => [item.title[action.payload.language], index])
            );
        
            let newOptions = action.payload.newArray?.map((e) => {
                const title = e.title[action.payload.language];
                return {
                    ...e,
                    display: selectedMap.has(title) // Check if title exists in selected
                };
            });
        
            // Sort newOptions based on the order of selected items
            newOptions.sort((a, b) => {
                const indexA = selectedMap.get(a.title[action.payload.language]) ?? Infinity;
                const indexB = selectedMap.get(b.title[action.payload.language]) ?? Infinity;
                return indexA - indexB;
            });
        
            state.home.serviceSection.cards = newOptions;
        }
        
        
    }
})

export const { updateContent, updateSpecificContent, updateSelectedContent } = homeContentSlice.actions;
const homeContentReducer = homeContentSlice.reducer
export default homeContentReducer;