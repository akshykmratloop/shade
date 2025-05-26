import { useEffect, useState } from "react";
import formatTimestamp from "../../app/TimeFormat";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { BsDashCircle } from "react-icons/bs";
import { CheckCircle, XCircle } from "lucide-react";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import { useSelector } from "react-redux";
import { getRequestInfo, versionInfo } from "../../app/fetch";
import { FiEye } from "react-icons/fi";
import Comments from "../Requests/Comments";

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

const RequestDetails = () => {
    const id = useSelector(state => state.rightDrawer.extraObject.id)
    const [versionData, setVersionData] = useState({ resource: {}, version: {} })

    const { resource, version } = useState

    const verifiers = Object.entries(versionData?.["assignedUsers"]?.verifiers || [])

    const requestStageStyle = statusStyles[getStyle[versionData?.status]] || {}


    console.log("requestDetails, ", id)
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
            <div className=" flex flex-col h-[87%] text-[14px] custom-text-color p-[10px] py-0  mt-2 overflow-y-auto customscroller">
                <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                    <label>Resource</label>
                    <p>{resource?.titleEn || "N/A"}</p>
                </div>
                <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                    <label>Version Number</label>
                    <p className={`${requestStageStyle.bg} ${requestStageStyle.text} inline-flex items-center px-3 py-1 rounded-full text-xs font-small`}>
                        {/* {requestStageStyle.icon}
                        {capitalizeWords(requestData?.status) || "N/A"} */}
                        {version?.versionNumber}
                    </p>
                </div>
                <div className="flex flex-col">
                    <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                        <label>Version Status</label>
                        <div className={`w-max flex flex-col items-end gap-[2.5px]`}>
                            <p className="text py-0 my-0">PDF File</p>
                            <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0">
                                See Document
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col py-[15px] pb-[2px] justify-between">
                    <label>Assigned Users:</label>
                    <div className="">
                        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                            <label className="">Manager:</label>
                            <p>{versionData?.["assignedUsers"]?.manager}</p>
                        </div>
                        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                            <label className="">Editor:</label>
                            <p>{versionData?.["assignedUsers"]?.editor}</p>
                        </div>
                        <div className="flex flex-col">
                            {verifiers?.map((el, ind) => {
                                let firstIndex = ind === 0;
                                return (
                                    <div
                                        key={ind}
                                        className={`flex gap-[10px] items-center border-b dark:border-stone-700 ${firstIndex ? "justify-between" : "justify-end"
                                            }`}
                                    >
                                        {firstIndex && <label className="">Verifiers:</label>}
                                        <div className="flex gap-[10px] items-center py-[10px]">
                                            <p className="border px-[12px] w-[6rem] py-[2px] text-center rounded-3xl font-light text-[11px]">
                                                {el[0]}
                                            </p>
                                            <p>{el[1]}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-b dark:border-stone-700 flex justify-between py-4 items-center">
                            <label className="">Publisher:</label>
                            <p>{versionData?.["assignedUsers"]?.publisher}</p>
                        </div>
                        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                            <label className="">Submitted Date</label>
                            <p>{formatTimestamp(versionData?.["submittedDate"])}</p>
                        </div>
                        <div className="border-b dark:border-stone-700 flex flex-col justify-between py-2">
                            <div className="flex gap-1 items-center">
                                <label className=" ">Editor's Comment</label>
                                <RxQuestionMarkCircled />
                            </div>
                            <p className="py-2">
                                {versionData?.comment}
                            </p>
                        </div>
                        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                            <label className="">Submitted By</label>
                            <p>{versionData?.["submittedBy"]}</p>
                        </div>
                        {/* <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="">Submitted To</label>
              <p>{requestData?.["submittedTo"]}</p>
            </div> */}
                        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                            <label className="">Version No.</label>
                            <p>{versionData?.["versionNo."]}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                        <label>Reference Document</label>
                        <div className={`w-max flex flex-col items-end gap-[2.5px]`}>
                            <p className="text py-0 my-0">PDF File</p>
                            <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0">
                                See Document
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex border-b dark:border-stone-700">
                    {/* <div className="w-1/2 flex flex-col justify-between py-2">
            <label className="">Request Type</label>
            <p>{requestData?.["requestType"]}</p>
          </div> */}
                    {/* <div className=" w-1/2 flex  flex-col justify-between py-2">
            <label className="">Request No.</label>
            <p>{requestData?.["requestNo."]}</p>
          </div> */}
                </div>
                {/* <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
          <label className="">Previous Request</label>
          <p>{requestData?.["previousRequest"]}</p>
        </div> */}
                <div className="flex flex-col justify-between py-2">
                    <label className=" pt-1 pb-2">Approval Status</label>
                    <table className="w-full bg-white rounded-lg shadow dark:bg-base-100">
                        <thead>
                            <tr className="bg-blue-800 dark:bg-slate-700 text-white">
                                <th className="px-3 py-2 text-sm  text-left font-light rounded-tl-lg">
                                    Role
                                </th>
                                <th className="px-3 py-2 text-sm  text-left font-light ">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-sm  text-left font-light  rounded-tr-lg">
                                    Comment
                                </th>
                            </tr>
                        </thead>
                        <tbody className="relative">
                            {versionData?.approvalStatus?.map(({ role, status, comment }, i) => {
                                const { bg, text, icon } = statusStyles[status] || {};
                                // setCommentOn(prev => ({ ...prev, i: false }))
                                return (
                                    <tr
                                        key={role}
                                        className="border-b dark:border-slate-700 last:border-0"
                                    >
                                        <td className="px-3 py-2 text-sm">{capitalizeWords(role)}</td>
                                        <td className="px-3 py-2 text-sm dark:text-white  ">
                                            <span
                                                className={`${bg} ${text} inline-flex items-center px-3 py-1 rounded-full text-xs font-small`}
                                            >
                                                {icon}
                                                {status}
                                            </span>
                                        </td>

                                        <td title={comment || 'N/A'} className="px-3 py-2 text-sm">
                                            <Comments comment={comment} />
                                            {/* <div className="flex items-center gap-1">

                        {TruncateText(comment, 20) || "N/A"}
                        {comment !== "No Comments" && (
                          <div className=""
                            onClick={() => setCommentOn(prev => ({ ...prev, i: !prev.i }))}
                          >
                            <FiEye />
                            {
                              commentOn &&
                              <div className="absolute right-[110%] top-[50%] z-[70]">
                                <div className="comment-bubble">
                                  <div className="comment-bubble-arrow"></div>
                                  <h3>Comments:</h3>
                                  <p className={`${comment ? "text-stone-900 dark:text-stone-200" : "text-stone-300"}`}>{comment || "No comments"}</p>
                                </div>
                              </div>
                            }
                          </div>
                        )}
                      </div> */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default RequestDetails;
