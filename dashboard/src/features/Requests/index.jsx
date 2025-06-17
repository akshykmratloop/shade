// libraries
import { useEffect, useState, memo, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// self modules and component
import ShowDifference from "./Showdifference";
import ShowVerifierTooltip from "./ShowVerifierTooltip";
import Paginations from "../Component/Paginations";
import { getRequests } from "../../app/fetch";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import formatTimestamp from "../../app/TimeFormat";
import { openRightDrawer } from "../../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import ToggleSwitch from "../../components/Toggle/Toggle";

// icons
import { FiEdit, FiEye } from "react-icons/fi";
import { LuListFilter } from "react-icons/lu";
import { PiInfoThin } from "react-icons/pi";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ShowPdf from "./ShowPDF";
// import { Switch } from "@headlessui/react";
// import { FiEdit } from "react-icons/fi";

const TopSideButtons = memo(
  ({
    removeFilter,
    applyFilter,
    applySearch,
    // openAddForm,
  }) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = ["REJECTED", "PUBLISHED", "PENDING"];
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
  }
);
//--------------------------------------------------------------------------------------------------------------------------------------------------------//
function Requests() {
  const userPermissionsSet = new Set(["EDIT", "VERIFY", "PUBLISH"]); // SET FOR EACH USER LOGIC
  // states
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [resourceId, setResourceId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [toggle, setToggle] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [filter, setFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  // const [path, setPath] = useState("")
  // const [subPath, setSubPath] = useState("")
  // const [deepPath, setDeepPath] = useState("")

  // redux state
  const userObj = useSelector((state) => state.user);

  const { isManager, isEditor, isPublisher, isVerifier, activeRole } = userObj;
  const roleId = activeRole?.id;

  // variables for conditioned renderings
  const [canSeeEditor, setCanSeeEditor] = useState(
    isVerifier || isPublisher || isManager
  );
  const [canSeeVerifier, setCanSeeVerifier] = useState(
    isPublisher || isManager
  );
  const [canSeePublisher, setCasSeePublisher] = useState(
    isVerifier || isManager
  );
  const noneCanSee = !(isEditor || isManager || isVerifier || isPublisher);
  const RoleTypeIsUser = userPermissionsSet.has(activeRole?.permissions[0]);
  const [permission, setPermission] = useState(
    RoleTypeIsUser ? activeRole?.permissions[0] || "" : false
  );
  const [random, setRandom] = useState(Math.random());

  // Fucntions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ordering the UsertypeRole options for toggle
  const order = ["EDIT", "VERIFY", "PUBLISH"];

  function sortStages(arr) {
    if (!Array.isArray(arr)) return;
    return arr?.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  const settingRoute = useCallback(
    (first, second, third) => {
      // setPath(first)
      // setSubPath(second)
      // setDeepPath(third)

      const route = third
        ? `/app/resources/edit/${first}/${second}/${third}`
        : second
          ? `/app/resources/edit/${first}/${second}`
          : `/app/resources/edit/${first}`;

      return route;
    },
    [navigate]
  );

  function navigateToPage(first, second, third) {
    let route = settingRoute(first, second, third);
    navigate(route);
  }

  // Change the reqeust table
  const changeTable = (permission) => {
    switch (permission) {
      case "EDIT":
        setCanSeeEditor(false);
        setCanSeeVerifier(false);
        setCasSeePublisher(false);
        setPermission(permission);
        break;
      case "VERIFY":
        setCanSeeVerifier(false);
        setCanSeeEditor(true);
        setCasSeePublisher(true);
        setPermission(permission);
        break;
      case "PUBLISH":
        setCasSeePublisher(false);
        setCanSeeVerifier(true);
        setCanSeeEditor(true);
        setPermission(permission);
        break;
    }
  };

  // REMOVE FILTER
  const removeFilter = () => {
    setRequests([...originalRequests]);
  };

  // APPLY FILTER
  const applyFilter = (status) => {
    setFilter(status);
  };

  function handleSearchInput(value) {
    if (value.length >= 3 || value.trim() === "") {
      setSearchValue(value);
    }
  }

  // Toggle verifier tooltip visibility
  const toggleTooltip = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Open Right Drawer
  const openNotification = (id) => {
    console.log(id);
    dispatch(
      openRightDrawer({
        header: "Details",
        bodyType: RIGHT_DRAWER_TYPES.RESOURCE_DETAILS,
        extraObject: { id },
      })
    );
  };

  // Pagination logic
  const currentRequests = requests;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 700); // debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Side Effects
  useEffect(() => {
    // Fetch Requests
    if (activeRole?.id) {
      async function fetchRequestsData() {
        try {
          const payload = { roleId: roleId ?? "", page: currentPage };

          if (RoleTypeIsUser)
            payload.permission = permission || activeRole?.permissions[0] || "";
          if (debouncedValue) payload.search = debouncedValue;
          if (filter) payload.status = filter;
          const response = await getRequests(payload);
          if (response.ok) {
            // console.log(response.requests.data)
            setRequests(response.requests?.data ?? []);
          }
          setOriginalRequests(response?.requests?.data ?? []); // Store the original unfiltered data
          setTotalPages(response?.requests?.pagination?.totalPages);
        } catch (err) {
          console.error(err);
        }
      }
      fetchRequestsData();
    }
  }, [activeRole.id, permission, filter, debouncedValue, currentPage, random]);

  useEffect(() => {
    setCanSeeEditor(isVerifier || isPublisher || isManager);
    setCanSeeVerifier(isPublisher || isEditor || isManager);
    setCasSeePublisher(isVerifier || isEditor || isManager);
  }, [activeRole?.id]);

  useEffect(() => {
    if (noneCanSee) {
      navigate("/app/dashboard");
    }
  }, [noneCanSee]);

  useEffect(() => {
    //flow
    if (activeRole?.permissions?.length > 1 && RoleTypeIsUser) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [activeRole]);

  return (
    <div className="relative min-h-full">
      <div className="absolute top-3 right-2 flex">
        {toggle && (
          <ToggleSwitch
            options={sortStages([...activeRole?.permissions])}
            switchToggles={changeTable}
          />
        )}
      </div>
      <TitleCard
        title={"Requests"}
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={handleSearchInput}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
          />
        }
      >
        <div className="min-h-[30rem] flex flex-col justify-between">
          <div className=" w-full border dark:border-stone-600 rounded-2xl">
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
                    // canSeeEditor &&
                    <th className="text-[#42526D] w-[154px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize text-center">
                      SubmitBy
                    </th>
                  }

                  {
                    // canSeeVerifier &&
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Verifier
                    </th>
                  }
                  {
                    // canSeePublisher &&
                    <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                      Publisher
                    </th>
                  }
                  {/* <th className="text-[#42526D] w-[211px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    Stage
                  </th> */}
                  <th className="text-[#42526D] w-[211px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize">
                    {/* Status */}
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
                    let publisher = request.approvals.filter(
                      (e) => e.stage === null
                    )[0];
                    let verifiers = request.approvals.filter((e) => e.stage);
                    return (
                      <tr
                        key={index}
                        className="font-light "
                        style={{ height: "65px" }}
                      >
                        <td
                          className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] py-[10px] pl-5 flex items-center`}
                        >
                          <div className="flex flex-col">
                            <p className="dark:text-[white]">
                              {request?.resourceVersion?.resource?.titleEn}
                            </p>
                          </div>
                        </td>
                        {
                          // canSeeEditor &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "" }}
                          >
                            <span className="" title={request?.sender.name}>
                              {TruncateText(request?.sender.name, 12) || "N/A"}
                            </span>
                          </td>
                        }
                        {
                          // canSeeVerifier &&
                          <td
                            className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                            style={{ whiteSpace: "" }}
                          >
                            <span className="">
                              {verifiers.length > 0 ? (

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
                                          {verifiers?.map((v) => {
                                            return (
                                              <tr
                                                key={v?.stage}
                                                className=" dark:border-stone-700 !rounded-none"
                                              >
                                                <td className="w-[100px] px-5 py-1 !rounded-none">
                                                  {v?.stage}
                                                </td>
                                                <td
                                                  className="w-[100px] px-5 py-1 !rounded-none"
                                                  title={v?.approver?.name}
                                                >
                                                  {TruncateText(
                                                    v?.approver?.name
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  }
                                  setOnView={() => setActiveIndex(-1)}
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
                                verifiers?.[0]?.approver?.name || "N/A"
                              )}
                            </span>
                          </td>
                        }
                        <td
                          className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                          style={{ whiteSpace: "" }}
                        >
                          <span className="" title={publisher?.approver?.name}>
                            {TruncateText(publisher?.approver?.name, 12) ||
                              "N/A"}
                          </span>
                        </td>

                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <p
                            className={`min-w-[85px] mx-auto before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] 
                              ${request.flowStatus === "SCHEDULED" ||
                                request.flowStatus === "PUBLISHED"
                                ? "text-green-600 bg-lime-200 before:text-green-600 px-1"
                                : request.flowStatus === "PENDING"
                                  ? "text-blue-600 bg-sky-200 before:text-blue-600 "
                                  : "text-red-600 bg-pink-200 before:text-red-600 "
                              } 
                                rounded-2xl`}
                            style={{ textTransform: "capitalize" }}
                          >
                            <span className="">
                              {capitalizeWords(request?.flowStatus)}
                            </span>
                          </p>
                        </td>
                        <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          {formatTimestamp(request?.createdAt)}
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-[145px] mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                // setShowDetailsModal(true);
                                openNotification(request?.id);
                              }}
                            >
                              <span
                                title="Request Info"
                                className="flex items-center gap-1 rounded-md text-[#101828]"
                              >
                                <PiInfoThin
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={2}
                                />
                              </span>
                            </button>

                            {request.flowStatus !== "PUBLISHED" && (
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetailsModal(true);
                                  // openNotification();
                                  setResourceId(
                                    request.resourceVersion.resourceId
                                  );
                                  setRequestId(request.id);
                                }}
                              >
                                <span
                                  title={`Review${canSeeEditor ? " and update" : ""
                                    }`}
                                  className="flex items-center gap-1 rounded-md text-[#101828]"
                                >
                                  <FiEye
                                    className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                    strokeWidth={1}
                                  />
                                </span>
                              </button>
                            )}

                            {!canSeeEditor &&
                              request.flowStatus === "REJECTED" && (
                                <button
                                  onClick={() => {
                                    const {
                                      relationType,
                                      resourceTag,
                                      subPage,
                                      subOfSubPage,
                                      slug,
                                    } = request.resourceVersion?.resource;
                                    if (relationType === "CHILD") {
                                      navigateToPage(
                                        resourceTag?.toLowerCase(),
                                        request.id
                                      );
                                    } else if (relationType !== "PARENT") {
                                      navigateToPage(
                                        resourceTag?.toLowerCase(),
                                        subPage,
                                        subOfSubPage
                                      );
                                    } else {
                                      navigateToPage(slug?.toLowerCase());
                                    }
                                  }}
                                >
                                  <span
                                    title={`Review${canSeeEditor ? " and update" : ""
                                      }`}
                                    className="flex items-center gap-1 rounded-md text-[#101828]"
                                  >
                                    <FiEdit
                                      className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                      strokeWidth={1}
                                    />
                                  </span>
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-[14px]">
                    <td colSpan={6}>No requests available</td>
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
          currentlyEditor={!canSeeEditor}
          currentlyVerifier={canSeePublisher}
          currentlyPublisher={canSeeVerifier}
          request={selectedRequest}
          show={showDetailsModal}
          resourceId={resourceId}
          requestId={requestId}
          refreshList={() => setRandom(Math.random())}
          // updateRoles={setChangesInRequest}
          onClose={() => {
            setSelectedRequest(false);
            setShowDetailsModal(false);
          }}
          // seePdf={() => { setShowPDF(true) }}
          seePdf={() => {}}
        />
      )}

      {
        showPDF
        && (
          <ShowPdf
            currentlyEditor={!canSeeEditor}
            currentlyVerifier={canSeePublisher}
            currentlyPublisher={canSeeVerifier}
            role={selectedRequest}
            show={showDetailsModal}
            resourceId={resourceId}
            requestId={requestId}
            // updateRoles={setChangesInRequest}
            onClose={() => {
              setShowPDF(false)
            }}
          />
        )}
      <ToastContainer />
    </div>
  );
}
export default Requests;
