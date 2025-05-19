import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aboutUsIcons } from "../../../../assets/index"; // ../../assets/index
import { Img_url } from "../../../../routes/backend";
import { updateMainContent } from "../../../common/homeContentSlice";
import dynamicSize from "../../../../app/fontSizes";
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

const AboutUs = ({ language, screen, currentContent }) => {
    const isPhone = screen < 768
    const isEnglish = language === "en"
    const dispatch = useDispatch()
    const [width, setWidth] = useState(0);
    const divRef = useRef(null);

    const directSize = (size) => dynamicSize(size, width)

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current);
            }
        };
    }, []);

    // useEffect(() => {
    //     return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    // }, [])

    return (
        <div className="px-8" ref={divRef}
            style={{ padding: `32px ${directSize(150)}` }}
        >
            {/** about us top section */}
            <section className="py-12">
                <div className="container mx-auto relative px-4"
                    style={{ height: directSize(715) }}
                >
                    <div className={`flex flex-col gap-6 items-center`}>
                        <h2 className={`text-black ${isPhone ? "text-2xl" : "text-3xl"} font-normal leading-none`}
                            style={{ fontSize: directSize(58) }}
                        >
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h2>
                        <p className="   font-light leading-7 mb-4 text-[#00B9F2]"
                            style={{ fontSize: directSize(24) }}
                        >
                            {(currentContent?.["1"]?.content?.subtitle?.[language])}
                        </p>
                    </div>
                    <div
                        style={{ gap: directSize(100) }}
                        className={`${!isEnglish ? `flex  ${isPhone ? "flex-col" : "flex-row-reverse"}` : `${isPhone ? "flex flex-col" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`} text-center gap-8 mt-8`}>
                        {currentContent?.["1"]?.content?.cards?.map((card, index) => (
                            <div
                                className={`bg-[#ebf8fd] rounded-sm flex-1 flex flex-col items-center gap-4`}

                                key={index}
                                style={{
                                    // width: directSize(319), 
                                    // height: directSize(315), 
                                    padding: `${directSize(40)} ${directSize(10)}`
                                }}
                            >
                                <img
                                    src={Img_url + card.icon}
                                    // width="44"
                                    // height="44"
                                    style={{ width: directSize(44), height: directSize(44) }}
                                    alt="icon"
                                    className="w-11 h-11 self-center"
                                />
                                <h5 className="text-black text-xl font-normal leading-none"
                                    style={{ fontSize: directSize(24) }}
                                >
                                    {card?.title?.[language]}
                                </h5>
                                <p className="text-black text-sm font-light leading-6 self-center"
                                    style={{ fontSize: directSize(16) }}
                                >
                                    {card?.description?.[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/** about us with video */}

            <section
                className={`${language === "en" ? "text-left" : "text-right"}`}
                style={{marginBottom: directSize(100)}}
            >
                <div className="container mx-auto px-4">
                    <div className={`flex items-center ${!isEnglish ? `${isPhone ? "flex-col" : "flex-row-reverse"}` : `${isPhone && "flex-col"}`} gap-8`}>
                        <div className="w-full flex flex-[2] items-center"
                            style={{
                                width: directSize(639),
                                height: directSize(457),
                            }}
                        >
                            <video
                                src={currentContent?.['2']?.content?.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-lg shadow-lg"

                            />
                        </div>

                        <div className=" flex-[1]">
                            <h2 className="text-2xl font-[400] text-black mb-5"
                                style={{ fontSize: directSize(36) }}
                            >
                                {currentContent?.['2']?.content?.title?.[language]}
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className="" dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.descriptions?.[language] }} />
                            </div>
                            <button
                                className="mt-6 px-4 py-2 bg-[white] text-[#00B9F2] border border-[#00B9F2] text-xs font-semibold rounded-[4px] shadow-md hover:none"
                            // onClick={() => setIsModal(true)}
                            >
                                {currentContent?.['2']?.content?.button?.[0]?.text?.[language]}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;