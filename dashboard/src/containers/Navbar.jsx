import { useSelector, useDispatch } from "react-redux";
import { updateName, updateTag, updateType } from "../features/common/navbarSlice";
import capitalizeWords from "../app/capitalizeword";
import { useEffect, useState } from "react";

const Navbar = ({ setCurrentResource }) => {
    // const userPermissions = useSelector(state => state.user.user?.permissions);
    // const currentNav = useSelector(state => state.navBar.resourceTag)
    const currentName = useSelector(state => state.navBar.name)
    const dispatch = useDispatch();
    // const [currentName, setCurrentName] = useState("Pages")
    // const permissionsSet = new Set(userPermissions);


    const navs = [
        { name: "Pages", resourceType: "MAIN_PAGE", resourceTag: "MAIN", permission: "PAGE_MANAGEMENT" },
        { name: "Services", resourceType: "SUB_PAGE", resourceTag: "SERVICE", permission: "SERVICE_MANAGEMENT" },
        { name: "Sub Services", resourceType: "SUB_PAGE_ITEM", resourceTag: "SERVICE", permission: "SERVICE_MANAGEMENT" },
        { name: "Market", resourceType: "SUB_PAGE", resourceTag: "MARKET", permission: "MARKET_MANAGEMENT" },
        { name: "Project", resourceType: "SUB_PAGE", resourceTag: "PROJECT", permission: "PROJECT_MANAGEMENT" },
        { name: "Testimonials", resourceType: "SUB_PAGE", resourceTag: "TESTIMONIAL", permission: "TESTIMONIAL_MANAGEMENT" },
        { name: "Career Page", resourceType: "SUB_PAGE", resourceTag: "CAREER", permission: "CAREER_MANAGEMENT" },
        { name: "Blogs & News", resourceType: "SUB_PAGE", resourceTag: "NEWS", permission: "NEWS_BLOGS_MANAGEMENT" },
        { name: "Header", resourceType: "HEADER", resourceTag: "HEADER", permission: "HEADER_MANAGEMENT" },
        { name: "Footer", resourceType: "FOOTER", resourceTag: "FOOTER", permission: "FOOTER_MANAGEMENT" },
        { name: "S & R", resourceType: "SUB_PAGE", resourceTag: "SAFETY_RESPONSIBILITY", permission: "PROJECT_MANAGEMENT" },
    ];

    // const hasPermission = (required) => {
    //     if (Array.isArray(required)) {
    //         return required.some(p => permissionsSet.has(p));
    //     }
    //     return permissionsSet.has(required);
    // };

    const settingResources = (resource, tag, name) => {
        dispatch(updateType(resource));
        dispatch(updateTag(tag));
        dispatch(updateName(name));
        localStorage.setItem("resourceType", resource);
        localStorage.setItem("resourceTag", tag);
        localStorage.setItem("navName", name)
    };

    useEffect(() => {
        let currentName = localStorage.getItem("navName")
        if(currentName) {
            // setCurrentName(currentName)
            dispatch(updateName(currentName))
        }
    }, [])

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
                                    onClick={() => settingResources(nav.resourceType, nav.resourceTag, nav.name)}
                                    className={`block w-full rounded-lg py-1 ${currentName === nav.name
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
