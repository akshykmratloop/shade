import React from 'react'
import Select from '../../../components/Input/Select'
import SelectorAccordion from './SelectorAccordion'

const ConfigBar = () => {

    return (
        <div className='fixed z-20 top-0 left-0 w-[100vw] h-screen bg-[black] bg-opacity-50'>
            <div className='fixed p-[42px] z-30 top-0 right-0 w-[32rem] h-screen bg-[white] shadow-xl-custom rounded-tl-3xl rounded-bl-3xl'>
                <h1 className='font-medium text-[1.1rem]'>Assign User</h1>
                <form action="" className='mt-5 flex flex-col justify-between h-[93%]'>
                    <div className=''>

                        {/* selected page/content */}
                        <input
                            type="text"
                            className="input px-3 rounded-md w-[27rem] h-[2.5rem] outline-none disabled:pointer-events-none disabled:cursor-text"
                            value="default"
                            disabled
                        />

                        {/* select manager */}
                        <Select
                            baseClass={"mt-4"}
                            label={"Select Manager"}
                            labelClass={"font-[400] text-[#6B7888] text-[14px]"}
                            inputClass={"px-2 border-1 border border-stone-300 w-[27rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"}
                        />

                        {/* select editor */}
                        <Select
                            baseClass={"mt-4"}
                            label={"Select Editor"}
                            labelClass={"font-[400] text-[#6B7888] text-[14px] "}
                            inputClass={"px-2 border-1 border border-stone-300 w-[27rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"}
                        />

                        <SelectorAccordion />

                        <Select
                            baseClass={"mt-4"}
                            label={"Select Publisher"}
                            labelClass={"font-[400] text-[#6B7888] text-[14px] "}
                            inputClass={"px-2 border-1 border border-stone-300 w-[27rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"}
                        />
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button className='btn w-[8rem]'>Cancel</button>
                        <button className='btn w-[8rem]'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfigBar