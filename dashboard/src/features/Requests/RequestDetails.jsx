import React from "react";
import formatTimestamp from "../../app/TimeFormat";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {CheckCircle, XCircle} from "lucide-react";
import {TruncateText} from "../../app/capitalizeword";

const data = [
  {
    role: "Editor",
    status: "Approved",
    comment: "Edit, View, Delete",
  },
  {role: "Verifier", status: "Rejected", comment: "Edit, View, Delete"},
];

const statusStyles = {
  Approved: {
    bg: "bg-green-100",
    text: "text-green-600",
    icon: <CheckCircle className="w-4 h-4 inline-block mr-1" />,
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-600",
    icon: <XCircle className="w-4 h-4 inline-block mr-1" />,
  },
};

const RequestDetails = () => {
  return (
    <div>
      <div className=" flex flex-col h-[87%] text-[14px] custom-text-color p-[10px] py-0  mt-2 overflow-y-auto customscroller">
        <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
          <label>Resource</label>
          <p>Warish</p>
        </div>
        <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
          <label>Status</label>
          <p>Edit Mode</p>
        </div>
        <div className="flex flex-col py-[15px] pb-[2px] justify-between">
          <label>Assigned Users:</label>
          <div className="">
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Manager:</label>
              <p>Warish</p>
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Editor:</label>
              <p>Himanshu</p>
            </div>
            <div className="flex flex-col">
              {["Akshay", "Akshay", "Akshay", "Akshay"].map((el, ind) => {
                let firstIndex = ind === 0;
                return (
                  <div
                    key={ind}
                    className={`flex gap-[10px] items-center border-b dark:border-stone-700 ${
                      firstIndex ? "justify-between" : "justify-end"
                    }`}
                  >
                    {firstIndex && (
                      <label className="!text-[#5d5d5e]">Verifiers:</label>
                    )}
                    <div className="flex gap-[10px] items-center py-[10px]">
                      <p className="border px-[12px] w-[6rem] py-[2px] text-center rounded-3xl font-light text-[11px]">
                        {"level " + parseInt(ind + 1)}
                      </p>
                      <p>{el}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-4 items-center">
              <label className="!text-[#5d5d5e]">Publisher:</label>
              <p>Anukool</p>
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Submitted Date</label>
              <p>09/09/2025</p>
            </div>
            <div className="border-b dark:border-stone-700 flex flex-col justify-between py-2">
              <div className="flex gap-1 items-center">
                <label className="!text-[#5d5d5e] ">Comment</label>
                <RxQuestionMarkCircled />
              </div>
              <p className="py-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
              </p>
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Submitted By</label>
              <p>Warish</p>
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Submitted To</label>
              <p>Akshay</p>
            </div>
            <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
              <label className="!text-[#5d5d5e]">Version No.</label>
              <p>V 1.1.0</p>
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
          <div className="w-1/2 flex flex-col justify-between py-2">
            <label className="!text-[#5d5d5e]">Request Type</label>
            <p>Verifier</p>
          </div>
          <div className=" w-1/2 flex  flex-col justify-between py-2">
            <label className="!text-[#5d5d5e]">Request No.</label>
            <p>0002</p>
          </div>
        </div>
        <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
          <label className="!text-[#5d5d5e]">Previous Request</label>
          <p>Verifier | 0001</p>
        </div>
        <div className="flex flex-col justify-between py-2">
          <label className="!text-[#5d5d5e] pt-1 pb-2">Approval Status</label>
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-800 text-white">
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
            <tbody>
              {data.map(({role, status, comment}) => {
                const {bg, text, icon} = statusStyles[status] || {};
                return (
                  <tr key={role} className="border-b last:border-0">
                    <td className="px-3 py-2 text-sm">{role}</td>
                    <td className="px-3 py-2 text-sm">
                      <span
                        className={`${bg} ${text} inline-flex items-center px-3 py-1 rounded-full text-xs font-small`}
                      >
                        {icon}
                        {status}
                      </span>
                    </td>

                    <td title={comment} className="px-3 py-2 text-sm">
                      {TruncateText(comment, 20)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
