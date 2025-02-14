import { themeChange } from 'theme-change'
import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'
import { LiaUserCircleSolid  } from "react-icons/lia";
import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'
import { openModal } from "../features/common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../utils/globalConstantUtil'


function Header(){

    const dispatch = useDispatch()
    const {noOfNotifications, pageTitle} = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
      }, [])


    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({header : "Notifications", bodyType : RIGHT_DRAWER_TYPES.NOTIFICATION}))
    }


    function logoutUser(){
        localStorage.clear();
        window.location.href = '/'
    }

    const openAddNewLeadModal = () => {
        dispatch(openModal({title : "Reset Your Password", bodyType : MODAL_BODY_TYPES.LEAD_ADD_NEW}))
    }


    return(
        <>
            <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md pl-[15px] pr-[15px] ">


                {/* Menu toogle for mobile view or small screen */}
                <div className="">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5"/></label>
                    {/* <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1> */}
                </div>

                

            <div className="order-last gap-[5px]">

                {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}
                
                {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}


            {/* Light and dark theme selection toogle **/}
            <label className="swap h-[35px] w-[35px] mx-1   hover:bg-base-300 rounded-md border-green-200">
                <input type="checkbox"/>
                <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
            </label>


                {/* Notification icon */}
                <button className="h-[35px] w-[35px] mx-1 flex items-center justify-center  hover:bg-base-300 rounded-md border-green-200" onClick={() => openNotification()}>
                    <div className="indicator">
                        <BellIcon className="h-6 w-6"/>
                        {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null }
                    </div>
                </button>


                {/* Profile icon, opening menu on click */}
                <div className="dropdown h-[35px] dropdown-end mx-1 w-[110px]  hover:bg-base-300  rounded-md border-green-200  ">
                    <label tabIndex={0} className="">
                    <div className="flex h-[100%] items-center justify-center flex-row cursor-pointer">
                        <i className='text-[24px] '><LiaUserCircleSolid  /></i>
                        <h6 className=' font-medium text-xs pl-[5px] text-center'>Super Admin</h6>
                    </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-6 p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="justify-between">
                        <Link to={'/app/settings-profile'}>
                            Profile Settings
                            {/* <span className="badge">Super Admin</span> */}
                            </Link>
                        </li>
                        <li className=''><Link onClick={()=>openAddNewLeadModal()}>Reset Password</Link></li>
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={logoutUser}>Logout</a></li>
                    </ul>
                </div>
            </div>
            
            </div>

        </>
    )
}

export default Header