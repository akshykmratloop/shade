import { themeChange } from "theme-change";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { LiaUserCircleSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { openModal } from "../features/common/modalSlice";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import SearchBar from "../components/Input/SearchBar";
import { getNotificationsbyId } from "../app/fetch";
import { setNotificationCount } from "../features/common/headerSlice";
import socket from "../Socket/socket";
import capitalizeWords, { TruncateText } from "../app/capitalizeword";
import { updateActiveRole, updateUser } from "../features/common/userSlice";
import { FaCaretDown } from "react-icons/fa";

function Header() {
  // state
  const [greetings, setGreetings] = useState("Good Morning");
  const [openList, setOpenList] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);

  // redux state
  const userObj = useSelector((state) => state.user);
  const { noOfNotifications } = useSelector((state) => state.header);
  const { user, activeRole } = userObj;
  const {isSuperUser } = user

  // ref
  const listRef = useRef(null);

  // variables
  const oneRoleOnly = user.roles?.length <= 1;
  const userId = user.id;

  //=========================================================================
  // functions
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    let theme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", theme);
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

  const switchRole = (id) => {
    if (activeRole.role === id) return;
    // Switch Role
    localStorage.setItem("activeRole", id);
    // dispatch(updateCurrentRole(id))
    navigate(0);
  };

  //=========================================================================

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (listRef.current && !listRef.current.contains(e.target)) {
        setOpenList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    const handleUserUpdate = async (response) => {
      if (response.result?.status === "INACTIVE") {
        return logoutUser();
      }

      // let roles = response.result?.roles?.filter((e) => e.status === "ACTIVE");

      const userObj = response.result
      // console.log("userObj", userObj);

      dispatch(updateUser({ data: userObj, type: "update" }));
      localStorage.setItem("user", JSON.stringify(userObj));
    };

    socket.on("role_created", handleNew);
    socket.on("user_created", handleNew);
    socket.on("user_updated", handleNew);
    socket.on("userUpdated", handleUserUpdate);
    // socket.on("user_updated", handleNew);
    // …listen to any other event names you emit

    // …listen to any other event names you emit

    return () => {
      socket.off("role_created", handleNew);
      socket.off("user_updated", handleNew);
      socket.off("user_created", handleNew);
      socket.off("userUpdated", handleUserUpdate);
      // socket.off("user_updated", handleNew);
    };
  }, [userId, dispatch]);

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
          <div className="flex gap-2 items-center">
            <h2 className="font-semibold">Hello {user?.name}</h2>
            {/* <select name="" id=""
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent select text-sm py-0 w-[10vw] border dark:border-stone-500 border-stone-500/30">
              {user.roles?.map((e,i) => {
                return (
                  <option value={e.role} key={i} className="bg-transparent text-xs py-0 rounded-sm">{e.role?.replace?.("_", " ")}</option>
                )
              })}
            </select> */}
          </div>
          <p className="text-base-700 font-light font-lexend text-[grey]">
            {greetings}
          </p>
        </div>
        <div className="order-last w-[50%] gap-[12px]">
          {/* <SearchBar
            setSearchText={() => { }}
            styleClass={
              "bg-transparent border border-stone-300 dark:border-stone-600"
            }
          /> */}
          {/* <button
            className="h-[45px] w-[45px] mx-1 flex items-center justify-center bg-base-300 rounded-md border-green-200"
            onClick={openNotification}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
            </div>
          </button> */}
          <div
            className="mx-1 w-[20vw] p-0 self-stretch flex gap-[6px] items-center rounded-md relative cursor-pointer "
            onClick={() => {
              setOpenList(!openList);
            }}
            title={capitalizeWords(activeRole?.role) || "No role is assigned"}
          >
            <div
              className="py-1 px-[4px] pl-[6px] text-[14px] h-full flex items-center font-[600] rounded-[5px_0px_0px_5px]"
              onClick={() => {
                if (!oneRoleOnly) return;
                setOpenList(!openList);
              }}
            >
              Role
            </div>
            <label
              className={`flex items-center ${oneRoleOnly ? "justify-center" : "justify-between"
                } cursor-pointer w-full bg-base-300 py-1 px-[6px] h-full rounded-md`}
              // style={{ justifyItems: oneRoleOnly ? "center" : ""}}
              onClick={() => {
                setOpenList(!openList);
              }}
            >
              <div
                className="flex h-[100%] items-center justify-center flex-row text-[clamp(10px,1.7vh,2rem)]"
                style={{ whiteSpace: "" }}
              >
                {TruncateText(capitalizeWords(activeRole?.role), 20) ||
                  "No role is assigned"}
              </div>
              {!oneRoleOnly && (
                <span>
                  <FaCaretDown strokeWidth={0.5} />
                </span>
              )}
            </label>
            {!oneRoleOnly && (
              <ul
                ref={listRef}
                className="dropdown-content w-[90%]
                mt-1 left-[18%] top-[100%] 
                dark:border dark:border-stone-300/20 
                dark:shadow-md dark:shadow-stone-800 
                absolute z-[30] p-2 shadow bg-base-100 
                rounded-md flex flex-col gap-1"
                style={{ display: openList ? "flex" : "none", whiteSpace: "pre" }}
              >
                {user.roles?.map((e, i) => {
                  return (
                    <li
                      onClick={() => {
                        console.log(e.role);
                        switchRole(e.role);
                        setOpenList(false);
                      }}
                      value={e.role}
                      key={i}
                      title={e.role?.replace?.("_", " ")}
                      className="bg-transparent text-sm 
                      font-[300] cursor-pointer px-2 py-1 
                      rounded-sm hover:bg-[#e5e6e6] 
                      dark:hover:bg-stone-200/10"
                    >
                      {TruncateText(capitalizeWords(e.role), 25)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
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
          <div className="dropdown h-[45px] dropdown-end mx-1 w-[33%] px-2 bg-base-300 rounded-md border-green-200">
            <label tabIndex={0} className="">
              <div className="flex h-[100%] items-center justify-center flex-row cursor-pointer">
                <i className="text-[24px] ">
                  <LiaUserCircleSolid />
                </i>
                <h6 className=" font-medium text-xs pl-[5px] text-center">
                  {capitalizeWords(user.name)}
                </h6>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-1 p-2 shadow dark:border dark:border-stone-300/20 dark:shadow-md dark:shadow-stone-800 bg-base-100 rounded-box w-52"
            >
              {
                !isSuperUser &&
                <li className="justify-between">
                  <Link to={"/app/settings-profile"}>Profile Settings</Link>
                </li>
              }
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
