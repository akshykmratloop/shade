import { useEffect, useState } from "react";
import { format } from 'date-fns';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import SearchBar from "../../components/Input/SearchBar";
import { fetchRoles, activateRole, deactivateRole } from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import AddRoleModal from "./AddRole";
import RoleDetailsModal from "./ShowRole";
import { toast, ToastContainer } from "react-toastify";
import updateToasify from "../../app/toastify";
import { Switch } from '@headlessui/react';
import { MdInfo } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import dummyUser from "../../assets/Dummy_User.json"
import { FaRegEdit } from "react-icons/fa";


const TopSideButtons = ({ removeFilter, applyFilter, applySearch, openAddForm }) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = ["ACTIVE", "INACTIVE"];

    // const showFiltersAndApply = (status) => {
    //     applyFilter(status);
    //     setFilterParam(status);
    // };

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
        <div className="inline-block float-right">
            {/* <SearchBar searchText={searchText} styleClass="mr-4 border border-1 border-stone-300" setSearchText={setSearchText} /> */}
            {filterParam && (
                <button
                    onClick={() => removeAppliedFilter()}
                    className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
                >
                    {filterParam}
                    <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
            {/* <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    <FunnelIcon className="w-5 mr-2" />
                    Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {statusFilters.map((status, key) => (
                        <li key={key}>
                            <a onClick={() => showFiltersAndApply(status)}>{status}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div> */}
            <button className="btn btn-sm btn-success ml-4 bg-[#25439B] text-[white] font-semibold py-4 pb-[1.8rem] px-4" onClick={openAddForm}>
                <PlusIcon className="w-4 mr-2 border border-1 rounded-full border-dotted " />
                <span>
                    New User
                </span>
            </button>
        </div>
    );
};

function Users() {
    const [roles, setRoles] = useState([]);
    const [originalRoles, setOriginalRoles] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [changesInUser, setChangesInUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    // const [enabled, setEnabled] = useState(false);

    const removeFilter = () => {
        setRoles([...originalRoles]);
    };

    const applyFilter = (status) => {
        const filteredRoles = originalRoles.filter(role => role.status === status);
        setRoles(filteredRoles);
    };

    const applySearch = (value) => {
        const filteredRoles = originalRoles.filter(role =>
            role.name.toLowerCase().includes(value.toLowerCase())
        );
        setRoles(filteredRoles);
    };

    const statusChange = async (role) => {
        const loadingToastId = toast.loading("loging in", { autoClose: 2000 }); // starting the loading in toaster

        let response;
        if (role.status === "ACTIVE") response = await deactivateRole(role)
        else response = await activateRole(role)

        if (response.ok) {
            updateToasify(loadingToastId, `Request successful. ${response.message}`, "success", 1000) // updating the toaster
            setChangesInUser(prev => !prev)
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000) // updating the toaster
        }
    }

    useEffect(() => {
        async function fetchRoleData() {
            // const response = await fetchRoles();
            // setRoles(response.roles);
            setOriginalRoles(dummyUser); // Store the original unfiltered data
        }
        fetchRoleData();
    }, [changesInUser]);


    return (
        <>
            <TitleCard title="User" topMargin="mt-2"
                TopSideButtons={
                    <TopSideButtons
                        // applySearch={applySearch} 
                        applyFilter={applyFilter}
                        removeFilter={removeFilter}
                        openAddForm={() => setShowAddForm(true)} />}>
                <div className="overflow-x-auto w-full">
                    <table className="table min-w-full ">
                        <thead className="border-b border-[#EAECF0]">
                            <tr className="capitalize" style={{textTransform:"capitalize"}}>
                                <th className="font-medium text-[12px] font-poppins leading-normal bg-[#FAFBFB]  text-[#42526D] px-[24px] py-[13px]"
                                style={{position:"static"}}>Name</th>
                                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px]">Role</th>
                                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px]">Page Assign</th>
                                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px] text-center">Status</th>
                                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px]">Task Assigned</th>
                                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(roles) && dummyUser?.map((user, index) => {
                                return (
                                    <tr key={index} className="font-light ">
                                        <td className="font-poppins font-normal text-[14px] leading-normal text-[#101828] p-[26px] flex ">
                                            <img src={user.image} alt={user.name} className="rounded-[50%] w-[50px] h-[50px] mr-3" />
                                            <div className="flex flex-col">
                                                <p>{user.name}</p>
                                                <p className="font-light text-[grey]">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] p-[26px]">
                                            {user.roles.length > 1 ? "multiple" : user.roles[0].name}
                                        </td>

                                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] p-[26px]"> </td>
                                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] p-[26px]">
                                            <p
                                                className={`before:content-['•'] before:text-2xl flex items-center capitalize justify-center gap-1 px-2 ${user.status === 'ACTIVE' ? "text-green-600 bg-green-100 before:text-green-600" : "text-red-600 bg-red-100 before:text-red-600"} text-center rounded-2xl`}
                                            style={{textTransform:"capitalize"}}
                                            >{user.status[0].toUpperCase() + user.status.slice(1).toLowerCase()}</p>
                                        </td>
                                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] p-[26px]" style={{whiteSpace:"wrap"}}> asdfwerweq eqt eqfsadf qew</td>
                                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] p-[26px]">
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    {/* <MdInfo
                                                                  size={28}
                                                                  className="text-blue-500 dark:text-white"
                                                                /> */}
                                                    <span className="flex items-center gap-1 border rounded-md p-[5px]">
                                                        <FiEye />
                                                        View
                                                    </span>
                                                </button>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowAddForm(true);
                                                    }}
                                                >
                                                    {/* <PencilIcon className="w-4" /> */}
                                                    <FaRegEdit />
                                                </button>
                                                <div className="flex items-center space-x-4">
                                                    <Switch
                                                        checked={user.status === "ACTIVE"}
                                                        onChange={() => {
                                                            statusChange(user);
                                                        }}
                                                        className={`${user.status === "ACTIVE"
                                                            ? "bg-blue-600"
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
                                                    {/* <span>{role.status === 'ACTIVE' ? 'Enabled' : 'Disabled'}</span> */}
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">


                                        </td> */}
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            </TitleCard>


            {/* Add Role Modal */}
            <AddRoleModal
                show={showAddForm}
                onClose={() => {
                    setShowAddForm(false);
                    setSelectedUser(null);
                }}
                updateUser={setChangesInUser}
                role={selectedUser}
            />
            {/* <AddRoleModal show={showAddForm} onClose={() => setShowAddForm(false)} updateRole={setChangesInRole} /> */}

            {/* Role Details Modal */}
            <RoleDetailsModal user={selectedUser} show={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
            <ToastContainer />
        </>
    );
}

export default Users;