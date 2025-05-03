import routes from "../routes/sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LiaChevronCircleLeftSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setSidebarState } from "../features/common/SbStateSlice";
import { useEffect, useState, useCallback, useMemo } from "react";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const userRole = useSelector((state) => state.user.currentRole);
  const [showText, setShowText] = useState(false);

  const defineUserAndRoleManager = useMemo(() => 
    userRole?.permissions?.some(e => !e.startsWith("USER") && !e.startsWith("ROLE")),
    [userRole?.permissions]
  );

  const handleResize = useCallback(() => {
    const shouldCollapse = window.innerWidth < 1200;
    dispatch(setSidebarState(shouldCollapse));
  }, [dispatch]);

  const setRouteOnStorage = useCallback((route) => {
    localStorage.setItem("route", route);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isCollapsed) {
      setShowText(true);
    } else {
      const timer = setTimeout(() => setShowText(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isCollapsed]);

  const renderRouteItem = (route, index, lastIndex) => (
    <li
      key={index}
      className="mt-2 w-full flex justify-center"
      title={route.name}
      style={{ borderRadius: lastIndex ? "0px 0px 0px 0px" : undefined }}
    >
      <NavLink
        end
        to={route.path}
        onClick={() => setRouteOnStorage(route.path)}
        className={({ isActive }) =>
          `${isActive
            ? "font-semibold bg-base-200 dark:bg-stone-300/20 dark:text-white"
            : "font-normal"} pl-7 w-full flex items-center gap-2 relative`
        }
        
      >
        {route.icon} {!showText && route.name}
        {location.pathname === route.path && (
          <span
            className="absolute inset-y-0 left-0 w-1 bg-primary"
            aria-hidden="true"
          ></span>
        )}
      </NavLink>
    </li>
  );

  return (
    <div className="flex-1 p-4 text-sm pb-8">
      <ul
        className={`menu relative ${isCollapsed ? "w-[81px]" : "w-56"} transition-all duration-500 bg-[#fafaff] dark:bg-[#242933] text-base-content h-full rounded-lg`}
      >
        <button
          className="absolute z-10 top-14 right-[-.9rem] drop-shadow-xl btn btn-sm btn-circle bg-stone-300 dark:bg-base-200 hover:bg-base-300 transition-transform duration-300 dark:border dark:border-stone-700 border-transparent"
          onClick={() => dispatch(toggleSidebar())}
        >
          <LiaChevronCircleLeftSolid
            className={`h-5 w-10 dark:text-stone-50 text-stone-800 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <li
          className="pt-2 cursor-pointer font-semibold text-xl flex items-center h-[64px]"
          onClick={() => navigate("/app/welcome")}
        >
          <img
            className="w-[50px] h-[50px] p-0 border-0 pointer-events-none"
            src="/logo192.png"
            alt="SHADE-CMS Logo"
          />
          {!showText && (
            <span className="truncate translate-x-[-1rem] pointer-events-none">
              SHADE-CMS
            </span>
          )}
        </li>

        {routes.map((route, index, array) => {
          const lastIndex = index === array.length - 1;
          if (
            (route.name === "Requests" || route.name === "Resources") &&
            !defineUserAndRoleManager
          ) {
            return null;
          }
          if (route.permission && !userRole?.permissions?.includes(route.permission)) {
            return null;
          }
          return renderRouteItem(route, index, lastIndex);
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
