import { useEffect, useRef, useState } from "react"
import CloseModalButton from "../../../../components/Button/CloseButton";
import { MoonLoader } from "react-spinners";

const Popups = ({ confirmationText, display, setClose, confirmationFunction }) => {
    const [isloading, setIsLoading] = useState(false);
    const modalRef = useRef(null);

    async function onConfirm() {
        setIsLoading(true);
        await confirmationFunction();
        setIsLoading(false);
        setClose();
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setClose();
            }
        }

        window.addEventListener("mousedown", handleClickOutside);

        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-30 bg-black/50 ${display ? "block" : "hidden"}`}>
            {isloading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <MoonLoader color="#ffffff" />
                </div>
            ) : (
                <div ref={modalRef} className="bg-white dark:bg-[#242933] flex flex-col items-center justify-center gap-5 p-6 rounded-lg shadow-lg w-[300px] relative">
                    <CloseModalButton onClickClose={setClose} />
                    <p className="text-lg font-semibold">Confirm</p>
                    <p className="text-sm">{confirmationText}</p>
                    <div className="mt-4 flex gap-4">
                        <button onClick={setClose} className="px-4 w-[5rem] py-2 bg-[#FF0000] text-white rounded-md">No</button>
                        <button onClick={onConfirm} className="px-4 w-[5rem] py-2 bg-[#29469c] text-white rounded-md">Yes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popups;

