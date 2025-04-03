import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import formatTimestamp from "../../app/TimeFormat";
import { getRoleById } from "../../app/fetch";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import DummyData from "../../assets/Dummy_User.json"


function ShowLogs({ log, show, onClose }) {
    const [fetchedRole, setFetchedRole] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)

    function getBrowserInfo(uaString) {
        let browserMatch = uaString?.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)\/?\s*(\d+)/i) || [];

        // Special handling for older Edge and IE versions
        if (/Trident/i.test(browserMatch[1])) {
            let ieMatch = uaString?.match(/rv:(\d+)/);
            return { browser: "Internet Explorer", version: ieMatch ? ieMatch[1] : "Unknown" };
        }

        if (browserMatch[1] === "Chrome") {
            let edgeOrOpera = uaString?.match(/\b(Edg|OPR)\/(\d+)/);
            if (edgeOrOpera) {
                return { browser: edgeOrOpera[1] === "Edg" ? "Edge" : "Opera", version: edgeOrOpera[2] };
            }
        }

        return {
            browser: browserMatch[1] || "Unknown",
            version: browserMatch[2] || "Unknown"
        };
    }

    const browserInfoToRender = getBrowserInfo(log?.browserInfo) ?? undefined
    
    function isValidDateTime(str) {
        return !isNaN(Date.parse(str));
    }

    const modalRef = useRef(null);
    const data = []

    data.forEach(element => {
        
    });

    if (log?.newValue) {
        delete log.newValue.id;
        delete log.newValue.roleTypeId;
        delete log.newValue.image;
        delete log.newValue.password;
    }
    
    if (log?.oldValue) {
        delete log.oldValue.id;
        delete log.oldValue.roleTypeId;
    }    

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
        async function getUser() {
            if (!log?.id) return;
            setLoading(true);
            try {
                const response = await getRoleById(log?.id);
                setTimeout(() => {
                    // setFetchedRole(response.role);
                    setFetchedRole(log)
                    setError(false);
                }, 200)
            } catch (err) {
                setError(true);
            } finally {
                setTimeout(() => {

                    setLoading(false);
                }, 200)
            }
        }
        getUser();
    }, [log]);

    if (!log) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50 font-poppins">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[653px] h-[600px] overflow-y-scroll customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-[500]">Log Details</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>

                    {
                        loading || error ? (<SkeletonLoader />
                        ) : (

                            <div className="overflow-x-auto">

                                <table className="table-auto w-full text-left mb-4">
                                    <thead>

                                    </thead>
                                    <tbody style={{ borderBottom: "1px solid #E0E0E0 " }}>
                                        <tr className="font-light text-sm ">
                                            <td className="pt-2  w-1/4">Action Type</td>
                                            <td className="pt-2  w-1/4">Target</td>
                                            <td className="pt-2  w-1/4">Performed By</td>
                                            <td className="pt-2  w-1/4">Perfromed Over</td>

                                        </tr>
                                        <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm">
                                            <td className={`py-2 pb-6 w-1/4`}>
                                                {log.actionType ?? "N/A"}
                                            </td>
                                            <td className="py-2 pb-6  w-1/4">{log.entity ?? "N/A"}</td>
                                            <td className="py-2 pb-6 w-1/4">{log?.user?.user?.name ?? "N/A"}</td>
                                            <td className="py-2 pb-6  w-1/4">{log?.oldValue?.name ?? "N/A"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table-auto w-full text-left mb-4">
                                    <thead>

                                    </thead>
                                    <tbody style={{ borderBottom: "1px solid #E0E0E0 " }}>
                                        <tr className="font-light text-sm ">
                                            <td className="pt-2  w-1/4">Outcome</td>
                                            <td className="pt-2  w-1/4">Date & Time</td>
                                            <td className="pt-2  w-1/4">Browser Info</td>
                                            <td className="pt-2  w-1/4">IP Address</td>

                                        </tr>
                                        <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm h-30">
                                            <td className="py-2 pb-6  w-1/4">
                                                <p
                                                    className={`w-[85px] 
                                                         
                                                        before:content-['•'] 
                                                        before:text-2xl 
                                                        flex h-7 
                                                        items-center
                                                        justify-center gap-1 
                                                        px-1 py-0 font-[500] 
                                                        ${log?.outcome === 'Success' ?
                                                            "text-green-600 bg-green-100 before:text-green-600 px-1" :
                                                            log?.outcome === "Failed" ? "text-red-600 bg-red-100 before:text-red-600" :
                                                                "text-stone-600 bg-stone-100 before:text-stone-600"
                                                        } 
                                                        rounded-2xl
                                                        `}
                                                    style={{ textTransform: "capitalize", }}
                                                >
                                                    {capitalizeWords(fetchedRole?.outcome ?? "N/A")}
                                                </p>
                                            </td>
                                            <td className={`py-2 pb-6  w-1/4`}>
                                                <p className="w-[120px] ">
                                                    {formatTimestamp(log?.timestamp) || "N/A"}
                                                </p>
                                            </td>
                                            <td className="py-2 pb-6 w-1/4">
                                                {`${browserInfoToRender?.browser} ${browserInfoToRender?.version}`}
                                            </td>
                                            <td className="py-2 pb-6  w-1/4"
                                            >
                                                <p className="">
                                                    {(log.ipAddress) ?? "N/A"}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex gap-3">

                                    <table className=" border-collapse w-1/2">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="text-left font-[500] text-[">Old Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { log.oldValue &&
                                                Object.keys(log?.oldValue ?? {})?.map((e, i, a) => {

                                                    return (
                                                        <tr key={i} className="font-[300] text-[12px] border-b ">
                                                            <td className=" font-[400] pr-1 w-1/3">{capitalizeWords(e)}: </td>
                                                            <td className="">{log.oldValue !== null ? isValidDateTime(log.oldValue[e]) ? formatTimestamp(log.oldValue[e]) : log.oldValue[e] : ""}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <table className=" border-collapse w-1/2">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="text-left font-[500] text-[">New Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {log.newValue &&
                                                Object.keys(log?.newValue ?? {})?.map((e, i, a) => {

                                                    return (
                                                        <tr key={i} className="font-[300] text-[12px] border-b">
                                                            <td className="font-[400] pr-1 w-1/3 py-2">{capitalizeWords(e)}: </td>
                                                            <td className="py-2">{ isValidDateTime(log.newValue[e]) ? formatTimestamp(log.newValue[e]) : log.newValue[e]}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        )
                    }
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default ShowLogs;