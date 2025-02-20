import routes from "../routes/sidebar";
import { NavLink, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
// import { useDispatch } from "react-redux";

function LeftSidebar() {
  const location = useLocation();

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  w-60 bg-base-100 text-base-content">
        <button
          className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-2 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className=" cursor-pointer shadow-md font-semibold text-xl flex flex-row items-center h-[64px] justify-start" onClick={()=>navigate('/')}>
            <img
              className="w-[50px] h-[50px] p-0 mx-[15px] hover:bg-transparent border-0"
              src="/logo192.png"
              alt="SHADE-CMS Logo"
            />
            SHADE-CMS
        </li>
        {routes.map((route, k) => {
          return (
            <li className="mt-2" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} /> 
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-semibold  bg-base-200 " : "font-normal"
                    }`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
