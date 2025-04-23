import { useSelector, useDispatch } from "react-redux";

const Navbar = ({ currentNav, setCurrentResource }) => {
    const userPermissions = useSelector(state => state.user.user?.permissions);
    const dispatch = useDispatch();
    const permissionsSet = new Set(userPermissions);


    const navs = [
        { name: "Pages", pageType: "MAIN_PAGE", pageTag: "MAIN", permission: "PAGE_MANAGEMENT" },
        { name: "Services", pageType: "PAGE_ITEM", pageTag: "SERVICE", permission: "SERVICE_MANAGEMENT" },
        { name: "Sub Services", pageType: "PAGE_ITEM", pageTag: "SUB_SERVICE", permission: "SERVICE_MANAGEMENT" },
        { name: "Market", pageType: "PAGE_ITEM", pageTag: "MARKET", permission: "MARKET_MANAGEMENT" },
        { name: "Project", pageType: "PAGE_ITEM", pageTag: "PROJECT", permission: "PROJECT_MANAGEMENT" },
        { name: "Testimonials", pageType: "PAGE_ITEM", pageTag: "TESTIMONIAL", permission: "TESTIMONIAL_MANAGEMENT" },
        { name: "Career Page", pageType: "PAGE_ITEM", pageTag: "CAREER", permission: "CAREER_MANAGEMENT" },
        { name: "Blogs & News", pageType: "PAGE_ITEM", pageTag: "NEWS", permission: "NEWS_BLOGS_MANAGEMENT" },
        { name: "Sub Page", pageType: "PAGE_ITEM", pageTag: "SUB_PAGE", permission: ["HEADER_MANAGEMENT", "FOOTER_MANAGEMENT"] },
    ];

    const hasPermission = (required) => {
        if (Array.isArray(required)) {
            return required.some(p => permissionsSet.has(p));
        }
        return permissionsSet.has(required);
    };

    const settingResources = (resource, tag) => {
        dispatch(setCurrentResource(tag));
        localStorage.setItem("pageType", resource);
        localStorage.setItem("pageTag", tag)
    };

    return (
        <div className="sticky top-0 z-20">
            <nav className="bg-[#29469C] xl:text-[.9rem] sm:text-[.8rem] w-full rounded-lg sm:overflow-x-scroll xl:overflow-x-visible customscroller h-[61px]">
                <ul className="flex md:flex-nowrap lg:flex-nowrap md:w-full text-white py-2 whitespace-nowrap">
                    {navs.map((nav, index) => {
                        if (!hasPermission(nav.permission)) return null;

                        return (
                            <li
                                key={index}
                                className="max-w-[150px] w-full text-center px-2 relative flex items-center justify-center"
                            >
                                <button
                                    onClick={() => settingResources(nav.pageType, nav.pageTag)}
                                    className={`block w-full rounded-lg py-3 ${currentNav === nav.pageTag
                                        ? "bg-base-200 text-stone-700 dark:text-stone-50"
                                        : "hover:bg-base-200"
                                        } hover:text-stone-700 dark:hover:text-stone-50 transition`}
                                >
                                    {nav.name}
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
