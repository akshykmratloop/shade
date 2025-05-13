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
import RejectPopup from "./RejectPopup";
import { LiaComment } from "react-icons/lia";

import { IoDocumentOutline } from "react-icons/io5";
import DateTime from "./DateTime";
import createContent from "../Resources/defineContent";
import Popups from "../Resources/components/breakUI/Popups";



function ShowDifference({ show, onClose, resourceId, currentlyEditor, currentlyPublisher }) {
    // const contentFromRedux = useSelector(state => state.homeContent.present)
    const [liveVersion, setLiveVersion] = useState({})
    const [editVersion, setEditVersion] = useState({})
    const [language, setLanguage] = useState("en")
    const [showDateTime, setShowDateTime] = useState(false)
    const { isManager } = useSelector(state => state.user)
    const [PopUpPublish, setPopupPublish] = useState(false)
    const [PopupSubmit, setPopupSubmit] = useState(false)
    const [onRejectPopup, setOnRejectPopup] = useState(false)
    const [commentOn, setCommentOn] = useState(false)
    const pageStatus = { "VERIFICATION_PENDING": "Verifier's stage", "PUBLISH_PENDING": "Publisher's stage" }
    const pageStages = new Set(["VERIFICATION_PENDING", "PUBLISH_PENDING"])

    const editedContent = createContent(editVersion, "difference", "home")
    const LiveContent = createContent(liveVersion, "difference", "home")


    const modalRef = useRef(null)
    const commentRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setCommentOn(false)
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    useEffect(() => {
        async function fetchContent() {
            try {
                const response = await getContent(resourceId)

                const payload = {
                    id: response.content.id,
                    titleEn: response.content.titleEn,
                    titleAr: response.content.titleAr,
                    slug: response.content.slug,
                    resourceType: response.content.resourceType,
                    resourceTag: response.content.resourceTag,
                    relationType: response.content.relationType,
                    comments: response.content.editModeVersionData.comments,
                    referenceDoc: response.content.editModeVersionData.referenceDoc
                }
                setLiveVersion({ ...payload, editVersion: response.content.liveModeVersionData })
                setEditVersion({ ...payload, editVersion: response.content.editModeVersionData ?? response.content.liveModeVersionData })

            } catch (err) {
                console.log(err)
            }
        }
        fetchContent()
    }, [])

    return (
        <Dialog open={show} onClose={onClose} className="relative z-40 font-poppins">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4 px-0">
                <Dialog.Panel className="w-[98vw] h-[98vh] customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6 px-0 relative">
                    <div className="flex justify-between items-center mb-4 px-6 ">
                        {/* <Dialog.Title className="text-lg font-[500]">Difference Preview</Dialog.Title> */}
                        <div className="flex gap-5 justify-between w-[95%]">
                            <LanguageSwitch w={'w-[20%]'} setLanguage={setLanguage} language={language} />
                            { // not for currentlyEditor
                                !currentlyEditor &&
                                <div className="flex gap-2">
                                    <div className="flex gap-3 text-[25px] items-center border-r px-2 border-r-2">
                                        <div ref={commentRef} className=" flex flex-col gap-1 items-center relative">
                                            <div className="flex flex-col gap-1 items-center"
                                                onClick={() => setCommentOn(prev => !prev)}
                                            >
                                                <LiaComment strokeWidth={.0001} />
                                                <span className="text-[12px]">
                                                    Comment
                                                </span>
                                            </div>
                                            {
                                                commentOn &&
                                                <div className="absolute right-[110%] top-[20%] z-[5]">
                                                    <div className="comment-bubble">
                                                        <div className="comment-bubble-arrow"></div>
                                                        <h3>Comments:</h3>
                                                        <p className={`${editVersion.comments ? "text-stone-900 dark:text-stone-200" : "text-stone-300"}`}>{editVersion.comments || "No comments"}</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-1 items-center translate-y-[1.5px]">
                                            <IoDocumentOutline className="text-[23px]" width={10} />
                                            <span className="text-[12px]">
                                                Doc
                                            </span>
                                        </div>
                                    </div>
                                    { // buttons/actions based on the roles
                                        !isManager ?
                                            (<div className="flex gap-2">
                                                { // for currentlyPublisher
                                                    currentlyPublisher &&
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
                                                    <button onClick={() => { setOnRejectPopup(true) }} className='flex justify-center items-center gap-1 bg-[#FF0000] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]'>
                                                        <RxCross1 /> Reject
                                                    </button>
                                                    <Button text={'Approve'} functioning={() => { setPopupSubmit(true) }} classes='bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                                                </div>
                                            </div>) :
                                            (
                                                <div className="flex gap-2 px-2">
                                                    <Button text={'Publish'} functioning={() => { setPopupPublish(true) }} classes='bg-[#29469D] rounded-md xl:h-[2.68rem] sm:h-[2rem] xl:text-xs sm:text-[.6rem] xl:w-[5.58rem] w-[4rem] text-[white]' />
                                                </div>
                                            )
                                    }
                                </div>
                            }
                        </div>
                        <button onClick={onClose} className="bg-transparent absolute top-4 right-10 z-20 hover:bg-stone-300 dark:hover:bg-stone-300 dark:hover:text-stone-900 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="flex w-[98.5%]">
                        <h3 className="font-[500] px-4 flex-1">Live Version</h3>
                        <h3 className="font-[500] px-4 flex-1">Changed Version</h3>
                    </div>

                    <div className="flex overflow-y-scroll h-[95%] customscroller relative">
                        <div className="border-r border-r-[4px] border-cyan-800 h-fit">
                            <AllForOne
                                currentPath={"home"}
                                language={language} screen={740}
                                content={LiveContent.content} fullScreen={""}
                                hideScroll={true}
                            />
                        </div>
                        <div>
                            <AllForOne
                                currentPath={"home"} language={language}
                                screen={740} content={editedContent.content}
                                live={LiveContent.content} showDifference={true}
                                fullScreen={""}
                                hideScroll={true}
                            />
                        </div>
                    </div>
                    {
                        showDateTime &&
                        <DateTime onClose={setShowDateTime} display={showDateTime} />
                    }
                    {
                        onRejectPopup &&
                        <RejectPopup display={onRejectPopup} setClose={setOnRejectPopup} submitfunction={async () => { }} />
                    }

                    <Popups display={PopUpPublish} setClose={() => setPopupPublish(false)}
                        confirmationText={`The page is under ${capitalizeWords(pageStatus[editVersion.editVersion?.status])}. Are you sure you want to publish?`} confirmationFunction={() => { }}
                    />
                    <Popups display={PopupSubmit} setClose={() => setPopupSubmit(false)}
                        confirmationText={"Are you sure you want to Approve?"} confirmationFunction={() => { }}
                    />
                </Dialog.Panel>
            </div>


        </Dialog>
    );
}

export default ShowDifference;