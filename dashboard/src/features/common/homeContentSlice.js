import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    past: [],
    present: {
        images: {},
        loading: true
    },
    future: []
};

const basePath = 'present.home';

const cmsSlice = createSlice({
    name: "CMS",
    initialState,
    reducers: {
        updateImages: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.payload.type === "refDoc") {
                state.present.content.editVersion.referenceDoc = action.payload.src
            } else if (action.payload.section === "clientSection") {
                state.present.content.editVersion.sections[action.payload.index].content.clients[action.payload.cardIndex].image[0] = action.payload.src
            } else if (action.payload.directIcon) {
                state.present.content.editVersion.sections[action.payload.index].content.cards[action.payload.cardIndex].icon = action.payload.src
            } else {
                state.present.content.editVersion.sections[action.payload.index].content.images[action.payload.order - 1] = action.payload.src
            }
            state.future = [];
        },
        updateAList: (state, action) => {

            let newArray = state.present.content.editVersion.sections[action.payload.index].content.clients

            if (action.payload.operation === "add") {
                newArray = [...newArray, action.payload.data]
            } else {
                if (!action.payload.data) {
                    newArray.pop()
                } else {
                    newArray = newArray.filter(e => {
                        console.log(e.image[0] !== action.payload.data)
                        console.log(e.image[0], action.payload.data)
                        return e.image[0] !== action.payload.data
                    })
                }
            }

            state.present.content.editVersion.sections[action.payload.index].content.clients = newArray;
        },
        removeImages: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.images[action.payload.section] = "";
            state.future = [];
        },
        updateMainContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.content = action.payload.payload;
            state.present.loading = false
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

                case "subOfsubService":
                    expression = state.present.subOfsubService[action.payload.serviceId][action.payload.deepPath - 1][action.payload.subContext]
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

                case "subOfsubService":
                    state.present.subOfsubService[action.payload.serviceId][action.payload.deepPath - 1][action.payload.subContext] = newArray
                    break;

                default:
            }
            state.future = [];
        },
        updateWhatWeDoList: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            console.log(action.payload.sectionIndex)
            let oldArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content
            if (action.payload.operation === 'add') {
                newArray = [...oldArray, { ...action.payload.insert, order: oldArray.length }]
            } else {
                newArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content.filter((e, i) => {
                    return i !== action.payload.index
                })
            }
            state.present.content.editVersion.sections[action.payload.sectionIndex].content = newArray
            state.future = [];
        },
        updateSpecificContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.payload.type === "content[index]") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.contentIndex][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.title === "button") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.title][0].text[action.payload.lan] = action.payload.value
            } else if (action.payload.section === "recentProjectsSection") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].sections[action.payload.index].content[action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.subSection === "cards") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.cards[action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
            } else {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.title][action.payload.lan] = action.payload.value
            }

            state.future = [];
        },
        updateServicesNumber: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.content.editVersion.sections[action.payload.sectionIndex].content.cards[action.payload.index][action.payload.title] = action.payload.value
            state.future = [];
        },
        updateSelectedContent: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            // const selectedMap = new Map(
            //     action.payload?.selected?.filter(e => e.display).map((item, index) => [item[action.payload.titleLan], index])
            // );
            let newOptions = action.payload.data

            // newOptions.sort((a, b) => {
            //     const indexA = selectedMap.get(a[action.payload.titleLan]) ?? Infinity;
            //     const indexB = selectedMap.get(b[action.payload.titleLan]) ?? Infinity;
            //     return indexA - indexB;
            // });
            console.log(action.payload.sectionIndex)

            switch (action.payload.origin) {
                case "home":
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
                    break;

                case "recentproject":
                    state.present.content.editVersion.sections[action.payload.sectionIndex].sections[action.payload.index].items = newOptions
                    break;

                case "testimonials":
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
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

                case "serviceCards":
                    state.present[action.payload?.currentPath].serviceCards = newOptions;
                    break;

                case "subServices":
                    state.present[action.payload?.currentPath][action.payload.projectId].subServices = newOptions
                    break;

                default:
            }
            state.future = [];
        },
        updateSelectedSubService: (state, action) => {
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            const selectedMap = new Map(
                action.payload?.selected?.filter(e => e.display).map((item, index) => [item.title[action.payload.language], index])
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

            switch (action.payload.origin) {
                case "subServices":
                    state.present[action.payload?.currentPath][action.payload.projectId].subServices = newOptions
                    break;

                case "otherServices":
                    state.present[action.payload?.currentPath][action.payload.projectId].otherServices = newOptions
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
    updateMainContent,
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
    updateTheProjectSummaryList,
    updateSelectedSubService,
    updateAList
} = cmsSlice.actions;

export default cmsSlice.reducer; // reducer



// if (action.payload.deepPath) {
//     if (action.payload.section && (action.payload.index + 1)) {
//         state.present[action.payload.currentPath][action.payload.projectId][action.payload.deepPath - 1][action.payload?.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value;
//     } else {
//         state.present[action.payload.currentPath][action.payload.projectId][action.payload.deepPath - 1][action.payload?.section][action.payload.title][action.payload.lan] = action.payload.value;
//     }
// } else if (action.payload.projectId && !action.payload.careerId) {
//     if (action.payload.subSection) {
//         state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload?.section][action.payload.subSection][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
//     } else if (action.payload.title === 'url') {
//         state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title] = action.payload.value
//     } else {
//         if (action.payload.section === 'testimonials') {
//             state.present[action.payload.currentPath][action.payload.section][action.payload.projectId - 1][action.payload.title][action.payload.lan] = action.payload.value
//         } else if (action.payload.section === 'descriptionSection') {
//             state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
//         } else {
//             state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value
//         }
//     }
// } else if (action.payload.subSectionsProMax === "Links") {
//     state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.title] = action.payload.value;
// } else if (action.payload.subSectionsProMax) {
//     if (action.payload.careerId) {
//         if (action.payload.subSectionsProMax === "viewAllButton") {
//             if (action.payload.title === 'link') {
//                 state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload.title] = action.payload.value;
//             } else {
//                 state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload.title][action.payload.lan] = action.payload.value;
//             }
//         } else {
//             state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.subSectionsProMax][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
//         }
//     } else {
//         state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.subSectionsProMax][action.payload.subSecIndex][action.payload.title][action.payload.lan] = action.payload.value;
//     }
// } else if (action.payload.subSection === 'url') {
//     state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection] = action.payload.value;
// } else if (action.payload.subSection) {
//     if (action.payload.careerId) {
//         state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.subSection][action.payload.title][action.payload.lan] = action.payload.value;
//     } else {
//         state.present[action.payload?.currentPath][action.payload.section][action.payload.subSection][action.payload?.index][action.payload.title][action.payload.lan] = action.payload.value;
//     }
// } else if (action.payload.type === 'rich') {
//     state.present[action.payload?.currentPath][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value;
// } else {
//     if (action.payload.careerId) {
//         if (action.payload.section === "newsPoints") {
//             state.present[action.payload.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
//         } else {
//             state.present[action.payload?.currentPath][action.payload.projectId - 1][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
//         }
//     } else {
//         state.present[action.payload?.currentPath][action.payload.section][action.payload.title][action.payload.lan] = action.payload.value;
//     }
// }