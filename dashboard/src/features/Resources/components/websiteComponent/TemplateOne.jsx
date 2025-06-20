import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";


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
                    backgroundImage: `url("${Img_url + content?.['1']?.content?.images?.[0]?.url}")`,
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

            <section className=""
                style={{
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className={`grid ${(isComputer || isTablet) && "grid-cols-2"}`}
                    style={{ gap: `${getDynamicSize(100)}` }}
                >
                    {
                        tempArr?.map((e, i) => {
                            return (
                                <div key={i}
                                    className="flex flex-col gap-4"
                                >
                                    <div className=" bg-[#00B9F212]"
                                        style={{ padding: `${getDynamicSize(58)}` }}
                                    >
                                        <img src={projectPageData.asphaltWork}
                                            className="w-full"
                                            alt="" />

                                    </div>
                                    <div>
                                        <h3
                                            style={{ fontSize: fontSize.subProjectHeadings }}
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
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
                className="bg-[#00B9F28C]"
            >

                <div className={`grid ${(isComputer || isTablet) && "grid-cols-3"}`}
                    style={{ gap: `${getDynamicSize(40)}` }}
                >
                    {
                        tempArr?.concat(tempArr)?.map((e, i) => {
                            return (
                                <div className="bg-white flex flex-col"
                                    style={{
                                        padding: `${getDynamicSize(16)}`,
                                        gap: getDynamicSize(16)
                                    }}
                                    key={i}
                                >
                                    <div className="flex"
                                        style={{ gap: getDynamicSize(10) }}
                                    >
                                        <img src={aboutUsIcons.ourGoal} alt=""
                                            style={{ width: getDynamicSize(46) }}
                                            className="aspect-[1/1]"
                                        />
                                        <h3
                                            style={{ fontSize: fontSize.aboutMainPara }}
                                        >Education</h3>
                                    </div>
                                    <p className={`${fontLight}`}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content</p>
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            <section
                style={{
                    padding: (isComputer) && `${getDynamicSize(80)} ${getDynamicSize(120)}`
                }}
            >
                <div
                    style={{
                        padding: (isComputer) && `${getDynamicSize(0)} ${getDynamicSize(60)}`,
                        gap: `${getDynamicSize(40)}`
                    }}
                    className="flex flex-col"
                >
                    {
                        tempArr?.map((e, i) => {
                            return (
                                <section className={`flex gap-[30px] border ${isPhone ? "flex-col" : ""}`} key={i}>
                                    <h2 className={`text-[32px] flex-1 leading-[28px]
                                                    ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                                                `}
                                        style={{ fontSize: fontSize.serviceHeading, lineHeight: isComputer && getDynamicSize(35) }}
                                    >
                                        {
                                            content?.[2]?.content?.title?.[language] ||
                                            "Project Description"
                                        }
                                    </h2>
                                    <div className={`text-[9.5px] flex-1
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