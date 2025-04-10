import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    past: [],
    present: {
        images: {},
    },
    future: []
};

const cmsSlice = createSlice({
    name: "CMS",
    initialState,
    reducers: {
        updateImages: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.payload.updateType === 'gallerySection') {
                let newArray = []
                if (action.payload.operation === 'add') {
                    newArray = [...state.present.projectDetail[action.payload.projectId - 1].gallerySection.images, action.payload.src]
                } else {
                    newArray = state.present.projectDetail[action.payload.projectId - 1].gallerySection.images.filter((e, i) => {
                        return i !== action.payload.src
                    })
                }
                state.present.projectDetail[action.payload.projectId - 1].gallerySection.images = newArray
            } else {
                state.present.images[action.payload.section] = action.payload.src;
            }
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
        selectMainNews: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));

            switch (action.payload.origin) {
                case "MainNews":
                    state.present.newsBlogs.mainCard = action.payload.selected[0];
                    break;

                case "TrendingNews":
                    state.present.newsBlogs.trendingCard = action.payload.selected[0];
                    break;

                default:
            }
            state.future = [];
        },
        updateTheProjectSummaryList: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            let expression;

            switch (action.payload.context) {
                case "projectDetail":
                    expression = state.present.projectDetail?.[action.payload.projectId - 1].descriptionSection;
                    break;

                case "careerDetails":
                    expression = state.present.careerDetails?.[action.payload.careerIndex]?.jobDetails?.leftPanel?.sections;
                    break;

                case "newsBlogsDetails":
                    expression = state.present.newsBlogsDetails?.[action.payload.newsIndex]?.newsPoints;
                    break;

                default:
            }

            if (action.payload.operation === 'add') {
                newArray = [...expression, action.payload.insert]
            } else {
                newArray = expression?.filter((e, i) => {
                    return i !== action.payload.index
                })
            }

            switch (action.payload.context) {
                case "projectDetail":
                    state.present.projectDetail[action.payload.projectId - 1].descriptionSection = newArray
                    break;

                case "careerDetails":
                    state.present.careerDetails[action.payload.careerIndex].jobDetails.leftPanel.sections = newArray
                    break;

                case "newsBlogsDetails":
                    state.present.newsBlogsDetails[action.payload.newsIndex].newsPoints = newArray
                    break;

                default:
            }
            state.future = [];
        }, updateWhatWeDoList: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            if (action.payload.operation === 'add') {
                newArray = [...state.present.solution?.[action.payload.section], action.payload.insert]
            } else {
                newArray = state.present.solution[action.payload.section].filter((e, i) => {
                    return i !== action.payload.index
                })
            }
            state.present.solution[action.payload.section] = newArray
            state.future = [];
        },
        updateSpecificContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.payload.projectId && !action.payload.careerId) {
                if (action.payload.subSection) {
                    state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload?.section][action.payload.subSection][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
                } else if (action.payload.title === 'url') {
                    state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title] = action.payload.value
                } else {
                    if (action.payload.section === 'testimonials') {
                        state.present[action.payload.currentPath][action.payload.section][action.payload.projectId][action.payload.title][action.payload.lan] = action.payload.value
                    } else if (action.payload.section === 'descriptionSection') {
                        state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
                    } else {
                        state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value
                    }
                }
            } else if (action.payload.subSectionsProMax === "Links") {
                state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.title] = action.payload.value;
            } else if (action.payload.subSectionsProMax) {
                if (action.payload.careerId) {
                    if (action.payload.subSectionsProMax === "viewAllButton") {
                        if (action.payload.title === 'link') {
                            state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload.title] = action.payload.value;
                        } else {
                            state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload.title][action.payload.lan] = action.payload.value;
                        }
                    } else {
                        state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
                    }
                } else {
                    state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.subSectionsProMax][action.payload.subSecIndex][action.payload.title][action.payload.lan] = action.payload.value;
                }
            } else if (action.payload.subSection === 'url') {
                state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection] = action.payload.value;
            } else if (action.payload.subSection) {
                if (action.payload.careerId) {
                    state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.title][action.payload.lan] = action.payload.value;
                } else {
                    state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
                }
            } else if (action.payload.type === 'rich') {
                state.present[action.payload?.currentPath][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value;
            } else {
                if (action.payload.careerId) {
                    if (action.payload.section === "newsPoints") {
                        state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
                    } else {
                        state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
                    }
                } else {
                    state.present[action.payload?.currentPath][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
                }
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
                action.payload.origin === "jobs" ?
                    action.payload?.selected?.filter(e => e.display).map((item, index) => [item.title.key[action.payload.language], index])
                    : action.payload?.selected?.filter(e => e.display).map((item, index) => [item.title[action.payload.language], index])
            );
            let newOptions = action.payload.newArray?.map(e => ({
                ...e,
                display: action.payload.origin === "jobs" ? selectedMap.has(e.title.key[action.payload.language]) : selectedMap.has(e.title[action.payload.language])
            }));
            if (action.payload.origin === "jobs") {
                newOptions.sort((a, b) => {
                    const indexA = selectedMap.get(a.title.key[action.payload.language]) ?? Infinity;
                    const indexB = selectedMap.get(b.title.key[action.payload.language]) ?? Infinity;
                    return indexA - indexB;
                });
            } else {
                newOptions.sort((a, b) => {
                    const indexA = selectedMap.get(a.title[action.payload.language]) ?? Infinity;
                    const indexB = selectedMap.get(b.title[action.payload.language]) ?? Infinity;
                    return indexA - indexB;
                });
            }
            switch (action.payload.origin) {
                case "home":
                    state.present[action.payload?.currentPath].serviceSection.cards = newOptions;
                    break;
                case "recentproject":
                    state.present[action.payload?.currentPath].recentProjectsSection.sections[action.payload.index].projects = newOptions;
                    break;
                case "jobs":
                    state.present[action.payload?.currentPath].jobListSection.jobs = newOptions;
                    break;

                case "news":
                    state.present[action.payload?.currentPath].latestNewCards.cards = newOptions
                    break;
                case "projectDetail":
                    state.present.projectDetail[action.payload.projectId - 1].moreProjects.projects = newOptions
                    break;

                default:
            }
            state.future = [];
        },
        updateSelectedProject: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));

            const selectedMap = new Map(
                action.payload?.selected
                    ?.filter(e => e.display)
                    .map((item, index) => [item.title[action.payload.language], index])
            );

            let newOptions = action.payload.selected;

            if (action.payload.operation === 'remove') {
                newOptions = action.payload.newArray?.map(e => ({
                    ...e,
                    display: selectedMap.has(e.title[action.payload.language])
                }));
            }

            // ❗ Remove duplicates based on title[language]
            const uniqueTitles = new Set();
            newOptions = newOptions.filter(item => {
                const title = item.title[action.payload.language];
                if (uniqueTitles.has(title)) return false;
                uniqueTitles.add(title);
                return true;
            });

            // Sort based on original order
            newOptions.sort((a, b) => {
                const indexA = selectedMap.get(a.title[action.payload.language]) ?? Infinity;
                const indexB = selectedMap.get(b.title[action.payload.language]) ?? Infinity;
                return indexA - indexB;
            });

            switch (action.payload.origin) {
                case "projectDetail":
                    state.present.projectDetail[action.payload.projectId - 1].moreProjects.projects = newOptions;
                    break;

                case "newsBlogsDetails":
                    state.present.newsBlogsDetails[action.payload.projectId - 1].latestNews = newOptions;
                    break;

                default:
            }

            state.future = [];
        },

        updateAllProjectlisting: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)))

            if (action.payload.action === 'update') {
                state.present.projects.projectsSection.allProjectsList = [...action.payload.selected]
            }
            else if (action.payload.action === 'initial') {
                state.present.projects.projectsSection.allProjectsList = action.payload.data ?? []
            }

            state.future = []
        },
        updateMarketSelectedContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            const newSet = new Set(action.payload?.selected?.map(e => e.id))
            let newArray;
            if (action.payload.newOption === null) {
                newArray = action.payload.newArray.filter(e => {
                    return !(newSet.has(e.id))
                })

                action.payload?.selected?.forEach(element => {
                    newArray.push(element)
                });

            } else {
                newArray = action.payload.newArray.map(option => {
                    if (option.id === action.payload.newOption.id) {
                        return action.payload.newOption
                    } else return option
                })
            }

            switch (action.payload.origin) {
                case "markets":
                    state.present[action.payload.currentPath].tabSection.marketItems = newArray
                    break;

                case "projects":
                    state.present[action.payload.currentPath].projectsSection.projects = newArray
                    break;

                default:
            }

            state.future = []
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

export const { // actions
    updateImages,
    removeImages,
    updateContent,
    updateSpecificContent,
    updateServicesNumber,
    updateSelectedContent,
    updateSelectedProject,
    updateMarketSelectedContent,
    updateWhatWeDoList,
    updateAllProjectlisting,
    selectMainNews,
    undo,
    redo,
    updateTheProjectSummaryList
} = cmsSlice.actions;

export default cmsSlice.reducer; // reducer
































