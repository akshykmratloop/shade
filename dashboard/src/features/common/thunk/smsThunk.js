// thunks/homeContentThunks.js (or wherever you put it)

import { updateSelectedContent } from '../homeContentSlice';
// import { saveDraftAction } from '../saveContentSlice';  

// This is a thunk
export const updateSelectedContentAndSaveDraft = (payload) => (dispatch) => {
    const selectedMap = new Map(
        payload?.selected?.filter(e => e.display).map((item, index) => [item[payload.titleLan], index])
    );

    let newOptions = payload.selected.map((e, i) => ({ ...e, order: i + 1 }));

    newOptions.sort((a, b) => {
        const indexA = selectedMap.get(a[payload.titleLan]) ?? Infinity;
        const indexB = selectedMap.get(b[payload.titleLan]) ?? Infinity;
        return indexA - indexB;
    });

    console.log(newOptions)

    dispatch(updateSelectedContent({ ...payload, data: newOptions }));
};
