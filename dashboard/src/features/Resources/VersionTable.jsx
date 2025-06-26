// libraries
import { useEffect, useState, memo, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// self modules and component
import Paginations from "../Component/Paginations";
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import formatTimestamp from "../../app/TimeFormat";
import { openRightDrawer } from "../../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import ToggleSwitch from "../../components/Toggle/Toggle";

// icons
import { FiEye } from "react-icons/fi";
import { LuListFilter } from "react-icons/lu";
import { PiInfoThin } from "react-icons/pi";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { getContent, getVersionContent, versionsList } from "../../app/fetch";
import { Switch } from "@headlessui/react";
import CustomContext from "../Context/CustomContext";
import ShowPdf from "../Requests/ShowPDF";
import FallBackLoader from "../../components/fallbackLoader/FallbackLoader";
import AllForOne from "./components/AllForOne";
import CloseModalButton from "../../components/Button/CloseButton";
import createContent from "./defineContent";
import { updateMainContent } from "../common/homeContentSlice";
import { setPlatform } from "../common/platformSlice";
import ToastPlacer from "../Component/ToastPlacer";
import LanguageSwitch from "./components/breakUI/SwitchLang";
// import { Switch } from "@headlessui/react";
// import { FiEdit } from "react-icons/fi";

const TopSideButtons = memo(
  ({
    removeFilter,
    applyFilter,
    // applySearch,
    // openAddForm,
  }) => {
    const [filterParam, setFilterParam] = useState("");
    const [searchText, setSearchText] = useState("");
    const statusFilters = [
      "DRAFT",
      "VERIFICATION_PENDING",
      "PUBLISH_PENDING",
      "SCHEDULED",
      "PUBLISHED",
    ];
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
        // applySearch(searchText);
      }
    }, [searchText]);
    return (
      <div className="inline-block float-left ml-[auto] flex items-center gap-3  dark:border-neutral-600 rounded-lg p-1">
        {/* <SearchBar
          searchText={searchText}
          styleClass="w-700px border-none w-full flex-1"
          setSearchText={setSearchText}
          placeholderText={
            "Search Roles by name, role, ID or any related keywords"
          }
          outline={false}
        /> */}
        {filterParam && (
          <button
            onClick={() => removeAppliedFilter()}
            className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
          >
            {capitalizeWords(filterParam)}
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

const statusStyles = {
  PUBLISHED: "text-green-600 bg-lime-200 before:text-green-600 px-1",
  DRAFT: "text-blue-600 bg-sky-200 before:text-blue-600 ",
  VERIFICATION_PENDING: "text-red-600 bg-pink-200 before:text-red-600 ",
  LIVE: "text-blue-600 bg-blue-200 before:text-white-600",
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------//
function VersionTable() {
  const userPermissionsSet = new Set(["EDIT", "VERIFY", "PUBLISH"]); // SET FOR EACH USER LOGIC
  // states
  const [versions, setVersions] = useState([]);
  const [originalVersions, setOriginalVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contentLoader, setContentLoader] = useState(false);
  const [preview, setPreview] = useState(false);
  const [rawContent, setRawContent] = useState(null);
  const [language, setLanguage] = useState("en");
  const [path, setPath] = useState("");
  const [subPath, setSubPath] = useState("");
  const [deepPath, setDeepPath] = useState("");
  const [currentResourceId, setCurrentResourceId] = useState("");
  const [searchValue, setSearchValue] = useState('')
  const [debounceSearchValue, setDebounceValue] = useState("")
  const [filter, setFilter] = useState("")
  // const [random, setRandowm] = useState(Math.random())
  const { random } = CustomContext().random;
  const { pdf } = CustomContext();
  const { showPDF, setShowPDF } = pdf;
  // const [activeIndex, setActiveIndex] = useState(null);


  // redux state
  const userObj = useSelector((state) => state.user);
  // const { resourceId, resourceName } = useSelector(state => state.versions)
  const [currentResource, setCurrentResource] = useState({
    resourceId: "",
    resourceName: "",
  });

  const { resourceId, resourceName } = currentResource;

  const { isManager } = userObj;

  // Fucntions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // REMOVE FILTER
  const removeFilter = () => {
    // setVersions([...originalVersions]);
    setFilter("")
  };

  // APPLY FILTER
  const applyFilter = (status) => {
    setFilter(status)
  };


  // Open Right Drawer
  const openNotification = (id) => {
    dispatch(
      openRightDrawer({
        header: "Version Details",
        bodyType: RIGHT_DRAWER_TYPES.VERSION_DETAILS,
        extraObject: { id },
      })
    );
  };

  const setRoute = (data) => {
    const tempRoute = {
      TEMPLATE_ONE: "temp-1",
      TEMPLATE_TWO: "temp-2",
      TEMPLATE_THREE: "temp-3",
      TEMPLATE_FOUR: "temp-4",
    };

    // setIdOnStorage(page.id);
    const {
      relationType,
      resourceTag,
      resourceType,
      subPage,
      subOfSubPage,
      slug,
    } = data;
    const parentId = data?.parentId;
    if (resourceTag.slice(0, 5) === "TEMPL") {
      setPath(tempRoute[resourceTag]);
    } else if (resourceType === "SUB_PAGE") {
      let firstRoute = resourceTag?.toLowerCase();
      setPath(firstRoute);
      setSubPath(data.id);
    } else if (resourceType === "SUB_PAGE_ITEM") {
      setPath(resourceTag?.toLowerCase());
      setSubPath(parentId);
      setDeepPath(data.id);
    } else {
      setPath(slug);
    }
    // setPreview(true)
    // dispatch(setPlatform("RESOURCE"))
  };

  // Pagination logic
  // const versionsPerPage = 10;
  // const indexOfLastUser = currentPage * versionsPerPage;
  // const indexOfFirstUser = indexOfLastUser - versionsPerPage;
  const currentVersions = versions
  // const totalPages = Math.ceil(versions?.length / versionsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0)


  // Side Effects
  useEffect(() => {
    // Fetch Versions
    if (resourceId) {
      async function fetchversionsData() {
        try {
          const payload = { page: currentPage };
          // payload.search = debounceSearchValue
          if (filter) payload.status = filter
          const response = await versionsList(resourceId, payload);
          if (response.ok) {
            setVersions(response?.content?.versions || []);
            setOriginalVersions(response?.content?.versions ?? []); // Store the original unfiltered data
            setTotalPages(response?.content?.pagination.totalPages)
          }
          setOriginalVersions(response?.content?.versions || []); // Store the original unfiltered data
        } catch (err) {
          console.error(err);
        }
      }
      fetchversionsData();
    }
  }, [resourceId, random, currentPage, filter]);

  useEffect(() => {
    setCurrentResource(
      JSON.parse(localStorage.getItem("currentResource")) || currentResource
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreview(false)
      }
    };

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    // Fetch Resource's Content from server
    if (currentResourceId) {
      async function fetchResourceContent() {
        setContentLoader(true);
        try {
          const response = await getVersionContent(currentResourceId);
          // console.log(response)
          if (response.ok) {
            const payload = {
              id: response.data.id,
              titleEn: response.data.titleEn,
              titleAr: response.data.titleAr,
              slug: response.data.slug,
              resourceType: response.data.resourceType,
              resourceTag: response.data.resourceTag,
              relationType: response.data.relationType,
              editVersion: response.data.versionData,
            };
            dispatch(updateMainContent({ currentPath: "content", payload }));
            setRawContent(createContent(payload));
            setRoute(payload);
            // if(res)
          }
        } catch (err) {
          console.error(err);
        } finally {
          setContentLoader(false);
        }
      }
      fetchResourceContent();
    }
  }, [currentResourceId, preview]);

  return (
    <div className="relative min-h-full">
      <TitleCard
        title={`Resources/ ${resourceName} / Versions `}
        question={false}
        topMargin="mt-2"
        backButton={true}
        TopSideButtons={
          <TopSideButtons
            // applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
          />
        }
      >
        <div className="min-h-[28.2rem] flex flex-col justify-between">
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
                    Version Number
                  </th>
                  <th className="text-[#42526D] w-[154px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] !capitalize text-left pl-10">
                    Status
                  </th>
                  <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                    Published At
                  </th>
                  <th className="text-[#42526D] w-[221px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[24px] py-[13px] text-center !capitalize">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {Array.isArray(versions) && currentVersions.length > 0 ? (
                  currentVersions?.map((version, index) => {
                    return (
                      <tr
                        key={index}
                        className="font-light "
                        style={{ height: "65px" }}
                      >
                        {/* 1 */}
                        <td
                          className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] p-[26px] pl-5 flex`}
                        >
                          <div className="flex flex-col">
                            <p className="dark:text-[white]">
                              {version?.["versionNumber"]}
                            </p>
                          </div>
                        </td>
                        {/* 2 */}
                        <td className="font-poppins w-[10vw] font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <div className="">
                            <div className="flex mx-auto gap-2 items-center justify-start">
                              <p
                                className={`min-w-[100px] 
                                                                before:content-['•'] 
                                                                before:text-2xl flex h-7 
                                                            items-center justify-center 
                                                            gap-1 px-1 py-0 font-[500] 
                                                          ${statusStyles[
                                  version
                                    ?.versionStatus
                                  ]
                                  }
                                                            rounded-2xl`}
                                style={{ textTransform: "capitalize" }}
                              >
                                <span className="">
                                  {capitalizeWords(version?.versionStatus)}
                                </span>
                              </p>
                              {/* <p className="text-xs font-[500]">{version?.isLive ? "Live" : version?.isUnderEditing ? "Under Editing" : ""}</p> */}
                            </div>
                          </div>
                        </td>
                        {/* 3 */}
                        <td
                          className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                          style={{ whiteSpace: "" }}
                        >
                          <span className="">
                            {formatTimestamp(version?.publishedAt)}
                          </span>
                        </td>

                        {/* 4 */}
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-[145px] mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                console.log(version.id);
                                setSelectedVersion(version);
                                openNotification(version?.id);
                              }}
                            >
                              <span
                                title="Version Info"
                                className="flex items-center gap-1 rounded-md text-[#101828]"
                              >
                                <PiInfoThin
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={2}
                                />
                              </span>
                            </button>

                            <button
                              onClick={() => {
                                console.log(version);
                                setSelectedVersion(version);
                                setCurrentResourceId(version.id);
                                // setShowDetailsModal(true);
                                setPreview(true);
                              }}
                            >
                              <span
                                title={`Review version details`}
                                className="flex items-center gap-1 rounded-md text-[#101828]"
                              >
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
                    <td colSpan={6}>No version available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <Paginations
            data={versions}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />

          {showPDF && (
            <ShowPdf
              open={showPDF}
              pdf={selectedVersion?.referenceDoc}
              onClose={() => {
                setShowPDF(false);
              }}
            />
          )}
        </div>
      </TitleCard>

      {preview &&
        rawContent &&
        // true
        (contentLoader ? (
          <FallBackLoader />
        ) : (
          <div className="fixed top-0 left-0 z-[55] w-screen h-screen bg-stone-900/30 overflow-y-scroll customscroller">
            <Suspense fallback={<FallBackLoader />}>
              <div className="">
                <CloseModalButton
                  onClickClose={() => {
                    setPreview(false);
                    setRawContent(null);
                  }}
                  className={"fixed top-4 right-8 z-[56]"}
                />
                <div className="w-[10%] fixed top-[30px] rounded-md p-5 bg-gray-100 dark:bg-cyan-800 z-30">
                  <LanguageSwitch language={language} setLanguage={setLanguage} />
                </div>
              </div>

              <AllForOne
                language={language}
                screen={1532}
                content={rawContent?.content}
                // contentIndex={content?.index}
                subPath={subPath}
                deepPath={deepPath}
                setLanguage={setLanguage}
                fullScreen={true}
                currentPath={path}
              />
            </Suspense>
          </div>
        ))}
      {/* <ToastContainer /> */}
      <ToastPlacer />
    </div>
  );
}
export default VersionTable;
