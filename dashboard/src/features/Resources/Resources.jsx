import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
// Components
import ConfigBar from "./components/breakUI/ConfigBar";
import PageDetails from "./components/breakUI/PageDetails";
import Navbar from "../../containers/Navbar";
// import AllForOne from "./components/AllForOne"
import { ToastContainer } from "react-toastify";
import { MoonLoader } from "react-spinners";

// Icons
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";

// Assets & Utils
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import unavailableIcon from "../../assets/no_data_found.svg";
import content from "./components/websiteComponent/content.json";

// Redux
// import { getLeadsContent } from "./leadSlice"
import { getContent, getResources } from "../../app/fetch";
import { updateTag, updateType } from "../common/navbarSlice";
import { updateRouteLists } from "../common/routeLists";
import resourcesContent from "./resourcedata";
import CloseModalButton from "../../components/Button/CloseButton";
import createContent from "./defineContent";
import FallBackLoader from "../../components/fallbackLoader/FallbackLoader";

const AllForOne = lazy(() => import("./components/AllForOne"));
const Page404 = lazy(() => import("../../pages/protected/404"));

function Resources() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const divRef = useRef(null);
  const isManager = useSelector(state => state.user.isManager)

  const [configBarOn, setConfigBarOn] = useState(false);
  const [pageDetailsOn, setPageDetailsOn] = useState(false);
  const [configBarData, setConfigBarData] = useState({});
  const [resources, setResources] = useState({
    SUB_PAGE_ITEM: [],
    SUB_PAGE: [],
    MAIN_PAGE: [],
  });
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('en');
  const [path, setPath] = useState("")
  const [subPath, setSubPath] = useState("")
  const [deepPath, setDeepPath] = useState("")
  const [preview, setPreview] = useState(false)
  const [currentResourceId, setCurrentResourceId] = useState("")
  const [rawContent, setRawContent] = useState({})

  const [screen, setScreen] = useState(359);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  const isSidebarOpen = useSelector(state => state.sidebar.isCollapsed)
  const [randomRender, setRandomRender] = useState(Date.now());

  const resourceType = useSelector((state) => state.navBar.resourceType);
  const resourceTag = useSelector((state) => state.navBar.resourceTag);

  const resNotAvail = resources?.[resourceType]?.length === 0;

  const setIdOnStorage = (id) => localStorage.setItem("contextId", id);


  const settingRoute = useCallback(
    (first, second, third) => {
      setPath(first)
      setSubPath(second)
      setDeepPath(third)

      const route = third
        ? `./edit/${first}/${second}/${third}`
        : second
          ? `./edit/${first}/${second}`
          : `./edit/${first}`;

      return route
    },
    [navigate]
  );

  console.log(rawContent)


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

  useEffect(() => {
    // dispatch(getLeadsContent())

    const currentResource = localStorage.getItem("resourceType") || "MAIN_PAGE";
    const currentTag = localStorage.getItem("resourceTag") || "MAIN";

    dispatch(updateType(currentResource));
    dispatch(updateTag(currentTag));
  }, [dispatch]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!resourceType) return;
      setLoading(true); // Start loading

      const payload = ["MAIN", "HEADER_FOOTER"].includes(resourceTag)
        ? { resourceType }
        : { resourceType, resourceTag, relationType: "CHILD" };

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

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(handleResize);
    });

    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, [handleResize]);

  useEffect(() => {
    // dispatch(updateContent({ currentPath: "home", payload: (content?.home) }))
    if (currentResourceId) {
      async function context() {
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

            setRawContent(createContent(payload))
          }
        } catch (err) {

        }
      }
      context()
    }
  }, [currentResourceId])

  const ActionIcons = ({ page }) => {
    const actions = [
      {
        icon: <AiOutlineInfoCircle />,
        text: "Info",
        onClick: () => {
          setPageDetailsOn(true);
          setConfigBarData(page);
        },
      },
      {
        icon: <FiEdit />,
        text: "Edit",
        onClick: () => {
          setIdOnStorage(page.id);
          const { relationType, resourceTag, subPage, subOfSubPage, slug } = page;
          if (relationType === "CHILD") {
            navigateToPage(resourceTag?.toLowerCase(), page.id);
          } else if (relationType !== "PARENT") {
            navigateToPage(resourceTag?.toLowerCase(), subPage, subOfSubPage);
          } else {
            navigateToPage(slug?.toLowerCase());
          }
        },
      },
      {
        icon: <IoSettingsOutline />,
        text: "Assign",
        onClick: () => {
          setConfigBarOn(true);
          setConfigBarData(page);
        },
      },
      {
        icon: <LuEye />,
        text: "Preview",
        onClick: () => {
          setCurrentResourceId(page.id)
          // setIdOnStorage(page.id);
          const { relationType, resourceTag, subPage, subOfSubPage, slug } = page;
          if (relationType === "CHILD") {
            settingRoute(resourceTag?.toLowerCase(), page.id);
          } else if (relationType !== "PARENT") {
            settingRoute(resourceTag?.toLowerCase(), subPage, subOfSubPage);
          } else {
            settingRoute(slug?.toLowerCase());
          }
          setPreview(true)
        },
      }
    ];

    return (
      <div
        className={`absolute z-10 bottom-3 left-0 w-full text-white text-center flex justify-center items-center ${isNarrow ? "gap-2" : "gap-2"
          } py-1`}
      >
        {actions.map((item, i, a) => {
          let lastIndex = i === a.length - 1
          return (
            <span
              key={i}
              onClick={item.onClick}
              className={`flex ${isCollapsed ? "flex-col" : ""} gap-1 items-center cursor-pointer`}
            >
              {item.icon}
              <span className={`${isSmall ? "text-xs" : "text-sm"} translate-y-[1px]`}>{item.text}</span>
              {!lastIndex &&
                <span className="pl-2"> | </span>
              }
            </span>
          )
        })}
      </div>
    );
  };

  return (
    <div className="customscroller relative" ref={divRef}>
      <Navbar currentNav={resourceType} setCurrentResource={updateType} />

      <div
        className={`${resNotAvail || loading ? "" : "grid"} ${isNarrow ? "grid-cols-1" : "grid-cols-2"
          } mt-4 lg:grid-cols-3 gap-10 w-full px-10`}
      >
        {loading ? (
          <div className="flex justify-center items-center h-[70vh] w-full">
            <MoonLoader size={60} color="#29469c" className="" />
          </div>
        ) : resNotAvail ? (
          <div className="flex justify-center py-24 h-full border border-cyan-400">
          {/* //   <img src={unavailableIcon} alt="Not Available" /> */}
            <Page404 />
          </div>
        ) : (
          resources?.[resourceType]?.map((page, index) => (
            <div key={page.id || index} className="w-full">
              <h3 className="mb-1 font-poppins font-semibold">
                {isSmall
                  ? page.titleEn?.length > 20
                    ? `${TruncateText(page.titleEn, 20)}...`
                    : page.titleEn
                  : page.titleEn?.length > 35
                    ? `${TruncateText(page.titleEn, 35)}...`
                    : page.titleEn}
              </h3>

              <div className="relative rounded-lg overflow-hidden border border-base-300 shadow-xl-custom">
                <div
                  className={`h-6 ${page.isAssigned
                    ? "bg-[#29469c] w-[120px]"
                    : "bg-red-500 w-[140px]"
                    } text-white flex items-center justify-center text-sm font-light clip-concave absolute top-3 left-0 z-10`}
                >
                  {page.isAssigned ? "Assigned" : "Not assigned"}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 via-60%"></div>

                {/* <div className="relative aspect-[10/11] overflow-hidden"> */}
                {/* <div className="h-full overflow-y-scroll customscroller"> */}
                <div className="relative aspect-[10/11] overflow-hidden">
                  <iframe
                    src={resourcesContent?.pages?.[index]?.src}
                    className={`top-0 left-0 border-none transition-all duration-300 ease-in-out ${isNarrow
                      ? "w-[1000px] scale-[0.10]"
                      : `w-[1200px]  ${isSidebarOpen ? "scale-[0.34] " : "scale-[0.299]"
                      } p-4  bg-white`
                      } origin-top-left h-[80rem]`}
                  ></iframe>

                  {/* Dark Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/100 via-black/40 to-transparent"></div>
                  <div className="absolute top-0 left-0 w-full h-1/3  bg-gradient-to-b from-white/100 via-white/40 to-transparent"></div>
                </div>
                {/* <AllForOne currentPath={page.slug} content={content} language="en" screen={screen} /> */}
                {/* </div> */}

                <div className="absolute z-10 bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white via-white/40 to-transparent"></div>
                {/* </div> */}

                <ActionIcons page={page} />
              </div>
            </div>
          ))
        )}

        {/* Add More Card */}
        {resources?.[resourceType]?.[0]?.subPage && (
          <div className="w-full flex flex-col gap-[5px]">
            <h3 className="font-poppins font-semibold">{`Add More ${capitalizeWords(
              resourceType
            )} Page`}</h3>
            <div
              onClick={() =>
                navigate(
                  `./edit/${resourceType}/${resources?.[resourceType].length + 1
                  }`
                )
              }
              className="border rounded-md bg-white aspect-[10/11] flex-grow cursor-pointer flex items-center justify-center text-[50px] shadow-xl-custom border-[#29469c80]"
            >
              <span className="text-[#1f2937]">+</span>
            </div>
          </div>
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
        preview &&
        <div className="fixed top-0 left-0 z-[55] h-screen bg-stone-900/30 overflow-y-scroll">
          <Suspense fallback={<FallBackLoader />}>
            <div className="">
              <CloseModalButton onClickClose={() => setPreview(false)} className={"fixed top-4 right-8 z-[56]"} />
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
        </div>
      }
      <ToastContainer />
    </div >
  );
}

export default Resources;
