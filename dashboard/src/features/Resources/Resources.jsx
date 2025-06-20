import React, { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
// import AllForOne from "./components/AllForOne"
import { ToastContainer } from "react-toastify";
import { MoonLoader } from "react-spinners";
// Icons
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import { FiEdit } from "react-icons/fi";
// import { IoSettingsOutline } from "react-icons/io5";
// import { LuEye } from "react-icons/lu";
// Image
// Components, Assets & Utils
// import { pagesImages } from "./resourcedata";
import ConfigBar from "./components/breakUI/ConfigBar";
import PageDetails from "./components/breakUI/PageDetails";
import Navbar from "../../containers/Navbar";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import content from "./components/websiteComponent/content.json";
import { getContent, getResources } from "../../app/fetch";
import { updateTag, updateType } from "../common/navbarSlice";
// import resourcesContent from "./resourcedata";
import CloseModalButton from "../../components/Button/CloseButton";
import createContent from "./defineContent";
import FallBackLoader from "../../components/fallbackLoader/FallbackLoader";
// import VersionTable from "./VersionTable";
import { setPlatform } from "../common/platformSlice";
// import { updateResourceId } from "../common/resourceSlice";
import { updateMainContent } from "../common/homeContentSlice";
import { ResourceCard } from "./ResourceCard";
import NewProjectDialog from "./NewProjectDialog";

const AllForOne = lazy(() => import("./components/AllForOne"));
const Page404 = lazy(() => import("../../pages/protected/404"));

function Resources() {
  // State
  const [configBarOn, setConfigBarOn] = useState(false);
  const [pageDetailsOn, setPageDetailsOn] = useState(false);
  const [configBarData, setConfigBarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [path, setPath] = useState("")
  const [subPath, setSubPath] = useState("")
  const [deepPath, setDeepPath] = useState("")
  const [preview, setPreview] = useState(false)
  const [currentResourceId, setCurrentResourceId] = useState("")
  const [rawContent, setRawContent] = useState(null)
  const [contentLoader, setContentLoader] = useState(false)
  const [screen, setScreen] = useState(359);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [randomRender, setRandomRender] = useState(Date.now());
  const [resources, setResources] = useState({
    SUB_PAGE_ITEM: [],
    SUB_PAGE: [],
    MAIN_PAGE: [],
  });
  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false)


  // Redux State
  const divRef = useRef(null);
  // const isSidebarOpen = useSelector(state => state.sidebar.isCollapsed)
  const resourceType = useSelector((state) => state.navBar.resourceType);
  const resourceTag = useSelector((state) => state.navBar.resourceTag);
  const { showVersions } = useSelector(state => state.versions)
  const userObj = useSelector(state => state.user)

  const { isManager, isEditor, activeRole } = userObj
  const activeRoleId = activeRole?.id
  const superUser = userObj.user?.isSuperUser

  // Variables
  const resNotAvail = resources?.[resourceType]?.length === 0;

  // Functions
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setIdOnStorage = (id) => localStorage.setItem("contextId", id);

  const settingRoute = useCallback(
    (first, second, third) => {
      setPath(first)
      setSubPath(second)
      setDeepPath(third)

      const route = third
        ? `../edit/${first}/${second}/${third}`
        : second
          ? `../edit/${first}/${second}`
          : `../edit/${first}`;

      return route
    },
    [navigate]
  );

  function navigateToPage(first, second, third) {
    let route = settingRoute(first, second, third)
    navigate(route);
  }

  const setRouteList = useCallback((payload = []) => {
    const list = payload.map((e) =>
      e.resourceType === "MAIN_PAGE" ? e.slug : e.id
    );
    localStorage.setItem("subRoutes", JSON.stringify(list));
  }, []);

  const handleResize = useCallback((entry) => {
    const width = entry.contentRect.width;
    setIsCollapsed(width < 1100);
    setIsSmall(width < 1200);
    setIsNarrow(width < 600);
    setScreen(width / 3 - 55);
  }, []);

  // Side Effects 

  const conditionNewPage = resourceTag !== "FOOTER" && resourceTag !== "HEADER"

  useEffect(() => { // Running resources from localstroge
    const currentResource = localStorage.getItem("resourceType") || "MAIN_PAGE";
    const currentTag = localStorage.getItem("resourceTag") || "MAIN";

    dispatch(updateType(currentResource));
    dispatch(updateTag(currentTag));
  }, [dispatch]);

  useEffect(() => { // Fetch Resources
    const fetchResources = async () => {
      if (!resourceType) return;

      setLoading(true); // Start loading
      // const roleType = isManager ? "MANAGER" : "USER"
      const payload = ["MAIN", "FOOTER", "HEADER"].includes(resourceTag)
        ? { resourceType, ...(superUser ? {} : { roleId: activeRoleId }), }
        : { resourceType, resourceTag, ...(superUser ? {} : { roleId: activeRoleId }), };

      const response = await getResources(payload);

      if (response?.message === "Success") {
        setRouteList(response.resources?.resources);
        setResources((prev) => ({
          ...prev,
          [resourceType]: response.resources?.resources,
        }));
      }
      setLoading(false); // Stop loading
    };

    fetchResources();
  }, [resourceType, resourceTag, randomRender, setRouteList]);

  useEffect(() => { // The Resizes
    const observer = new ResizeObserver((entries) => {
      entries.forEach(handleResize);
    });

    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, [handleResize]);

  useEffect(() => { // Fetch Resource's Content from server
    if (currentResourceId) {
      async function fetchResourceContent() {
        setContentLoader(true)
        try {
          const response = await getContent(currentResourceId)
          if (response.message === "Success") {
            const payload = {
              id: response.content.id,
              titleEn: response.content.titleEn,
              titleAr: response.content.titleAr,
              slug: response.content.slug,
              resourceType: response.content.resourceType,
              resourceTag: response.content.resourceTag,
              relationType: response.content.relationType,
              editVersion: isManager ? response.content.liveModeVersionData : response.content.editModeVersionData ?? response.content.liveModeVersionData
            }
            dispatch(updateMainContent({ currentPath: "content", payload }))
            setRawContent(createContent(payload))
          }
        } catch (err) {
          console.error(err)
        } finally {
          setContentLoader(false)
        }
      }
      fetchResourceContent()
    }
  }, [currentResourceId, preview])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreview(false)
      }
    };

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  /// Components ///
  // if (showVersions) {
  //   return (
  //     <VersionTable />
  //   )
  // }

  const ActionIcons = ((page, i) => {
    const actions = [
      () => {
        setPageDetailsOn(true);
        setConfigBarData(page);
      },
      () => {
        // dispatch(updateResourceId({ id: page.id, name: page.titleEn }))

        setIdOnStorage(page.id);
        const { resourceType, resourceTag, subPage, subOfSubPage, slug } = page;
        const parentId = page?.parentId
        if (resourceType === "SUB_PAGE") {
          navigateToPage(resourceTag?.toLowerCase(), page.id);
        } else if (resourceType === "SUB_PAGE_ITEM") {
          navigateToPage(resourceTag?.toLowerCase(), parentId, page.id);
        } else {
          navigateToPage(slug?.toLowerCase());
        }
      },
      () => {
        setConfigBarOn(true);
        setConfigBarData(page);
      },
      () => {
        setCurrentResourceId(page.id)
        // setIdOnStorage(page.id);
        const { relationType, resourceTag, subPage, subOfSubPage, slug } = page;
        const parentId = page?.parentId
        if (resourceType === "SUB_PAGE") {
          let firstRoute = resourceTag?.toLowerCase()
          settingRoute(firstRoute, page.id);
        } else if (resourceType === "SUB_PAGE_ITEM") {
          settingRoute(resourceTag?.toLowerCase(), parentId, page.id);
        } else {
          settingRoute(slug?.toLowerCase());
        }
        setPreview(true)
        dispatch(setPlatform("RESOURCE"))
      }
    ];
    return actions[i]();
  })

  if (!isEditor && !isManager) return null

  return (
    <div className="customscroller relative" ref={divRef}>
      <Navbar currentNav={resourceType} setCurrentResource={updateType} />

      <div
        className={`${resNotAvail || loading ? "" : "grid"} ${isNarrow ? "grid-cols-1" : "grid-cols-2"
          } mt-4 lg:grid-cols-3 gap-10 w-full px-10 auto-rows-fr`}
      >
        {loading ? (
          <div className="flex justify-center items-center h-[70vh] w-full">
            <MoonLoader size={60} color="#29469c" className="" />
          </div>
        ) : resNotAvail ? (
          <div className="flex justify-center py-24 h-full">
            {/* //   <img src={unavailableIcon} alt="Not Available" /> */}
            <Page404 />
          </div>
        ) : (
          <>{
            resources?.[resourceType]?.map((page, index) => {
              return (
                <ResourceCard key={index} resource={page} ActionIcons={ActionIcons} />
              )
            })}
            {/* Add More Card */}
            {
              (conditionNewPage) &&
              <div className="w-full flex flex-col gap-[5px]">
                <div
                  onClick={() => {
                    if (resourceType === "MAIN_PAGE") {
                      return setOpenCreateProjectDialog(true)
                    } else if (resourceType === "SUB_PAGE_ITEM") {
                      localStorage.setItem("contextId", "null");
                      navigate(
                        `../edit/${(resourceTag).toLowerCase()}/new/new`
                      )
                    } else {
                      localStorage.setItem("contextId", "null");
                      navigate(
                        `../edit/${(resourceTag).toLowerCase()}/new`
                      )
                    }
                  }}
                  className="border rounded-md bg-white flex-grow cursor-pointer flex flex-col items-center justify-center text-[50px] shadow-xl-custom border-[#29469c80]"
                >
                  <div></div>
                  <span className="text-[#1f2937]">+</span>
                  <h3 className="font-poppins font-light text-sm">{`Create New ${resourceType === "SUB_PAGE_ITEM" ? "Service's Child" : capitalizeWords(resourceTag)} Page`}</h3>
                </div>
              </div>
            }
          </>
        )}
      </div>

      {configBarOn && (
        <ConfigBar
          data={configBarData}
          display={configBarOn}
          setOn={setConfigBarOn}
          resourceId={configBarData.id}
          reRender={() => setRandomRender(Date.now())}
        />
      )}
      {pageDetailsOn && (
        <PageDetails
          data={configBarData}
          display={pageDetailsOn}
          setOn={setPageDetailsOn}
        />
      )}
      {
        (preview && rawContent) && (
          contentLoader ?
            <FallBackLoader />
            :
            < div className="fixed top-0 left-0 z-[55] w-screen h-screen bg-stone-900/30 overflow-y-scroll customscroller">
              <Suspense fallback={<FallBackLoader />}>
                <div className="">
                  <CloseModalButton onClickClose={() => { setPreview(false); setRawContent(null) }} className={"fixed top-4 right-8 z-[56]"} />
                </div>

                <AllForOne
                  language={language}
                  screen={1532}
                  content={rawContent.content}
                  contentIndex={content.index}
                  subPath={subPath}
                  deepPath={deepPath}
                  setLanguage={setLanguage}
                  fullScreen={true}
                  currentPath={path}
                />
              </Suspense>
            </div>)
      }

      {
        openCreateProjectDialog &&
        <NewProjectDialog display={openCreateProjectDialog} close={() => setOpenCreateProjectDialog(false)} />
      }
      <ToastContainer />
    </div >
  );
}

export default Resources;
