import React, { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { FiTablet, FiSmartphone } from "react-icons/fi";
import { GrUndo, GrRedo } from "react-icons/gr";
import { RiShareForward2Fill } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import Button from '../../../components/Button/Button';
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { redo, undo } from '../../common/homeContentSlice';


export default function ContentTopBar({ setWidth }) {
    const dispatch = useDispatch();
    const iconSize = 'xl:h-[1.5rem] xl:w-[1.5rem]';
    const smallIconSize = 'sm:h-[1rem] sm:w-[1rem]';
    const [selectedDevice, setSelectedDevice] = useState("Desktop");
    const [menuOpen, setMenuOpen] = useState(false);
    const ReduxState = useSelector(state => state.homeContent)

    const deviceIcons = [
        { icon: <MdOutlineDesktopWindows />, label: 'Desktop', width: 1180 },
        { icon: <FiTablet />, label: 'Tablet', width: 768 },
        { icon: <FiSmartphone />, label: 'Phone', width: 425 }
    ];

    const handleDeviceChange = (device) => {
        setSelectedDevice(device.label);
        setWidth(device.width); // Set width based on device
    };

    const undos = () => {
        dispatch(undo());
    };

    const redos = () => {
        dispatch(redo());
    };

    return (
        <div className='flex justify-between gap-2 items-center xl:px-[2.36rem] xl:py-[1.2rem] sm:px-[.8rem] sm:py-[.5rem] lg:px-[.8rem] bg-[#fafaff] dark:bg-[#242933]'>
            <div className='flex items-center gap-2'>
                <span className='text-[black] dark:text-[#fafaff] flex items-center'>
                    <FaArrowLeftLong className={`h-[1.25rem] w-[1.19rem]`} />
                </span>
                <div className='xl:flex lg:flex hidden gap-1 items-center'>
                    {deviceIcons.map((device, index) => (
                        <span
                            key={index}
                            className={`cursor-pointer ${selectedDevice === device.label ? 'bg-[#29469D] text-white rounded-md p-1' : ''}`}
                            onClick={() => handleDeviceChange(device)}
                        >
                            {React.cloneElement(device.icon, { className: `${iconSize} ${smallIconSize}` })}
                        </span>
                    ))}
                </div>
                <div className='sm:block lg:hidden xl:hidden relative'>
                    <button onClick={() => setMenuOpen(!menuOpen)} className='flex items-center gap-1'>
                        {React.cloneElement(deviceIcons.find(d => d.label === selectedDevice).icon, { className: `${iconSize} ${smallIconSize}` })}
                    </button>
                    {menuOpen && (
                        <div className='absolute left-0 mt-2 w-32 bg-white dark:bg-[#242933] shadow-lg rounded-md overflow-hidden z-50'>
                            {deviceIcons.map((device, index) => (
                                <button
                                    key={index}
                                    className={`flex gap-1 items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedDevice === device.label ? 'bg-[#29469D] text-white' : ''}`}
                                    onClick={() => { handleDeviceChange(device); setMenuOpen(false); }}
                                >
                                    {device.icon} {device.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center gap-3 text-[#CBD5E1] md:flex-row'>
                <div className='flex items-center gap-3'>
                    <div className='flex gap-2 border-r border-[#64748B] pr-2'>
                        <span className={`cursor-pointer`} onClick={undos}><GrUndo className={`${iconSize} ${smallIconSize} hover:text-[#64748B] ${ReduxState.past.length>1&&"text-[black]"}`} /></span>
                        <span className={`cursor-pointer`} onClick={redos}><GrRedo className={`${iconSize} ${smallIconSize} hover:text-[#64748B] ${ReduxState.future.length>=1&&"text-[black]"}`} /></span>
                    </div>
                    <div className='flex gap-2 border-r border-[#64748B] pr-2'>
                        <span className={`cursor-pointer`}><RiShareForward2Fill className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                        <span className={`cursor-pointer`}><LuEye className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                    </div>
                </div>
                <div className='flex gap-3 sm:gap-1'>
                    <button className='flex justify-center items-center gap-1 bg-[#FF0000] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]'>
                        <RxCross1 /> Reject
                    </button>
                    <Button text={'Draft'} classes='bg-[#26345C] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                    <Button text={'Submit'} classes='bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                </div>
            </div>
        </div>
    );
}
