import { useEffect, useRef, useState } from "react";
import { Dialog, Switch } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import userIcon from "../../assets/user.png"
import formatTimestamp from "../../app/TimeFormat";
import { getContent, getRoleById } from "../../app/fetch";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import AllForOne from "../Resources/components/AllForOne";
import content from "../Resources/components/websiteComponent/content.json"
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import Button from "../../components/Button/Button";
import LanguageSwitch from "../Resources/components/breakUI/SwitchLang";
import RequestPopup from "./RequestPopup";
import { LiaComment } from "react-icons/lia";

import { IoDocumentOutline } from "react-icons/io5";
import DateTime from "./DateTime";
import createContent from "../Resources/defineContent";



function ShowDifference({ role, show, onClose, resourceId }) {
    const [fetchedRole, setFetchedRole] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)
    // const contentFromRedux = useSelector(state => state.homeContent.present)
    const [liveVersion, setLiveVersion] = useState({})
    const [editVersion, setEditVersion] = useState({})
    const [language, setLanguage] = useState("en")
    const [showDateTime, setShowDateTime] = useState(false)
    const { isEditor, isManager, isPublisher, isVerifier } = useSelector(state => state.user)

    const editedContent = createContent(editVersion, "difference", "home")
    const LiveContent = createContent(liveVersion, "difference", "home")

    const modalRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    useEffect(() => {
        async function fetchContent() {
            try {
                const response = await getContent("cmac0mp5j009lmn2ad81i9kgz")

                const payload = {
                    id: response.content.id,
                    titleEn: response.content.titleEn,
                    titleAr: response.content.titleAr,
                    slug: response.content.slug,
                    resourceType: response.content.resourceType,
                    resourceTag: response.content.resourceTag,
                    relationType: response.content.relationType,
                    comments: response.content.editModeVersionData.comments,
                    referenceDoc: response.content.editModeVersionData
                }
                setLiveVersion({ ...payload, editVersion: response.content.liveModeVersionData })
                setEditVersion({ ...payload, editVersion: response.content.editModeVersionData ?? response.content.liveModeVersionData })

            } catch (err) {
                console.log(err)
            }
        }
        fetchContent()
    }, [])

    // useEffect(() => {
    //     async function getRole() {
    //         if (!role?.id) return;
    //         setLoading(true);
    //         try {
    //             const response = await getRoleById(role.id);
    //             if (response.statusCode >= 400 || response instanceof Error) {
    //                 throw `Error: status: ${response.statusCode}, type: ${response.errorType}`
    //             }
    //             setTimeout(() => {
    //                 setFetchedRole(response.role);
    //                 setError(false);
    //             }, 200)
    //         } catch (err) {
    //             setError(true);
    //             console.log("catch")
    //         } finally {
    //             setTimeout(() => {

    //                 setLoading(false);
    //             }, 200)
    //         }
    //     }
    //     getRole();
    // }, [role]);

    // if (!role) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-40 font-poppins">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4 px-0">
                <Dialog.Panel className="w-[98vw] h-[98vh] customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6 px-0 relative">
                    <div className="flex justify-between items-center mb-4 px-6 ">
                        {/* <Dialog.Title className="text-lg font-[500]">Difference Preview</Dialog.Title> */}
                        <div className="flex gap-5 justify-between w-[95%]">
                            <LanguageSwitch w={'w-[20%]'} setLanguage={setLanguage} language={language} />
                            {
                                !isEditor &&
                                <div className="flex gap-2">
                                    <div className="flex gap-3 text-[25px] items-center border-r px-2 border-r-2">
                                        <span className=" flex flex-col gap-1 items-center">
                                            <LiaComment strokeWidth={.0001} />
                                            <span className="text-[12px]">
                                                Comment
                                            </span>
                                        </span>
                                        <span className="flex flex-col gap-1 items-center translate-y-[1.5px]">
                                            <IoDocumentOutline className="text-[23px]" width={10} />
                                            <span className="text-[12px]">
                                                Doc
                                            </span>
                                        </span>
                                    </div>
                                    {
                                        !isManager ?
                                            (<div className="flex gap-2">
                                                {
                                                    isPublisher &&
                                                    <div className='flex items-center gap-1'>
                                                        <span className={`text-[14px] font-lexend font-[400] dark:text-[#CBD5E1] text-[#202a38] select-none`}>
                                                            Publish Schedule
                                                        </span>

                                                        <Switch
                                                            checked={true}
                                                            onChange={() => setShowDateTime(true)}
                                                            className={`${true
                                                                ? "bg-[#1DC9A0]"
                                                                : "bg-gray-300"
                                                                } relative inline-flex h-2 w-7 items-center rounded-full`}
                                                        >
                                                            <span
                                                                className={`${true
                                                                    ? "translate-x-4"
                                                                    : "translate-x-0"
                                                                    } inline-block h-[17px] w-[17px] bg-white rounded-full shadow-2xl border border-gray-300 transition`}
                                                            />
                                                        </Switch>
                                                    </div>}
                                                <div className="flex gap-2 px-2">
                                                    <button onClick={() => { }} className='flex justify-center items-center gap-1 bg-[#FF0000] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]'>
                                                        <RxCross1 /> Reject
                                                    </button>
                                                    <Button text={'Approve'} functioning={() => { }} classes='bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                                                </div>
                                            </div>) :
                                            (
                                                <div className="flex gap-2 px-2">
                                                    <Button text={'Publish'} functioning={() => { }} classes='bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                                                </div>
                                            )
                                    }
                                </div>
                            }
                        </div>
                        <button onClick={onClose} className="bg-transparent absolute top-4 right-10 z-20 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="flex w-[98.5%]">
                        <h3 className="font-[500] px-4 flex-1">Live Version</h3>
                        <h3 className="font-[500] px-4 flex-1">Changed Version</h3>
                    </div>

                    <div className="flex overflow-y-scroll h-[95%] customscroller relative">
                        <div>
                            <AllForOne currentPath={"home"} language={language} screen={740} content={LiveContent.content} fullScreen={""} />
                        </div>
                        <div>
                            <AllForOne currentPath={"home"} language={language} screen={740} content={editedContent.content} live={LiveContent.content} showDifference={true} fullScreen={""} />
                        </div>
                    </div>
                    {
                        showDateTime &&
                        <DateTime onClose={setShowDateTime} display={showDateTime} />
                    }
                </Dialog.Panel>
            </div>
            {
                false &&
                <RequestPopup />
            }

        </Dialog>
    );
}

export default ShowDifference;