import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect, useState } from "react"
import  {  removeNotificationMessage } from "../features/common/headerSlice"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"
import Header from "./Header"
import ResetPass from "./ResetPass"


function Layout(){
  const dispatch = useDispatch()
  const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)
  const [resetPass, setResetPass] = useState(false);

  const resetPassDisplay = () => setResetPass(prev => !prev)


  useEffect(() => {
      if(newNotificationMessage !== ""){
          if(newNotificationStatus === 1)NotificationManager.success(newNotificationMessage, 'Success')
          if(newNotificationStatus === 0)NotificationManager.error( newNotificationMessage, 'Error')
          dispatch(removeNotificationMessage())
      }
  }, [newNotificationMessage])

    return(
      <div className="relative">
        <ResetPass display={resetPass?"block":"hidden"} close={resetPassDisplay} />
        { /* Left drawer - containing page content and side bar (always open) */ }
        <Header openResetPass={resetPassDisplay} />
        <div className="drawer drawer-mobile">
            <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            <PageContent/>
            <LeftSidebar />
        </div>

        { /* Right drawer - containing secondary content like notifications list etc.. */ }
        <RightSidebar />


        {/** Notification layout container */}
        <NotificationContainer />

      {/* Modal layout container */}
        <ModalLayout />
      </div>
    )
}

export default Layout