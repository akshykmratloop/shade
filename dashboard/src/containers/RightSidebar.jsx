import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { useDispatch, useSelector } from "react-redux";
import NotificationBodyRightDrawer from "../features/common/components/NotificationBodyRightDrawer";
import {
  closeRightDrawer,
  openRightDrawer,
} from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import CalendarEventsBodyRightDrawer from "../features/calendar/CalendarEventsBodyRightDrawer";
import { useCallback, useEffect, useState } from "react";
import { deleteNotifications, getNotificationsbyId, markAllNotificationAsRead } from "../app/fetch";
import { setNotificationCount, incrementNotificationCount } from "../features/common/headerSlice";
import socket from "../Socket/socket.js";
import RequestDetails from "../features/Requests/RequestDetails.jsx";
import VersionDetails from "../features/Resources/VersionDetails.jsx";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";
import { toast } from "react-toastify";

function RightSidebar({ notificationData = [], notificationMeta = { totalPages: 1, page: 1 }, notificationCount = 0, setNotificationData, setNotificationMeta, setNotificationCountLocal }) {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { isOpen, bodyType, extraObject, header } = useSelector(
    (state) => state.rightDrawer
  );
  const dispatch = useDispatch();

  const userId = extraObject?.id;
  const lastFetchedParams = useRef({ page: 0, search: "" });

  const fetchNotifications = async (id, page, search = "") => {
    if (
      lastFetchedParams.current.page === page &&
      lastFetchedParams.current.search === search
    ) {
      return;
    }

    lastFetchedParams.current = { page, search };

    setLoading(true);
    try {
      const result = await getNotificationsbyId(id, page, search);
      if (result?.data) {
        setNotificationData(result.data.notifications);
        setNotificationMeta({
          totalPages: result.data.totalPages,
          page: result.data.page,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async (id) => {
    try {
      setLoading(true);
      await markAllNotificationAsRead(id);
      fetchNotifications(id, notificationMeta.page, searchText); // refetch after marking read
      dispatch(setNotificationCount(0));
    } catch (err) {
      console.error("Error marking all as read", err);
    } finally {
      setLoading(false);
    }
  };

  const close = async (e) => {
    dispatch(closeRightDrawer(e));
  };

  const handlePageChange = (newPage) => {
    fetchNotifications(userId, newPage, searchText);
  };

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    fetchNotifications(userId, 1, searchValue);
  };

  const clearNotifications = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      await deleteNotifications(userId);
      if (setNotificationData) setNotificationData([]);
      if (setNotificationCountLocal) setNotificationCountLocal(0);
      setNotificationMeta({
        totalPages: 1,
        page: 1,
      });
      dispatch(setNotificationCount(0));
    } catch (e) {
      console.error("Error while deleting notifications:", e);
      // Optionally show error to user
    }
  };

  return (
    <div
      className={
        " fixed overflow-hidden z-[41] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={`${
          bodyType === RIGHT_DRAWER_TYPES.RESOURCE_DETAILS ||
          bodyType === RIGHT_DRAWER_TYPES.VERSION_DETAILS
            ? "w-[34rem]"
            : "w-80 md:w-96"
        }
          right-0 absolute bg-base-100 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
      >
        <div className="relative pb-5 flex flex-col h-full">
          {/* Header */}
          <div className="navbar   flex pl-4 pr-4  ">
            <button
              className="float-left btn btn-circle btn-outline btn-sm mr-2"
              onClick={() => close()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold text-l">{header}</span>

            {bodyType === RIGHT_DRAWER_TYPES.NOTIFICATION && notificationData?.length > 0 &&  (
              <p
                onClick={() => handleMarkAllAsRead(extraObject.id)}
                className="ml-auto text-sm cursor-pointer"
              >
                Mark all as read
              </p>
            )}
          </div>

          {/* ------------------ Content Start ------------------ */}
          <div className="overflow-y-scroll customscroller pl-4 pr-4 grow-[1]">
            <div className="flex flex-col w-full">
              {/* Loading drawer body according to different drawer type */}
              {
                {
                  [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
                    <NotificationBodyRightDrawer
                      notifications={notificationData}
                      loading={loading}
                      onPageChange={handlePageChange}
                      onSearch={handleSearch}
                      currentPage={notificationMeta.page}
                      totalPages={notificationMeta.totalPages}
                      searchText={searchText}
                      clearNotifications={clearNotifications}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.CALENDAR_EVENTS]: (
                    <CalendarEventsBodyRightDrawer
                      {...extraObject}
                      closeRightDrawer={close}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.RESOURCE_DETAILS]: (
                    <RequestDetails />
                  ),
                  [RIGHT_DRAWER_TYPES.VERSION_DETAILS]: (
                    <VersionDetails close={close} />
                  ),

                  [RIGHT_DRAWER_TYPES.DEFAULT]: <div></div>,
                }[bodyType]
              }
            </div>
          </div>
          {/* ------------------ Content End ------------------ */}
        </div>
      </section>

      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => close()}
      ></section>
      <ToastContainer />
    </div>
  );
}

export default RightSidebar;
