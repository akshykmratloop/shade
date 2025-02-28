import routes from "../routes/sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LiaChevronCircleLeftSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setSidebarState } from "../features/common/SbStateSlice"; // Adjust path as needed
import { useEffect } from "react";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 1200;
      dispatch(setSidebarState(shouldCollapse));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div className="flex-1 p-4">
      <ul
        className={`menu relative ${isCollapsed ? "w-16" : "w-60"} transition-all duration-500 bg-[#fafaff] dark:bg-[#242933] text-base-content h-full rounded-lg`}
      >
        <button
          className={`absolute z-10 top-14 right-[-.9rem] drop-shadow-xl btn btn-sm btn-circle bg-stone-300 dark:bg-base-200 hover:bg-base-300 transition-transform duration-300 dark:border dark:border-stone-700 border-transparent`}
          onClick={() => dispatch(toggleSidebar())}
        >
          <LiaChevronCircleLeftSolid className={`h-5 w-10 dark:text-stone-50 text-stone-800 ${isCollapsed ? "rotate-180" : "rotate-0"}`} />
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
          {!isCollapsed && <span className="truncate translate-x-[-1rem]">SHADE-CMS</span>}
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
              {route.icon} {!isCollapsed && route.name}
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
