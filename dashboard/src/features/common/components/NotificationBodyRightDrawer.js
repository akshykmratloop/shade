import { useEffect, useState } from "react";
import {
  getNotificationsbyId,
  markAllNotificationAsRead,
} from "../../../app/fetch";
import { setNotificationCount } from "../headerSlice";
import { useDispatch } from "react-redux";
import Paginations from "../../Component/Paginations";
import { useRef } from "react";

function NotificationBodyRightDrawer({ notifications = [], loading, onPageChange, onSearch, currentPage, totalPages, searchText }) {
  // const [notifications, setNotifications] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const result = await getNotificationsbyId(id);
  //       setNotifications(result?.notifications || []); // assuming API returns { notifications: [...]}
  //     } catch (error) {
  //       console.error("Failed to load notifications:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   if (id) fetchData();
  // }, [id]);



  // STATES FOR SEARCH AND PAGINATION
  const [localSearch, setLocalSearch] = useState("");
  const debounceTimer = useRef(null);

  // Initialize local search with prop value
  useEffect(() => {
    setLocalSearch(searchText);
  }, [searchText]);

  // Apply search with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (localSearch !== searchText) {
        onSearch(localSearch);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localSearch, onSearch, searchText]);

  const removeFilter = () => {
    setLocalSearch("");
    onSearch("");
  };


  function formatNotificationDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;

    const dateOptions = {
      month: "short",
      day: "numeric",
    };
    const day = new Intl.DateTimeFormat("en-US", dateOptions).format(date);

    return `${day} at ${time}`;
  }

  // console.log("Notifications: ", notifications);

  return (
    // <>
    //   {[...Array(15)].map((_, i) => {
    //     return (
    //       <div
    //         key={i}
    //         className={
    //           "grid mt-3 card bg-base-200 rounded-box p-3" +
    //           (i < 5 ? " bg-blue-100" : "")
    //         }
    //       >
    //         {i % 2 === 0
    //           ? `Your sales has increased by 30% yesterday`
    //           : `Total likes for instagram post - New launch this week,  has crossed 100k `}
    //       </div>
    //     );
    //   })}
    // </>
    <div className="min-h-[45rem] flex flex-col justify-between">

      {/* ADDED SEARCH BAR */}
      <div className="mb-4 inline-block w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1">
        <input
          type="text"
          placeholder="Search notifications..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="flex-1 input input-sm border-none bg-transparent"
        />
        {localSearch && (
          <button
            onClick={removeFilter}
            className="btn btn-xs btn-active btn-ghost normal-case"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            {localSearch ? "No notifications found" : "No notifications available"}
          </div>
        )}

        {/* NOTIFICATIONS LIST */}
        {!loading && notifications.length > 0 && notifications.map((notif, i) => (
          <div key={i} className="relative">
            {/* 🔵 Blue dot for unread */}
            {!notif.isRead && (
              <div className="absolute top-[1.3rem] left-[-0.25rem] w-[7px] h-[7px] bg-[#25439B] rounded-full" />
            )}
            <div
              className={
                "grid mt-3 p-3 font-medium text-[16px]"
                // + (i < 5 ? " bg-blue-100" : "")
              }
            >
              {notif.message || notif.text || "No message"}
            </div>

            <div className="font-normal text-[#A5ACB8] text-[13px] px-3">
              {formatNotificationDate(notif.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION AT BOTTOM */}
      <div className="mt-auto">
        {totalPages > 1 && (
          <Paginations
            data={notifications}
            currentPage={currentPage}
            setCurrentPage={onPageChange}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default NotificationBodyRightDrawer;
