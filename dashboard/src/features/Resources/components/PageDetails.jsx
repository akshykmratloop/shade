import { useEffect, useRef } from "react";

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
            <div ref={pageRef} className="fixed p-[30px]  z-30 top-0 right-0 w-[26rem] h-screen bg-base-200 shadow-xl-custom rounded-tl-3xl rounded-bl-3xl">
                <h1 className="font-medium text-[1.1rem]">Page Details for {data.heading}</h1>
                <div className="mt-5 flex flex-col h-[93%] text-[14px]">
                    <div className="flex py-[15px] justify-between border-b">
                        <label>Last Edited:</label>
                        <p>09/09/2025</p>
                    </div>
                    <div className="flex py-[15px] justify-between border-b">
                        <label>Public Version:</label>
                        <div className={`w-min flex flex-col items-end gap-[5px]`}>
                            <p className="text">V 1.1.00</p>
                            <a href="#" className="text" style={{whiteSpace:"pre"}}>Restore Previous Version</a>
                            <a href="#" className="text">View</a>
                        </div>
                    </div>
                    <div className="flex py-[15px] justify-between border-b">
                        <label>Assigned Users:</label>
                        <p>09/09/2025</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageDetails