import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect, useState } from "react"
import { removeNotificationMessage } from "../features/common/headerSlice"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"
import Header from "./Header"
import ResetPass from "./ResetPass"
import { updateUser } from "../features/common/userSlice"

// Layout Component
function Layout() {
  const dispatch = useDispatch();
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header);
  const [resetPass, setResetPass] = useState(false);

  const resetPassDisplay = () => setResetPass(prev => !prev);

  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success');
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error');
      dispatch(removeNotificationMessage());
    }
  }, [newNotificationMessage]);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    dispatch(updateUser(userObj));
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col">
      <ResetPass display={resetPass ? "block" : "hidden"} close={resetPassDisplay} />
      <Header openResetPass={resetPassDisplay} />

      {/* Main Content Layout */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-80 bg-base-200">
          <LeftSidebar />
        </div>

        {/* Page Content */}
        <div className="flex-grow overflow-y-auto">
          <PageContent />
        </div>

        {/* Optional Right Sidebar */}
        <div className="w-64 hidden">
          <RightSidebar />
        </div>
      </div>

      <NotificationContainer />
      <ModalLayout />
    </div>
  );
}

export default Layout;
