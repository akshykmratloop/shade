//libraries
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';
// modules
import Button from '../../../../components/Button/Button';
import { redo, undo } from '../../../common/homeContentSlice';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { saveInitialContentValue } from '../../../common/InitialContentSlice';
import { submitings } from '../../../common/homeContentSlice';
import transformContent, { baseTransform } from '../../../../app/convertContent';
import { addResource, generateRequest, publishContent, updateContent } from '../../../../app/fetch';
import Popups from './Popups';
import formatTimestamp from '../../../../app/TimeFormat';
import capitalizeWords from '../../../../app/capitalizeword';
//icons
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { FiTablet, FiSmartphone } from "react-icons/fi";
import { GrUndo, GrRedo } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
// import { RxCross1 } from "react-icons/rx";
import { Switch } from '@headlessui/react';



export default function ContentTopBar({ setWidth, setFullScreen, outOfEditing, contentStatus }) {
    // states
    const [selectedDevice, setSelectedDevice] = useState("Desktop");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isChanged, setIsChanged] = useState(false)
    const [savedChanges, setSavedChanges] = useState(false)
    const [autoSave, setAutoSave] = useState(JSON.parse(localStorage.getItem("autoSave")))
    const [info, setInfo] = useState(false)
    const [PopUpPublish, setPopupPublish] = useState(false)
    const [PopupSubmit, setPopupSubmit] = useState(false)

    // redux state
    const ReduxState = useSelector(state => state.homeContent)
    const savedInitialState = useSelector(state => state.InitialContentValue.InitialValue)
    const isManager = useSelector(state => state.user.isManager)

    // refs
    const infoRef = useRef(null)
    const infoIconRef = useRef(null); // Create a new ref for the info icon

    // variables
    const iconSize = 'xl:h-[1.5rem] xl:w-[1.5rem]';
    const smallIconSize = 'sm:h-[1rem] sm:w-[1rem]';
    const lastUpdate = formatTimestamp(ReduxState.present?.content?.editVersion?.updatedAt)
    const status = capitalizeWords(ReduxState.present?.content?.editVersion?.status)
    const EditingIsLive = ReduxState.EditInitiated

    const deviceIcons = [
        { icon: <MdOutlineDesktopWindows />, label: 'Desktop', width: 1180 },
        { icon: <FiTablet />, label: 'Tablet', width: 768 },
        { icon: <FiSmartphone />, label: 'Phone', width: 425 }
    ];

    // functions
    const dispatch = useDispatch();
    const navigate = useNavigate()

    function autoSaveToggle() {
        setAutoSave(prev => {
            if (prev) {
                return false
            } else return true
        })

    }

    async function saveTheDraft(isToastify = true) {
        const paylaod = transformContent(ReduxState.present.content)

        dispatch(saveInitialContentValue(ReduxState.present.content))
        setSavedChanges(true)
        try {
            const response = await updateContent(paylaod)
            if (response.ok) {
                if (isToastify) {
                    toast.success("Changes has been saved", {
                        style: { backgroundColor: "#187e3d", color: "white" },
                        autoClose: 1000, // Closes after 1 second
                        pauseOnHover: false, // Does not pause on hover
                    })
                }
            } else {
                throw new Error(response.message)
            }
        } catch (err) {
            toast.error(err, {
                style: { backgroundColor: "#187e3d", color: "white" },
                autoClose: 1000, // Closes after 1 second
                pauseOnHover: false, // Does not pause on hover
            })
        }
    }

    async function handleSubmit() {
        const paylaod = transformContent(ReduxState.present.content)

        try {
            const response = await generateRequest(paylaod)
            if (response.ok) {
                dispatch(submitings())
                toast.success("Changes has been saved", {
                    style: { backgroundColor: "#187e3d", color: "white" },
                    autoClose: 1000, // Closes after 1 second
                    pauseOnHover: false, // Does not pause on hover
                })
                setTimeout(() => {
                    navigate(-1);
                    // navigate(0)
                }, 750)
            } else {
                throw new Error(response.message)
            }
        } catch (err) {
            toast.error(err, {
                style: { backgroundColor: "#187e3d", color: "white" },
                autoClose: 1000, // Closes after 1 second
                pauseOnHover: false, // Does not pause on hover
            })
        }
    }

    async function HandlepublishToLive() {
        if (!isManager) return toast.error("You are not allowed to publish the content directly!", { autoClose: 600 })
        const payload = transformContent(ReduxState.present.content)
        try {
            const response = await publishContent(payload)
            if (response.message === "Success") {
                dispatch(submitings())
                toast.success("Changes have been published", {
                    style: { backgroundColor: "#187e3d", color: "white" },
                    autoClose: 1000, // Closes after 1 second
                    pauseOnHover: false, // Does not pause on hover
                })
                setTimeout(() => {
                    navigate(-1)
                }, 650)
            } else {
                throw new Error(response.message)
            }
        } catch (err) {
            toast.error(err, {
                style: { backgroundColor: "#187e3d", color: "white" },
                autoClose: 1000, // Closes after 1 second
                pauseOnHover: false, // Does not pause on hover
            })
        }
    }

    async function PublishNewPage() {
        if (!isManager) return toast.error("You are not allowed to publish the content directly!", { autoClose: 600 })
        const payload = baseTransform(ReduxState.present.content, ReduxState.filters)
        console.log(payload)
        try {
            const response = await addResource(payload)
            if (response.message === "Success") {
                dispatch(submitings())
                toast.success("New Page has been created", {
                    style: { backgroundColor: "#187e3d", color: "white" },
                    autoClose: 1000, // Closes after 1 second
                    pauseOnHover: false, // Does not pause on hover
                })
                setTimeout(() => {
                    navigate(-1)
                }, 650)
            } else {
                throw new Error(response.message)
            }
        } catch (err) {
            toast.error(err, {
                style: { backgroundColor: "#187e3d", color: "white" },
                autoClose: 1000, // Closes after 1 second
                pauseOnHover: false, // Does not pause on hover
            })
        }
    }

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (infoRef.current && !infoRef.current.contains(e.target) && e.target !== infoIconRef.current) {
                setInfo(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSavedChanges(false)
    }, [ReduxState])

    useEffect(() => {
        if (!autoSave) return;

        const debounceTimer = setTimeout(() => {
            saveTheDraft(false)
        }, 5000); // 5 seconds debounce time

        return () => clearTimeout(debounceTimer); // Reset timer if ReduxState changes before 3 seconds
    }, [ReduxState, autoSave]);

    useEffect(() => {
        localStorage.setItem("autoSave", String(autoSave))
    }, [autoSave])


    useEffect(() => { // Checking ig there has been any changes in the initial and running content
        console.log(ReduxState.present?.content, savedInitialState)
        const hasChanged = !isEqual(ReduxState.present?.content, savedInitialState)
        setIsChanged(hasChanged)
    }, [ReduxState.present?.content])

    return (
        <div className='flex rounded-lg justify-between gap-2 items-center xl:px-[2.36rem] xl:py-[1.2rem] sm:px-[.8rem] sm:py-[.5rem] lg:px-[.8rem] bg-[#fafaff] dark:bg-[#242933]'>
            <div className='flex items-center gap-2'>
                <span className='text-[black] dark:text-[#fafaff] flex items-center cursor-pointer'
                    onClick={() => navigate(-1)}>

                    <FaArrowLeftLong className={`h-[1.25rem] w-[1.19rem]`} />
                </span>
                <div className='xl:flex lg:flex hidden gap-4 items-center ml-3'>
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
                    <div className='flex gap-2 border-r border-[#64748B] dark:text-[#808080] pr-2'>
                        <span className={`cursor-pointer`} onClick={undos}><GrUndo className={`${iconSize} ${smallIconSize} hover:text-[#64748B] dark:hover:text-[#bbb] ${ReduxState.past.length > 1 && "text-[#1f2937] dark:text-[#bbb]"}`} /></span>
                        <span className={`cursor-pointer`} onClick={redos}><GrRedo className={`${iconSize} ${smallIconSize} hover:text-[#64748B] dark:hover:text-[#bbb] ${ReduxState.future.length >= 1 && "text-[#1f2937] dark:text-[#bbb]"}`} /></span>
                    </div>
                    <div className='flex gap-2 border-r border-[#64748B] text-[#1f2937] dark:text-[#808080] pr-2 relative'>
                        <span className={`cursor-pointer `} onClick={() => setFullScreen(true)}><LuEye className={`${iconSize} ${smallIconSize} dark:hover:text-[#bbbbbb]`} /></span>
                        {
                            !isManager &&
                            <span ref={infoIconRef} className={`cursor-pointer `} onClick={() => info ? setInfo(false) : setInfo(true)}>
                                <IoIosInformationCircleOutline className={`${iconSize} ${smallIconSize} dark:hover:text-[#bbbbbb]`} /></span>
                        }
                        <div ref={infoRef} className={`absolute top-[100%] left-1/2 dark:shadow-lg dark:border dark:border-stone-600/10 bg-base-100 w-[230px] shadow-xl rounded-lg text-xs p-2 ${info ? "block" : "hidden"}`} >
                            <div className=' w-fit'>
                                {
                                    EditingIsLive &&
                                    <p className='text-[#64748B]'>last saved:  <span className='text-[black] dark:text-stone-300'>{lastUpdate}</span></p>
                                }
                                <p className='text-[#64748B]'>status: <span className='text-[black] dark:text-stone-300'> {contentStatus || status}</span></p>   {/**status */}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !isManager
                        ?
                        outOfEditing ? (
                            <div>
                                <button disabled className='bg-[#80808080] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[12.58rem] w-[4rem] text-[white]'>
                                    {status}
                                </button>
                            </div>
                        ) :
                            (<div className='flex gap-3'>
                                <div className='flex items-center gap-1'>
                                    <span className={`text-sm font-lexend dark:text-[#CBD5E1] text-[#202a38] select-none`}>
                                        Auto Save
                                    </span>
                                    <Switch
                                        checked={autoSave}
                                        onChange={autoSaveToggle}
                                        className={`${autoSave
                                            ? "bg-[#26c226]"
                                            : "bg-gray-300"
                                            } relative inline-flex h-2 w-7 items-center rounded-full`}
                                    >
                                        <span
                                            className={`${autoSave ? "translate-x-4" : "translate-x-0"} 
                                            inline-block h-[17px] w-[17px] bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                        />
                                    </Switch>
                                </div>
                                <div className='flex gap-2'>
                                    {
                                        !autoSave &&
                                        <Button
                                            disabled={!isChanged}
                                            text={savedChanges ? 'Saved' : 'Draft'} functioning={saveTheDraft}
                                            classes={`
                                                ${savedChanges ? "bg-[#26c226]" : isChanged ? "bg-[#26345C]" : "bg-gray-500"} 
                                        rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`} />
                                    }
                                    <Button text={'Submit'}
                                        disabled={!isChanged}
                                        functioning={() => { setPopupSubmit(true) }}
                                        classes={` ${isChanged ? "bg-[#29469D]" : "bg-gray-500"}
                                             bg-[#29469D]
                                    rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`} />
                                </div>
                            </div>)
                        :
                        <div className='flex gap-3 sm:gap-1'>
                            <Button text={'Publish'}
                                // disabled={!isChanged}  -- style isChanged ? "bg-[#29469D]" : bg-gray-white
                                functioning={() => setPopupPublish(true)}
                                classes={`
                                    ${"bg-[#29469D]"} 
                                rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]`}
                            />
                        </div>
                }
            </div>

            <Popups
                display={PopUpPublish} setClose={() => setPopupPublish(false)}
                confirmationText={`Are you sure you want to ${ReduxState?.present?.content?.id === "N" ? "create a new page" : "publish"}?`}
                confirmationFunction={ReduxState?.present?.content?.id === "N" ? PublishNewPage : HandlepublishToLive}
            />
            <Popups
                display={PopupSubmit}
                setClose={() => setPopupSubmit(false)}
                confirmationText={"Are you sure you want to submit?"}
                confirmationFunction={handleSubmit}
            />
        </div>
    );
}
