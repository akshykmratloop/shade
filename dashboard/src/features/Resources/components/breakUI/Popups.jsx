import { useEffect, useRef } from "react"
import CloseModalButton from "../../../../components/Button/CloseButton";

const Popups = ({ confirmationText, display, setClose }) => {
    const modalRef = useRef(null)


    useEffect(() => {
        const hanldeClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setClose()
            }
        }

        window.addEventListener("mousedown", hanldeClickOutside)

        return () => window.removeEventListener("mousedown", hanldeClickOutside)
    }, [])
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-30 bg-black/50 ${display ? "block" : "hidden"}`}>
            <div ref={modalRef} className="bg-white dark:bg-[#242933] flex flex-col items-center justify-center gap-5 p-6 rounded-lg shadow-lg w-[300px] relative">
                <CloseModalButton onClickClose={setClose} />
                <p className="text-lg font-semibold">Confirm</p>
                <p className="text-sm">{confirmationText}</p>
                <div className="mt-4 flex gap-4">
                    <button onClick={setClose} className="px-4 w-[5rem] py-2 bg-[#FF0000] text-white rounded-md">No</button>
                    <button className="px-4 w-[5rem] py-2 bg-[#29469c] text-white rounded-md">Yes</button>
                </div>
            </div>
        </div>
    );
};

export default Popups;
