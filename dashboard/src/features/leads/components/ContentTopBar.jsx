import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { FiTablet } from "react-icons/fi";
import { FiSmartphone } from "react-icons/fi";
import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";
import { RiShareForward2Fill } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import Button from '../../../components/Button/Button';
import { RxCross1 } from "react-icons/rx";

export default function ContentTopBar() {
    const iconSize = 'xl:h-[1.5rem] xl:w-[1.5rem]';
    const smallIconSize = 'sm:h-[1rem] sm:w-[1rem]';

    return (
        <div className='flex justify-between items-center xl:px-[2.36rem] xl:py-[1.5rem] sm:px-[.8rem] sm:py-[.2rem] lg:px-[.8rem] bg-[#fafaff] dark:bg-[#242933]'>
            <div className='flex items-center gap-2'>
                <span className='text-[black] flex items-center'><FaArrowLeftLong className={`h-[1.25rem] w-[1.19rem]`} /></span>
                <div className='flex gap-1 items-center'>
                    <span className=''><MdOutlineDesktopWindows className={`xl:w-[2.2rem] xl:h-[1.7rem] sm:w-[1rem] sm:h-[1rem] hover:text-[#64748B]`} /></span>
                    <span className=''><FiTablet className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                    <span className=''><FiSmartphone className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                </div>
            </div>

            <div className='flex items-center gap-3 text-[#CBD5E1] sm:flex-col-reverse md:flex-row'>
                <div className='flex items-center gap-3'>
                    <div className='flex gap-2 border-r border-[#64748B] pr-2'>
                        <span><GrUndo className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                        <span><GrRedo className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                    </div>
                    <div className='flex gap-2 border-r border-[#64748B] pr-2'>
                        <span><RiShareForward2Fill className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                        <span><LuEye className={`${iconSize} ${smallIconSize} hover:text-[#64748B]`} /></span>
                    </div>
                </div>
                <div className='flex gap-3 sm:gap-1'>
                    <button className={`flex justify-center items-center gap-1 bg-[#FF0000] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`}>
                        <RxCross1 /> Reject
                    </button>
                    <Button text={"Draft"} classes={`bg-[#26345C] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`} />
                    <Button text={"Submit"} classes={`bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`} />
                </div>
            </div>
        </div>
    )
}