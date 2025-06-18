import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    past: [],
    present: {
        images: {},
        loading: true,
    },
    future: [],
    EditInitiated: false
};

const cmsSlice = createSlice({
    name: "CMS",
    initialState,
    reducers: {
        updateIsEditMode: (state, action) => {
            state.EditInitiated = action.payload.value
        },
        submitings: (state, action) => { // post content
            state.past = []
            state.present = {}
            state.future = []
        },
        updateComment: (state, action) => { // post content
            state.present.content.editVersion.comments = action.payload.value
        },
        updateMainContent: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.content = action.payload.payload;
            state.present.loading = false
            state.future = [];
        },
        updateSpecificContent: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.payload.type === "content[index]") {
                if (action.payload.title === 'url') {
                    state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.contentIndex][action.payload.title] = action.payload.value
                } else if (action.payload.section === "procedures/terms") {
                    state.present.content.editVersion.sections[action.payload.sectionIndex].content.procedures.terms[action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
                } else {
                    console.log(action.payload.contentIndex)
                    state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.contentIndex][action.payload.title][action.payload.lan] = action.payload.value
                }
            } else if (action.payload.subSection === "content/procedures") {
                // console.log(action.payload.sectionIndex, action.payload.index, action.payload.title, action.payload.lan, action.payload.value)
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.cards[action.payload.buttonIndex][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.section === "points") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.points[action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.section === "procedures") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.procedures[action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.section === "Footer") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.contentIndex][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.section === "Footer/Links") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.contentIndex].links[action.payload.index][action.payload.title] = action.payload.value
            } else if (action.payload.title === "button") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.title][action.payload.buttonIndex].text[action.payload.lan] = action.payload.value
            } else if (action.payload.section === "recentProjectsSection") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].sections[action.payload.index].content[action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.subSection === "cards") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.cards[action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.section === "sectionPointers") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.sectionPointers[action.payload.index][action.payload.title][action.payload.lan] = action.payload.value
            } else if (action.payload.subSection) {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.introSection[action.payload.title][action.payload.lan] = action.payload.value
            } else {
                if (action.payload.title === "url") {
                    state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.title] = action.payload.value
                } else {
                    state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.title][action.payload.lan] = action.payload.value
                }
            }

            state.future = [];
        },
        updateServicesNumber: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.content.editVersion.sections[action.payload.sectionIndex].content.cards[action.payload.index][action.payload.title] = action.payload.value
            state.future = [];
        },
        updateImages: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            if (action.type.type === "VIDEO") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content.video = action.payload.src
            } else if (action.payload.subSection === "projectInforCard") {
                state.present.content.editVersion.sections[action.payload.index].content[action.payload.cardIndex].icon = action.payload.src
            } else if (action.payload.type === "refDoc") {
                state.present.content.editVersion.referenceDoc = action.payload.src
            } else if (action.payload.section === "clientsImages") {
                state.present.content.editVersion.sections[action.payload.index].content.clientsImages[action.payload.cardIndex] = action.payload.src
            } else if (action.payload.directIcon) {
                state.present.content.editVersion.sections[action.payload.index].content.cards[action.payload.cardIndex].icon = action.payload.src
            } else if (action.payload.section === "socialLinks") {
                state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section][action.payload.index][action.payload.title] = action.payload.src
            } else if (action.payload.section === "points") {
                state.present.content.editVersion.sections[action.payload.index].content.points[action.payload.cardIndex].images[action.payload.order - 1] = action.payload.src
            } else if (action.payload.section === "affiliates") {
                state.present.content.editVersion.sections[action.payload.index].content.cards[action.payload.order - 1].images[0] = action.payload.src
            } else if (action.payload.section === "Chart") {
                state.present.content.editVersion.sections[action.payload.index].content.chart.images[action.payload.order - 1] = action.payload.src
            } else {
                state.present.content.editVersion.sections[action.payload.index].content.images[action.payload.order - 1] = action.payload.src
            }
            state.future = [];
        },
        addImageArray: (state, action) => { // post content
            let oldArray = state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section]
            let newArray = [...oldArray, { ...action.payload.src, order: oldArray.length + 1 }]

            state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section] = newArray
        },
        addImagePointArray: (state, action) => { // post content
            let oldArray = state.present.content.editVersion.sections[action.payload.sectionIndex].content.images
            let newArray = [...oldArray, { ...action.payload.src, order: oldArray.length + 1 }]

            state.present.content.editVersion.sections[action.payload.sectionIndex].content.images = newArray
        },
        rmImageArray: (state, action) => { // post content

            let oldArray = state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section]
            let newArray = oldArray.filter(e => {
                return e.order !== action.payload.order
            })

            newArray = newArray.map((e, i) => ({ ...e, order: i + 1 }))
            console.log(newArray)
            state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section] = newArray
        },
        rmImagePointArray: (state, action) => { // post content

            let oldArray = state.present.content.editVersion.sections[action.payload.sectionIndex].content.images
            let newArray = oldArray.filter(e => {
                return e.order !== action.payload.order
            })

            newArray = newArray.map((e, i) => ({ ...e, order: i + 1 }))
            console.log(newArray)
            state.present.content.editVersion.sections[action.payload.sectionIndex].content.images = newArray
        },
        updateAList: (state, action) => { // post content

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
        removeImages: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            state.present.images[action.payload.section] = "";
            state.future = [];
        },
        selectMainNews: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));

            state.present.content.editVersion.sections[action.payload.sectionIndex].items = action.payload.selected;

            state.future = [];
        },
        updateCardAndItemsArray: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            let oldArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content
            if (action.payload.operation === 'add') {
                newArray = [...oldArray, { ...action.payload.insert, order: oldArray.length }]
            } else {
                console.log(action.payload.index, action.payload.order)
                newArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content.filter((e, i) => {
                    return i !== action.payload.index
                })
            }
            state.present.content.editVersion.sections[action.payload.sectionIndex].content = newArray
            state.future = [];
        },
        updateSubServiceDetailsPointsArray: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            let oldArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content[action.payload.section]
            if (action.payload.operation === 'add') {
                newArray = [...oldArray, { ...action.payload.insert, order: oldArray.length +1 }]
            } else {
                newArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content[action.payload.section].filter((e, i) => {
                    return i !== action.payload.index
                })
            }
            state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section] = newArray
            state.future = [];
        },
        updateAffiliatesCardsArray: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            let oldArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content[action.payload.section]
            if (action.payload.operation === 'add') {
                newArray = [...oldArray, { ...action.payload.src, order: oldArray.length + 1 }]
            } else {
                newArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content[action.payload.section].filter((e, i) => {
                    return e.order !== action.payload.order
                })
            }
            state.present.content.editVersion.sections[action.payload.sectionIndex].content[action.payload.section] = newArray
            state.future = [];
        },
        updatePoliciesItems: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));
            let newArray = []
            let oldArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content.procedures.terms
            if (action.payload.operation === 'add') {
                newArray = [...oldArray, { ...action.payload.insert, order: oldArray.length }]
            } else {
                newArray = state.present.content?.editVersion?.sections?.[action.payload.sectionIndex].content.procedures.terms.filter((e, i) => {
                    return i !== action.payload.index
                })
            }
            state.present.content.editVersion.sections[action.payload.sectionIndex].content.procedures.terms = newArray
            state.future = [];
        },
        updateSelectedContent: (state, action) => { // post content
            state.past.push(JSON.parse(JSON.stringify(state.present)));

            let newOptions = action.payload.data

            switch (action.payload.origin) {
                case "home": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
                    break;

                case "recentproject": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].sections[action.payload.index].items = newOptions
                    break;

                case "testimonials": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
                    break;

                case "project/main": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].sections[action.payload.index].items = newOptions
                    break;

                case "news": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
                    break;

                case "subServices": // in use
                    state.present.content.editVersion.sections[action.payload.sectionIndex].items = newOptions
                    break;

                // case "jobs":
                //     state.present[action.payload?.currentPath].jobListSection.jobs = newOptions;
                //     break;

                case "projectDetail":
                    state.present.projectDetail[action.payload.projectId - 1].moreProjects.projects = newOptions
                    break;

                case "serviceCards":
                    state.present[action.payload?.currentPath].serviceCards = newOptions;
                    break;

                default:
            }
            state.future = [];
        },
        // updateTheProjectSummaryList: (state, action) => {
        //     state.past.push(JSON.parse(JSON.stringify(state.present)));
        //     let newArray = []
        //     let expression;

        //     switch (action.payload.context) {
        //         case "projectDetail":
        //             expression = state.present.projectDetail?.[action.payload.projectId - 1].descriptionSection;
        //             break;

        //         case "careerDetails":
        //             expression = state.present.careerDetails?.[action.payload.careerIndex]?.jobDetails?.leftPanel?.sections;
        //             break;

        //         case "newsBlogsDetails":
        //             expression = state.present.newsBlogsDetails?.[action.payload.newsIndex]?.newsPoints;
        //             break;

        //         case "subOfsubService":
        //             expression = state.present.subOfsubService[action.payload.serviceId][action.payload.deepPath - 1][action.payload.subContext]
        //             break;

        //         default:
        //     }

        //     if (action.payload.operation === 'add') {
        //         newArray = [...expression, action.payload.insert]
        //     } else {
        //         newArray = expression?.filter((e, i) => {
        //             return i !== action.payload.index
        //         })
        //     }

        //     switch (action.payload.context) {
        //         case "projectDetail":
        //             state.present.projectDetail[action.payload.projectId - 1].descriptionSection = newArray
        //             break;

        //         case "careerDetails":
        //             state.present.careerDetails[action.payload.careerIndex].jobDetails.leftPanel.sections = newArray
        //             break;

        //         case "newsBlogsDetails":
        //             state.present.newsBlogsDetails[action.payload.newsIndex].newsPoints = newArray
        //             break;

        //         case "subOfsubService":
        //             state.present.subOfsubService[action.payload.serviceId][action.payload.deepPath - 1][action.payload.subContext] = newArray
        //             break;

        //         default:
        //     }
        //     state.future = [];
        // },

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
    updateIsEditMode,
    updateImages,
    removeImages,
    updateMainContent,
    updateSpecificContent,
    updateServicesNumber,
    updateSelectedContent,
    updateSelectedProject,
    updateMarketSelectedContent,
    updateCardAndItemsArray,
    updatePoliciesItems,
    updateAllProjectlisting,
    selectMainNews,
    submitings,
    addImageArray,
    addImagePointArray,
    rmImagePointArray,
    rmImageArray,
    undo,
    redo,
    updateTheProjectSummaryList,
    updateSelectedSubService,
    updateAList,
    updateComment,
    updateSubServiceDetailsPointsArray,
    updateAffiliatesCardsArray
} = cmsSlice.actions;

export default cmsSlice.reducer; // reducer
