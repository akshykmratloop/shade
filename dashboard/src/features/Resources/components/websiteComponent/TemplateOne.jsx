import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";
import { services } from "../../../../assets";


const TemplateOne = ({ content, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';

    // const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light)

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    const tempArr = [1, 2, 3, 4]

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    return (
        <div>
            <section
                className={`relative w-full ${isPhone ? "px-8" : ""}
                            ${checkDifference(content?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                            flex items-center bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${
                        // Img_url + content?.['1']?.content?.images?.[0]?.url
                        services.contructionTowerImage
                        }")`,
                    backgroundPosition: "bottom",
                    height: isComputer ? getDynamicSize(600) : "70vh",
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative flex items-center justify-center">
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-full  flex flex-col 
                                    ${isPhone ? "items-start" : "items-start p-6 space-y-4"} `}
                        style={{
                            padding: (isTablet) && `${getDynamicSize(100)} ${getDynamicSize(110)}`
                        }}
                    >
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                                                ${checkDifference(content?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                                                `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {content?.['1']?.content?.title?.[language] || "Lorem Ipsum"}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} 
                                                ${checkDifference(content?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                                        `}>
                            {
                                content?.['1']?.content?.description?.[language]
                                || "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia."
                            }
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-10 py-10"
                style={{
                    padding: (isComputer) ? `${getDynamicSize(100)} ${getDynamicSize(120)}` : `${getDynamicSize(100)} ${getDynamicSize(170)}`
                }}
            >
                <div className={`grid ${(isComputer) && "grid-cols-2"} gap-10`}
                    style={{ gap: (isComputer) ? `${getDynamicSize(80)} ${getDynamicSize(90)}` : `${getDynamicSize(150)}` }}
                >
                    {
                        tempArr?.map((e, i) => {
                            return (
                                <div key={i}
                                    className="flex flex-col gap-1"
                                    style={{ gap: `${getDynamicSize(16)}` }}
                                >
                                    <div className=" bg-[#00B9F212]"
                                        style={{ padding: isComputer ? `${getDynamicSize(58)}` : `${getDynamicSize(120)}` }}
                                    >
                                        <img src={projectPageData.asphaltWork}
                                            className="w-full"
                                            alt="" />

                                    </div>
                                    <div>
                                        <h3 className={`${isTablet && "mb-2"}`}
                                            style={{ fontSize: fontSize.subProjectHeadings, lineHeight: isTablet && "30px" }}
                                        >Lorem, ipsum dolor.</h3>
                                        <p className={`${fontLight}`}
                                            style={{ fontSize: fontSize.mainPara }}
                                        >We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            <section
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
                className="bg-[#00B9F28C]"
            >

                <div className={`grid ${(isComputer) ? "grid-cols-3" : isTablet ? "grid-cols-2" : "grid-cols-1 p-10  gap-10"}`}
                    style={{ gap: (isComputer || isTablet) && `${getDynamicSize(40)}` }}
                >
                    {
                        tempArr?.concat(tempArr)?.map((e, i) => {
                            return (
                                <div className="bg-white flex flex-col"
                                    style={{
                                        padding: isComputer ? `${getDynamicSize(16)}` : getDynamicSize(32),
                                        gap: getDynamicSize(16)
                                    }}
                                    key={i}
                                >
                                    <div className="flex gap-4"
                                        style={{ gap: (isComputer || isTablet) && getDynamicSize(10) }}
                                    >
                                        <img src={aboutUsIcons.ourGoal} alt=""
                                            style={{ width: (isComputer) && getDynamicSize(46) }}
                                            className={`aspect-[1/1] w-[46px]`}
                                        />
                                        <h3
                                            className=""
                                            style={{ fontSize: fontSize.aboutMainPara }}
                                        >Education</h3>
                                    </div>
                                    <p className={`${fontLight} text-[#718096]`}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content</p>
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            <section
                className="p-10"
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(80)} ${getDynamicSize(120)}`
                }}
            >
                <div
                    style={{
                        padding: (isComputer) && `${getDynamicSize(0)} ${getDynamicSize(60)}`,
                        gap: (isComputer || isTablet) && `${getDynamicSize(40)}`
                    }}
                    className={`flex flex-col gap-6 `}
                >
                    {
                        tempArr?.map((e, i) => {
                            return (
                                <section
                                    className={`
                                        flex  border 
                                        ${isPhone ? "flex-col p-1" : ""} 
                                        ${isTablet ? "px-[20px] py-[30px] gap-[20px]" : "gap-[10px]"}`}
                                    key={i}
                                >
                                    <h2 className={`text-[32px] ${isTablet && "flex-[1_1_167px]"} leading-[28px] font-[700]
                                                    ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                                                `}
                                        style={{ fontSize: fontSize.serviceHeading, lineHeight: isComputer && getDynamicSize(35) }}
                                    >
                                        {
                                            content?.[2]?.content?.title?.[language] ||
                                            "Project Description"
                                        }
                                    </h2>
                                    <div className={`text-[9.5px] ${isTablet && "flex-[0_1_363px]"} ${fontLight}
                                                    ${checkDifference(content?.[2]?.content?.description?.[language], liveContent?.[2]?.content?.description?.[language])}
                                                    `}
                                        style={{ fontSize: fontSize.mainPara }}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                content?.[2]?.content?.description?.[language] ||
                                                "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran."
                                        }}
                                    />
                                </section>
                            )
                        })
                    }

                </div>
            </section>
        </div>
    )
}


export default TemplateOne