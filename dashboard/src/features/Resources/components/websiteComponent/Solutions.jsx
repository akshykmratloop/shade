import { useSelector } from "react-redux";

import { Img_url } from "../../../../routes/backend";
import arrow from "../../../../assets/icons/right-wrrow.svg";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";

import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

const SolutionPage = ({ currentContent, language, screen, width }) => {
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    const isLeftAlign = language === 'en'

    // Font and Size
    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)



    return (
        <div className=" bankgothic-medium-dt pb-8" dir={language === 'en' ? 'ltr' : "rtl"}>
            {/** banner  1 */}
            <section
                className={`relative py-[8rem] w-full border bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''} px-12 ${isPhone ? "h-[500px]" : ""}`}
                style={{
                    backgroundImage: `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})`,
                    height: (isComputer || isTablet) && getDynamicSize(720),
                    padding: `0px ${getDynamicSize(150)}`
                }}
            >
                <div className="container h-full relative flex items-center justify-center">
                    <div className={`text-${isLeftAlign ? 'left' : 'right'} w-full transform ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className="text-[#292E3D] text-[40px] font-medium leading-[77px] tracking-[-3.5px] mb-4"
                            style={{ fontSize: fontSize.mainHeading }}
                        >
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h1>
                        <p
                            style={{ fontSize: fontSize.mainPara }}
                            className={`text-[#0E172FB3] ${fontLight} text-left text-xs font-semibold leading-[26px] mb-6 ${isLeftAlign ? "" : "ml-auto"} ${isPhone ? "w-[70%]" : "w-[50%]"} word-spacing-[5px]`}>
                            {currentContent?.["1"]?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative  py-[6px] px-[12px] flex gap-2 items-center text-xs text-[white] font-medium ${isLeftAlign ? "" : "ml-auto"} bg-[#00B9F2] rounded-[4px] border-none cursor-pointer`}
                            style={{
                                fontSize: fontSize.mainButton,
                                padding: `${getDynamicSize(12)} ${getDynamicSize(16)}`
                            }}
                        >
                            {currentContent?.["1"]?.content?.button?.[0]?.text?.[language]}
                            <img
                                src={arrow}
                                width={11}
                                height={11}
                                alt="arrow"
                                className="left-[32px] scale-x-[-1]"
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/** What we do 2 */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"}`}
                style={{ padding: `${getDynamicSize(88)} ${getDynamicSize(150)}` }}
            >
                {currentContent?.["2"]?.content?.map((e, i) => {
                    return (
                        <div className="container bankgothic-regular-db-mt" key={i}>
                            <div className={`${isPhone || isTablet ? "flex flex-col" : "grid  "} `}
                            style={{gap: getDynamicSize(50), gridTemplateColumns: `${getDynamicSize(200)} 1fr`}}
                            >
                                <div className={`flex justify-start w-[190px] py-[14px]`}>
                                    <span className="relative w-[10px] h-[20px]">
                                        <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                                    </span>
                                    <h1 className="text-[20px] text-[#1F2937] font-bold leading-[20px] pr-[20px]"
                                        style={{ fontSize: isComputer && `${getDynamicSize(20)}` }}
                                    >
                                        {e?.title?.[language]}
                                    </h1>
                                </div>
                                <div className="text-[#2A303C]">
                                    <div
                                        style={{ fontSize: isComputer && `${getDynamicSize(24)}`, lineHeight: isComputer && getDynamicSize(50) }}
                                        className={`  ${isPhone ? `leading-[20px] text-sm` : "leading-[40px]"} ${fontLight} tracking-[-1.2px] mb-[32px]`}
                                        // className={` font-light text-[#1F2937] ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        dangerouslySetInnerHTML={{ __html: e?.description?.[language] }}
                                    />

                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>


            {/** gallary wrap 3 */}
            <div
                className="w-[800px] mx-auto"
                style={{
                    width: isComputer ? "50rem" : `${screen - 30}px`,
                    // direction: isRTL ? "rtl" : "ltr"  // Add this line
                }}
            >
                <Swiper
                    className=""
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={isPhone ? 1 : 2}
                    loop={true}
                    spaceBetween={10}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            swiper?.autoplay?.start();
                        }, 500);
                    }}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 250,
                        modifier: 2,
                        slideShadows: false,
                    }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    // dir={isRTL ? "rtl" : "ltr"} // Add this line
                    breakpoints={{
                        724: { slidesPerView: isPhone ? 1 : 2 },
                        500: { slidesPerView: isPhone ? 1 : 2 },
                    }}
                >
                    {(currentContent?.["3"]?.content?.images || []).map((image, index) => (
                        <SwiperSlide key={`slide-${index}`}>
                            <div className="flex justify-center">
                                <img
                                    src={image.url.slice(0, 5) === "https" ? image.url : Img_url + image.url}
                                    alt={`Image ${index + 1}`}
                                    className="object-cover w-[400px] h-[400px] rounded-md border"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {/** HowWeDo */}
            {/* <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"}`}
            >
                {currentContent?.howWeDo?.map((e, i) => {
                    return (
                        <div className="container bankgothic-regular-db-mt" key={i}>
                            <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[129px_1fr] gap-[67px]"} `}>
                                <div className={`flex justify-start w-[190px] py-[14px]`}>
                                    <span className="relative w-[10px] h-[20px]">
                                        <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                                    </span>
                                    <h1 className="text-[20px] text-[#1F2937] font-bold leading-[20px] pr-[20px]">
                                        {e?.title?.[language]}
                                    </h1>
                                </div>
                                <div>
                                    <div
                                        className={` font-light ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        // className={` font-light text-[#1F2937] ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        dangerouslySetInnerHTML={{ __html: e?.description?.[language] }}
                                    />

                                </div>
                            </div>
                        </div>
                    )
                })}
            </section> */}

        </div>
    );
};

export default SolutionPage;