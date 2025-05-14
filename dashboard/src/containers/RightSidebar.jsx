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
import { getNotificationsbyId, markAllNotificationAsRead } from "../app/fetch";
import { setNotificationCount } from "../features/common/headerSlice";
import socket from "../Socket/socket.js";
import RequestDetails from "../features/Requests/RequestDetails.jsx";

function RightSidebar() {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, bodyType, extraObject, header } = useSelector(
    (state) => state.rightDrawer
  );
  const dispatch = useDispatch();

  const userId = extraObject?.id;



  const fetchNotifications = async (id) => {
    setLoading(true);
    try {
      const result = await getNotificationsbyId(id);
      setNotificationData(result?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
  }, [userId]);

  useEffect(() => {
    if (userId && bodyType === RIGHT_DRAWER_TYPES.NOTIFICATION) {
      setLoading(true);
      getNotificationsbyId(userId)
        .then((res) => setNotificationData(res?.notifications || []))
        .finally(() => setLoading(false));
    }
  }, [userId, bodyType]);

  useEffect(() => {
    if (!userId) return;

    const handleNewNotification = (payload) => {
      if (payload.userId !== userId) return; // only for this user

      // Option A: simply re‑fetch from server
      getNotificationsbyId(userId).then((res) => {
        setNotificationData(res?.notifications || []);
        dispatch(
          setNotificationCount(
            res?.notifications?.filter((n) => !n.isRead).length
          )
        );
      });
    };

    socket.on("role_created", handleNewNotification);
    // socket.on("user_created", handleNewNotification);
    socket.on("user_updated", handleNewNotification);
    socket.on("user_created", handleNewNotification);
    socket.on("user_updated", handleNewNotification)
    // …listen for any other events you emit

    return () => {
      socket.off("role_created", handleNewNotification);
      socket.off("user_updated", handleNewNotification);

      socket.off("user_created", handleNewNotification);
      socket.off("user_updated", handleNewNotification)

    };
  }, [userId, dispatch]);

  // =========================================================================

  // Fetch notifications
  // useEffect(() => {
  //   if (extraObject?.id && bodyType === RIGHT_DRAWER_TYPES.NOTIFICATION) {
  //     fetchNotifications(extraObject.id);
  //   }
  // }, [extraObject?.id, bodyType]);

  // useEffect(() => {
  //   if (userId) {
  //     setLoading(true);
  //     getNotificationsbyId(userId)
  //       .then((res) => {
  //         setNotificationData(res?.notifications || []);
  //       })
  //       .finally(() => setLoading(false));
  //   }
  // }, [userId]);

  const handleMarkAllAsRead = async (id) => {
    try {
      setLoading(true);
      await markAllNotificationAsRead(id);
      fetchNotifications(id); // refetch after marking read
      dispatch(setNotificationCount(0));
    } catch (err) {
      console.error("Error marking all as read", err);
    } finally {
      setLoading(false);
    }
  };

  const close = async (e) => {
    dispatch(closeRightDrawer(e));
    // await handleMarkAllAsRead(extraObject.id)
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
        className={`${bodyType === RIGHT_DRAWER_TYPES.RESOURCE_DETAILS
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

            {/* <p
              onClick={() => handleMarkAllAsRead(extraObject.id)}
              className="ml-auto text-sm cursor-pointer"
            >
              Mark all as read
            </p> */}

            {bodyType === RIGHT_DRAWER_TYPES.NOTIFICATION && (
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
                      // id={extraObject?.id}
                      // {...extraObject}
                      closeRightDrawer={close}
                      notifications={notificationData}
                      loading={loading}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.CALENDAR_EVENTS]: (
                    <CalendarEventsBodyRightDrawer
                      {...extraObject}
                      closeRightDrawer={close}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.RESOURCE_DETAILS]: (
                    // <CalendarEventsBodyRightDrawer
                    //   {...extraObject}
                    //   closeRightDrawer={close}
                    // />
                    <RequestDetails />
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
    </div>
  );
}

export default RightSidebar;
