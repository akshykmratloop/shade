// libraries import
import { useEffect, useRef, useState } from "react";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { toast, ToastContainer } from "react-toastify";
// self modules
import { fetchRoles, activateRole, deactivateRole } from "../../app/fetch";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import updateToasify from "../../app/toastify";
import Dummyuser from "../../assets/Dummy_User.json";
// icons
import { Switch } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FiEye } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter } from "react-icons/lu";
import { LuImport } from "react-icons/lu";
import capitalizeWords from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import formatTimestamp from "../../app/TimeFormat";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShowDifference from "./Showdifference";
import ShowVerifierTooltip from "./ShowVerifierTooltip";
import { openRightDrawer } from "../../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import { PiInfoThin } from "react-icons/pi";
import { VscInfo } from "react-icons/vsc";

// import userIcon from "../../assets/user.png"

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
          className="capitalize border text-[14px] self-center border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] w-[91px] flex items-center gap-1 font-[300] px-[14px] py-[10px]"
        >
          <LuListFilter className="w-5 " />
          Filter
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 text-[#0E2354] font-[400]"
        >
          {statusFilters?.map((status, key) => (
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
            <a
              className="dark:text-gray-300"
              onClick={() => removeAppliedFilter()}
            >
              Remove Filter
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

function Requests() {
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [changesInRequest, setChangesInRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null);
  const requestsPerPage = 20;
  const userRole = useSelector((state) => state.user.currentRole);
  const userObj = useSelector(state => state.user)
  const { isManager, isEditor, isPublisher, isVerifier } = userObj;
  // const userPermissionsSet = new Set(["EDIT", "VERIFY", "PUBLISH"]); // SET FOR EACH USER LOGIC
  // const { isOpen, bodyType, extraObject, header } = useSelector(
  //   (state) => state.rightDrawer
  // );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // REMOVE FILTER
  const removeFilter = () => {
    setRequests([...originalRequests]);
  };
  // APPLY FILTER
  const applyFilter = (status) => {
    const filteredRequests = originalRequests?.filter(
      (request) => request.status === status
    );
    setRequests(filteredRequests);
  };
  // APPLY SEARCH
  const applySearch = (value) => {
    const filteredRequests = originalRequests?.filter((request) =>
      request?.name.toLowerCase().includes(value.toLowerCase())
    );
    setCurrentPage(1);
    setRequests(filteredRequests);
  };

  // Toggle verifier tooltip visibility
  const toggleTooltip = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Open Right Drawer
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Details",
        bodyType: RIGHT_DRAWER_TYPES.RESOURCE_DETAILS,
        extraObject: { id: userRole.id },
      })
    );
  };

  // Pagination logic
  const indexOfLastUser = currentPage * requestsPerPage;
  const indexOfFirstUser = indexOfLastUser - requestsPerPage;
  const currentRequests = requests?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(requests?.length / requestsPerPage);

  const canSeeEditor = (isVerifier || isPublisher || isManager)
  const canSeeVerifier = (isPublisher || isManager)
  const canSeePublisher = (isVerifier || isManager)
  const canSeeNone = !isEditor && !isManager && !isVerifier && !isPublisher

  useEffect(() => {
    async function fetchRequestsData() {
      // const response = await fetchRoles();
      setRequests(Dummyuser);
      // setOriginalRequests(response?.roles?.roles ?? []); // Store the original unfiltered data
    }
    fetchRequestsData();
  }, [changesInRequest]);

  useEffect(() => {
    if (canSeeNone) {
      console.log(isPublisher, isVerifier)
      navigate("/app/dashboard")
    }
  }, [])

  return (
    <div className="relative min-h-full">
      <div className="absolute top-3 right-2 flex">

      </div>
      <TitleCard
        title={"Requests"}
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            openAddForm={() => setShowAddForm(true)}
          />
        }
      >
        <div className="min-h-[28.2rem] flex flex-col justify-between">
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
                    Resource
                  </th>
                  {/* <th className="text-[#42526D] w-[164px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">Sub Permission</th> */}
                  {
                    canSeeEditor &&
                    <th className="text-[#42526D] w-[154px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize text-center">
                      Editor
                    </th>}

                  {
                    canSeeVerifier &&
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Verifier
                    </th>
                  }
                  {
                    canSeePublisher &&
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Publisher
                    </th>
                  }
                  <th className="text-[#42526D] w-[211px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    Status
                  </th>

                  <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                    Date Time
                  </th>
                  <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {Array.isArray(requests) && currentRequests.length > 0 ? (
                  currentRequests?.map((request, index) => {
                    return (
                      <tr
                        key={index}
                        className="font-light "
                        style={{ height: "65px" }}
                      >
                        <td
                          className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] p-[26px] pl-5 flex`}
                        >
                          {/* <img src={user.image ? user.image : userIcon} alt={user.name} className="rounded-[50%] w-[41px] h-[41px] mr-2" /> */}
                          <div className="flex flex-col">
                            <p className="dark:text-[white]">
                              {request?.resource}
                            </p>
                            {/* <p className="font-light text-[grey]">{user.email}</p> */}
                          </div>
                        </td>
                        {
                          canSeeEditor &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "wrap" }}
                          >
                            <span className="">{request?.editor || "1"}</span>
                          </td>
                        }
                        {
                          canSeeVerifier &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "wrap" }}
                          >
                            <span className="">
                              {request?.verifier ? (
                                // <button
                                //   onClick={() => {
                                //     setSelectedRequest(request);
                                //   }}
                                // >
                                //   <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                //     <FiEye
                                //       className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                //       strokeWidth={1}
                                //     />
                                //   </span>
                                // </button>
                                <ShowVerifierTooltip
                                  content={
                                    <div>
                                      {/* <div className="text-left ">Verifier</div> */}
                                      <table className="p-3">
                                        <thead className="bg-[#FAFBFB] dark:bg-slate-700  text-[#FFFFFF] font-poppins font-medium text-[10px] leading-normal px-[24px] py-[13px] text-left !rounded-none !capitalize">
                                          <tr className="bg-[#25439B]  dark:bg-slate-700 !rounded-none">
                                            <th className="bg-[#25439B]  dark:bg-slate-700 w-[100px] px-5 py-1 !rounded-none">
                                              Stage
                                            </th>
                                            <th className="bg-[#25439B]  dark:bg-slate-700 w-[100px] px-5 py-1 !rounded-none">
                                              Name
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-left dark:border-gray-800  border rounded">
                                          {request?.verifier.map((v) => (
                                            <tr
                                              key={v.stage}
                                              className=" dark:border-stone-700 !rounded-none"
                                            >
                                              <td className="w-[100px] px-5 py-1 !rounded-none">
                                                {v.stage}
                                              </td>
                                              <td className="w-[100px] px-5 py-1 !rounded-none">
                                                {v.name}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>

                                      {/* <div className="flex justify-around  font-semibold mb-1">
                                        <p>Stage</p>
                                        <p>Name</p>
                                        </div>
                                        <ul className="list-disc">
                                        {request?.verifier.map((v) => (
                                          <div key={v.stage}>
                                          <div className="flex justify-around ">
                                          <div className="w-full font-semibold">
                                          {v.stage}
                                          </div>
                                          <div className="w-full">
                                          {v.name}
                                          </div>
                                          </div>
                                          </div>
                                          ))}
                                          </ul> */}
                                    </div>
                                  }
                                  isVisible={activeIndex === request?.id}
                                  onToggle={() => toggleTooltip(request?.id)}
                                >
                                  {/* <FiEye
                                    className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                    strokeWidth={1}
                                    /> */}
                                  <span className="underline w-5 h-6 text-[#3b4152] cursor-pointer dark:text-stone-200">
                                    View
                                  </span>
                                </ShowVerifierTooltip>
                              ) : (
                                ""
                              )}
                            </span>
                          </td>
                        }
                        {
                          canSeePublisher &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "wrap" }}
                          >
                            <span className="">
                              {request?.publisher || "1"}
                            </span>
                          </td>
                        }
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <p
                            className={`w-[85px] mx-auto before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] 
                              ${request.status === "Green"
                                ? "text-green-600 bg-lime-200 before:text-green-600 px-1"
                                : request.status === "Blue"
                                  ? "text-blue-600 bg-sky-200 before:text-blue-600 "
                                  : "text-red-600 bg-pink-200 before:text-red-600 "
                              } 
                                rounded-2xl`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {/* <span className="">{request?.status}</span> */}
                          </p>
                        </td>
                        <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          {formatTimestamp(request?.datetime)}
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-[145px] mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                // setShowDetailsModal(true);
                                openNotification();
                              }}
                            >
                              <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                <PiInfoThin
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={2}
                                />
                              </span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailsModal(true);
                                // openNotification();
                              }}
                            >
                              <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                <FiEye
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={1}
                                />
                              </span>
                            </button>

                            {/* <button
                              className=""
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowAddForm(true);
                              }}
                            >
                              <FiEdit
                                className="w-5 h-6 text-[#3b4152] dark:text-stone-200"
                                strokeWidth={1}
                              />
                            </button> */}
                            {/* <div className="flex items-center space-x-4 ">
                              <Switch
                                checked={request?.status === "ACTIVE"}
                                onChange={() => {
                                  statusChange(request);
                                }}
                                className={`${request?.status === "ACTIVE"
                                  ? "bg-[#1DC9A0]"
                                  : "bg-gray-300"
                                  } relative inline-flex h-2 w-8 items-center rounded-full`}
                              >
                                <span
                                  className={`${request?.status === "ACTIVE"
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                    } inline-block h-5 w-5 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                />
                              </Switch>
                            </div> */}
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
            data={requests}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </TitleCard>
      {showDetailsModal && (
        <ShowDifference
          role={selectedRequest}
          show={showDetailsModal}
          updateRoles={setChangesInRequest}
          onClose={() => {
            setSelectedRequest(false);
            setShowDetailsModal(false);
          }}
        />
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}
export default Requests;
