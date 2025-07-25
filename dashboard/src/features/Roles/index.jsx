// libraries import
import { useEffect, useState } from "react";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { toast, ToastContainer } from "react-toastify";

// icons
import { Switch } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FiEye } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { LuListFilter } from "react-icons/lu";
// self modules
import { fetchRoles, activateRole, deactivateRole } from "../../app/fetch";
import AddRoleModal from "./AddRole";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import RoleDetailsModal from "./ShowRole";
import updateToasify from "../../app/toastify";
import capitalizeWords from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import ToastPlacer, { runToast } from "../Component/ToastPlacer";

const TopSideButtons = ({
  removeFilter,
  applyFilter,
  applySearch,
  // openAddForm,
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
    // setSearchText("");
    applyFilter("");
  };
  useEffect(() => {
    applySearch(searchText);
  }, [searchText]);
  return (
    <div className="inline-block float-right w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1">
      <SearchBar
        searchText={searchText}
        styleClass="w-700px border-none w-full flex-1"
        setSearchText={setSearchText}
        placeholderText={
          "Search Roles by name, role, ID or any related keywords"
        }
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
          className={`capitalize border text-[14px] 
            self-center border-stone-300 dark:border-neutral-500 
            rounded-lg h-[40px] w-[91px] flex items-center 
            gap-1 font-[300] px-[14px] py-[10px]`}
        >
          <LuListFilter className="w-5 " />
          Filter
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 text-[#0E2354] font-[400]"
        >
          {statusFilters.map((status, key) => (
            <li key={key}>
              <a
                className="dark:text-gray-300"
                onClick={() => showFiltersAndApply(status)}
                style={{ textTransform: "capitalize" }}
              >
                {capitalizeWords(status)}
              </a>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a className="dark:text-gray-300" onClick={() => removeAppliedFilter()}>Remove Filter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
// ---------------------------------------------------------------------------------------------
function Roles() {
  const [roles, setRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [changesInRole, setChangesInRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [filter, setFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1);
  // const rolesPerPage = 20;

  const removeFilter = () => {
    setRoles([...originalRoles]);
  };

  const applyFilter = (status) => {
    setFilter(status)
    // const filteredRoles = originalRoles?.filter(
    //   (role) => role?.status === status
    // );
    // setRoles(filteredRoles);
  };

  function handleSearchInput(value) {
    if (value.length >= 3 || value.trim() === "") {
      setSearchValue(value);
    }
  }


  const statusChange = async (role) => {
    // let loadingToastId = toast.loading("Proceeding..."); // starting the loading in toaster
    runToast("LOAD", "Proceeding...")
    try {

      let response;
      if (role?.status === "ACTIVE") response = await deactivateRole(role);
      else response = await activateRole(role);
      if (response?.ok) {
        // updateToasify(
        //   loadingToastId,
        //   `Request successful. ${response.message}`,
        //   "success",
        //   2000
        // ); // updating the toaster
        runToast("SUCCESS", `Request successful. ${response.message}`)
        // setTimeout(() => {
        //   loadingToastId = undefined
        // }, 2000)
        setChangesInRole((prev) => !prev);
      } else {
        // updateToasify(
        //   loadingToastId,
        //   `Request failed. ${response.message}`,
        //   "error",
        //   2000
        // ); // updating the toaster
        runToast("ERROR", `Request failed. ${response.message}`)
        // setTimeout(() => {
        //   loadingToastId = undefined
        //   toast.dismiss(loadingToastId) // to deactivate to running taost
        // }, 2000)
      }
    } catch (err) {
      console.log(err)
    }
    // toast.dismiss(loadingToastId); // to deactivate to running taost
  };


  // Pagination logic
  const currentRoles = roles
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 700); // debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // useEffect(() => {
  //   // applySearch(debouncedValue);
  // }, [debouncedValue]);

  useEffect(() => {
    async function fetchRoleData() {
      let query = { page: currentPage }

      if (debouncedValue) query.search = debouncedValue
      if (filter) query.status = filter
      const response = await fetchRoles(query);
      setRoles(response?.roles?.roles ?? []);
      setOriginalRoles(response?.roles?.roles ?? []); // Store the original unfiltered data
      setTotalPages(response?.roles?.pagination?.totalPages)
    }
    fetchRoleData();
  }, [changesInRole, filter, debouncedValue, currentPage]);
  return (
    <div className="relative min-h-full">
      <div className="absolute top-3 right-2 flex">
        {/* button for import */}
        {/* <button className="border dark:border-neutral-400 flex justify-center items-center gap-2 px-3 rounded-lg text-[14px] text-[#0E2354] dark:text-stone-200">
          <LuImport />
          <span>Import</span>
        </button> */}
        <button
          className="z-20 btn btn-sm hover:bg-[#25439B] border-none !capitalize ml-4 bg-[#25439B] text-[white] font-semibold py-[.9rem] pb-[1.8rem] px-4"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="w-4 mr-2 border border-1 rounded-full border-dotted " />
          <span>Create Role</span>
        </button>
      </div>
      <TitleCard
        title={"Roles"}
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={handleSearchInput}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            openAddForm={() => setShowAddForm(true)}
          />
        }
      >
        <div className="min-h-[30rem] flex flex-col justify-between">
          <div className="overflow-x-auto w-full border dark:border-stone-600 rounded-2xl">
            <table className="table text-center min-w-full dark:text-[white]">
              <thead className="" style={{ borderRadius: "" }}>
                <tr
                  className="!capitalize"
                  style={{ textTransform: "capitalize" }}
                >
                  <th
                    className="font-medium text-[12px] text-left font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[24px] py-[13px] !capitalize"
                    style={{ position: "static", width: "363px" }}
                  >
                    {" "}
                    Role Name
                  </th>
                  <th className="text-[#42526D] w-[133px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    Permission
                  </th>
                  <th className="text-[#42526D] w-[211px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    No. of Users Assigned
                  </th>
                  <th className="text-[#42526D] w-[154px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize text-center">
                    Status
                  </th>
                  <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {Array.isArray(roles) && currentRoles.length > 0 ? (
                  currentRoles?.map((role, index) => {
                    return (
                      <tr
                        key={index}
                        className="font-light "
                        style={{ height: "65px" }}
                      >
                        <td
                          className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] p-[10px] pl-5 flex items-center`}
                        >
                          <div className="flex flex-col">
                            <p className="dark:text-[white]">{role?.name}</p>
                          </div>
                        </td>

                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">{role?._count?.permissions ?? "N/A"}</span>
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]" style={{ whiteSpace: "wrap" }}>
                          <span className="">
                            {role?._count?.users ?? "N/A"}
                          </span>
                        </td>
                        <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <p
                            className={`w-[85px] mx-auto before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] ${role.status === "ACTIVE"
                              ? "text-green-600 bg-green-100 before:text-green-600 px-1"
                              : "text-red-600 bg-red-100 before:text-red-600 "
                              } rounded-2xl`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {capitalizeWords(role?.status)}
                          </p>
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-[145px] mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                setSelectedRole(role);
                                setShowDetailsModal(true);
                              }}
                            >
                              <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                <FiEye
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={1}
                                />
                              </span>
                            </button>
                            <button
                              className=""
                              onClick={() => {
                                setSelectedRole(role);
                                setShowAddForm(true);
                              }}
                            >
                              <FiEdit
                                className="w-5 h-6 text-[#3b4152] dark:text-stone-200"
                                strokeWidth={1}
                              />
                            </button>
                            <div className="flex items-center space-x-4 ">
                              <Switch
                                checked={role?.status === "ACTIVE"}
                                onChange={() => {
                                  statusChange(role);
                                }}
                                className={`${role?.status === "ACTIVE"
                                  ? "bg-[#1DC9A0]"
                                  : "bg-gray-300"
                                  } relative inline-flex h-2 w-8 items-center rounded-full`}
                              >
                                <span
                                  className={`${role?.status === "ACTIVE"
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                    } inline-block h-5 w-5 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                />
                              </Switch>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-[14px]">
                    <td colSpan={6}>No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <Paginations
            data={roles}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </TitleCard>

      {/* Add Role Modal */}
      {showAddForm && (
        <AddRoleModal
          show={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setSelectedRole(null);
          }}
          updateRoles={setChangesInRole}
          role={selectedRole}
        />
      )}
      {/* Role Details Modal */}
      {showDetailsModal && (
        <RoleDetailsModal
          role={selectedRole}
          show={showDetailsModal}
          updateRoles={setChangesInRole}
          onClose={() => {
            setSelectedRole(false);
            setShowDetailsModal(false);
          }}
        />
      )}
      {/* <ToastContainer /> */}
      <ToastPlacer />
    </div>
  );
}
export default Roles;
