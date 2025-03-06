import { createSlice } from "@reduxjs/toolkit";
import undoable, { groupByActionTypes } from "redux-undo";

const homeContentSlice = createSlice({
    name: "HomeContent",
    initialState: {
        home: {}
    },
    reducers: {
        updateContent: (state, action) => {
            state.home = action.payload;
        },
        updateSpecificContent: (state, action) => {
            if (action.payload.subSection) {
                state.home[action.payload.section][action.payload.subSection][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value;
            } else {
                state.home[action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
            }
        },
        updateServicesNumber: (state, action) => {
            state.home[action.payload.section][action.payload.subSection][action.payload.index][action.payload.title] = action.payload.value;
        },
        updateSelectedContent: (state, action) => {
            const selectedMap = new Map(
                action.payload.selected
                    ?.filter((e) => e.display)
                    .map((item, index) => [item.title[action.payload.language], index])
            );

            let newOptions = action.payload.newArray?.map((e) => {
                const title = e.title[action.payload.language];
                return {
                    ...e,
                    display: selectedMap.has(title)
                };
            });

            newOptions.sort((a, b) => {
                const indexA = selectedMap.get(a.title[action.payload.language]) ?? Infinity;
                const indexB = selectedMap.get(b.title[action.payload.language]) ?? Infinity;
                return indexA - indexB;
            });

            state.home.serviceSection.cards = newOptions;
        }
    }
});

// Custom function to group actions per word
const groupByWord = (action, currentState, previousHistory) => {
    if (action.type === "HomeContent/updateSpecificContent") {
        // Group actions until a space is found
        return action.payload.value.endsWith(" ") ? null : "typing";
    }
    return null;
};

export const { updateContent, updateSpecificContent, updateSelectedContent, updateServicesNumber } = homeContentSlice.actions;
const homeContentReducer = homeContentSlice.reducer;

// Apply undoable with groupBy
export default undoable(homeContentReducer, { groupBy: groupByWord });
