import { useSelector } from "react-redux";
import { projectPageData } from "../../../../../assets/index";
import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../../app/fontSizes";

const ServiceDetails = ({ serviceId, content, language, screen, width, highlight, liveContent }) => {
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 700;
    const isPhone = screen < 767;
    const isLeftAlign = language === 'en';
    const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const slug = useSelector(state => state.homeContent?.present?.content?.slug)
    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    // Font and Size
    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"} className="w-full">
            {/* banner */}
            <section className={`py-[120px] ${isPhone ? "px-2 h-[400px]" : "px-20"} flex flex-col justify-center object-cover items-start bg-cover bg-bottom `}
                style={{
                    backgroundImage: `linear-gradient(to left,#00000020 20%,#fffffffb 150%), url(${Img_url + content?.['1']?.content?.images?.[0]?.url})`,
                    padding: `${getDynamicSize(120)} ${getDynamicSize(150)}`,
                    height: (isComputer || isTablet) && getDynamicSize(550)
                }}
            >
                <h1 className={`text-[41px] text-[#292E3D] ${(checkDifference(content?.["1"]?.content?.title?.[language], liveContent?.["1"]?.content?.title?.[language]))}`}
                    style={{ fontSize: fontSize.mainHeading }}
                >
                    {content?.['1']?.content?.title?.[language]}
                </h1>
                <p className={`text-[#0E172FB2] text-[10px] w-2/3 ${(checkDifference(content?.["1"]?.content?.description?.[language], liveContent?.["1"]?.content?.description?.[language]))}`}
                    style={{ fontSize: fontSize.mainPara }}
                >
                    {content?.['1']?.content?.description?.[language]}
                </p>
            </section>

            {/* Sub services */}
            <section
                style={{
                    padding: `${getDynamicSize(50)} ${getDynamicSize(140)}`,
                }}
            >
                <section
                    className={`grid ${isTablet || isPhone ? "grid-cols-1 items-center justify-center " : "grid-cols-2 "}
                    ${(checkDifference(content?.['2']?.items, liveContent?.['2']?.items))}
                    `}
                    style={{
                        // padding: `${getDynamicSize(50)} ${getDynamicSize(112)}`,
                        rowGap: getDynamicSize(30),
                        columnGap: getDynamicSize(35),
                    }}
                >
                    {
                        (content?.['2']?.items || [])?.map((subService, index) => {
                            return (
                                <article key={index + "12i"} className={`border-b flex ${isPhone && "flex-col"} gap-4 pb-[12px]`}>
                                    <article className={`w-full`}
                                        style={{
                                            minWidth: isComputer && getDynamicSize(300),
                                            padding: isComputer && `${getDynamicSize(8)}`,
                                        }}
                                    >
                                        <img
                                            src={Img_url + subService.image}
                                            alt=""
                                            className={`${isTablet || isTablet ? "w-[50vw] aspect-[4/3]" : "w-full"}`}
                                            style={{
                                                width: isComputer && getDynamicSize(300),
                                                height: isComputer && getDynamicSize(191)
                                            }}
                                        />
                                    </article>
                                    <article className="flex w-full flex-col items-start justify-between"
                                        style={{
                                            gap: fontSize.aboutCardPaddingX,
                                            padding: isTablet && `${getDynamicSize(20)} 0px`
                                        }}
                                    >
                                        <h3
                                            className={`${isPhone && "leading-[25px]"}`}
                                            style={{
                                                fontSize: fontSize.aboutMainPara,
                                                // lineHeight: fontSize.headingLeading,
                                                lineHeight: isComputer && getDynamicSize(30)
                                            }}
                                            title={subService?.[titleLan]}
                                        >{TruncateText(subService?.[titleLan], 40)}</h3>
                                        <div className={`${fontLight}`}
                                            style={{ fontSize: fontSize.mainPara }}
                                            dangerouslySetInnerHTML={{ __html: subService?.description?.[language] }}
                                        />
                                        {/* <button
                                        className={`text-[#00B9F2]`}
                                        style={{ fontSize: fontSize.mainButton }}
                                    >
                                        {content?.['2']?.content?.button?.[0]?.text?.[language]}
                                        <img src="" alt="" />
                                        </button> */}
                                        <button
                                            style={{
                                                fontSize: isComputer ? getDynamicSize(16) : "",
                                            }}
                                            className="text-[#00B9F2] flex items-center gap-2 mt-2"
                                        >
                                            {content?.['2']?.content?.button?.[0]?.text?.[language]}
                                            <img
                                                className={language === "en" ? "transform scale-x-[-1]" : ""}
                                                src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                                // width={22}
                                                // height={22}
                                                style={{ width: fontSize.paraLeading, height: fontSize.paraLeading }}
                                                alt="icon"
                                            />
                                        </button>
                                    </article>
                                </article>
                            )
                        })
                    }
                </section>
            </section>

            {/* Other Services */}
            <section>
                <h3
                    className={`text-[#292E3D] font-[400] ${isPhone ? "mx-5" : ""} py-[20px]`}
                    style={{
                        fontSize: fontSize.aboutMainPara,
                        margin: `0px ${getDynamicSize(130)}`,
                        padding: `${getDynamicSize(20)}`
                    }}
                >
                    Other Services
                </h3>
                <section className={`overflow-x-scroll rm-scroll ${isPhone && "py-10"} pt-2
                    ${(checkDifference(content?.['3']?.items, liveContent?.['3']?.items))}
                `}
                    style={{
                        padding: (isComputer || isTablet) && `${getDynamicSize(20)} ${getDynamicSize(60)}`,
                        paddingBottom: (isComputer || isTablet) && `${getDynamicSize(60)}`,
                    }}
                >
                    <section
                        dir={isLeftAlign ? 'ltr' : 'rtl'}
                        className={`flex gap-7 ${isPhone ? "px-[38px] " : ""} pr-[38px] w-fit items-stretch`}
                        style={{
                            padding: isComputer ? `0px ${getDynamicSize(76)}` : isTablet ? `0px ${getDynamicSize(76)}` : "",
                            width: "fit-content"
                        }}
                    >
                        {
                            (content?.['3']?.items || [])?.map((service, idx) => {
                                if (service.slug === slug) return null
                                return (
                                    <article
                                        key={idx}
                                        className="flex flex-col bg-white overflow-hidden shadow"
                                        style={{ width: isComputer ? getDynamicSize(437) : isTablet ? getDynamicSize(600) : getDynamicSize(1000) }}
                                    >
                                        <img src={service.image} alt="img"
                                            className="w-full object-cover"
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
                                                {TruncateText(service?.[titleLan], isTablet ? 18 : 20)}
                                            </h1>
                                            <p className={`text-[#292E3D] text-[10px] mb-2 ${fontLight}`}
                                                style={{ fontSize: fontSize.mainPara }}
                                            >
                                                {service?.description?.[language]}
                                            </p>
                                            <button className={`text-[#00B9F2] flex gap-1 items-center mt-auto ${!isLeftAlign && "flex-rows-reverse"}`}
                                                style={{ fontSize: fontSize.mainPara }}
                                            >
                                                {content?.[3]?.content?.button?.[0]?.text?.[language]}
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
                    </section>
                </section>
            </section>
        </div >
    )
}

export default ServiceDetails