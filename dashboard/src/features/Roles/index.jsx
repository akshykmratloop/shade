import {useEffect, useState} from "react";
import {format} from "date-fns";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import SearchBar from "../../components/Input/SearchBar";
import {fetchRoles, activateRole, deactivateRole} from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import AddRoleModal from "./AddRole";
import RoleDetailsModal from "./ShowRole";
import {toast, ToastContainer} from "react-toastify";
import updateToasify from "../../app/toastify";
import {Switch} from "@headlessui/react";
import {MdInfo} from "react-icons/md";
import {FiEye} from "react-icons/fi";
import {FiEdit} from "react-icons/fi";

const TopSideButtons = ({
  removeFilter,
  applyFilter,
  applySearch,
  openAddForm,
}) => {
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
      {/* <SearchBar
        searchText={searchText}
        styleClass="mr-4 border border-1 border-stone-300"
        setSearchText={setSearchText}
      /> */}
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
      <button
        className="btn bg-[#25439B] p-[12px_16px] ml-4"
        onClick={openAddForm}
      >
        <div className="border border-dashed rounded-full mr-2">
          <PlusIcon className="w-4" />
        </div>
        Create Role
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
    const filteredRoles = originalRoles.filter(
      (role) => role.status === status
    );
    setRoles(filteredRoles);
  };
  const applySearch = (value) => {
    const filteredRoles = originalRoles.filter((role) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
    setRoles(filteredRoles);
  };
  const statusChange = async (role) => {
    const loadingToastId = toast.loading("loging in", {autoClose: 2000}); // starting the loading in toaster
    let response;
    if (role.status === "ACTIVE") response = await deactivateRole(role);
    else response = await activateRole(role);
    console.log(response);
    if (response.ok) {
      updateToasify(
        loadingToastId,
        `Request successful. ${response.message}`,
        "success",
        1000
      ); // updating the toaster
      setChangesInRole((prev) => !prev);
    } else {
      updateToasify(
        loadingToastId,
        `Request failed. ${response.message}`,
        "failure",
        2000
      ); // updating the toaster
    }
  };
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
      <TitleCard
        title="Roles"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            // applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            openAddForm={() => setShowAddForm(true)}
          />
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table min-w-full text-left ">
            <thead className="border-b border-[#EAECF0]">
              <tr className="">
                <th className="font-medium text-[12px] font-poppins leading-normal bg-[#FAFBFB]  text-[#42526D] px-[24px] py-[13px]">
                  Role Name
                </th>
                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px]">
                  Status
                </th>
                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
                  Permission
                </th>
                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
                  Sub permission
                </th>
                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
                  No. of Users Assigned
                </th>
                <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]"></th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(roles) &&
                roles?.map((role, index) => (
                  <tr key={index} className="font-light">
                    <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      {role.name}
                    </td>
                    <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      <p
                        className={`${
                          role.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {role.status}
                      </p>
                    </td>
                    <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      <span className="bg-[#F5F6F7] p-1 rounded-full ">
                        {role?._count?.permissions}
                      </span>
                    </td>
                    <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      <span className="bg-[#F5F6F7] p-1 rounded-full ">
                        {role?._count?.subPermissions || "3"}
                      </span>
                    </td>
                    <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      <span className="bg-[#F5F6F7] p-1  rounded-full">
                        {role?.usersAssigned || "1"}
                      </span>
                    </td>
                    <td className="flex justify-start space-x-2 font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
                      <div className="border-[1px] border-[#E6E7EC] rounded-[7px] flex gap-2 px-[12px] py-[8px]">
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowDetailsModal(true);
                          }}
                        >
                          {/* <MdInfo
                          size={28}
                          className="text-blue-500 dark:text-white"
                        /> */}
                          <span className="flex items-center gap-1 p-[5px]">
                            <FiEye />
                          </span>
                        </button>
                        <button
                          // className="btn btn-sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setShowAddForm(true);
                          }}
                        >
                          {/* <PencilIcon className="w-4" /> */}
                          <FiEdit />
                        </button>
                        <div className="flex items-center space-x-4">
                          <Switch
                            checked={role.status === "ACTIVE"}
                            onChange={() => {
                              statusChange(role);
                            }}
                            className={`${
                              role.status === "ACTIVE"
                                ? "bg-[#1DC9A0]"
                                : "bg-[#C7C7CC]"
                            } relative inline-flex h-2 w-8 items-center rounded-full`}
                          >
                            <span
                              className={`${
                                role.status === "ACTIVE"
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              } inline-block h-4 w-4 bg-white rounded-full shadow-[0px_2px_8px_0px_#0000003D] border border-gray-300 transition`}
                            />
                          </Switch>
                          {/* <span>{role.status === 'ACTIVE' ? 'Enabled' : 'Disabled'}</span> */}
                        </div>
                      </div>
                    </td>
                    {/* <td></td> */}
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
      <RoleDetailsModal
        role={selectedRole}
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
      <ToastContainer />
    </>
  );
}
export default Roles;
