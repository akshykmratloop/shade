import { useEffect, useState } from "react";
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { toast, ToastContainer } from "react-toastify";
import SearchBar from "../../components/Input/SearchBar";
import { activateRole, deactivateRole } from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import AddUserModal from "./AddUser";
import RoleDetailsModal from "./ShowRole";
import updateToasify from "../../app/toastify";
import dummyUser from "../../assets/Dummy_User.json"
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import { Switch } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { FiEye, FiEdit } from "react-icons/fi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter, LuImport } from "react-icons/lu";
import userIcon from "../../assets/user.png";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [changesInUser, setChangesInUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        async function fetchRoleData() {
            setUsers(dummyUser);
            setOriginalUsers(dummyUser);
        }
        fetchRoleData();
    }, [changesInUser]);

    const applyFilter = (status) => {
        const filteredRoles = originalUsers.filter(user => user.status === status);
        setUsers(filteredRoles);
        setCurrentPage(1);
    };

    const applySearch = (value) => {
        const filteredRoles = originalUsers.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setUsers(filteredRoles);
        setCurrentPage(1);
    };

    const statusChange = async (role) => {
        const loadingToastId = toast.loading("Processing...", { autoClose: 2000 });
        let response = role.status === "ACTIVE" ? await deactivateRole(role) : await activateRole(role);
        if (response.ok) {
            updateToasify(loadingToastId, `Request successful. ${response.message}`, "success", 1000);
            setChangesInUser(prev => !prev);
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000);
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="relative">
            <div className="absolute top-3 right-2 flex">
                <button className="border dark:border-neutral-400 flex justify-center items-center gap-2 px-3 rounded-lg text-[14px] text-[#0E2354] dark:text-stone-200">
                    <LuImport />
                    <span>Import</span>
                </button>
                <button className="btn btn-sm hover:bg-[#25439B] bg-[#25439B] text-white font-semibold ml-4 px-4" onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="w-4 mr-2 border border-1 rounded-full border-dotted" />
                    <span>Create User</span>
                </button>
            </div>
            <TitleCard title={"Users"} topMargin="mt-2">
                <div className="overflow-x-auto w-full border dark:border-stone-600 rounded-2xl">
                    <table className="table text-left min-w-full dark:text-[white]">
                        <thead>
                            <tr className="!capitalize">
                                <th className="font-medium text-[12px] px-6 py-3">Name</th>
                                <th className="text-[12px] px-6 py-3">Role</th>
                                <th className="text-[12px] px-6 py-3">Page Assign</th>
                                <th className="text-[12px] px-6 py-3">Task Assigned</th>
                                <th className="text-[12px] px-6 py-3 text-center">Status</th>
                                <th className="text-[12px] px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length > 0 ? currentUsers.map((user, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 flex items-center">
                                        <img src={user.image || userIcon} alt={user.name} className="rounded-full w-10 h-10 mr-2" />
                                        <div>
                                            <p>{user.name}</p>
                                            <p className="text-gray-500 text-sm">{TruncateText(user.email, 20)}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.roles.length > 1 ? "Multiple" : user.roles[0].name}</td>
                                    <td className="px-6 py-4"></td>
                                    <td className="px-6 py-4">{TruncateText("Sample Task", 20)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <p className={`px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'ACTIVE' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {capitalizeWords(user.status)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }}>
                                                <FiEye className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <button onClick={() => { setSelectedUser(user); setShowAddForm(true); }}>
                                                <FiEdit className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <Switch checked={user.status === "ACTIVE"} onChange={() => statusChange(user)}
                                                className={`${user.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"} relative inline-flex h-5 w-10 rounded-full transition`}>
                                                <span className={`inline-block h-5 w-5 bg-white rounded-full shadow transform ${user.status === "ACTIVE" ? "translate-x-5" : "translate-x-0"}`} />
                                            </Switch>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No Data Available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
                    >
                        Next
                    </button>
                </div>
            </TitleCard>

            <AddUserModal show={showAddForm} onClose={() => { setShowAddForm(false); setSelectedUser(null); }} updateUser={setChangesInUser} user={selectedUser} />
            <RoleDetailsModal user={selectedUser} show={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
            <ToastContainer />
        </div>
    );
};

export default Users;
