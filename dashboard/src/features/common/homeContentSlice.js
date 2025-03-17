import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    past: [],
    present: {
        images: {},
        // home: {}
    },
    future: []
};

const cmsSlice = createSlice({
    name: "CMS",
    initialState,
    reducers: {
        updateImages: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.images[action.payload.section] = action.payload.src;
            state.future = [];
        },
        removeImages: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.images[action.payload.section] = "";
            state.future = [];
        },
        updateContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present[action.payload?.currentPath] = action.payload.payload;
            state.future = [];
        },
        updateSpecificContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if(action.payload.subSectionsProMax){
                state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.subSectionsProMax][action.payload.subSecIndex][action.payload.title][action.payload.lan] = action.payload.value;
            }else if (action.payload.subSection) {
                state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
            } else {
                state.present[action.payload?.currentPath][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
            }
            state.future = [];
        },
        updateServicesNumber: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload.index][action.payload.title] = action.payload.value;
            state.future = [];
        },
        updateSelectedContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            const selectedMap = new Map(
                action.payload.selected?.filter(e => e.display).map((item, index) => [item.title[action.payload.language], index])
            );
            let newOptions = action.payload.newArray?.map(e => ({
                ...e,
                display: selectedMap.has(e.title[action.payload.language])
            }));
            newOptions.sort((a, b) => {
                const indexA = selectedMap.get(a.title[action.payload.language]) ?? Infinity;
                const indexB = selectedMap.get(b.title[action.payload.language]) ?? Infinity;
                return indexA - indexB;
            });
            switch(action.payload.origin) {
                case "home":
                    state.present[action.payload?.currentPath].serviceSection.cards = newOptions; 
                    break;
                case "recentproject":
                    state.present[action.payload?.currentPath].recentProjectsSection.sections[action.payload.index].projects = newOptions;
                    break;

                default:
            }
            state.future = [];
        },
        undo: (state) => {
            if (state.past.length > 0) {
                if (state.past.length === 1) return; // Prevent undo beyond the first recorded change
                state.future.push(JSON.parse(JSON.stringify(state.present)));
                state.present = state.past.pop();
            }
        },
        redo: (state) => {
            if (state.future.length > 0) {
                state.past.push(JSON.parse(JSON.stringify(state.present)));
                state.present = state.future.pop();
            }
        }
    }
});

export const { updateImages, removeImages, updateContent, updateSpecificContent, updateServicesNumber, updateSelectedContent, undo, redo } = cmsSlice.actions;
export default cmsSlice.reducer;