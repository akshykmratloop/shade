import {useEffect, useState} from "react";
import {
  getNotificationsbyId,
  markAllNotificationAsRead,
} from "../../../app/fetch";
import {setNotificationCount} from "../headerSlice";
import {useDispatch} from "react-redux";

function NotificationBodyRightDrawer({notifications = [], loading}) {
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

  console.log("Notifications: ", notifications);

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
    <div className="">
    
      {notifications.map((notif, i) => (
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
  );
}

export default NotificationBodyRightDrawer;
