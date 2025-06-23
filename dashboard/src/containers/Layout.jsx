import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect, useState } from "react"
import { removeNotificationMessage, incrementNotificationCount } from "../features/common/headerSlice"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"
import { updateActiveRole, updateUser } from "../features/common/userSlice"
import socket from "../Socket/socket.js"
import { toast } from "react-toastify"
import { setNotificationCount } from "../features/common/headerSlice"
import { getNotificationsbyId } from "../app/fetch";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";


function Layout() {
  const dispatch = useDispatch()
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header)
  const { isOpen, bodyType, extraObject } = useSelector(state => state.rightDrawer);

  // Global notification state
  const [notificationData, setNotificationData] = useState([])
  const [notificationCount, setNotificationCountLocal] = useState(0)

  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success')
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error')
      dispatch(removeNotificationMessage())
    }
  }, [newNotificationMessage])

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    if (userObj) {
      dispatch(updateUser({ data: userObj, type: "switch", }));
    }
    let roleId = localStorage.getItem("activeRole");
    if (roleId) {
      dispatch(updateActiveRole(roleId))
    }
  }, [dispatch]);

  useEffect(() => {
    // List all event names your backend emits for notifications
    const notificationEvents = [
      "role_created",
      "role_updated",
      "user_created",
      "user_updated",
      "user_profile_updated",
      "resource_assigned_manager",
      "resource_assigned_editor",
      "resource_assigned_publisher",
      "resource_assigned_verifier_stage_1",
      "resource_assigned_verifier_stage_2",
      "resource_approve",
      "resource_reject",
      "resource_schedule",
    ];

    const handleNewNotification = (payload) => {
      // toast(payload.message, { autoClose: 3000, hideProgressBar: false });
      setNotificationData((prev) => [payload, ...prev]);
      setNotificationCountLocal((prev) => prev + 1);
      dispatch(incrementNotificationCount());
    };

    notificationEvents.forEach(event => {
      socket.on(event, handleNewNotification);
    });

    return () => {
      notificationEvents.forEach(event => {
        socket.off(event, handleNewNotification);
      });
    };
  }, [dispatch]);

  useEffect(() => {
    // Fetch notifications from API when sidebar is opened and is of type NOTIFICATION
    const fetchNotifications = async () => {
      if (isOpen && bodyType === RIGHT_DRAWER_TYPES.NOTIFICATION && extraObject?.id) {
        const result = await getNotificationsbyId(extraObject.id, 1, "");
        if (result?.data?.notifications) {
          setNotificationData(result.data.notifications);
        }
      }
    };
    fetchNotifications();
  }, [isOpen, bodyType, extraObject]);

  return (
    <>
      { /* Left drawer - containing page content and side bar (always open) */}
      <div className="flex h-[100vh]">
        <LeftSidebar />
        <PageContent />
      </div>

      { /* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar 
        notificationData={notificationData} 
        notificationCount={notificationCount} 
        setNotificationData={setNotificationData}
        setNotificationCountLocal={setNotificationCountLocal}
      />


      {/** Notification layout container */}
      <NotificationContainer />

      {/* Modal layout container */}
      <ModalLayout />

    </>
  )
}

export default Layout