// library
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
// modules
import resources from "./resourcedata";
import ConfigBar from "./components/breakUI/ConfigBar";
import PageDetails from "./components/breakUI/PageDetails";
import { getLeadsContent } from "./leadSlice"
import Navbar from "../../containers/Navbar"
// icon
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import capitalizeWords from "../../app/capitalizeword";

function Resources() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const divRef = useRef(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isSmall, setIsSmall] = useState(false)
    const [isNarrow, setIsNarrow] = useState(false)
    const [currentResource, setCurrentResource] = useState("pages")
    const [configBarOn, setConfigBarOn] = useState(false);
    const [PageDetailsOn, setPageDetailsOn] = useState(false);
    const [configBarData, setConfigBarData] = useState({})

    const resNotAvail = resources?.[currentResource]?.length === 0


    const settingRoute = (firstRoute, secRoute, thirdRoute) => {
        let routeExpression = ''
        if (thirdRoute) {
            routeExpression = `./edit/${firstRoute}/${secRoute}/${thirdRoute}`
        } else if (secRoute) {
            routeExpression = `./edit/${firstRoute}/${secRoute}`
        } else {
            routeExpression = `./edit/${firstRoute}`
        }

        navigate(routeExpression)
        return 0;
    }

    useEffect(() => {
        dispatch(getLeadsContent())
        const currentResource = localStorage.getItem("resource")
        if (currentResource) setCurrentResource(currentResource)
    }, [])

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setIsCollapsed(entry.contentRect.width < 1100);
                setIsSmall(entry.contentRect.width < 1200);
                setIsNarrow(entry.contentRect.width < 600);
            }
        });

        if (divRef.current) observer.observe(divRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="customscroller relative" ref={divRef}>
            <Navbar currentNav={currentResource} setCurrentResource={setCurrentResource} />
            <div className={`${resNotAvail ? "" : "grid"} ${isNarrow ? "grid-cols-1" : "grid-cols-2"} mt-4 lg:grid-cols-3 gap-10 w-full px-10`}>
                {resNotAvail ? <p className="">Sorry, No Resource available for {currentResource}</p>
                    :
                    resources?.[currentResource].map((page, index) => (
                        <div key={index + Math.random()} className="w-full ">
                            <h3 className="mb-1 font-poppins font-semibold">
                                {isSmall
                                    ? (page.heading.length > 20 ? page.heading.substring(0, 20) + "..." : page.heading)
                                    : (page.heading.length > 35 ? page.heading.substring(0, 35) + "..." : page.heading)
                                }
                            </h3>
                            <div className="relative rounded-lg overflow-hidden border border-[1px] border-base-300 shadow-xl-custom">
                                {/* Info Icon
                                <div className="absolute top-2 right-2 z-10 text-[1.5rem] p-2 rounded-full text-[blue]">
                                    <FiInfo />
                                </div> */}
                                <div className={` h-6 ${page.assign ? 'bg-[#29469c] w-[120px]' : "bg-red-600 w-[140px]"} text-white flex items-center justify-center text-sm font-[300] clip-concave absolute top-3 left-0 z-10`}>
                                    {page.assign ? "Assigned" : "Not assigned"}
                                </div>

                                {/* Background Image with Adjusted Dark Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 via-60%"></div>
                                <div className="relative aspect-[10/11] overflow-hidden">
                                    <iframe
                                        src={page.src}
                                        className={`top-0 left-0 border-none transition-all duration-300 ease-in-out ${isNarrow ? "w-[1000px] scale-[0.5]" : "w-[1200px] scale-[0.4]"
                                            } origin-top-left h-[80rem]`}
                                    ></iframe>

                                    {/* Dark Gradient Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/100 via-black/40 to-transparent"></div>
                                    <div className="absolute top-0 left-0 w-full h-1/3  bg-gradient-to-b from-white/100 via-white/40 to-transparent"></div>
                                </div>

                                {/* Bottom Text Options */}
                                <div className={`absolute bottom-3 left-0 w-full text-center text-white justify-center items-center flex ${isNarrow ? "gap-2" : "gap-6"} py-1`}>
                                    {[{ icon: <AiOutlineInfoCircle />, text: "Info", onClick: () => { setPageDetailsOn(true); setConfigBarData(page) } },
                                    { icon: <FiEdit />, text: "Edit", onClick: () => { page.subPage ? page.subOfSubPage ? settingRoute(page.supPage, page.subPage, page.subOfSubPage) : settingRoute(currentResource, page.subPage) : settingRoute(page.heading?.toLowerCase()) } },
                                    { icon: <IoSettingsOutline />, text: "Config", onClick: () => { setConfigBarOn(true); setConfigBarData(page) } }].map((item, i) => (
                                        <span key={i + Math.random()}
                                            onClick={item.onClick}
                                            className={`flex ${isCollapsed ? "flex-col" : ""} ${i < 2 ? "border-r-2 pr-5" : ""} gap-2 items-center text-center cursor-pointer`}>
                                            {item.icon}
                                            <span className={`${isSmall ? "text-xs" : "text-sm"}`}>
                                                {item.text}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>  
                        </div>
                    ))}

                {
                    resources?.[currentResource]?.[0]?.subPage &&
                    <div className="w-full flex flex-col gap-[5px] ">
                        <h3 className=" font-poppins font-semibold">
                            {`Add More ${capitalizeWords(currentResource)} Page`}
                        </h3>
                        <div onClick={() => { navigate(`./edit/${currentResource}/${resources?.[currentResource].length + 1}`) }}
                            className="border rounded-md bg-[white] aspect-[10/11] justify-center flex-grow cursor-pointer flex items-center text-[50px] shadow-xl-custom border-[#29469c80]"
                        >
                            <span className="text-[#1f2937]">+</span>
                        </div>
                    </div>
                }
            </div>

            {/* right side bar for configuration */}
            <ConfigBar data={configBarData} display={configBarOn} setOn={setConfigBarOn} />
            <PageDetails data={configBarData} display={PageDetailsOn} setOn={setPageDetailsOn} />

        </div>
    )
}

export default Resources
