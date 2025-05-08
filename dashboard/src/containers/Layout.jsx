import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect } from "react"
import { removeNotificationMessage } from "../features/common/headerSlice"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"
import { updateCurrentRole, updateUser } from "../features/common/userSlice"


function Layout() {
  const dispatch = useDispatch()
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header)


  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success')
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error')
      dispatch(removeNotificationMessage())
    }
  }, [newNotificationMessage])

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    dispatch(updateUser(userObj));
    let roleId = localStorage.getItem("currentRole");
    if (roleId) {
      dispatch(updateCurrentRole(roleId))
    }
  }, [dispatch]);

  return (
    <>
      { /* Left drawer - containing page content and side bar (always open) */}
      <div className="flex h-[100vh]">
        <LeftSidebar />
        <PageContent />
      </div>

      { /* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />


      {/** Notification layout container */}
      <NotificationContainer />

      {/* Modal layout container */}
      <ModalLayout />

    </>
  )
}

export default Layout