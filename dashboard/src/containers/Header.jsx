import { themeChange } from 'theme-change'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'
import { LiaUserCircleSolid } from "react-icons/lia";
import { Link } from 'react-router-dom'
import { openModal } from "../features/common/modalSlice"
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import SearchBar from '../components/Input/SearchBar'

function Header() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const { noOfNotifications } = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(null);
    const [greetings, setGreetings] = useState("Good Morning");

    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Notifications", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }))
    }

    function logoutUser() {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.location.href = '/'
    }

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Reset Your Password", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }))
    }

    const toggleTheme = () => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
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

    return (
        <div className='py-4 px-2 pr-4'>
            <div className="navbar py-[20px] rounded-lg flex justify-between bg-[#fafaff] dark:bg-[#242933] z-10 pl-[15px] pr-[15px] ">
                <div className="sm:block xl:hidden"></div>
                <div className=" flex-col items-start sm:hidden xl:flex font-lexend">
                    <h2 className='font-semibold'>Hello {user?.name} {`(${user?.roles[0]?.replace("_", " ")})`}</h2>
                    <p className='text-base-700 font-light font-lexend text-[grey]'>{greetings}</p>
                </div>
                <div className="order-last gap-[12px]">
                    <SearchBar setSearchText={() => {}} styleClass={"bg-transparent border border-stone-300 dark:border-stone-600"} />
                    <button className="h-[45px] w-[45px] mx-1 flex items-center justify-center bg-base-300 rounded-md border-green-200" onClick={openNotification}>
                        <div className="indicator">
                            <BellIcon className="h-6 w-6" />
                        </div>
                    </button>
                    <label className="swap swap-rotate h-[45px] w-[45px] mx-1 bg-base-300 rounded-md border-none">
                        <input type="checkbox" onChange={toggleTheme} checked={currentTheme === "dark"} style={{}} />
                        <SunIcon className="fill-current w-6 h-6 swap-off" />
                        <MoonIcon className="fill-current w-6 h-6 swap-on" />
                    </label>
                    <div className="dropdown h-[45px] dropdown-end mx-1 w-[124px] bg-base-300 rounded-md border-green-200">
                        <label tabIndex={0} className="">
                            <div className="flex h-[100%] items-center justify-center flex-row cursor-pointer">
                                <i className='text-[24px] '><LiaUserCircleSolid /></i>
                                <h6 className=' font-medium text-xs pl-[5px] text-center'>Super Admin</h6>
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-6 p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="justify-between">
                                <Link to={'/app/settings-profile'}>Profile Settings</Link>
                            </li>
                            <li><Link onClick={openAddNewLeadModal}>Reset Password</Link></li>
                            <div className="divider mt-0 mb-0"></div>
                            <li><a onClick={logoutUser}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;