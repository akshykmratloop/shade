// import Arrow from "../../../../../assets/icons/right-wrrow.svg"; ///assets/icons/right-wrrow.svg
import { useDispatch, useSelector } from "react-redux";
// import { updateMainContent } from "../../../common/homeContentSlice";
// import { services, projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../../app/fontSizes";
import blueCheckIcon from "../../../../../assets/bluecheckicon.svg"

const SnRPolicies = ({ currentContent, screen, language, width, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const dispatch = useDispatch()
    const fontLight = useSelector(state => state.fontStyle.light)

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = (!purpose && highlight)  ? differentText?.checkDifference?.bind(differentText) : () => ""

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)


    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}
                ${checkDifference(currentContent?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                `}
                style={{
                    backgroundImage: `url("${Img_url + currentContent?.['1']?.content?.images?.[0]?.url}")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(600),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className=" rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative h-full flex items-center justify-end"
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-full flex flex-col ${isPhone ? "items-start" : " space-y-4"} `}>
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                            ${checkDifference(currentContent?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                        `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} 
                            ${checkDifference(currentContent?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                            `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section className={`flex ${isPhone && 'flex-col'}`}
                style={{
                    margin: `${getDynamicSize(50)} ${getDynamicSize(110)}`,
                    gap: getDynamicSize(16)
                }}
            >
                <div className="flex-[1] flex flex-col"
                    style={{ gap: getDynamicSize(30) }}
                >
                    <h2 className={`
                            ${checkDifference(currentContent?.['2']?.content?.title?.[language], liveContent?.['2']?.content?.title?.[language])}
                    `}
                        style={{ fontSize: fontSize.SnRSubHeading, lineHeight: fontSize.headingLeading }}
                    >
                        {currentContent?.['2']?.content?.title?.[language]}
                    </h2>
                    <p
                        style={{ fontSize: fontSize.mainPara }}
                        className={`${fontLight} pr-3
                            ${checkDifference(currentContent?.['2']?.content?.description?.[language], liveContent?.['2']?.content?.description?.[language])}
                        `}>
                        {currentContent?.['2']?.content?.description?.[language]}
                    </p>
                </div>

                <div className="flex-[1] flex flex-col"
                    style={{ gap: getDynamicSize(30) }}
                >

                    <div className="flex">
                        <div className="flex-[3_1_auto]">
                            <p style={{ fontSize: fontSize.mainPara, marginTop: getDynamicSize(8) }}>001</p>
                        </div>
                        <div className=""
                            style={{ flex: `3 1 ${getDynamicSize(552)}` }}
                        >
                            <h3 className={`
                                    ${checkDifference(currentContent?.['2']?.content?.procedures?.title?.[language], liveContent?.['2']?.content?.procedures?.title?.[language])}
                            `}
                                style={{ fontSize: fontSize.aboutMainPara }}
                            >
                                {currentContent?.['2']?.content?.procedures?.title?.[language]}
                            </h3>
                            <p
                                style={{ fontSize: fontSize.mainPara }}
                                className={`${fontLight}
                                 ${checkDifference(currentContent?.['2']?.content?.procedures?.description?.[language], liveContent?.['2']?.content?.procedures?.description?.[language])}
                                `}>
                                {currentContent?.['2']?.content?.procedures?.description?.[language]}
                            </p>
                        </div>
                    </div>
                    {
                        currentContent?.['2']?.content?.procedures?.terms?.map((term, i) => {

                            return (
                                <div className={`flex`} key={i}>
                                    <div className="flex-[3_1_auto]">
                                        <p style={{ fontSize: fontSize.mainPara, marginTop: getDynamicSize(8) }}>
                                            {(i + 2).toString().padStart(3, '0')}
                                        </p>

                                    </div>
                                    <div className=""
                                        style={{ flex: `3 1 ${getDynamicSize(552)}` }}
                                    >
                                        <h3 className={`
                                            ${checkDifference(term?.title?.[language], liveContent?.[2]?.content?.procedures?.terms?.[i]?.title?.[language])}
                                        `}
                                            style={{ fontSize: fontSize.aboutMainPara }}
                                        >
                                            {term?.title?.[language]}
                                        </h3>
                                        <p
                                            style={{ fontSize: fontSize.mainPara }}
                                            className={`${fontLight}
                                            ${checkDifference(term?.description?.[language], liveContent?.[2]?.content?.procedures?.terms?.[i]?.description?.[language])}
                                            `}>
                                            {term?.description?.[language]}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </section>

        </div >
    );
};

export default SnRPolicies;