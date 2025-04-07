import React, { useEffect } from "react";
import content from "./content.json"
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import { aboutUsIcons } from "../../../../assets/index"; // ../../assets/index
import parse from 'html-react-parser'
// import styles from "./about.module.scss";
// import localFont from "next/font/local";
// import Button from "@/common/Button";
// import Image from "next/image";
// import { useGlobalContext } from "../../contexts/GlobalContext";
// import patch from "../../../../assets/icons/pa";  // ../../contexts/svg/path.jsx

// Font files can be colocated inside of `app`

// import dynamic from "next/dynamic";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
//     ssr: false,
// });

const AboutUs = ({ language, screen }) => {
    const isPhone = screen < 768
    const isEnglish = language === "en"
    const dispatch = useDispatch()
    const currentContent = useSelector((state) => state.homeContent.present.about)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)

    // const { language, content } = useGlobalContext();
    // const [isModal, setIsModal] = useState(false);
    // const currentContent = content?.aboutUs;
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    useEffect(() => {
        dispatch(updateContent({ currentPath: "about", payload: content.about }))
    }, [])
    return (
        <div className="">
            {/** about us top section */}
            <section className="py-12">
                <div className="container mx-auto relative px-4">
                    <div className={`flex flex-col gap-6 items-center`}>
                        <h2 className={`text-black ${isPhone ? "text-2xl" : "text-3xl"} font-normal leading-none`}>
                            {currentContent?.services?.title[language]}
                        </h2>
                        <p className="text-black text-base font-light leading-7 mb-4 text-[#00B9F2]">
                            {(currentContent?.services?.subtitle[language])}
                        </p>
                    </div>
                    <div className={`${!isEnglish ? `flex  ${isPhone ? "flex-col" : "flex-row-reverse"}` : `${isPhone?"flex flex-col":"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`} text-center gap-8 mt-8`}>
                        {currentContent?.services?.cards.map((card, index) => (
                            <div
                                className={`p-6 bg-[#ebf8fd] rounded-lg shadow-md flex-1 flex flex-col items-center gap-4`}
                                key={index}
                            >
                                <img
                                    src={ImageFromRedux[card.icon] || aboutUsIcons[card?.icon]}
                                    width="44"
                                    height="44"
                                    alt="icon"
                                    className="w-11 h-11 self-center"
                                />
                                <h5 className="text-black text-xl font-normal leading-none">
                                    {card.title[language]}
                                </h5>
                                <p className="text-black text-sm font-light leading-6 self-center">
                                    {card.description[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/** about us with video */}

            <section
                className={`${language === "en" ? "text-left" : "text-right"
                    } py-24`}
            >
                <div className="container mx-auto px-4">
                    <div className={`flex items-center ${!isEnglish ? `${isPhone?"flex-col":"flex-row-reverse"}` : `${isPhone && "flex-col"}`} gap-8`}>
                        <div className="w-full mb-8 flex flex-[2]">
                            <video
                                src={ImageFromRedux["video"] || currentContent?.main?.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                        </div>

                        <div className=" flex-[1]">
                            <h2 className="text-2xl font-bold text-black mb-5">
                                {currentContent?.main?.title[language]}
                            </h2>
                            <div>
                                <p className="text-xs text-[#292E3D] mb-4">
                                    {currentContent?.main?.description1[language]}
                                </p>
                                <p className="text-xs text-[#292E3D] mb-4">
                                    {currentContent?.main?.description2[language]}
                                </p>
                            </div>
                            <button
                                className="mt-6 px-4 py-2 bg-[white] text-[#00B9F2] border border-[#00B9F2] text-xs font-semibold rounded-lg hover:bg-blue-600"
                            // onClick={() => setIsModal(true)}
                            >
                                {currentContent?.main?.button?.text[language]}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-black text-3xl font-medium mb-5 ">
                            {currentContent?.newProject?.title[language]}
                        </h2>
                        <p className="text-black text-base font-light leading-7 mb-2 relative">
                            {currentContent?.newProject?.description[language].replace(
                                currentContent?.newProject?.highlightedText[language],
                                `"${currentContent?.newProject?.highlightedText[language]}"`
                            )}
                            <i
                                className={`absolute top-0 opacity-70 ${language === "ar" ? "right-48" : "right-0"
                                    }`}
                            >
                            </i>
                        </p>
                        <p className="text-black text-base font-light leading-7 mb-2">
                            {currentContent?.newProject?.description2[language]}
                        </p>
                        <button
                            className={`mt-11 px-7 py-3 text-lg ${language === "en" ? "px-3" : ""
                                }`}
                            // onClick={() => setIsModal(true)}
                        >
                            {currentContent?.newProject?.button?.text[language]}
                        </button>
                    </div>
                </div>
            </section> */}
            {/* // <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}
        </div>
    );
};

export default AboutUs;