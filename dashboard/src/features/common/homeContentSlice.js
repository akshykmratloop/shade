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
            console.log(action.payload.selected)
            // Create a Set for quick lookup of selected items
            const selectedSet = new Set(
                action.payload.selected?.filter(e => e.display).map(item => item.title[action.payload.language])
            );
        
            console.log(selectedSet)
            let newOptions = action.payload.newArray?.map((e) => {
                const title = e.title[action.payload.language];
                return {
                    ...e,
                    display: selectedSet.has(title) // Check if title exists in selected
                };
            });
        
            state.home.serviceSection.cards = newOptions;
        }
        
    }
})

export const { updateContent, updateSpecificContent, updateSelectedContent } = homeContentSlice.actions;
const homeContentReducer = homeContentSlice.reducer
export default homeContentReducer;