// import React, { useEffect, useState } from "react";
import Arrow from "../../../../assets/icons/right-wrrow.svg"; ///assets/icons/right-wrrow.svg
import { useDispatch, useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
// import { services, projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import blueCheckIcon from "../../../../assets/bluecheckicon.svg"

const SnR = ({ currentContent, screen, language, width, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const dispatch = useDispatch()
    const fontLight = useSelector(state => state.fontStyle.light)

    const checkDifference = (!purpose && highlight) ? differentText?.checkDifference?.bind(differentText) : () => ""

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)


    return (
        <div className="">
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${Img_url + currentContent?.['1']?.content?.images?.[0]?.url}")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(740),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: isComputer ? getDynamicSize(1050) : "70%", height: isComputer ? getDynamicSize(650) : "100%" }}
                        className={`rounded-full bg-white  ${isPhone ? "blur-[60px] opacity-[.75]" : "blur-[120px] opacity-[.9]"} mix-blend-screen`}></div>
                </div>
                <div className="container relative h-full flex items-center justify-end">
                    <div className={`${isLeftAlign ? 'scale-x-[-1] text-left' : 'text-right'} 
                                        ${isPhone ? "w-full" : isTablet ? "w-2/3" : ""} space-y-4 p-6 flex flex-col 
                                    ${isLeftAlign ? "items-start" : "items-end"}`}>
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                                            ${checkDifference(currentContent?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                                        `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: isComputer ? fontSize.headingLeading : "40px",
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] 
                             ${checkDifference(currentContent?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                            ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section className={`${isPhone ? "px-4" : ""}`} style={{
                padding: `0px ${getDynamicSize(150)}`,
                margin: `${getDynamicSize(70)} 0px`,
            }}>

                <section
                    className={`${isPhone ? "px-4" : ""} grid grid-cols-1 gap-[20px]
                    ${checkDifference(currentContent?.['2']?.items, liveContent?.['2']?.items)}
                    `}
                    dir={isLeftAlign ? "ltr" : "rtl"}
                    style={{
                        gap: getDynamicSize(60),
                        gridTemplateRows: !isPhone && `repeat(${currentContent?.['2']?.items?.length}, 1fr)`
                    }}
                >
                    {
                        currentContent?.['2']?.items?.map((e, i) => {
                            let odd = i % 2 !== 0
                            return (
                                <article
                                    style={{
                                        // height: getDynamicSize(359),
                                        // width: getDynamicSize(1216)
                                        // gap: getDynamicSize(30),
                                        // margin: `${getDynamicSize(70)} 0px`
                                    }}
                                    className={`flex relative ${(isPhone || isTablet) ? "flex-col" : odd && "flex-row-reverse"}`}
                                    key={e.id}
                                >
                                    <div className={`${!isPhone && 'absolute'} flex-[2_0_auto] `}
                                        style={{
                                            width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463),
                                            height: isPhone ? 'fit-content' : isTablet ? "40vh" : '100%'
                                        }}

                                    >
                                        <img
                                            src={e.image ? (Img_url + e.image) : `https://frequencyimage.s3.ap-south-1.amazonaws.com/851e35b5-9b3b-4d9f-91b4-9b60ef2a102c-Rectangle%2034624110.png`}
                                            alt=""
                                            style={{
                                                width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463),
                                                height: isPhone ? '50vh' : isTablet ? "40vh" : '100%'
                                            }}
                                            className="object-cover"
                                        />
                                    </div>
                                    {
                                        !isPhone &&
                                        <div
                                            className="flex-[2_0_auto]"
                                            style={{ width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463), height: isPhone ? '50%' : isTablet ? "40vh" : '100%' }}

                                        ></div>}
                                    <article
                                        dir={isLeftAlign ? "ltr" : "rtl"}
                                        style={{
                                        }}
                                        className={`flex flex-col flex-[1_1_auto] gap-[13px] items-start justify-center text-[#292E3D]  
                                    ${isPhone ? "py-4 px-[18px]" : "py-4 px-[38px]"}`}>
                                        <h3 className="font-[400] text-[21px]"
                                            style={{
                                                fontSize: fontSize.aboutMainPara
                                            }}
                                        >{TruncateText(e?.[titleLan], 35)} </h3>

                                        {
                                            e.descriptions?.map((description, i) => {
                                                return (
                                                    <div className="flex items-start" style={{ gap: isPhone ? "4px" : getDynamicSize(8) }}>
                                                        <img src={blueCheckIcon} alt="" className="translate-y-[1px]"
                                                            style={{ width: isPhone ? "" : getDynamicSize(20), height: isPhone ? "" : getDynamicSize(20) }} />
                                                        <p className={`font-[300] text-[10px] ${fontLight}`}
                                                            key={i}
                                                            style={{
                                                                fontSize: fontSize.mainPara
                                                            }}>
                                                            {TruncateText(description?.[language], 120)}
                                                        </p>
                                                    </div>
                                                )
                                            })
                                        }

                                        <button
                                            className={`relative py-[6px] px-[12px] text-xs font-medium text-[#00B9F2] rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                                            style={{
                                                fontSize: fontSize.mainPara,
                                                padding: getDynamicSize(15)
                                            }}
                                        >
                                            <img
                                                src={"https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"}
                                                alt="Arrow"
                                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''}  w-[11px] h-[11px]`}
                                            />
                                            <p>
                                                {currentContent?.["2"]?.content?.button?.[0]?.text?.[language]}
                                            </p>
                                        </button>
                                    </article>
                                </article>
                            )
                        })
                    }

                </section>
            </section>

            {/* {!(currentContent?.serviceCards?.length > 3) &&
                < div className="flex justify-center py-10" >
                <button className="bg-[#00B9F2] text-[#fff] p-[11px] rounded-[6px]">
                {currentContent?.['2']?.content?.button?.[0]?.text?.[language]}
                </button>
                </div>
                } */}

        </div >
    );
};

export default SnR;