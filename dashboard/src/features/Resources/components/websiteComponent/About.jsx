import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { aboutUsIcons } from "../../../../assets/index"; // ../../assets/index
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";


const AboutUs = ({ language, screen, currentContent, width }) => {
    const isTablet = screen > 700 && screen < 1100
    const isPhone = screen < 700
    const isEnglish = language === "en"

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)

    const getDynamicSize = (size) => dynamicSize(size, width)

    const fontLight = useSelector(state => state.fontStyle.light)

    return (
        <div className="px-8"
            style={{ padding: `32px ${fontSize.aboutPaddingX}` }}
        >
            {/** about us top section */}
            <section className="py-12">
                <div className="container mx-auto px-4"
                // style={{ height: getDynamicSize(715) }}
                >
                    <div className={`flex flex-col gap-6 items-center`}>
                        <h2 className={`${isPhone ? "text-2xl" : "text-3xl"} font-normal leading-none`}
                            style={{ fontSize: fontSize.mainHeading }}
                        >
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h2>
                        <p className={`font-light leading-7 mb-4 text-[#00B9F2] font-[100] ${fontLight}`}
                            style={{ fontSize: fontSize.aboutMainPara, }}
                        >
                            {(currentContent?.["1"]?.content?.subtitle?.[language])}
                        </p>
                    </div>
                    <div
                        style={{ gap: isTablet ? getDynamicSize(50) : getDynamicSize(60) }}
                        className={`${!isEnglish ? `flex  ${isPhone ? "flex-col" : "flex-row-reverse"}` : `${isPhone ? "flex flex-col" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`} text-center gap-8 mt-8`}>
                        {currentContent?.["1"]?.content?.cards?.map((card, index) => (
                            <div
                                className={`bg-[#ebf8fd] rounded-sm flex-1 flex flex-col items-center gap-4`}

                                key={index}
                                style={{
                                    // width: directSize(319),
                                    // height: directSize(315), 
                                    padding: `${fontSize.aboutCardPaddingY} ${fontSize.aboutCardPaddingX}`
                                }}
                            >
                                <img
                                    src={Img_url + card.icon}
                                    // width="44"
                                    // height="44"
                                    style={{ width: getDynamicSize(44), height: getDynamicSize(44) }}
                                    alt="icon"
                                    className="w-11 h-11 self-center"
                                />
                                <h5 className="text-black text-xl font-normal leading-none"
                                    style={{ fontSize: fontSize.aboutMainPara }}
                                >
                                    {card?.title?.[language]}
                                </h5>
                                <p className={`${fontLight} text-[#001a5882] text-sm font-light leading-6 self-center`}
                                    style={{ fontSize: fontSize.mainPara }}
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
                style={{ marginBottom: getDynamicSize(100) }}
            >
                <div className="container mx-auto px-4 mt-20">
                    <div className={`flex items-center ${!isEnglish ? `${isPhone ? "flex-col" : "flex-row-reverse"}` : `${isPhone && "flex-col"}`} gap-8`}>
                        <div className="w-full flex flex-[2] items-center"
                            style={{
                                // width: getDynamicSize(639),
                                // height: getDynamicSize(457),
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
                                style={{ fontSize: fontSize.clientSection }}
                            >
                                {currentContent?.['2']?.content?.title?.[language]}
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className={`${fontLight}`} style={{ fontSize: fontSize.experiencePara }} dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.descriptions?.[language] }} />
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