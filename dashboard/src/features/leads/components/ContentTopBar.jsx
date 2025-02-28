import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { FiTablet } from "react-icons/fi";
import { FiSmartphone } from "react-icons/fi";
import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

export default function ContentTopBar() {
    const iconSize = 'h-6 w-[1.75rem]'

    return (
        <div className='flex'>
            <div className='flex text-[#64748B] items-center'>
                <span className='text-[black]'><FaArrowLeftLong className={`${iconSize}`} /></span>
                <div className='flex'>
                    <span className=''><MdOutlineDesktopWindows className={`w-[2.2rem] h-[1.7rem]`} /></span>
                    <span className=''><FiTablet className={`${iconSize}`} /></span>
                    <span className=''><FiSmartphone className={`${iconSize}`} /></span>
                </div>
            </div>

            <div>
                <div className='flex border-r border-[#64748B]'>
                    <span><GrUndo className={`${iconSize}`} /></span>
                    <span><GrRedo className={`${iconSize}`} /></span>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}