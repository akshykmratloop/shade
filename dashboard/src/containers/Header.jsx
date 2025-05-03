import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { LiaUserCircleSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { openModal } from "../features/common/modalSlice";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import SearchBar from "../components/Input/SearchBar";
import { getNotificationsbyId } from "../app/fetch";
import { setNotificationCount } from "../features/common/headerSlice";
import socket from "../Socket/socket";
import { TruncateText } from "../app/capitalizeword";

function Header() {
  const dispatch = useDispatch();
  const userObj = useSelector((state) => state.user);
  const { user, currentRole } = userObj
  const { noOfNotifications } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [greetings, setGreetings] = useState("Good Morning");

  const userId = user.id;

  //=========================================================================

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const res = await getNotificationsbyId(userId);
      const unread = res?.notifications?.filter((n) => !n.isRead)?.length;
      dispatch(setNotificationCount(unread));
    })();
  }, [userId, dispatch]);

  useEffect(() => {
    if (!userId) return;

    // join your room
    socket.emit("join", userId);

    // handler to re‑fetch the unread count
    const handleNew = async (payload) => {
      if (payload.userId !== userId) return;
      const res = await getNotificationsbyId(userId);
      const unread = res.notifications?.filter((n) => !n.isRead)?.length;
      dispatch(setNotificationCount(unread));
    };

    socket.on("role_created", handleNew);
    socket.on("user_created", handleNew);
    // …listen to any other event names you emit

    return () => {
      socket.off("role_created", handleNew);
      socket.off("user_created", handleNew);
    };
  }, [userId, dispatch]);

  //=========================================================================

  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
        extraObject: { id: user.id },
      })
    );
  };

  function logoutUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const openAddNewLeadModal = () => {
    dispatch(
      openModal({
        title: "Reset Your Password",
        bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
      })
    );
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setCurrentTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
    themeChange(false);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreetings("Good Afternoon");
    } else if (hour >= 17) {
      setGreetings("Good Evening");
    } else {
      setGreetings("Good Morning");
    }
  }, []);

  // useEffect(() => {
  //   async function fetchUnreadCount() {
  //     try {
  //       const result = await getNotificationsbyId(user?.id);
  //       const unreadCount =
  //         result?.notifications?.filter((n) => !n.isRead).length || 0;
  //       dispatch(setNotificationCount(unreadCount));
  //     } catch (error) {
  //       console.error("Failed to fetch notifications count", error);
  //     }
  //   }

  //   if (user?.id) {
  //     fetchUnreadCount();
  //   }
  // }, [user?.id]);

  return (
    <div className="py-4 px-2 pr-4">
      <div className="navbar py-[20px] rounded-lg flex justify-between bg-[#fafaff] dark:bg-[#242933] z-10 pl-[15px] pr-[15px] ">
        <div className="sm:block xl:hidden"></div>
        <div className=" flex-col items-start xl:flex font-lexend">
          <div className="flex gap-2 items-center border">
            <h2 className="font-semibold">
              Hello {user?.name}
            </h2>
            <select name="" id="" className="bg-transparent text-sm py-0 w-[10vw] border dark:border-stone-500 border-stone-500/30">
              {user.roles?.map(e => {
                return (
                  <option value="" className="bg-transparent text-xs py-0">{e.role?.replace?.("_", " ")}</option>
                )
              })}
            </select>
          </div>
          <p className="text-base-700 font-light font-lexend text-[grey]">
            {greetings}
          </p>
        </div>
        <div className="order-last gap-[12px]">
          <SearchBar
            setSearchText={() => { }}
            styleClass={
              "bg-transparent border border-stone-300 dark:border-stone-600"
            }
          />
          {/* <button
            className="h-[45px] w-[45px] mx-1 flex items-center justify-center bg-base-300 rounded-md border-green-200"
            onClick={openNotification}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
            </div>
          </button> */}
          <button
            className="relative h-[45px] w-[45px] mx-1 flex items-center justify-center bg-base-300 rounded-md border-green-200"
            onClick={openNotification}
          >
            <div className="indicator">
              {/* ✅ Notification Count */}
              {noOfNotifications > 0 && (
                <span className="indicator-item badge badge-sm bg-red-500 text-white border-none">
                  {noOfNotifications}
                </span>
              )}
              <BellIcon className="h-6 w-6" />
            </div>
          </button>

          <label className="swap swap-rotate h-[45px] w-[45px] mx-1 bg-base-300 rounded-md border-none">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={currentTheme === "dark"}
              style={{}}
            />
            <SunIcon className="fill-current w-6 h-6 swap-off" />
            <MoonIcon className="fill-current w-6 h-6 swap-on" />
          </label>
          <div className="dropdown h-[45px] dropdown-end mx-1 w-[124px] bg-base-300 rounded-md border-green-200">
            <label tabIndex={0} className="">
              <div className="flex h-[100%] items-center justify-center flex-row cursor-pointer">
                <i className="text-[24px] ">
                  <LiaUserCircleSolid />
                </i>
                <h6 className=" font-medium text-xs pl-[5px] text-center">
                  {TruncateText(user.name, 9)}
                </h6>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-6 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="justify-between">
                <Link to={"/app/settings-profile"}>Profile Settings</Link>
              </li>
              <li>
                <Link onClick={openAddNewLeadModal}>Reset Password</Link>
              </li>
              <div className="divider mt-0 mb-0"></div>
              <li>
                <a onClick={logoutUser}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
