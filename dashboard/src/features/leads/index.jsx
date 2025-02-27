import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { getLeadsContent } from "./leadSlice"
import Navbar from "../../containers/Navbar"
import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { FiInfo } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import resources from "./Resources";
import ConfigBar from "./components/ConfigBar";

function Resources() {
    const dispatch = useDispatch()
    const divRef = useRef(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isSmall, setIsSmall] = useState(false)
    const [isNarrow, setIsNarrow] = useState(false)
    const [currentResource, setCurrentResource] = useState("pages")
    const [configBarOn, setConfigBarOn] = useState(false);
    const [configBarData, setConfigBarData] = useState({})

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
            <div className={`grid ${isNarrow ? "grid-cols-1" : "grid-cols-2"} mt-4 lg:grid-cols-3 gap-12 w-full px-8`}>
                {resources?.[currentResource].length === 0 ? <p className="">Sorry, No Resource available for {currentResource}</p>
                    :
                    resources?.[currentResource].map((page, index) => (
                        <div key={index} className="w-full ">
                            <h3 className="mb-1 font-poppins font-semibold">{page.heading}</h3>
                            <div className="relative rounded-lg overflow-hidden border border-[1px] border-base-300 shadow-xl-custom">
                                {/* Info Icon */}
                                <div className="absolute top-2 right-2 z-10 text-[1.5rem] p-2 rounded-full text-[blue]">
                                    <FiInfo />
                                </div>

                                {/* Background Image with Adjusted Dark Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 via-60%"></div>
                                <div className="relative aspect-[9/10] overflow-hidden">
                                    {/* Click-blocking transparent overlay */}
                                    {/* <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"></div> */}

                                    {/* Iframe */}
                                    <iframe
                                        src={page.src}
                                        className={`top-0 left-0 border-none transition-all duration-300 ease-in-out ${isNarrow ? "w-[1000px] scale-[0.5]" : "w-[1200px] scale-[0.4]"
                                            } origin-top-left h-[80rem]`}
                                    // scrolling="no"
                                    ></iframe>

                                    {/* Dark Gradient Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/100 via-black/40 to-transparent"></div>
                                    <div className="absolute top-0 left-0 w-full h-1/3  bg-gradient-to-b from-white/100 via-white/40 to-transparent"></div>
                                    {/* <div className="absolute top-[-5.2rem] right-[-5.2rem] w-full h-3/4 bg-gradient-to-bl from-black/45 via-transparent via-[15%] to-transparent before:absolute before:top-0 before:right-0 before:w-1/2 before:h-1/2 before:bg-[radial-gradient(circle,_rgba(0,0,0,0.45)_10%,_transparent_60%)]"></div> */}

                                </div>


                                {/* Bottom Text Options */}
                                <div className={`absolute bottom-2 left-0 w-full text-center text-white justify-center items-center flex  ${isNarrow ? "gap-2" : "gap-6"} py-1`}>
                                    {[
                                        { icon: <FaRegEye />, text: "View" },
                                        { icon: <FiEdit />, text: "Edit" },
                                        { icon: <IoSettingsOutline />, text: "Config" }
                                    ].map((item, i) => (
                                        <span key={i}
                                            onClick={() => {setConfigBarOn(true); setConfigBarData(page)}}
                                            className={`flex ${isCollapsed ? "flex-col" : ""} ${i < 2 ? "border-r-2 pr-5" : ""} gap-1 items-center text-center cursor-pointer`}>
                                            {item.icon}
                                            <span className={`${isSmall ? "text-sm" : "text-base"}`}>
                                                {item.text}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <ConfigBar data={configBarData} display={configBarOn} setOn={setConfigBarOn} />
        </div>
    )
}

export default Resources