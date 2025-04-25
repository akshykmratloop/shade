import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import ConfigBar from "./components/breakUI/ConfigBar";
import PageDetails from "./components/breakUI/PageDetails";
import AllForOne from "./components/AllForOne";
import Navbar from "../../containers/Navbar";

// Redux + API
import { getLeadsContent } from "./leadSlice";
import { getResources } from "../../app/fetch";
import { updateTag, updateType } from "../common/navbarSlice";
import { updateRouteLists } from "../common/routeLists";

// Utils + Assets
import capitalizeWords from "../../app/capitalizeword";
import unavailableIcon from "../../assets/no_data_found.svg";
import content from "./components/websiteComponent/content.json";

// Icons
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

// Notifications
import { ToastContainer } from "react-toastify";

function Resources() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const divRef = useRef(null);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isNarrow, setIsNarrow] = useState(false);
    const [screen, setScreen] = useState(359);

    const [configBarOn, setConfigBarOn] = useState(false);
    const [pageDetailsOn, setPageDetailsOn] = useState(false);
    const [configBarData, setConfigBarData] = useState({});

    const [resources, setResources] = useState({
        SUB_PAGE_ITEM: [],
        SUB_PAGE: [],
        MAIN_PAGE: []
    });

    const [randomRender, setRandomRender] = useState(Math.random());

    const resourceType = useSelector(state => state.navBar.resourceType);
    const resourceTag = useSelector(state => state.navBar.resourceTag);

    const resNotAvailable = resources?.[resourceType]?.length === 0;

    const handleRouteNavigation = useCallback((first, second, third) => {
        const route = third
            ? `./edit/${first}/${second}/${third}`
            : second
                ? `./edit/${first}/${second}`
                : `./edit/${first}`;
        navigate(route);
    }, [navigate]);

    const setRouteList = useCallback((payload) => {
        const list = payload?.map(e =>
            e.resourceType === "MAIN_PAGE" ? e.slug : e.id
        );
        localStorage.setItem("subRoutes", JSON.stringify(list));
    }, []);

    const fetchAndSetResources = useCallback(async () => {
        if (!resourceType) return;

        const payload = resourceTag === "MAIN" || resourceTag === "HEADER_FOOTER"
            ? { resourceType }
            : { resourceType, resourceTag, relationType: "CHILD" };

        const response = await getResources(payload);
        if (response.message === "Success") {
            setRouteList(response.resources?.resources);
            setResources(prev => ({
                ...prev,
                [resourceType]: response.resources?.resources
            }));
        }
    }, [resourceType, resourceTag, setRouteList]);

    useEffect(() => {
        dispatch(getLeadsContent());

        const currentType = localStorage.getItem("resourceType") || "MAIN_PAGE";
        const currentTag = localStorage.getItem("resourceTag") || "MAIN";

        dispatch(updateType(currentType));
        dispatch(updateTag(currentTag));
    }, [dispatch]);

    useEffect(() => {
        fetchAndSetResources();
    }, [fetchAndSetResources, randomRender]);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setIsCollapsed(width < 1100);
                setIsSmall(width < 1200);
                setIsNarrow(width < 600);
                setScreen((width / 3) - 55);
            }
        });

        if (divRef.current) observer.observe(divRef.current);
        return () => observer.disconnect();
    }, []);

    const handleIconClick = (action, page) => {
        if (action === "info") {
            setPageDetailsOn(true);
            setConfigBarData(page);
        } else if (action === "edit") {
            const { relationType, resourceTag, subPage, subOfSubPage, slug, id } = page;
            if (relationType !== "PARENT") {
                relationType !== "CHILD"
                    ? handleRouteNavigation(resourceTag?.toLowerCase(), subPage, subOfSubPage)
                    : handleRouteNavigation(resourceTag?.toLowerCase(), id);
            } else {
                handleRouteNavigation(slug?.toLowerCase());
            }
        } else if (action === "assign") {
            setConfigBarOn(true);
            setConfigBarData(page);
        }
    };

    return (
        <div className="customscroller relative" ref={divRef}>
            <Navbar currentNav={resourceType} setCurrentResource={updateType} />

            <div className={`mt-4 w-full px-10 gap-10 ${resNotAvailable ? "" : "grid"} ${isNarrow ? "grid-cols-1" : "grid-cols-2"} lg:grid-cols-3`}>
                {resNotAvailable ? (
                    <div className="flex justify-center py-16">
                        <img src={unavailableIcon} alt="No data" />
                    </div>
                ) : (
                    resources?.[resourceType]?.map((page, index) => (
                        <div key={`${page.id}-${index}`} className="w-full">
                            <h3 className="mb-1 font-poppins font-semibold">
                                {page.title?.length > (isSmall ? 20 : 35)
                                    ? `${page.title?.slice(0, isSmall ? 20 : 35)}...`
                                    : page.title}
                            </h3>
                            <div className="relative rounded-lg border border-base-300 shadow-xl-custom overflow-hidden">
                                <div className={`absolute top-3 left-0 z-10 h-6 text-white text-sm font-[300] flex items-center justify-center clip-concave ${page.isAssigned ? 'bg-[#29469c] w-[120px]' : 'bg-red-500 w-[140px]'}`}>
                                    {page.isAssigned ? "Assigned" : "Not assigned"}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 via-60%" />
                                <div className="relative aspect-[10/11] overflow-hidden">
                                    <div className="h-full overflow-y-scroll customscroller">
                                        <AllForOne currentPath={page.slug} content={content} language="en" screen={screen} />
                                    </div>
                                    <div className="absolute z-[10] bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/100 via-white/40 to-transparent" />
                                </div>

                                <div className={`absolute bottom-3 left-0 z-[10] w-full text-white flex justify-center items-center py-1 ${isNarrow ? "gap-2" : "gap-6"}`}>
                                    {[
                                        { icon: <AiOutlineInfoCircle />, text: "Info", action: "info" },
                                        { icon: <FiEdit />, text: "Edit", action: "edit" },
                                        { icon: <IoSettingsOutline />, text: "Assign", action: "assign" }
                                    ].map(({ icon, text, action }, i) => (
                                        <span
                                            key={action}
                                            onClick={() => handleIconClick(action, page)}
                                            className={`flex ${isCollapsed ? "flex-col" : ""} ${i < 2 ? "border-r-2 pr-5" : ""} gap-2 items-center text-center cursor-pointer`}>
                                            {icon}
                                            <span className={`${isSmall ? "text-xs" : "text-sm"}`}>{text}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {resources?.[resourceType]?.[0]?.subPage && (
                    <div className="w-full flex flex-col gap-1">
                        <h3 className="font-poppins font-semibold">
                            {`Add More ${capitalizeWords(resourceType)} Page`}
                        </h3>
                        <div
                            onClick={() => navigate(`./edit/${resourceType}/${resources?.[resourceType].length + 1}`)}
                            className="border rounded-md bg-white aspect-[10/11] flex-grow flex justify-center items-center text-[50px] shadow-xl-custom border-[#29469c80] cursor-pointer"
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
                    reRender={setRandomRender}
                />
            )}

            <PageDetails data={configBarData} display={pageDetailsOn} setOn={setPageDetailsOn} />
            <ToastContainer />
        </div>
    );
}

export default Resources;
