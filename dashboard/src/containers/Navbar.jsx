import { useSelector } from "react-redux";

const Navbar = ({ currentNav, setCurrentResource }) => {
    const userPermissions = useSelector(state => state.user.user?.permissions);
    const permissionsSet = new Set(userPermissions);

    const navs = [
        { name: "Pages", resources: "mainPages", permission: "PAGE_MANAGEMENT" },
        { name: "Services", resources: "services", permission: "SERVICE_MANAGEMENT" },
        { name: "Sub Services", resources: "subServices", permission: "SERVICE_MANAGEMENT" },
        { name: "Market", resources: "markets", permission: "MARKET_MANAGEMENT" },
        { name: "Project", resources: "projects", permission: "PROJECT_MANAGEMENT" },
        { name: "Testimonials", resources: "testimonials", permission: "TESTIMONIAL_MANAGEMENT" },
        { name: "Career Page", resources: "careers", permission: "CAREER_MANAGEMENT" },
        { name: "Blogs & News", resources: "news", permission: "NEWS_BLOGS_MANAGEMENT" },
        { name: "Sub Page", resources: "subPage", permission: ["HEADER_MANAGEMENT", "FOOTER_MANAGEMENT"] }, // ✅ fixed typo
    ];

    const hasPermission = (required) => {
        if (Array.isArray(required)) {
            return required.some(p => permissionsSet.has(p));
        }
        return permissionsSet.has(required);
    };

    const settingResources = (resource) => {
        setCurrentResource(resource);
        localStorage.setItem("resource", resource);
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
                                    onClick={() => settingResources(nav.resources)}
                                    className={`block w-full rounded-lg py-3 ${
                                        currentNav === nav.resources
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
