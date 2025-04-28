// libraries import
import {useEffect, useRef, useState} from "react";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import {toast, ToastContainer} from "react-toastify";
// self modules
import {fetchRoles, activateRole, deactivateRole} from "../../app/fetch";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import updateToasify from "../../app/toastify";
import Dummyuser from "../../assets/Dummy_User.json";
// icons
import {Switch} from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import {FiEye} from "react-icons/fi";
import {FiEdit} from "react-icons/fi";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {LuListFilter} from "react-icons/lu";
import {LuImport} from "react-icons/lu";
import capitalizeWords from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import formatTimestamp from "../../app/TimeFormat";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ShowDifference from "./Showdifference";
import ShowVerifierTooltip from "./ShowVerifierTooltip";
import {openRightDrawer} from "../../features/common/rightDrawerSlice";
import {RIGHT_DRAWER_TYPES} from "../../utils/globalConstantUtil";
import {GoSidebarExpand} from "react-icons/go";

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
                onClick={() => showFiltersAndApply(status)}
                style={{textTransform: "capitalize"}}
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

const ToggleSwitch = ({options, switchToggles}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});
  const buttonRefs = useRef([]);

  useEffect(() => {
    if (buttonRefs.current[selectedIndex]) {
      const button = buttonRefs.current[selectedIndex];
      const {offsetLeft, offsetWidth} = button;
      setSliderStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [selectedIndex, options]);

  useEffect(() => {
    switchToggles(options[0]);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex bg-gray-300 py-0 rounded-md"
    >
      {/* Slider */}
      <div
        className="absolute top-0 bg-blue-500 bottom-1 h-full rounded-md shadow transition-all rounded duration-300 ease-in-out"
        style={sliderStyle}
      ></div>

      {/* Options */}
      {options.map((option, index) => (
        <button
          key={index}
          ref={(el) => (buttonRefs.current[index] = el)}
          onClick={() => {
            switchToggles(option);
            setSelectedIndex(index);
          }}
          className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200  ${
            selectedIndex === index
              ? "text-white"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {option}
        </button>
      ))}
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
  const user = useSelector((state) => state.user.user);
  const userPermissionsSet = new Set(["EDIT", "VERIFY", "PUBLISH"]); // SET FOR EACH USER LOGIC
  const {isOpen, bodyType, extraObject, header} = useSelector(
    (state) => state.rightDrawer
  );
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
        extraObject: {id: user.id},
      })
    );
  };

  // Pagination logic
  const indexOfLastUser = currentPage * requestsPerPage;
  const indexOfFirstUser = indexOfLastUser - requestsPerPage;
  const currentRequests = requests?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(requests?.length / requestsPerPage);

  const [allowAll, setAllowAll] = useState(
    user?.permissions.some((e) => {
      return (
        e.slice(0, 4) !== "USER" &&
        e.slice(0, 4) !== "ROLE" &&
        e.slice(-10) === "MANAGEMENT"
      );
    })
  );
  let allowEditor = false;
  let allowVerifier = false;
  let allowPublisher = false;
  const [allowEditorState, setAllowEditor] = useState(false);
  const [allowVerifierState, setAllowVerifier] = useState(false);
  const [allowPublisherState, setAllowPublisher] = useState(false);
  let isToggle =
    user.permissions.length > 1 &&
    user?.permissions?.some((e) => userPermissionsSet.has(e));
  let singleUserPermission = "";

  let permissionsSet = new Set([...user?.permissions]);
  let userPermissionCount = 0;

  const options = [
    {permission: "MANAGEMENT", text: "Manager"},
    {permission: "EDIT", text: "Editor"},
    {permission: "VERIFY", text: "Verifier"},
    {permission: "PUBLISH", text: "Publisher"},
  ];

  if (!allowAll && !isToggle) {
    permissionsSet.forEach((e) => {
      if (userPermissionsSet.has(e)) {
        userPermissionCount++;
        singleUserPermission = e;
      }
    });
    switch (singleUserPermission) {
      case "PUBLISH":
        allowEditor = true;
        allowVerifier = true;
        break;

      case "VERIFY":
        allowEditor = true;
        allowPublisher = true;
        break;

      case "EDIT":
        break;

      default:
        navigate("/");
    }
  }

  const switchToggles = (option) => {
    switch (option) {
      case "Publisher":
        setAllowEditor(true);
        setAllowVerifier(true);
        setAllowPublisher(false);
        setAllowAll(false);
        break;

      case "Verifier":
        setAllowEditor(true);
        setAllowVerifier(false);
        setAllowPublisher(true);
        setAllowAll(false);
        break;

      case "Editor":
        setAllowEditor(false);
        setAllowVerifier(false);
        setAllowPublisher(false);
        setAllowAll(false);
        break;

      default:
        setAllowAll(true);
    }
  };

  const finalToggleOptions = options
    .map((option, i) => {
      const isNotUserAndRole =
        option.permission.slice(4) !== "USER" &&
        option.permission.slice(4) !== "ROLE";
      if (option.permission === "MANAGEMENT" && isNotUserAndRole) {
        return option.text;
      } else if (
        option.permission !== "MANAGEMENT" &&
        user?.permissions.includes(option.permission)
      ) {
        return option.text;
      }
    })
    .filter((e) => e);

  useEffect(() => {
    async function fetchRequestsData() {
      // const response = await fetchRoles();
      setRequests(Dummyuser);
      // setOriginalRequests(response?.roles?.roles ?? []); // Store the original unfiltered data
    }
    fetchRequestsData();
  }, [changesInRequest]);

  return (
    <div className="relative min-h-full">
      <div className="absolute top-3 right-2 flex">
        {isToggle && (
          <div className="flex justify-center items-center">
            <ToggleSwitch
              options={finalToggleOptions}
              switchToggles={switchToggles}
            />
          </div>
        )}
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
              <thead className="" style={{borderRadius: ""}}>
                <tr
                  className="!capitalize"
                  style={{textTransform: "capitalize"}}
                >
                  <th
                    className="font-medium text-[12px] text-left font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[24px] py-[13px] !capitalize"
                    style={{position: "static", width: "363px"}}
                  >
                    {" "}
                    Resource{" "}
                  </th>
                  {/* <th className="text-[#42526D] w-[164px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">Sub Permission</th> */}
                  <th className="text-[#42526D] w-[211px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    Status
                  </th>
                  {(allowAll || allowEditorState || allowEditor) && (
                    <th className="text-[#42526D] w-[154px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize text-center">
                      Editor
                    </th>
                  )}
                  {(allowAll || allowVerifier || allowVerifierState) && (
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Verifier
                    </th>
                  )}
                  {(allowAll || allowPublisher || allowPublisherState) && (
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Publisher
                    </th>
                  )}

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
                        style={{height: "65px"}}
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

                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <p
                            className={`w-[85px] mx-auto before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] 
                              ${
                                request.status === "Green"
                                  ? "text-green-600 bg-lime-200 before:text-green-600 px-1"
                                  : request.status === "Blue"
                                  ? "text-blue-600 bg-sky-200 before:text-blue-600 "
                                  : "text-red-600 bg-pink-200 before:text-red-600 "
                              } 
                                rounded-2xl`}
                            style={{textTransform: "capitalize"}}
                          >
                            {/* <span className="">{request?.status}</span> */}
                          </p>
                        </td>
                        {(allowAll || allowEditor || allowEditorState) && (
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{whiteSpace: "wrap"}}
                          >
                            <span className="">{request?.editor || "1"}</span>
                          </td>
                        )}
                        {(allowAll || allowVerifier || allowVerifierState) && (
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{whiteSpace: "wrap"}}
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
                                        <thead className="bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#FFFFFF] font-poppins font-medium text-[10px] leading-normal px-[24px] py-[13px] text-left !rounded-none !capitalize">
                                          <tr className="bg-[#25439B] !rounded-none">
                                            <th className="bg-[#25439B] w-[100px] px-5 py-1 !rounded-none">
                                              Stage
                                            </th>
                                            <th className="bg-[#25439B] w-[100px] px-5 py-1 !rounded-none">
                                              Name
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-left border rounded">
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
                                  <FiEye
                                    className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                    strokeWidth={1}
                                  />
                                </ShowVerifierTooltip>
                              ) : (
                                ""
                              )}
                            </span>
                          </td>
                        )}
                        {(allowAll ||
                          allowPublisher ||
                          allowPublisherState) && (
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{whiteSpace: "wrap"}}
                          >
                            <span className="">
                              {request?.publisher || "1"}
                            </span>
                          </td>
                        )}

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
                                <GoSidebarExpand
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={0.9}
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

                            <button
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
                            </button>
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
