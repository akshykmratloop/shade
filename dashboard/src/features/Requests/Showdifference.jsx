import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import userIcon from "../../assets/user.png"
import formatTimestamp from "../../app/TimeFormat";
import { getRoleById } from "../../app/fetch";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import AllForOne from "../Resources/components/AllForOne";
import content from "../Resources/components/websiteComponent/content.json"
import { useSelector } from "react-redux";


function ShowDifference({ role, show, onClose }) {
    const [fetchedRole, setFetchedRole] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)
    const contentFromRedux = useSelector(state => state.homeContent.present)


    const modalRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    useEffect(() => {
        async function getRole() {
            if (!role?.id) return;
            setLoading(true);
            try {
                const response = await getRoleById(role.id);
                if (response.statusCode >= 400 || response instanceof Error) {
                    throw `Error: status: ${response.statusCode}, type: ${response.errorType}`
                }
                setTimeout(() => {
                    setFetchedRole(response.role);
                    setError(false);
                }, 200)
            } catch (err) {
                setError(true);
                console.log("catch")
            } finally {
                setTimeout(() => {

                    setLoading(false);
                }, 200)
            }
        }
        getRole();
    }, [role]);

    if (!role) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50 font-poppins">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4 px-0">
                <Dialog.Panel className="w-[98vw] h-[98vh] overflow-y-auto customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6 px-0">
                    <div className="flex justify-between items-center mb-4 px-6">
                        <Dialog.Title className="text-lg font-[500]">Difference Preview</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>

                    <div className="flex scale-[.95] translate-x-[-15px] translate-y-[-100px]">
                        <div>
                            <AllForOne currentPath={"home"} language={"en"} screen={760} content={content} fullScreen={""}/>
                        </div>
                        <div>
                            <AllForOne currentPath={"home"} language={"en"} screen={760} content={contentFromRedux} fullScreen={""} />
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default ShowDifference;