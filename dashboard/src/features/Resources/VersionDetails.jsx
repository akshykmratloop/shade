import { useEffect, useState } from "react";
import formatTimestamp from "../../app/TimeFormat";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { BsDashCircle } from "react-icons/bs";
import { CheckCircle, XCircle } from "lucide-react";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import { useSelector } from "react-redux";
import { restoreVersion, versionInfo } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import CustomContext from "../Context/CustomContext";

const data = [
    {
        role: "Editor",
        status: "Approved",
        comment: "Edit, View, Delete",
    },
    { role: "Verifier", status: "Rejected", comment: "Edit, View, Delete" },
];

const statusStyles = {
    APPROVED: {
        bg: "bg-green-100",
        text: "text-green-600",
        icon: <CheckCircle className="w-4 h-4 inline-block mr-1" />,
    },
    REJECTED: {
        bg: "bg-red-100",
        text: "text-red-600",
        icon: <XCircle className="w-4 h-4 inline-block mr-1" />,
    },
    PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        icon: <BsDashCircle className="w-4 h-4 inline-block mr-1" />,
    },
    Blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        icon: <BsDashCircle className="w-4 h-4 inline-block mr-1" />,
    }
};

const getStyle = {
    VERIFICATION_PENDING: "Blue",
    PUBLISH_PENDING: "Blue",
    SCHEDULED: "APPROVED",
    PUBLISHED: "APPROVED"
}

const toastObject = {
    hideProgressBar: true, autoClose: 700, pauseOnHover: false
}

const RequestDetails = ({ close }) => {
    const id = useSelector(state => state.rightDrawer.extraObject.id)
    const [versionData, setVersionData] = useState({ resource: {}, version: {} })
    const { setRandom } = CustomContext().random


    const { resource, version } = versionData

    const verifiers = Object.entries(version.verifierHistory || [])

    const managers = version.roleHistory?.MANAGER
    const editors = version.roleHistory?.EDITOR
    const publishers = version.roleHistory?.PUBLISHER


    const requestStageStyle = statusStyles[getStyle[versionData?.status]] || {}

    const handleRestoreVersionRequest = async (version) => {
        // validation
        if (version.isLive) return toast.error("Error! Version is already live.", toastObject)
        if (version.versionStatus !== "PUBLISHED") return toast.error("Can't restore version. Version was never published.", toastObject)

        // API Logic
        try {
            const response = await restoreVersion(version.id)
            if (response.ok) {
                toast.success("Version has been restored.", toastObject)
                close()
                setRandom()
            } else {
                toast.error("Failed to restore.", toastObject)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function fetchRequestInfo() {

            if (id) {

                try {
                    const response = await versionInfo(id);

                    if (response.ok) {
                        setVersionData(response?.content)
                    } else {

                    }
                } catch (err) {
                    console.log(err)
                }

            }
        }
        fetchRequestInfo()
    }, [id])
    return (
        <div>
            <div className="flex flex-col h-[87%] text-[14px] custom-text-color p-[10px] py-0  mt-2 overflow-y-auto customscroller">

                <div className="flex py-[15px] justify-between border-b dark:border-[#8a8a8a]">
                    <label>Version Number</label>
                    <p className={`${requestStageStyle.bg} ${requestStageStyle.text} inline-flex items-center px-3 py-1 rounded-full text-xs font-small`}>
                        {version?.versionNumber}
                    </p>
                </div>
                {version.versionStatus === "PUBLISHED" &&
                    <div className="flex py-[15px] justify-between border-b dark:border-[#8a8a8a]">
                        <label></label>
                        <button className="underline text-[#145098] dark:text-[#0EA5E9] font-[300]"
                            onClick={() => handleRestoreVersionRequest(version)}
                        >Restore this version</button>
                    </div>}
                <div className="flex flex-col">
                    <div className="flex py-[15px] justify-between border-b dark:border-[#8a8a8a]">
                        <label>Version Status</label>
                        <div className={`w-max flex flex-col items-end gap-[2.5px]`}>
                            {capitalizeWords(version.versionStatus)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col py-[15px] pb-[2px] justify-between">
                    <label>Assigned Users:</label>
                    <div className={`flex items-center justify-between py-1`}>
                        <p className="w-[160px]">Name</p>
                        <p className="text-xs">Assigned Date</p>
                        <p className="text-center w-[68px]">Status</p>
                    </div>
                    <div className="">
                        <div className=" dark:border-stone-700 flex-col justify-between py-2 items-center">
                            <label className="">Manager:</label>
                            {/* <p>{versionData?.["assignedUsers"]?.manager}</p> */}
                            {
                                managers?.map((manager, i, a) => {
                                    let lastIndex = i === a.length - 1
                                    return (
                                        <div key={manager.user.id}
                                            className={`flex items-center justify-between py-1 border-b ${lastIndex ? "border-stone-[#e5e7eb] dark:border-[#8a8a8a]" : "border-stone-[#efefef] dark:border-[#3d3d3d]"}`}>
                                            <p className="w-[200px]">{TruncateText(manager.user.name, 18)}</p>
                                            <p className="text-xs">{formatTimestamp(manager.assignedAt, ' ')}</p>
                                            <p className={`w-[69px] text-center rounded-full px-1 text-white ${manager.status === "ACTIVE" ? "bg-lime-500" : "bg-red-500"}`}>
                                                {capitalizeWords(manager.status)}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className=" dark:border-stone-700 flex-col justify-between py-2 items-center">
                            <label className="">Editors:</label>
                            {/* <p>{versionData?.["assignedUsers"]?.manager}</p> */}
                            {
                                editors?.map((editor, i, a) => {
                                    let lastIndex = i === a.length - 1
                                    return (
                                        <div key={editor.user.id}
                                            className={`flex items-center justify-between py-1 border-b ${lastIndex ? "border-stone-[#e5e7eb] dark:border-[#8a8a8a]" : "border-stone-[#efefef] dark:border-[#3d3d3d]"}`}>
                                            <p className="w-[200px]">{TruncateText(editor.user.name, 18)}</p>
                                            <p className="text-xs">{formatTimestamp(editor.assignedAt, ' ')}</p>
                                            <p className={`w-[69px] text-center rounded-full px-1 text-white ${editor.status === "ACTIVE" ? "bg-lime-500" : "bg-red-500"}`}>{capitalizeWords(editor.status)}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="flex flex-col">
                            <label className="">Verifiers:</label>
                            {verifiers?.map((stage, ind, a) => {
                                let lastIndex = ind === a.length - 1;
                                return (
                                    <div className={` flex-col justify-between py-2 items-center
                                
                                    `}>
                                        <label className="text-xs">{"Stage " + stage[0]}:</label>
                                        {/* <p>{versionData?.["assignedUsers"]?.manager}</p> */}
                                        {
                                            stage[1]?.map((verifier, i, a) => {
                                                let lastIndexVerifier = i === a.length - 1
                                                return (
                                                    <div key={verifier.user.id}
                                                        className={`flex items-center justify-between py-1 border-b 
                                                        ${(lastIndex && lastIndexVerifier) ? "border-b border-stone-[#e5e7eb] dark:border-[#8a8a8a]" :
                                                                "border-stone-[#efefef] dark:border-[#3d3d3d] "}`}>
                                                        <p className="w-[200px]">{TruncateText(verifier.user.name, 18)}</p>
                                                        <p className="text-xs">{formatTimestamp(verifier.assignedAt, ' ')}</p>
                                                        <p className={`w-[69px] text-center rounded-full px-1 text-white 
                                                            ${verifier.status === "ACTIVE" ? "bg-lime-500" : "bg-red-500"}
                                                                
                                                            `}>{capitalizeWords(verifier.status)}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                );
                            })}
                        </div>
                        <div className=" dark:border-stone-700 flex-col justify-between py-2 items-center">
                            <label className="">Publishers:</label>
                            {/* <p>{versionData?.["assignedUsers"]?.manager}</p> */}
                            {
                                publishers?.map((publisher, i, a) => {
                                    let lastIndex = i === a.length - 1
                                    return (
                                        <div key={publisher.user.id}
                                            className={`flex items-center justify-between py-1 border-b ${lastIndex ? "border-stone-[#e5e7eb] dark:border-[#8a8a8a]" : "border-stone-[#efefef] dark:border-[#3d3d3d]"}`}>
                                            <p className="w-[200px]">{TruncateText(publisher.user.name, 18)}</p>
                                            <p className="text-xs">{formatTimestamp(publisher.assignedAt, ' ')}</p>
                                            <p className={`w-[69px] text-center rounded-full px-1 text-white ${publisher.status === "ACTIVE" ? "bg-lime-500" : "bg-red-500"}`}>{capitalizeWords(publisher.status)}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="border-b border-stone-[#e5e7eb] dark:border-[#8a8a8a] flex flex-col justify-between py-2">
                            <div className="flex gap-1 items-center">
                                <label className=" ">Editor's Comment</label>
                                <RxQuestionMarkCircled />
                            </div>
                            <p className="py-2">
                                {version?.notes}
                            </p>
                        </div>
                        <div className="border-b border-stone-[#e5e7eb] dark:border-[#8a8a8a] flex justify-between py-2 h-[43px] items-center">
                            <label className="">Published Date</label>
                            <p>{formatTimestamp((version.publishedAt || ""))}</p>
                        </div>
                        <div className="border-b border-stone-[#e5e7eb] dark:border-[#8a8a8a] flex justify-between py-2 h-[43px] items-center">
                            <label className="">Published By</label>
                            <p>{versionData?.["submittedBy"]}</p>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex py-[15px] justify-between border-b border-stone-[#e5e7eb] dark:border-[#8a8a8a]">
                        <label>Reference Document</label>
                        <div className={`w-max flex flex-col items-end gap-[2.5px]`}>
                            <p className="text py-0 my-0">PDF File</p>
                            <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0">
                                See Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    );
};

export default RequestDetails;
