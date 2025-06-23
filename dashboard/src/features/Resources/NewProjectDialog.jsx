import CloseModalButton from "../../components/Button/CloseButton"
import NA_Image from "../../assets/na.svg"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { structures } from "./components/websiteComponent/structures/PageStructure"
import { useDispatch } from "react-redux"
import { updateMainContent } from "../common/homeContentSlice"


const NewProjectDialog = ({ close, display, resources }) => {
    const usedTemp = new Set(resources.map(e => {
        if (e.resourceTag?.slice(0, 5) === "TEMPL")
            return e.resourceTag
    }).filter(Boolean))
    console.log(usedTemp)
    const navigate = useNavigate()
    const [selectedTemp, setSelectedTemp] = useState(-1)
    const dispatch = useDispatch()

    const templates = [
        { name: "Template 1", image: "", route: "temp-1", resourceTag: "TEMPLATE_ONE" },
        { name: "Template 2", image: "", route: "temp-2", resourceTag: "TEMPLATE_TWO" },
        { name: "Template 3", image: "", route: "temp-3", resourceTag: "TEMPLATE_THREE" },
        { name: "Template 4", image: "", route: "temp-4", resourceTag: "TEMPLATE_FOUR" }
    ]

    function selectTemplate(index) {
        if (selectedTemp === index) setSelectedTemp(-1)
        else setSelectedTemp(index)
    }

    function onSelectTemplate() {
        navigate(`../edit/${templates[selectedTemp]?.route}`)
        localStorage.setItem("contextId", templates[selectedTemp]?.resourceTag)
        dispatch(updateMainContent({ currentPath: "content", payload: structures[templates[selectedTemp]?.resourceTag] }))
    }

    return (
        <div className="fixed top-0 left-0 bg-black/70 z-[52] w-screen h-screen " style={{ display: display ? "block" : "none" }}>
            <div className="h-full flex justify-center items-center">

                <div id="" className="w-[45vw] h-[85vh] bg-[#fff] relative rounded-lg p-6">
                    <CloseModalButton onClickClose={close} />
                    <h2 className="text-lg font-[500] mb-5">Create New Resource</h2>
                    <div className="flex flex-col gap-5 items-start">
                        <h3>Choose Template</h3>
                        <div className="grid grid-cols-2 gap-[30px_60px] px-10 auto-rows-1fr h-fit" >
                            {
                                templates.map((e, i) => {
                                    if(usedTemp.has(e.resourceTag)) return null
                                    return (
                                        <div className={`rounded-md border border-2  ${selectedTemp == i && "border-blue-500"} p-2 flex flex-col gap-1`} key={i}
                                            onClick={() => selectTemplate(i)}
                                        >
                                            <div className="rounded-md overflow-hidden">
                                                <img src={`${NA_Image}`} className={`w-full aspect-[3/2] object-center object-cover`} alt="" />
                                            </div>
                                            <h3>{e.name}</h3>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="flex gap-2 self-end font-[500]">
                            <button className="py-3 border rounded-lg px-3" onClick={close}>Cancel</button>
                            <button className="py-3 rounded-lg bg-gradient-to-r from-blue-500/100 via-purple-500/ to-pink-500/70 p-3 text-white "
                                onClick={() => { onSelectTemplate() }}>Create Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProjectDialog