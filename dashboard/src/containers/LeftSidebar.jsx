import routes from "../routes/sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import { LiaChevronCircleLeftSolid } from "react-icons/lia";
import { useState, useEffect } from "react";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 900);
  const [showText, setShowText] = useState(!isCollapsed);

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setTimeout(() => {
      setShowText((prev) => !prev);
    }, 300);
  };

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 900;
      setIsCollapsed(shouldCollapse);
      setShowText(!shouldCollapse);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex-1 p-4">
      <ul
        className={`menu relative ${isCollapsed ? "w-16" : "w-60"} transition-all duration-500 bg-base-200 text-base-content rounded-lg`}
      >
        <button
          className={`absolute z-50 top-14 right-[-.9rem] btn border-none btn-sm btn-circle lg:hidden transition-transform duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          onClick={toggleSidebar}
        >
          <LiaChevronCircleLeftSolid className="h-5 w-10" />
        </button>

        <li
          className="pt-2 cursor-pointer font-semibold text-xl flex items-center h-[64px]"
          onClick={() => navigate("/app/welcome")}
        >
          <img
            className="w-[50px] h-[50px]  p-0 border-0"
            src="/logo192.png"
            alt="SHADE-CMS Logo"
          />
          {showText && <span className={`${showText ? "truncate" : ""} translate-x-[-1rem]`}>SHADE-CMS</span>}
        </li>

        {routes.map((route, k) => (
          <li className="mt-2 w-full" key={k}>
            
              <NavLink
                end
                to={route.path}
                className={({ isActive }) =>
                  `${isActive ? "font-semibold bg-base-200" : "font-normal"} pl-5 w-full flex items-center gap-2`
                }
              >
                {route.icon} {showText && route.name}
                {location.pathname === route.path && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-primary"
                    aria-hidden="true"
                  ></span>
                )}
              </NavLink>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeftSidebar;
