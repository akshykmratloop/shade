// import { createSlice } from "@reduxjs/toolkit";
// import { updateContent, updateSpecificContent } from "./homeContentSlice";
// import { updateImages, removeImages } from "./ImagesSlice";

// const MAX_HISTORY = 15;

// const historySlice = createSlice({
//     name: "history",
//     initialState: {
//         past: [],
//         future: []
//     },
//     reducers: {
//         undo: (state, action) => {
//             if (state.past.length > 0) {
//                 const lastAction = state.past.pop();
//                 state.future.unshift(lastAction); // Store for redo
//                 return lastAction.undoState; // Return the previous state to the reducer
//             }
//         },
//         redo: (state, action) => {
//             if (state.future.length > 0) {
//                 const nextAction = state.future.shift();
//                 state.past.push(nextAction); // Move back to history
//                 return nextAction.redoState; // Return the next state to the reducer
//             }
//         },
//         saveHistory: (state, action) => {
//             if (state.past.length >= MAX_HISTORY) state.past.shift(); // Limit history
//             state.past.push(action.payload);
//             state.future = []; // Clear redo history on new action
//         }
//     }
// });

// export const { undo, redo, saveHistory } = historySlice.actions;
// export default historySlice.reducer;
