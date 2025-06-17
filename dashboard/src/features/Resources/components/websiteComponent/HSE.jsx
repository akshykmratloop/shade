import { useSelector } from "react-redux";

import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";
import blueCheckIcon from "../../../../assets/bluecheckicon.svg"
import { projectPageData } from "../../../../assets/index";


const HSnE = ({ currentContent, screen, language, width }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 638;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative border w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${currentContent?.['1']?.content?.images?.[0]?.url ? Img_url + currentContent?.['1']?.content?.images?.[0]?.url : projectPageData.aiKhobarTunnel}")`,
                    backgroundPosition: "bottom",
                    height: isComputer ? getDynamicSize(600) : isTablet ? getDynamicSize(700) : getDynamicSize(1200),
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className=" rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"
                    ></div>
                </div>

                <div className="container relative h-full flex items-center justify-end "
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-full" : isTablet ? "" : ""} flex flex-col ${isPhone ? "items-start" : "items-start space-y-4"} `}>
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4`}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            {/* <section
                style={{ padding: `${getDynamicSize(80)} ${getDynamicSize(112)}` }}
                className={`flex gap-[30px]  ${isPhone ? "flex-col px-[30px]" : ""}`}>
                <h2 className='text-[32px]  flex-1 leading-[28px]'>
                    {currentContent?.subBanner?.title?.[language] ||
                        "Lorem ipsum dolor sit."
                    }
                </h2>
                <div className='text-[9.5px] flex-1' dangerouslySetInnerHTML={{
                    __html:
                        currentContent?.subBanner?.description?.[language] ||
                        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti voluptatem pariatur corrupti error ut vero expedita inventore repudiandae nostrum assumenda!"
                }} />

            </section> */}

            <section className={`grid ${isPhone ? "grid-cols-1 p-10" : "grid-cols-2"} gap-x-20 gap-y-5 `}
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    gap: `${getDynamicSize(40)} ${getDynamicSize(20)}`
                }}
            >
                {
                    currentContent?.[2]?.content?.cards?.map((card, i) => {

                        return (
                            <div className="relative pr-10 pb-5 flex gap-2">
                                <div className=""><img src={Img_url + card?.images?.[0]?.url} alt="" className="w-[120px] h-[50px]" /></div>
                                <div className="flex flex-col gap-2">
                                    <h3 className={`text-[#292E3D]`} style={{ fontSize: fontSize.subProjectHeadings }}>{card?.title?.[language]}</h3>
                                    <p className={`text-[10px] text-[#718096] ${fontLight}`} style={{ fontSize: fontSize.mainPara }}>
                                        {card?.description?.[language]}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }


            </section>

            <div className="w-full"
                style={{
                    padding: (isComputer || isTablet) && `0px ${getDynamicSize(150)}`
                }}
            >
                <img
                    src={Img_url + currentContent?.[2].images?.[0]?.url} alt=""
                    className={`w-full ${isPhone ? "aspect-[2/1.5]" : "aspect-[2.88/1]"} object-cover object-bottom`}
                />
            </div>

            <section className={`flex gap-5 py-10 px-10 flex-col`}
                style={{
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)} ${getDynamicSize(50)}`
                }}
            >
                <h2 className="text-[18px]"
                    style={{
                        lineHeight: fontSize.headingLeading,
                        fontSize: fontSize.aboutMainPara
                    }}
                >
                    {
                        currentContent?.['2']?.content?.title?.[language]
                    }
                </h2>
                <p
                    style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                    className={`text-[#718096] text-[12px] ${fontLight}`}>
                    {currentContent?.['2']?.content?.description?.[language]}
                </p>
                {/* {currentContent?.['2']?.content?.sectionPointers?.map((e, i) => {
                    return (
                        <p
                            key={i}
                            style={{ fontSize: fontSize.mainPara }}
                            className={`${fontLight} pr-3 text-[#718096]`}>
                            {e?.text?.[language]}
                        </p>
                    )
                })} */}

            </section>

            <section className={`flex gap-5 px-7 py-5 pb-10 flex-col`}
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(50)} ${getDynamicSize(150)} ${getDynamicSize(100)}`
                }}
            >
                {
                    currentContent?.['2']?.content?.sectionPointers?.map((description, i) => {
                        return (
                            <div className="flex items-start" style={{ gap: isPhone ? "4px" : getDynamicSize(8) }}>
                                <img src={blueCheckIcon} alt="" className="translate-y-[1px]"
                                    style={{ width: isPhone ? "" : getDynamicSize(20), height: isPhone ? "" : getDynamicSize(20) }} />
                                <p className={`font-[300] text-[#718096] text-[10px] ${fontLight}`}
                                    key={i}
                                    style={{
                                        fontSize: fontSize.mainPara
                                    }}>
                                    {description?.text?.[language]}
                                </p>
                            </div>
                        )
                    })
                }
            </section>

        </div >
    );
};

export default HSnE;