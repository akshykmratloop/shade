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
import { FunnelIcon } from "@heroicons/react/24/outline";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter } from "react-icons/lu";
import { LuImport } from "react-icons/lu";




const TopSideButtons = ({ removeFilter, applyFilter, applySearch, openAddForm }) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = ["ACTIVE", "INACTIVE"];

    const showFiltersAndApply = (status) => {
        applyFilter(status);
        setFilterParam(status);
    };

    const removeAppliedFilter = () => {
        removeFilter();
        setFilterParam("");
    };

    useEffect(() => {
        applySearch(searchText);
    }, [searchText]);

    return (
        <div className="inline-block float-right w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                placeholderText="Search Employee by name, role, ID or any related keywords"
                outline={false}
                styleClass="w-700px border-none w-full flex-1"
            />
            {filterParam && (
                <button onClick={removeAppliedFilter} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                    {filterParam}
                    <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="capitalize border text-[14px] rounded-lg h-[40px] w-[91px] flex items-center gap-1 px-[14px] py-[10px]">
                    <LuListFilter className="w-5" /> Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {statusFilters.map((status, key) => (
                        <li key={key}><a onClick={() => showFiltersAndApply(status)}>{status}</a></li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={removeAppliedFilter}>Remove Filter</a></li>
                </ul>
            </div>
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
    const [searchText, setSearchText] = useState("");
    const [filterParam, setFilterParam] = useState("");

    useEffect(() => {
        async function fetchRoleData() {
            setOriginalRoles(dummyUser);
            setRoles(dummyUser);
        }
        fetchRoleData();
    }, [changesInUser]);

    const applyFilter = (status) => {
        setFilterParam(status);
        setRoles(originalRoles.filter(role => role.status === status));
    };

    const removeFilter = () => {
        setFilterParam("");
        setRoles(originalRoles);
    };

    const applySearch = (value) => {
        setSearchText(value);
        const filteredRoles = originalRoles.filter(role =>
            role.name.toLowerCase().includes(value.toLowerCase())
        );
        setRoles(filteredRoles);
    };

    return (
        <div className="relative">
            <TitleCard title={<p>Users</p>} topMargin="mt-2"
                TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter} openAddForm={() => setShowAddForm(true)} />}>
                <div className="overflow-x-auto w-full border dark:border-stone-600 rounded-2xl">
                    <table className="table text-left min-w-full dark:text-[white]">
                        <tbody>
                            {roles.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.roles.length > 1 ? "Multiple" : user.roles[0].name}</td>
                                    <td>{user.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </div>
    );
}

export default Users;
