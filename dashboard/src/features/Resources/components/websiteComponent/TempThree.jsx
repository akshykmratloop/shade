import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";
import { services } from "../../../../assets";
import { TruncateText } from "../../../../app/capitalizeword";


const TemplateThree = ({ content, screen, language, width, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900 || highlight;
    const isTablet = (screen < 900 && screen > 730) && !highlight;
    const isPhone = screen < 738 && !highlight;
    const isLeftAlign = language === 'en';

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light);

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width);
    const getDynamicSize = (size) => dynamicSize(size, width);

    const tempArr = [1, 2, 3, 4]

    const checkDifference = (!purpose && highlight) ? differentText?.checkDifference?.bind(differentText) : () => "";

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`flex items-center ${!isComputer && `${isTablet ? "px-12" : ""}`}`}
                style={{
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    minHeight: getDynamicSize(750)
                }}
            >
                <div className={`flex justify-between ${!isComputer && "flex-col gap-6"} w-full`}
                    style={{
                        gap: (isComputer) && getDynamicSize(50),
                    }}
                >

                    <div className={`flex flex-col ${!isComputer ? `gap-4 py-10 justify-start ${isTablet ? "w-3/5" : "px-10"}` : "justify-center"} items-start `}
                        style={{
                            gap: (isComputer) && getDynamicSize(16),
                            flex: `1 1 ${getDynamicSize(483)}`
                        }}
                    >
                        <h2
                            style={{
                                fontSize: fontSize.mainHeading,
                                letterSpacing: (isComputer) && getDynamicSize(-5),
                                lineHeight: (isComputer) && getDynamicSize(50)
                            }}
                            className={`
                                ${checkDifference(content?.[1]?.content?.title?.[language], liveContent?.[1]?.content?.title?.[language])}
                                `}
                        >
                            {content?.[1]?.content?.title?.[language] || "LOREM IPSUM"}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.testimonialsQuote }}
                            className={` text-[#0E172FB2]
                                ${checkDifference(content?.[1]?.content?.description?.[language], liveContent?.[1]?.content?.description?.[language])}
                                `}
                        >
                            {content?.[1]?.content?.description?.[language] ||
                                `Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.
                        
                            Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.`
                            }
                        </p>
                        <button className={`p-4 bg-[#00B9F2] text-white rounded-[6px]
                        `}
                            style={{ fontSize: fontSize.mainPara }}
                        >
                            <p className={`
                                ${checkDifference(content?.[1]?.content?.button?.[0]?.text?.[language], liveContent?.[1]?.content?.button?.[0]?.text?.[language])}
                                `}>
                                {content?.[1]?.content?.button?.[0]?.text?.[language] || "Lorem Ipsum"}
                            </p>
                        </button>
                    </div>
                    <div className="border"
                        style={{
                            // flex: `1 1 auto`
                            width: (isComputer) && getDynamicSize(685)
                        }}
                    >
                        <img
                            src={`${content?.[1]?.content?.images?.[0]?.url ?
                                Img_url + content?.[1]?.content?.images?.[0]?.url :
                                projectPageData.asphaltWork
                                }`} alt=""
                            // style={{ width: (isComputer) && getDynamicSize(685) }}
                            className={`w-full h-full aspect-[2/1.3]
                                ${checkDifference(content?.[1]?.content?.images?.[0]?.url, liveContent?.[1]?.content?.images?.[0]?.url)}
                                `}
                        />
                    </div>
                </div>
            </section>

            <section
                className={`bg-[#00B9F20A] ${(isTablet || isPhone) && "p-10 my-16"}`}
                style={{
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }
                }
            >
                <section className={`flex  ${(isPhone || isTablet) ? "flex-col p-1 gap-[20px]" : "gap-[10px]"}`}>
                    <h2 className={`text-[32px] flex-1 leading-[28px]
                                        ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                                    `}
                        style={{
                            fontSize: fontSize.experienceHeading,
                            lineHeight: isComputer && getDynamicSize(40),
                            width: (isComputer) && getDynamicSize(505),
                            flex: `1 1 auto`
                        }}
                    >
                        {
                            content?.[2]?.content?.title?.[language] ||
                            "Project Description"
                        }
                    </h2>
                    <div className={`text-[9.5px] flex-1 ${fontLight}
                                    ${checkDifference(content?.[2]?.content?.description?.[language], liveContent?.[2]?.content?.description?.[language])}
                                    `}
                        style={{
                            width: (isComputer) && getDynamicSize(600),
                            fontSize: fontSize.mainPara,
                            flex: `1 1 auto`
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                content?.[2]?.content?.description?.[language] ||
                                "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran."
                        }}
                    />
                </section>
            </section>

            <section>
                <section className={`overflow-x-scroll rm-scroll ${isPhone && "py-10"} pt-2
                                ${(checkDifference(content?.['3']?.items, liveContent?.['3']?.items))}
                            `}
                    style={{
                        padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(60)}`,
                        paddingBottom: (isComputer || isTablet) && `${getDynamicSize(60)}`,
                    }}
                >
                    <section
                        dir={isLeftAlign ? 'ltr' : 'rtl'}
                        className={`flex gap-7 ${isPhone ? "px-[38px] " : ""} pr-[38px] w-fit items-stretch text-
                        ${checkDifference(content?.['3']?.content?.cards, liveContent?.['3']?.content?.cards)}
                        `}
                        style={{
                            padding: isComputer ? `0px ${getDynamicSize(76)}` : isTablet ? `0px ${getDynamicSize(76)}` : "",
                            width: "fit-content"
                        }}
                    >
                        <article className={`bg-[#73D9F8] rounded-[6px] ${(isTablet) ? "w-[340px] p-4" : isPhone ? "w-[300px] p-4" : ""}`}
                            style={{
                                width: (isComputer) && getDynamicSize(362),
                                padding: (isComputer) && getDynamicSize(20)
                            }}
                        >
                            <h3 style={{ fontSize: fontSize.aboutMainPara }}
                                className={`
                                ${checkDifference(content?.['3']?.content?.title?.[language], liveContent?.['3']?.content?.title?.[language])}
                                `}
                            >
                                {
                                    content?.['3']?.content?.title?.[language] ||
                                    "Lorem Ipsum"
                                }
                            </h3>
                            <p className={`${fontLight}
                                ${checkDifference(content?.['3']?.content?.description?.[language], liveContent?.['3']?.content?.description?.[language])}
                            `}
                                style={{ fontSize: fontSize.mainPara }}
                            >
                                {
                                    content?.['3']?.content?.description?.[language] ||
                                    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will a reader will"
                                }
                            </p>
                        </article>
                        {
                            (content?.['3']?.content?.cards ||
                                []
                            )?.map((service, idx) => {
                                return (
                                    <article
                                        key={idx}
                                        className="flex flex-col bg-white overflow-hidden shadow rounded-[6px]"
                                        style={{ width: isComputer ? getDynamicSize(437) : isTablet ? getDynamicSize(680) : "300px" }}
                                    >
                                        <img src={Img_url +
                                            service.images?.[0]?.url
                                        } alt="img"
                                            className={`w-full object-cover rounded-[6px]
                                                ${checkDifference(service.images?.[0]?.url, liveContent?.['3']?.content?.cards?.[idx]?.images?.[0]?.url)}
                                                `}
                                            style={{ height: isComputer ? getDynamicSize(210) : isTablet ? getDynamicSize(400) : getDynamicSize(437) }}
                                        />
                                        <section className="bg-[#F8F8F8] flex flex-col j flex-1"
                                            style={{
                                                padding: `${getDynamicSize(16)} ${getDynamicSize(25)}`,
                                                gap: isComputer ? getDynamicSize(10) : getDynamicSize(25)
                                            }}
                                        >
                                            <h1 className={`text-[#292E3D] text-[22px] font-[400]
                                                ${checkDifference(service?.title?.[language], liveContent?.['3']?.content?.cards?.[idx]?.title?.[language])}
                                            `}
                                                style={{ fontSize: fontSize.aboutMainPara, lineHeight: (isComputer || isTablet) && getDynamicSize(30) }}
                                                title={service?.title?.[language]}
                                            >
                                                {TruncateText(service?.title?.[language], isTablet ? 18 : 25) ||
                                                    "Project Services"}
                                            </h1>
                                            <p className={`text-[#292E3D] text-[10px] mb-2 ${fontLight}
                                                ${checkDifference(service?.description?.[language], liveContent?.['3']?.content?.cards?.[idx]?.description?.[language])}
                                            `}
                                                style={{ fontSize: fontSize.mainPara }}
                                            >
                                                {service?.description?.[language] ||
                                                    "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure."}
                                            </p>
                                        </section>
                                    </article>
                                )
                            })}
                    </section>
                </section>
            </section>

            <section
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    // height: getDynamicSize(750)
                }}
            >
                <div className={`flex ${!isComputer && "flex-col"}`}
                    style={{ gap: `${getDynamicSize(30)}` }}
                >
                    <div className="border h-fit"
                        style={{ flex: `1 1 ${getDynamicSize(510)}` }}
                    >
                        <img src={content?.[4]?.content?.images?.[0]?.url ?
                            Img_url +
                            content?.[4]?.content?.images?.[0]?.url :
                            projectPageData.itLabExcellence
                        } className={`w-full ${isComputer ? "aspect-[1/1.1]" : "aspect-[2/1]"}
                        ${checkDifference(content?.[4]?.content?.images?.[0]?.url, liveContent?.[4]?.content?.images?.[0]?.url)}
                        `} alt="" />
                    </div>
                    <div className="flex flex-col"
                        style={{
                            flex: `1 1 ${getDynamicSize(679)}`,
                            gap: (isComputer) && getDynamicSize(23)
                        }}
                    >
                        <h3
                            style={{
                                fontSize: fontSize.aboutMainPara
                            }}
                            className={`${checkDifference(content?.[4]?.content?.title?.[language], liveContent?.[4]?.content?.title?.[language])}`}
                        >
                            {
                                content?.[4]?.content?.title?.[language] ||
                                "Project Services"
                            }
                        </h3>
                        <p className={`${fontLight}
                                        ${checkDifference(content?.[4]?.content?.title?.[language], liveContent?.[4]?.content?.title?.[language])}
                                    `}
                            style={{
                                fontSize: fontSize.mainPara
                            }}
                        >
                            {
                                content?.[4]?.content?.description?.[language] ||
                                "Our company has been the leading provided construction services to clients throughout the Dubai since 1992."
                            }
                        </p>
                        <div
                            className={`grid ${isComputer ? "grid-cols-3" : isTablet ? "grid-cols-3 gap-2" : "grid-cols-1 gap-2"} ${!isComputer && "mt-2"}
                                        ${checkDifference(content?.[4]?.content?.cards, liveContent?.[4]?.content?.cards)}
                                        `}
                            style={{
                                gap: (isComputer) && getDynamicSize(23)
                            }}
                        >
                            {
                                content?.[4]?.content?.cards?.map((e, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="border aspect-[1/.91] flex justify-center items-center p-4 text-center"
                                            style={{ padding: isComputer && getDynamicSize(16) }}
                                        >
                                            <p style={{ fontSize: fontSize.aboutMainPara }} className={`font-[400]
                                            ${checkDifference(e.title?.[language], content?.[4]?.content?.card?.[i]?.title?.[language])}
                                            `}

                                            >
                                                {e.title?.[language] ||
                                                    "Lorem, Ipsum!"
                                                }
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div >
    )
}


export default TemplateThree