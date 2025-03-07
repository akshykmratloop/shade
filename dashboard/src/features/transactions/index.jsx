import { useEffect, useState } from "react";
import { format } from 'date-fns';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
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
            <SearchBar searchText={searchText} styleClass="mr-4 border border-1 border-stone-300" setSearchText={setSearchText} />
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
            <button className="btn btn-sm btn-success ml-4" onClick={openAddForm}>
                <PlusIcon className="w-4 mr-2" />
                Add Role
            </button>
        </div>
    );
};

function Roles() {
    const [roles, setRoles] = useState([]);
    const [originalRoles, setOriginalRoles] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [changesInRole, setChangesInRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [enabled, setEnabled] = useState(false);

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

        console.log(response)
        if (response.ok) {
            updateToasify(loadingToastId, `Request successful. ${response.message}`, "success", 1000) // updating the toaster
            setChangesInRole(prev => !prev)
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000) // updating the toaster
        }
    }


    useEffect(() => {
        async function fetchRoleData() {
            const response = await fetchRoles();
            setRoles(response.roles);
            setOriginalRoles(response.roles); // Store the original unfiltered data
        }
        fetchRoleData();
    }, [changesInRole]);


    return (
        <>
            <TitleCard title="Recent Roles" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter} openAddForm={() => setShowAddForm(true)} />}>
                <div className="overflow-x-auto">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th style={{ position: "static" }}>Name</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(roles) && roles?.map((role, index) => (
                                <tr key={index} >
                                    <td>{role.name}</td>
                                    <td>
                                        <p className={`${role.status === 'ACTIVE' ? "text-green-600" : "text-red-600"}`}>{role.status}</p>
                                    </td>
                                    <td>{format(new Date(role.created_at), 'dd/MM/yyyy')}</td>
                                    <td>{format(new Date(role.updated_at), 'dd/MM/yyyy')}</td>
                                    <td className="flex justify-center space-x-2">
                                        <button onClick={() => {
                                        setSelectedRole(role);
                                        setShowDetailsModal(true);
                                    }}>
                                            <MdInfo size={28} className="text-blue-500 dark:text-white" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setShowAddForm(true);
                                            }}
                                        >
                                            <PencilIcon className="w-4" />
                                        </button>
                                        <div className="flex items-center space-x-4">
                                            <Switch
                                                checked={role.status === 'ACTIVE'}
                                                onChange={() => { statusChange(role) }}
                                                className={`${role.status === 'ACTIVE' ? 'bg-blue-600' : 'bg-gray-300'
                                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                            >
                                                <span
                                                    className={`${role.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                                />
                                            </Switch>
                                            {/* <span>{role.status === 'ACTIVE' ? 'Enabled' : 'Disabled'}</span> */}
                                        </div>
                                    </td>
                                    <td>


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>


            {/* Add Role Modal */}
            <AddRoleModal
                show={showAddForm}
                onClose={() => {
                    setShowAddForm(false);
                    setSelectedRole(null);
                }}
                updateRoles={setChangesInRole}
                role={selectedRole}
            />
            {/* <AddRoleModal show={showAddForm} onClose={() => setShowAddForm(false)} updateRole={setChangesInRole} /> */}

            {/* Role Details Modal */}
            <RoleDetailsModal role={selectedRole} show={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
            <ToastContainer />
        </>
    );
}

export default Roles;
