// libraries import
import { useEffect, useRef, useState } from "react";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { toast, ToastContainer } from "react-toastify";
// self modules
import { userLogs } from "../../app/fetch";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import updateToasify from "../../app/toastify";
// icons
import { Switch } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FiEye } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuListFilter } from "react-icons/lu";
import { LuImport } from "react-icons/lu";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import formatTimestamp from "../../app/TimeFormat";
import DummyData from "../../assets/Dummy_User.json"
import { useSelector } from "react-redux";
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
          className="capitalize border text-[14px] self-center border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] w-[91px] flex items-center gap-1 font-[300] px-[14px] py-[10px]"
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
                onClick={() => showFiltersAndApply(status)}
                style={{ textTransform: "capitalize" }}
              >
                {capitalizeWords(status)}
              </a>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a onClick={() => removeAppliedFilter()}>Remove Filter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
function Requests() {
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalsRequests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [changesInRequests, setChangesInRequests] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [currentTD, setCurrentTD] = useState("EDIT");
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector(state => state.user.user);
  const requestsPerPage = 5;

  const removeFilter = () => {
    setRequests([...originalRequests]);
  };
  const applyFilter = (outcome) => {
    console.log(outcome);
    const filteredRoles = originalRequests?.filter(
      (log) => log.outcome === outcome
    );
    setRequests(filteredRoles);
  };
  const applySearch = (value) => {
    const filteredRoles = originalRequests?.filter((log) =>
      log?.action_performed.toLowerCase().includes(value.toLowerCase())
    );
    setCurrentPage(1)
    setRequests(filteredRoles);
  };

  const isEditor = !user?.permissions?.includes("EDIT")
  const isVerifier = !user?.permissions?.includes("VERIFY")
  const isPublisher = !user?.permissions?.includes("PUBLISH")

  const disAllowEditor = isEditor || user?.permissions?.length > 2 || user?.permissions?.some(element => element.slice(-10) === "MANAGEMENT")
  const disAllowVerifier = isVerifier || user?.permissions?.length > 2 || user?.permissions?.some(element => element.slice(-10) === "MANAGEMENT")
  const disAllowPublisher = isPublisher || user?.permissions?.length > 2 || user?.permissions?.some(element => element.slice(-10) === "MANAGEMENT")

  const raiseUser = currentTD === "EDIT"

  // Pagination logic
  const indexOfLastUser = currentPage * requestsPerPage;
  const indexOfFirstUser = indexOfLastUser - requestsPerPage;
  const currentRequests = Array.isArray(requests)
    ? requests?.slice(indexOfFirstUser, indexOfLastUser)
    : [];
  const totalPages = Math.ceil(requests?.length / requestsPerPage);

  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  let ToggleNames = []

  for (let i = 0; i < user.permissions.length; i++) {
    switch (user.permissions[i]) {
      case "EDIT":
        ToggleNames[i] = "Editor"
        break;

      case "PUBLISH":
        ToggleNames[i] = "Publisher";
        break;

      case "VERIFY":
        ToggleNames[i] = "Verifier"
        break;

      default:
    }
  }

  const [toggleText1, toggleText2] = ToggleNames

  useEffect(() => {
    const ref = raiseUser ? leftRef.current : rightRef.current;
    if (ref) {
      const { offsetWidth, offsetLeft } = ref;
      setSliderStyle({ width: offsetWidth, left: offsetLeft });
    }
  }, [raiseUser]);

  useEffect(() => {
    const activeRef = raiseUser ? rightRef : leftRef;
    if (activeRef.current) {
      // Allow time for DOM to paint
      requestAnimationFrame(() => {
        const { offsetWidth, offsetLeft } = activeRef.current;
        setSliderStyle({ width: offsetWidth, left: offsetLeft });
      });
    }
  }, [raiseUser, toggleText1, toggleText2]);



  useEffect(() => {
    async function fetchRequestsData() {
      // const response = await userLogs();
      setRequests(DummyData);
      // setOriginalLogs(response ?? []); // Store the original unfiltered data
    }
    fetchRequestsData();
  }, [changesInRequests]);
  return (
    <div className="relative min-h-full">
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
                    className="font-medium text-[12px] text-left font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[20px] py-[13px] !capitalize"
                    style={{ position: "static", width: "" }}
                  >
                    Resource
                  </th>
                  <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                    Status
                  </th>
                  {
                    user.permissions.length === 2 &&
                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <div
                          className="inline-flex bg-blue-200 rounded-[3px] relative items-center justify-between select-none gap-[4px] px-1 h-8"
                          onClick={() => setCurrentTD(prev => prev === "EDIT" ? "PUBLISH" : "EDIT")}
                        >
                          {/* Dynamic slider background */}
                          {sliderStyle.width > 0 && (
                            <div
                              className="absolute top-1 h-6 bg-[#00b9f2] rounded-[3px] transition-all duration-300 ease-in-out"
                              style={{
                                width: `${sliderStyle.width}px`,
                                left: `${sliderStyle.left}px`,
                              }}
                            ></div>
                          )}


                          {/* Left label */}
                          <span
                            ref={leftRef}
                            className={`z-10 text-xs font-medium px-3 leading-[1.5rem] transition-colors duration-300 ${raiseUser ? "text-[#001A5882]" : "text-white"
                              }`}
                          >
                            {toggleText1}
                          </span>

                          {/* Right label */}
                          <span
                            ref={rightRef}
                            className={`z-10 text-xs font-medium px-3 leading-[1.5rem] transition-colors duration-300 ${raiseUser ? "text-white" : "text-[#001A5882]"
                              }`}
                          >
                            {toggleText2}
                          </span>
                        </div>
                      </label>


                    </th>
                  }
                  {
                    disAllowEditor &&
                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                      Editor
                    </th>}
                  {/* <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">Performed Over</th> */}
                  {
                    disAllowVerifier &&
                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                      Verifier
                    </th>}
                  {
                    disAllowPublisher &&
                    <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize text-center">
                      Publisher
                    </th>
                  }
                  <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">
                    Date Time
                  </th>
                  <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">
                    Actions
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
                          <div className="flex flex-col ">
                            <p className="dark:text-[white]">
                              {request.resource}
                            </p>
                          </div>
                        </td>


                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">
                            <p
                              className={` mx-auto before:content-['•'] before:text-2xl flex h-7 items-center text-[12px] justify-center gap-1 px-3 py-0 font-[500] 
                                ${request?.status === "Green" ?
                                  "text-green-600 bg-green-200 before:text-green-600 px-1"
                                  : request?.status === "Red"
                                    ? "text-red-600 bg-red-200 before:text-red-600"
                                    : "text-stone-600 bg-blue-200 before:text-blue-600"
                                } rounded-2xl`}
                              style={{ textTransform: "capitalize" }}
                            >
                              {/* {request.status} */}
                            </p>
                          </span>
                        </td>
                        {
                          user?.permissions.length == 2 &&
                          < td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                            <span className="">
                              {raiseUser ? request.editor : request.verifier ? <button
                                onClick={() => {
                                  setSelectedRequests(request);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                  <FiEye
                                    className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                    strokeWidth={1}
                                  />
                                </span>
                              </button> : ""}
                            </span>
                          </td>
                        }
                        {
                          disAllowEditor &&
                          <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                            {request.editor}
                          </td>}
                        {
                          disAllowVerifier &&
                          <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                            {request.verifier.length > 1 ?
                              <button
                                onClick={() => {
                                  setSelectedRequests(request);
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
                              : "Multiple"}
                          </td>
                        }
                        {
                          disAllowPublisher &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "wrap" }}
                          >
                            <span className="">

                              {request.publisher}
                            </span>
                          </td>
                        }
                        <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[16px] py-[10px] dark:text-[white]">
                          {formatTimestamp(request?.datetime) || "N/A"}
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-fit mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                setSelectedRequests(request);
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

                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-[14px]">
                    <td colSpan={8}>No Data Available</td>
                  </tr>
                )
                }
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
      </TitleCard >

      <ToastContainer />
    </div >
  );
}
export default Requests;
