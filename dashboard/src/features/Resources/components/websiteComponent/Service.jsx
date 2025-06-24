import Arrow from "../../../../assets/icons/right-wrrow.svg"; ///assets/icons/right-wrrow.svg
import { projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";


const Services = ({ currentContent, screen, language, width, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900 || highlight;
    const isTablet = (screen < 900 && screen > 730) && !highlight;
    const isPhone = screen < 738 && !highlight;
    const isLeftAlign = language === 'en';

    const titleLan = isLeftAlign ? "titleEn" : "titleAr"
    const checkDifference = (!purpose && highlight) ? differentText?.checkDifference?.bind(differentText) : () => ""


    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)



    return (
        <div className="">
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `linear-gradient(to right,#00000020 30%,#fffffffb 100%) ,url("${Img_url + currentContent?.['1']?.content?.images?.[0]?.url}")`,
                    backgroundPosition: "bottom",
                    padding: isComputer && `${getDynamicSize(20)} ${getDynamicSize(145)}`,
                    height: isComputer && `${getDynamicSize(740)}`
                }}
            >
                <div className="container relative h-full flex items-center justify-end">
                    <div className={`${isLeftAlign ? 'scale-x-[-1] text-left' : 'text-right'} ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} space-y-4 p-6 flex flex-col ${isLeftAlign ? "items-start" : "items-end"}`}>
                        <h2
                            style={{ fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading }}
                            className={`text-[#292E3D]  font-medium 
                            ${isPhone ? "text-[40px] leading-[50px]" :
                                    isTablet ? "text-[45px] leading-[55px]" : "text-[45px] leading-[77px]"} 
                            ${checkDifference(currentContent?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                            tracking-[-3.5px] mb-4`}>
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara }}
                            className={`text-[#0E172FB2] text-[12px] font-semibold leading-[26px] word-spacing-5
                            ${checkDifference(currentContent?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                            `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative items-center flex ${isLeftAlign ? "" : "flex-row-reverse"} gap-1 text-[12px] font-medium px-[12px] py-[6px] px-[12px] bg-[#00b9f2] text-white rounded-md`}
                            onClick={() => { }}
                            style={{ fontSize: fontSize.mainButton }}
                        >
                            <p className={`
                            ${checkDifference(currentContent?.['1']?.content?.button?.[0]?.text?.[language], liveContent?.['1']?.content?.button?.[0]?.text?.[language])}
                                `}>
                                {currentContent?.['1']?.content?.button?.[0]?.text?.[language]}
                            </p>
                            <img
                                src={Arrow}
                                width="10"
                                height="11"
                                alt=""
                                style={{ transform: isLeftAlign ? "rotate(180deg)" : "" }}
                            />
                        </button>
                    </div>
                </div>
            </section>
            <section dir={isLeftAlign ? 'ltr' : 'rtl'}
                className={` ${isTablet ? "px-[60px]" : isPhone ? "px-[40px]" : "px-[100px]"}`}
                style={{ padding: isComputer && `${getDynamicSize(20)} ${getDynamicSize(145)}` }}
            >
                <div className={`grid ${isPhone ? " py-[80px] grid-cols-1" : "py-[20px] grid-cols-2"} gap-x-[28px] gap-y-10  auto-rows-fr
                                ${checkDifference(currentContent?.['2']?.items, liveContent?.['2']?.items)}
                                `}
                    style={{ gap: isComputer && `${getDynamicSize(28)} ${getDynamicSize(40)}` }}
                >
                    {currentContent?.['2']?.items?.map((service, idx) => {
                        return (
                            <article
                                key={idx}
                                className="flex flex-col h-full bg-white \ overflow-hidden shadow"
                            >
                                <img src={service.image ? (Img_url + service.image) : projectPageData.swccWaterSupply}
                                    alt="img"
                                    className="w-full object-cover aspect-[2.1/1]"
                                />
                                <section className="bg-[#F8F8F8] py-[14px] px-[18px] flex flex-col justify-between flex-1">
                                    <h1 className="text-[#292E3D] font-[400]"
                                        style={{
                                            fontSize: fontSize.aboutMainPara,
                                        }}
                                    >
                                        {TruncateText(service?.[titleLan], isTablet ? 15 : 23)}
                                    </h1>
                                    <p className={`text-[#292E3D] text-[10px] mb-2 ${fontLight}`}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >
                                        {service?.description?.[language]}
                                    </p>
                                    <button
                                        style={{ fontSize: fontSize.mainButton }}
                                        className={`text-[#00B9F2] flex gap-1 items-center mt-auto ${!isLeftAlign && "flex-rows-reverse"}`}>
                                        {currentContent?.['2']?.content?.button?.[1]?.text?.[language]}
                                        <img
                                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                            alt=""
                                            className={`${isLeftAlign && "rotate-[180deg]"} w-[16px] h-[16px]`}
                                        />
                                    </button>
                                </section>
                            </article>
                        )
                    })}
                </div>
            </section>

            {!(currentContent?.serviceCards?.length > 6) &&
                < div className="flex justify-center py-10" >
                    <button className="bg-[#00B9F2] text-[#fff] p-[11px] rounded-[6px]">
                        <p className={`${checkDifference(currentContent?.['2']?.content?.button?.[0]?.text?.[language], liveContent?.['2']?.content?.button?.[0]?.text?.[language])}`}>
                            {currentContent?.['2']?.content?.button?.[0]?.text?.[language]}
                        </p>
                    </button>
                </div>}

        </div >
    );
};

export default Services;