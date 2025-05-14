import { useSelector, useDispatch } from "react-redux";
import { updateTag, updateType } from "../features/common/navbarSlice";
import capitalizeWords from "../app/capitalizeword";

const Navbar = ({ setCurrentResource }) => {
    const userPermissions = useSelector(state => state.user.user?.permissions);
    const currentNav = useSelector(state => state.navBar.resourceTag)
    const dispatch = useDispatch();
    const permissionsSet = new Set(userPermissions);


    const navs = [
        { name: "Pages", resourceType: "MAIN_PAGE", resourceTag: "MAIN", permission: "PAGE_MANAGEMENT" },
        { name: "Services", resourceType: "SUB_PAGE", resourceTag: "SERVICE", permission: "SERVICE_MANAGEMENT" },
        { name: "Sub Services", resourceType: "SUB_PAGE_ITEM", resourceTag: "SUB_SERVICES", permission: "SERVICE_MANAGEMENT" },
        { name: "Market", resourceType: "SUB_PAGE", resourceTag: "MARKET", permission: "MARKET_MANAGEMENT" },
        { name: "Project", resourceType: "SUB_PAGE", resourceTag: "PROJECT", permission: "PROJECT_MANAGEMENT" },
        { name: "Testimonials", resourceType: "SUB_PAGE", resourceTag: "TESTIMONIAL", permission: "TESTIMONIAL_MANAGEMENT" },
        { name: "Career Page", resourceType: "SUB_PAGE", resourceTag: "CAREER", permission: "CAREER_MANAGEMENT" },
        { name: "Blogs & News", resourceType: "SUB_PAGE", resourceTag: "NEWS", permission: "NEWS_BLOGS_MANAGEMENT" },
        { name: "Header", resourceType: "HEADER", resourceTag: "HEADER", permission: ["HEADER_MANAGEMENT", "FOOTER_MANAGEMENT"] },
        { name: "Footer", resourceType: "FOOTER", resourceTag: "FOOTER", permission: ["HEADER_MANAGEMENT", "FOOTER_MANAGEMENT"] },
    ];

    const hasPermission = (required) => {
        if (Array.isArray(required)) {
            return required.some(p => permissionsSet.has(p));
        }
        return permissionsSet.has(required);
    };

    const settingResources = (resource, tag) => {
        dispatch(updateType(resource));
        dispatch(updateTag(tag));
        localStorage.setItem("resourceType", resource);
        localStorage.setItem("resourceTag", tag)
    };

    return (
        <div className="sticky top-0 z-20">
            <nav className="bg-[#29469C] xl:text-[.9rem] sm:text-[.8rem] w-full rounded-lg sm:overflow-x-scroll xl:overflow-x-visible customscroller h-[61px]">
                <ul className="flex md:flex-nowrap lg:flex-nowrap md:w-full text-white py-2 whitespace-nowrap">
                    {navs.map((nav, index) => {

                        return (
                            <li
                                key={index}
                                className="max-w-[150px] w-full text-center px-2 relative flex items-center justify-center"
                            >
                                <button
                                    onClick={() => settingResources(nav.resourceType, nav.resourceTag)}
                                    className={`block w-full rounded-lg py-1 ${currentNav === nav.resourceTag
                                        ? "bg-base-200 text-stone-700 dark:text-stone-50"
                                        : "hover:bg-base-200"
                                        } hover:text-stone-700 dark:hover:text-stone-50 transition flex flex-col`}
                                >
                                    {nav.name}
                                    <span className="text-[300] text-[9px]">{"("}{capitalizeWords(nav.resourceType)}{")"}</span>
                                </button>
                                {index !== navs.length - 1 && (
                                    <span className="absolute right-[-1px] top-1/2 -translate-y-1/2 h-1/2 w-[1px] bg-white"></span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
