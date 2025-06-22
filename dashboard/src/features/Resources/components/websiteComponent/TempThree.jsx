import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";
import { services } from "../../../../assets";
import { TruncateText } from "../../../../app/capitalizeword";


const TemplateThree = ({ content, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light);

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width);
    const getDynamicSize = (size) => dynamicSize(size, width);

    const tempArr = [1, 2, 3, 4]

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => "";

    return (
        <div>
            <section
                className="flex items-center"
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    height: getDynamicSize(750)
                }}
            >
                <div className="flex"
                    style={{
                        gap: (isComputer) && getDynamicSize(50),
                    }}
                >

                    <div className="flex flex-col items-start justify-center"
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
                        >
                            {content?.[1]?.content?.title?.[language] || "LOREM IPSUM"}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.testimonialsQuote }}
                        >
                            {content?.[1]?.content?.title?.[language] ||
                                `Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.
                        
                            Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.`
                            }
                        </p>
                        <button className="p-4 bg-[#00B9F2] text-white rounded-[6px]"
                            style={{ fontSize: fontSize.mainPara }}
                        >
                            {content?.[1]?.content?.button?.[0]?.text?.[language] || "Lorem Ipsum"}
                        </button>
                    </div>
                    <div className="border"
                        style={{
                            // flex: `1 1 auto`
                            width: (isComputer) && getDynamicSize(685)
                        }}
                    >
                        <img
                            src={`${projectPageData.asphaltWork}`} alt=""
                            // style={{ width: (isComputer) && getDynamicSize(685) }}
                            className="aspect-[2.1/1] w-full"
                        />
                    </div>
                </div>
            </section>

            <section
                className="bg-[#00B9F20A]"
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }
                }>

                <section className={`flex gap-[10px] ${isPhone ? "flex-col p-1" : ""}`}>
                    <h2 className={`text-[32px] flex-1 leading-[28px]
                                                    ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                                                    `}
                        style={{ fontSize: fontSize.experienceHeading, lineHeight: isComputer && getDynamicSize(40) }}
                    >
                        {
                            content?.[2]?.content?.title?.[language] ||
                            "Project Description"
                        }
                    </h2>
                    <div className={`text-[9.5px] flex-1 ${fontLight}
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
                        className={`flex gap-7 ${isPhone ? "px-[38px] " : ""} pr-[38px] w-fit items-stretch text-`}
                        style={{
                            padding: isComputer ? `0px ${getDynamicSize(76)}` : isTablet ? `0px ${getDynamicSize(76)}` : "",
                            width: "fit-content"
                        }}
                    >
                        <article className="bg-[#73D9F8] rounded-[6px]"
                            style={{
                                width: (isComputer) && getDynamicSize(362),
                                padding: (isComputer) && getDynamicSize(20)
                            }}
                        >
                            <h3 style={{ fontSize: fontSize.aboutMainPara }}>
                                Lorem, ipsum.
                            </h3>
                            <p className={`${fontLight}`}
                                style={{ fontSize: fontSize.mainPara }}
                            >
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will a reader will
                            </p>
                        </article>
                        {
                            (content?.['3']?.items ||
                                tempArr ||
                                []
                            )?.map((service, idx) => {
                                // if (service.slug === slug) return null
                                return (
                                    <article
                                        key={idx}
                                        className="flex flex-col bg-white overflow-hidden shadow rounded-[6px]"
                                        style={{ width: isComputer ? getDynamicSize(437) : isTablet ? getDynamicSize(600) : getDynamicSize(1000) }}
                                    >
                                        <img src={service.image} alt="img"
                                            className="w-full object-cover rounded-[6px]"
                                            style={{ height: isComputer ? getDynamicSize(210) : isTablet ? getDynamicSize(400) : getDynamicSize(437) }}
                                        />
                                        <section className="bg-[#F8F8F8] flex flex-col justify-between flex-1"
                                            style={{
                                                padding: `${getDynamicSize(16)} ${getDynamicSize(25)}`,
                                                gap: isComputer ? getDynamicSize(10) : getDynamicSize(25)
                                            }}
                                        >
                                            <h1 className="text-[#292E3D] text-[22px] font-[400]"
                                                style={{ fontSize: fontSize.aboutMainPara, lineHeight: (isComputer || isTablet) && getDynamicSize(30) }}
                                            >
                                                {TruncateText(service?.[titleLan], isTablet ? 18 : 20) ||
                                                    "Project Services"}
                                            </h1>
                                            <p className={`text-[#292E3D] text-[10px] mb-2 ${fontLight}`}
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
                <div className="flex"
                    style={{ gap: `${getDynamicSize(30)}` }}
                >
                    <div className="border h-fit"
                        style={{ flex: `1 1 ${getDynamicSize(510)}` }}
                    >
                        <img src={projectPageData.itLabExcellence} className="w-full aspect-[1/1.1]" alt="" />
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
                        >
                            Project Services
                        </h3>
                        <p className={`${fontLight}`}
                            style={{
                                fontSize: fontSize.mainPara
                            }}
                        >
                            Our company has been the leading provided construction services to clients throughout the Dubai since 1992.
                        </p>
                        <div className="grid grid-cols-3"
                            style={{
                                gap: (isComputer) && getDynamicSize(23)
                            }}
                        >
                            {
                                tempArr?.map((e, i) => {
                                    return (
                                        <div className="border aspect-[1/.91]">
                                            Lorem, ipsum.
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