import { Link } from "react-router-dom";

const Navbar = ({currentNav, setCurrentResource}) => {
    const navs = [
           { name: "Pages", resources: "pages" },
           { name: "Services", resources: "services" },
           { name: "Market", resources: "markets" },
           { name: "Project", resources: "projects" },
           { name: "Testimonials", resources: "testimonials" },
           { name: "Career Page", resources: "careers" },
           { name: "Blogs & News", resources: "blogs" },
           { name: "Header", resources: "header" },
           { name: "Footer", resources: "footer" }
       ];

    function settingResources (resource) {
        setCurrentResource(resource)
        localStorage.setItem("resource", resource)
    }

    return (
        <div className="">
            <nav className="bg-[#29469C] text-[.9rem] w-full rounded-lg sm:overflow-x-scroll xl:overflow-x-visible customscroller">
                <ul className="flex md:flex-nowrap lg:flex-nowrap md:w-full text-white py-2 whitespace-nowrap">
                    {navs.map((nav, index) => (
                        <li 
                            key={index} 
                            className="lg:w-full sm:w-auto text-center px-2 relative flex items-center justify-center"
                        >
                            <button 
                                onClick={() => settingResources(nav.resources)}
                                className={`block w-full rounded-lg py-3 ${currentNav === nav.resources?"bg-base-200 text-stone-700 dark:text-stone-50":"hover:bg-base-200"} hover:text-stone-700 dark:hover:text-stone-50 transition`}
                            >
                                {nav.name}
                            </button>
                            {index !== navs.length - 1 && (
                                <span className="absolute right-[-1px] top-1/2 -translate-y-1/2 h-1/2 w-[1px] bg-white"></span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
