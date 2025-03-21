// libraries import
import { useEffect, useState } from "react";
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { toast, ToastContainer } from "react-toastify";
// self modules
import SearchBar from "../../components/Input/SearchBar";
import { activateRole, deactivateRole } from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import AddUserModal from "./AddUser";
import RoleDetailsModal from "./ShowRole";
import updateToasify from "../../app/toastify";
import dummyUser from "../../assets/Dummy_User.json"
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import { getAllusers } from "../../app/fetch";
// icons
import { Switch } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { FiEye, FiEdit } from "react-icons/fi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter, LuImport } from "react-icons/lu";
import userIcon from "../../assets/user.png"
import Paginations from "../Component/Paginations";


const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => { // search and filter bar component
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = ["ACTIVE", "INACTIVE"];

    const showFiltersAndApply = (status) => { // apply filters 
        applyFilter(status);
        setFilterParam(status);
    };

    const removeAppliedFilter = () => { // the removing the filter and clearing the search
        removeFilter();
        setFilterParam("");
        setSearchText("");
    };

    useEffect(() => { // reflection on ui as per the state changes
        if (searchText === "") {
            removeAppliedFilter();
        } else {
            console.log(searchText)
            applySearch(searchText);
        }
    }, [searchText]);

    return (
        <div className="inline-block float-right w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1"
            style={{ textTransform: "capitalize" }}>
            <SearchBar
                searchText={searchText}
                styleClass="w-700px border-none w-full flex-1"
                setSearchText={setSearchText}
                placeholderText={"Search Users by name, role, ID or any related keywords"}
                outline={false}
            />
            {filterParam && (
                <button
                    onClick={removeAppliedFilter}
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

function Users() {
    const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [changesInUser, setChangesInUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;

    const removeFilter = () => {
        setUsers([...originalUsers]);
    };

    const applyFilter = (status) => {
        const filteredRoles = originalUsers.filter(user => user.status === status);
        setUsers(filteredRoles);
    };

    const applySearch = (value) => { // actual search application which is being sent to the topsidebar component
        const filteredRoles = originalUsers.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        console.log(filteredRoles)
        setUsers(filteredRoles);
    };

    const statusChange = async (role) => {
        const loadingToastId = toast.loading("Processing...", { autoClose: 2000 });
        let response = role.status === "ACTIVE" ? await deactivateRole(role) : await activateRole(role);
        if (response.ok) {
            updateToasify(loadingToastId, `Request successful. ${response.message}`, "success", 1000);
            setChangesInUser(prev => !prev);
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000);
            setTimeout(() => {
                toast.dismiss() // to deactivate to running taost
            }, 2000)
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users?.length / usersPerPage);

    useEffect(() => {

        async function fetchUsersData() {
            const response = await getAllusers();
            setUsers(response?.users?.allUsers ?? []) // save the fethched users here to apply filters
            setOriginalUsers(response?.users?.allUsers ?? []); // Store the original unfiltered data
        }
        fetchUsersData();
    }, [changesInUser]);


    return (
        <div className="relative min-h-full">
            <div className="absolute top-3 right-2 flex">
                <button className="border dark:border-neutral-400 flex justify-center items-center gap-2 px-3 rounded-lg text-[14px] text-[#0E2354] dark:text-stone-200">
                    <LuImport />
                    <span>Import</span>
                </button>
                <button className=" z-20 btn btn-sm hover:bg-[#25439B] border-none !capitalize ml-4 bg-[#25439B] text-[white] font-semibold py-[.9rem] pb-[1.8rem] px-4" onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="w-4 mr-2 border border-1 rounded-full border-dotted " />
                    <span>
                        Create User
                    </span>
                </button>
            </div>
            <TitleCard title={"Users"} topMargin="mt-2"
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
                        <table className="table text-left min-w-full dark:text-[white]">
                            <thead className="" style={{ borderRadius: "" }}>
                                <tr className="!capitalize" style={{ textTransform: "capitalize" }}>
                                    <th className="font-medium text-[12px] font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[24px] py-[13px] !capitalize"
                                        style={{ position: "static", width: "363px", minWidth: "315px" }}>Name</th>
                                    <th className="text-[#42526D] w-[140px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize flex items-center gap-1">Role <RxQuestionMarkCircled className="w-4 h-4 text-[gray] translate-y-[-1px]" /></th>
                                    <th className="text-[#42526D] w-[159px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">Page Assign</th>
                                    <th className="text-[#42526D] w-[333px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">Task Assigned</th>
                                    <th className="text-[#42526D] w-[172px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">Status</th>
                                    <th className="text-[#42526D] w-[240px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {Array.isArray(users) && currentUsers.length > 0 ? currentUsers.map((user, index) => {
                                    return (
                                        <tr key={index} className="font-light">
                                            <td className={`font-poppins truncate font-normal text-[14px] leading-normal text-[#101828] p-[26px] ${index % 2 === 0 ? "py-[11px]" : "py-[10px]"} pl-5 flex `}>
                                                <img src={user.image ? user.image : userIcon} alt={user.name} className="rounded-[50%] w-[41px] h-[41px] mr-2" />
                                                <div className="flex truncate flex-col">
                                                    <p className="dark:text-[white]">{user.name}</p>
                                                    <p className="font-light text-[grey]">{TruncateText(user.email, 20)}</p>
                                                </div>
                                            </td>
                                            <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                {user.roles?.length > 1 ? "multiple" : user?.roles?.[0].name}
                                            </td>

                                            <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"> </td>
                                            <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]" style={{ whiteSpace: "wrap" }}> {TruncateText("asdfwerweq eqt eqfsadf qew", 20)}</td>
                                            <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                                                <p
                                                    className={`w-[85px] mx-auto before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] ${user.status === 'ACTIVE' ? "text-green-600 bg-green-100 before:text-green-600 px-1" : "text-red-600 bg-red-100 before:text-red-600 "} rounded-2xl`}
                                                    style={{ textTransform: "capitalize", }}
                                                >
                                                    {capitalizeWords(user.status)}
                                                </p>
                                            </td>
                                            <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                                                <div className="max-w-[145px] mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDetailsModal(true);
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-1 rounded-md text-[#3b4152] dark:text-stone-200">
                                                            <FiEye className="w-5 h-6 " strokeWidth={1} />
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="text-[#3b4152] dark:text-stone-200"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowAddForm(true);
                                                        }}
                                                    >
                                                        <FiEdit className="w-5 h-6 " strokeWidth={1} />
                                                    </button>
                                                    <div className="flex items-center space-x-4 ">
                                                        <Switch
                                                            checked={user.status === "ACTIVE"}
                                                            onChange={() => {
                                                                statusChange(user);
                                                            }}
                                                            className={`${user.status === "ACTIVE"
                                                                ? "bg-[#1DC9A0]"
                                                                : "bg-gray-300"
                                                                } relative inline-flex h-2 w-8 items-center rounded-full`}
                                                        >
                                                            <span
                                                                className={`${user.status === "ACTIVE"
                                                                    ? "translate-x-4"
                                                                    : "translate-x-0"
                                                                    } inline-block h-5 w-5 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                                            />
                                                        </Switch>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                ) : (
                                    <tr className="text-[14px] text-center">
                                        <td colSpan={6}>No Data Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <Paginations data={users} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                </div>
            </TitleCard>


            {/* Add Role Modal */}
            <AddUserModal
                show={showAddForm}
                onClose={() => {
                    setShowAddForm(false);
                    setSelectedUser(null);
                }}
                updateUsers={setChangesInUser}
                user={selectedUser}
            />
            {/* <AddRoleModal show={showAddForm} onClose={() => setShowAddForm(false)} updateRole={setChangesInRole} /> */}

            {/* Role Details Modal */}
            <RoleDetailsModal
                user={selectedUser}
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />
            <ToastContainer />
        </div>
    );
}

export default Users;