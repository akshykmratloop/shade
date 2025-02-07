import { useEffect, useState } from "react";
import { format } from 'date-fns';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import SearchBar from "../../components/Input/SearchBar";
import { fetchRoles } from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import AddRoleModal from "./AddRole";

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
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText} />
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
            </div>
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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

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

    const handleStatusClick = (status) => {
        // Empty function for now
        console.log(`Status clicked: ${status}`);
    };

    // const handleDeleteRole = async () => {
    //     if (selectedRoleId) {
    //         await deleteRoleById(selectedRoleId); // Placeholder request function
    //         setChangesInRole(prev => !prev);
    //         setShowDeleteDialog(false);
    //     }
    // };

    useEffect(() => {
        async function fetchRoleData() {
            const response = await fetchRoles();
            setRoles(response);
            setOriginalRoles(response); // Store the original unfiltered data
        }
        fetchRoleData();
    }, [changesInRole]);

    return (
        <>
            <TitleCard title="Recent Roles" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter} openAddForm={() => setShowAddForm(true)} />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(roles) && roles?.map((role, index) => (
                                <tr key={index}>
                                    <td>{role.id}</td>
                                    <td>{role.name}</td>
                                    <td>{role.description}</td>
                                    <td>
                                        <button
                                            onClick={() => handleStatusClick(role.status)}
                                            className={`px-3 py-1 rounded text-white ${role.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        >
                                            {role.status}
                                        </button>
                                    </td>
                                    <td>{format(new Date(role.created_at), 'dd/MM/yyyy')}</td>
                                    <td>{format(new Date(role.updated_at), 'dd/MM/yyyy')}</td>
                                    <td className="flex justify-center space-x-2">
                                        <button className="btn btn-xs btn-primary">
                                            <PencilIcon className="w-4" />
                                        </button>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                                setSelectedRoleId(role.id);
                                                setShowDeleteDialog(true);
                                            }}
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>

            {/* Add Role Modal */}
            <AddRoleModal show={showAddForm} onClose={() => setShowAddForm(false)} updateRole={setChangesInRole} />

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-base-200 p-4 rounded-lg w-96">
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this role?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button className="btn btn-ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
                            <button className="btn btn-error" >Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Roles;
