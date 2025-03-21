import { useEffect, useRef } from "react";
import StatusBar from "./Statusbar";
import Assigned from "../../../assets/image 13.svg"
import Edit from "../../../assets/image 14.svg"
import Verify from "../../../assets/image 15.svg"
import Publisher from "../../../assets/image 16.svg"


const PageDetails = ({ data, display, setOn }) => {
    const pageRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pageRef.current && !pageRef.current.contains(event.target)) {
                setOn(false);
            }
        };

        if (display) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [display, setOn]);

    return (
        <div className={`${display ? "block" : "hidden"} fixed z-20 top-0 left-0 w-[100vw] h-screen bg-black bg-opacity-50`}>
            <div ref={pageRef} className="fixed p-[30px] z-30 top-0 right-0 w-[26rem] h-screen bg-base-200 shadow-xl-custom rounded-tl-3xl rounded-bl-3xl">
                <h1 className="font-medium text-[1.1rem]">Page Details for {data.heading}</h1>
                <div className="mt-5 flex flex-col h-[93%] text-[14px] custom-text-color">
                    <div className="flex py-[15px] justify-between border-b">
                        <label>Last Edited:</label>
                        <p>09/09/2025</p>
                    </div>
                    <div className="flex py-[15px] justify-between border-b">
                        <label>Public Version:</label>
                        <div className={`w-min flex flex-col items-end gap-[2.5px]`}>
                            <p className="text py-0 my-0">V 1.1.00</p>
                            <button className="text-[#145098] underline font-[300] py-0 my-0" style={{ whiteSpace: "pre" }}>Restore Previous Version</button>
                            <button className="text-[#145098] underline font-[300] py-0 my-0">View</button>
                        </div>
                    </div>
                    <div className="flex flex-col py-[15px] pb-[2px] justify-between">
                        <label>Assigned Users:</label>
                        <div className="">
                            <div className="border-b flex justify-between py-2 h-[43px] items-center">
                                <label className="!text-[#5d5d5e]">Manager:</label>
                                <p>Warish</p>
                            </div>
                            {/* <div className="border border-cyan-500 flex"> */}
                            <div className="flex flex-col">
                                {["Akshay", "Akshay", "Akshay", "Akshay"].map((el, ind) => {
                                    let firstIndex = ind === 0
                                    return (
                                        <div className={`flex gap-[10px] items-center border-b ${firstIndex ? "justify-between" : "justify-end"}`}>
                                            {firstIndex && <label className="!text-[#5d5d5e]">Verifiers:</label>}
                                            <div className="flex gap-[10px] items-center py-[10px]">
                                                <p className="border px-[12px] w-[6rem] py-[2px] text-center rounded-3xl font-light text-[10px]">{"level " + parseInt(ind + 1)}</p>
                                                <p>{el}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="border-b flex justify-between py-2 h-[43px] items-center">
                                <label className="!text-[#5d5d5e]">Publisher:</label>
                                <p>Warish Ahmad</p>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="flex flex-col border-b">
                        <div className="flex py-[15px] justify-between ">
                            <label>Page Status:</label>
                            <p>Null</p>
                        </div>
                        <div className="flex flex-col gap-[12px]">
                            <div className="bg-blue-500">
                                <StatusBar />
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col ">
                                    <img src={Assigned} alt="" className="w-[20px] h-[20px]" />
                                    <p>Assigned</p>
                                </div>
                                <div className="flex flex-col items-center translate-x-[-4px]">
                                    <img src={Edit} alt="" className="w-[20px] h-[20px]" />
                                    <p>Edit</p>
                                </div>
                                <div className="flex flex-col items-center translate-x-[9px]">
                                    <img src={Verify} alt="" className="w-[20px] h-[20px]" />
                                    <p>Verify</p>
                                </div>
                                <div className="flex flex-col items-center translate-x-2">
                                    <img src={Publisher} alt="" className="w-[20px] h-[20px]" />
                                    <p>Publisher</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageDetails