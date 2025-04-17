// libraries import
import { useEffect, useState } from "react";
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { toast, ToastContainer } from "react-toastify";
// self modules
import { userLogs } from "../../app/fetch";
// import AddRoleModal from "./AddRole";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import ShowLogs from "./ShowLog";
import updateToasify from "../../app/toastify";
// icons
import { Switch } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { FiEye } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter } from "react-icons/lu";
import { LuImport } from "react-icons/lu";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import formatTimestamp from "../../app/TimeFormat";
// import userIcon from "../../assets/user.png"

const TopSideButtons = ({
    removeFilter,
    applyFilter,
    applySearch,
    openAddForm,
}) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = ["Success", "Failure"];
    const showFiltersAndApply = (status) => {
        applyFilter(status);
        setFilterParam(status);
    };
    const removeAppliedFilter = () => {
        removeFilter();
        setFilterParam("");
        setSearchText("");
    };
    useEffect(() => {
        if (searchText === "") {
            removeAppliedFilter();
        } else {
            applySearch(searchText);
        }
    }, [searchText]);
    return (
        <div className="inline-block float-right w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1">
            <SearchBar
                searchText={searchText}
                styleClass="w-700px border-none w-full flex-1"
                setSearchText={setSearchText}
                placeholderText={"Search Logs by name and roles keywords"}
                outline={false}
            />
            {filterParam && (
                <button
                    onClick={() => removeAppliedFilter()}
                    className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
                >
                    {filterParam}
                    <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label
                    tabIndex={0}
                    className="capitalize border text-[14px] self-center border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] w-[91px] flex items-center gap-1 font-[300] px-[14px] py-[10px]">
                    <LuListFilter
                        className="w-5 " />
                    Filter
                </label>
                <ul tabIndex={0}
                    className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 text-[#0E2354] font-[400]">
                    {statusFilters.map((status, key) => (
                        <li key={key}>
                            <a onClick={() => showFiltersAndApply(status)} style={{ textTransform: "capitalize" }}>{capitalizeWords(status)}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
        </div>
    );
};
function Logs() {
    const [logs, setLogs] = useState([]);
    const [originalLogs, setOriginalLogs] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [changesInLogs, setChangesInLogs] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

    const removeFilter = () => {
        setLogs([...originalLogs]);
    };
    const applyFilter = (outcome) => {
        console.log(outcome)
        const filteredRoles = originalLogs?.filter(
            (log) => log.outcome === outcome
        );
        setLogs(filteredRoles);
    };
    const applySearch = (value) => {
        const filteredRoles = originalLogs?.filter((log) =>
            log?.action_performed.toLowerCase().includes(value.toLowerCase())
        );
        setLogs(filteredRoles);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * logsPerPage;
    const indexOfFirstUser = indexOfLastUser - logsPerPage;
    const currentLogs = Array.isArray(logs) ? logs?.slice(indexOfFirstUser, indexOfLastUser) : [];
    const totalPages = Math.ceil(logs?.length / logsPerPage);

    useEffect(() => {
        async function fetchRoleData() {
            const response = await userLogs();
            setLogs(response);
            setOriginalLogs(response ?? []); // Store the original unfiltered data
        }
        fetchRoleData();
    }, [changesInLogs]);
    return (
        <div className="relative min-h-full">
            <TitleCard title={"Logs"} topMargin="mt-2"
                TopSideButtons={
                    <TopSideButtons
                        applySearch={applySearch}
                        applyFilter={applyFilter}
                        removeFilter={removeFilter}
                        openAddForm={() => setShowAddForm(true)}
                    />
                }>
                <div className="min-h-[28.2rem] flex flex-col justify-between">
                    <div className="overflow-x-auto w-full border dark:border-stone-600 rounded-2xl">
                        <table className="table text-center min-w-full dark:text-[white]">
                            <thead className="" style={{ borderRadius: "" }}>
                                <tr className="!capitalize" style={{ textTransform: "capitalize" }}>
                                    <th className="font-medium text-[12px] text-left font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[20px] py-[13px] !capitalize"
                                        style={{ position: "static", width: "" }}>Action Perfomed</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">Action Type</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">Performed By</th>
                                    {/* <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">Performed Over</th> */}
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">Target</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize text-center">IP Address</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">Outcome</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">Date Time</th>
                                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {
                                    Array.isArray(logs) && currentLogs.length > 0 ? currentLogs?.map((log, index) => {
                                        return (
                                            <tr key={index} className="font-light " style={{ height: "65px" }}>
                                                <td className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] p-[26px] pl-5 flex`}>
                                                    {/* <img src={user.image ? user.image : userIcon} alt={user.name} className="rounded-[50%] w-[41px] h-[41px] mr-2" /> */}
                                                    <div className="flex flex-col">
                                                        <p className="dark:text-[white]">{log.action_performed}</p>
                                                        {/* <p className="font-light text-[grey]">{user.email}</p> */}
                                                    </div>
                                                </td>


                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                    <span className="">
                                                        {log?.actionType || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                    <span className="">
                                                        {log?.user.user.name || "N/A"}
                                                    </span>
                                                </td>
                                                {/* <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                    <span className="">
                                                        {TruncateText(log?.oldValue?.name, 10) ?? TruncateText(log?.newValue?.name, 10) ?? "N/A"}
                                                    </span>
                                                </td> */}
                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                    <span className="">
                                                        {log?.entity || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                    <span className="">
                                                        {(log?.ipAddress?.slice(7, this?.length)) || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]" style={{ whiteSpace: "wrap" }}>
                                                    <span className="">
                                                        <p
                                                            className={`w-[85px] 
                                                                mx-auto 
                                                                before:content-['•'] 
                                                                before:text-2xl 
                                                                flex h-7 
                                                                items-center
                                                                text-[12px] 
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
                                                            {capitalizeWords(log?.outcome) || "N/A"}
                                                        </p>
                                                    </span>
                                                </td>
                                                <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[16px] py-[10px] dark:text-[white]">
                                                    {formatTimestamp(log?.timestamp) || "N/A"}

                                                </td>
                                                <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                                                    <div className="w-fit mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLogs(log);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                                                <FiEye className="w-5 h-6  text-[#3b4152] dark:text-stone-200" strokeWidth={1} />
                                                            </span>
                                                        </button>
                                                        {/* <button
                                                            className=""
                                                            onClick={() => {
                                                                setSelectedRole(role);
                                                                setShowAddForm(true);
                                                            }}
                                                        >
                                                            <FiEdit className="w-5 h-6 text-[#3b4152] dark:text-stone-200" strokeWidth={1} />
                                                        </button>
                                                        <div className="flex items-center space-x-4 ">
                                                            <Switch
                                                                checked={role.status === "ACTIVE"}
                                                                onChange={() => {
                                                                    statusChange(role);
                                                                }}
                                                                className={`${role.status === "ACTIVE"
                                                                    ? "bg-[#1DC9A0]"
                                                                    : "bg-gray-300"
                                                                    } relative inline-flex h-2 w-8 items-center rounded-full`}
                                                            >
                                                                <span
                                                                    className={`${role.status === "ACTIVE"
                                                                        ? "translate-x-4"
                                                                        : "translate-x-0"
                                                                        } inline-block h-5 w-5 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                                                />
                                                            </Switch>
                                                        </div> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    ) : (
                                        <tr className="text-[14px]">
                                            <td colSpan={8}>No Data Available</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <Paginations data={logs} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            </TitleCard>


            {/* Add Role Modal */}
            {/* <AddRoleModal
        show={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedRole(null);
        }}
        updateRoles={setChangesInRole}
        role={selectedRole}
      /> */}
            {/* <AddRoleModal show={showAddForm} onClose={() => setShowAddForm(false)} updateRole={setChangesInRole} /> */}

            {/* Role Details Modal */}
            <ShowLogs
                log={selectedLogs}
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />
            <ToastContainer />
        </div>
    );
}
export default Logs;
