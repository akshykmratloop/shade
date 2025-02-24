import { Link } from "react-router-dom";

const Navbar = () => {
    const navs = [
        { name: "Pages", location: "/pages" },
        { name: "Services", location: "/services" },
        { name: "Project", location: "/project" },
        { name: "Testimonials", location: "/testimonials" },
        { name: "Career Page", location: "/career" },
        { name: "Blogs", location: "/blogs" },
        { name: "News", location: "/news" },
        { name: "Header", location: "/header" },
        { name: "Footer", location: "/footer" }
    ];

    return (
        <div className="p-4 py-1">
            <nav className="bg-[#29469C] w-full rounded-lg overflow-x-auto customscroller">
                <ul className="flex md:flex-nowrap lg:flex-nowrap md:w-full text-white py-2 whitespace-nowrap">
                    {navs.map((nav, index) => (
                        <li 
                            key={index} 
                            className="lg:w-full sm:w-auto text-center px-4 relative flex items-center justify-center"
                        >
                            <Link 
                                to={nav.location} 
                                className="block w-full rounded-lg py-3 hover:bg-base-200 hover:text-stone-700 dark:hover:text-stone-50 transition"
                            >
                                {nav.name}
                            </Link>
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
