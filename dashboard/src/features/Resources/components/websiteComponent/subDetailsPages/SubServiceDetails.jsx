// import content from '../content.json'
import { useEffect, useRef } from 'react'
// import { updateMainContent } from '../../../../common/homeContentSlice';
// import { services } from '../../../../../assets/index'
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Img_url } from '../../../../../routes/backend';
import dynamicSize, { defineDevice, differentText, generatefontSize } from '../../../../../app/fontSizes';
import { useSelector } from 'react-redux';

const SubServiceDetails = ({ serviceId, content, language, screen, deepPath, width, liveContent, highlight }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === "en";
    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    // const dispatch = useDispatch()
    const swiperRef = useRef(null);

    // Font and Size
    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (swiperRef.current) {
                swiperRef.current.slideTo(0);
                swiperRef.current.update();
                swiperRef.current.autoplay?.start();
            }
        }, 100); // slight delay ensures DOM is ready

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Only run when switching out of phone view
        if (!isPhone && swiperRef.current) {
            swiperRef.current.slideTo(0);        // Reset to first slide
            swiperRef.current.update();          // Force layout refresh
            swiperRef.current.autoplay?.start(); // Restart autoplay if paused
        }
    }, [isPhone]); // 👈 run effect *when isPhone changes*


    return (
        <div dir={isLeftAlign ? 'ltr' : "rtl"}>
            {/* banner */}
            <section className={`${isPhone ? "" : "px-[75px]"} py-[50px] pb-[25px]`}
                style={{ padding: `${getDynamicSize(112)} ${getDynamicSize(130)} ${getDynamicSize(40)}` }}
            >
                <article className={`flex flex-col gap-[34px] ${isPhone ? "" : ""}`}>
                    <section className={`flex gap-[30px] ${isPhone ? "flex-col px-[10px]" : ""}`}>
                        <h2 className={`${isPhone ? "leading-[30px]" : "w-1/2"}
                        ${checkDifference(content?.[1]?.content?.title?.[language], liveContent?.[1]?.content?.title?.[language])}
                        `}
                            style={{ fontSize: fontSize.serviceHeading, lineHeight: isComputer && getDynamicSize(35) }}
                        >
                            {content?.[1]?.content?.title?.[language]}
                        </h2>
                        <div className={`text-[9.5px] ${isPhone ? "" : "w-1/2"} ${fontLight}
                        ${checkDifference(content?.[1]?.content?.description?.[language], liveContent?.[1]?.content?.description?.[language])}
                        `}
                            style={{ fontSize: fontSize.mainPara }}
                            dangerouslySetInnerHTML={{ __html: content?.[1]?.content?.description?.[language] }}
                        />
                    </section>
                    <div>
                        <img src={Img_url + content?.[1]?.content?.images?.[0]?.url} alt=""
                            className={`${isPhone ? "aspect-[2/1]" : "w-full aspect-[3.5/1]"} object-cover
                        ${checkDifference(content?.[1]?.content?.images?.[0]?.url, content?.[1]?.content?.images?.[0]?.url)}
                        `} />
                    </div>
                    <section className={`flex gap-[30px]  ${isPhone ? "flex-col px-[10px]" : ""}`}>
                        <h2 className={`text-[32px]  flex-1 leading-[30px]
                        ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                        `}
                            style={{ fontSize: fontSize.serviceHeading, lineHeight: isComputer && getDynamicSize(35) }}
                        >{content?.[2]?.content?.title?.[language]}</h2>
                        <div className={`text-[9.5px] flex-1
                        ${checkDifference(content?.[2]?.content?.description?.[language], liveContent?.[2]?.content?.description?.[language])}
                        `}
                            style={{ fontSize: fontSize.mainPara }}
                            dangerouslySetInnerHTML={{ __html: content?.[2]?.content?.description?.[language] }} />
                    </section>
                </article>
            </section >

            {/* Services */}
            < section
                style={{
                    padding: (isComputer || isTablet) && `0px ${getDynamicSize(130)} ${getDynamicSize(40)}`,
                    gap: getDynamicSize(40)
                }}
                className={`py-16 px-10 grid ${isPhone ? "grid-cols-1" : "grid-cols-2 px-[75px]"} auto-rows-fr`}>
                {
                    content?.[2]?.content?.points?.map((point, i) => {

                        return (
                            <article className='px-[37px] py-[20px] bg-[#00B9F212]' key={i + point?.title?.[language]}
                                style={{ padding: `${getDynamicSize(30)} ${getDynamicSize(55)}` }}
                            >
                                <h3 className={`text-[25px]
                        ${checkDifference(point?.title?.[language], liveContent?.[2]?.content?.points?.[i]?.title?.[language])}
                                `}
                                    style={{ fontSize: fontSize.aboutMainPara }}
                                >{point?.title?.[language]}</h3>
                                <p className={`text-[11px] ${fontLight}
                        ${checkDifference(point?.description?.[language], liveContent?.[2]?.content?.points?.[i]?.description?.[language])}
                                `}
                                    style={{ fontSize: fontSize.mainPara }}
                                >
                                    {point?.description?.[language]}
                                </p>
                            </article>
                        )
                    })
                }
            </section >

            {/* gallery 1 and slider */}
            < section className='py-[25px]' >
                <div className={`relative w-[full] ${!isLeftAlign && "scale-x-[-1]"} py-1
                ${checkDifference(content?.[3]?.content?.images, liveContent?.['3']?.content?.images)}
                `} dir='ltr'>
                    <Swiper
                        modules={[Autoplay, EffectCoverflow]}
                        grabCursor={true}
                        slidesPerView={isPhone ? 1 : 2.5}
                        loop={true}
                        spaceBetween={10}
                        slidesOffsetBefore={isLeftAlign ? isComputer ? 15 : 0 : -10}
                        autoplay={{
                            delay: 2400,
                            disableOnInteraction: false,
                        }}
                        // effect="coverflow"
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 250,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        // breakpoints={{
                        //     1024: {slidesPerView: isPhone ? 1 : 2.5},
                        //     724: { slidesPerView: isPhone ? 1 : 2.5 },
                        //     0: { slidesPerView: 1 },
                        // }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)} // 👈 capture swiper instance
                    >
                        {content?.[3]?.content?.images?.map(
                            (image, index) => (
                                <SwiperSlide key={index}
                                    dir={isLeftAlign ? "ltr" : "rtl"}
                                >
                                    <div className={`${isComputer && ""}`}>
                                        <img
                                            src={Img_url + image.url}
                                            height={""}
                                            width={""}
                                            alt={image.title?.[language]}
                                            className={`aspect-[2/1] object-cover border border-gray-200
                                                ${checkDifference(image.url, liveContent?.[3]?.content?.images?.[index]?.url)}
                                                `}
                                            style={{ width: isComputer ? getDynamicSize(560) : isPhone ? '100%' : "" }}
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </div>
            </section >

            {/* description section */}
            {/* <section className={`${!isPhone && "px-[75px]"} py-[25px] flex flex-col gap-[25px]`}>
                {
                    content?.descriptions2?.map((description, i) => {

                        return (
                            <article className='flex flex-col gap-[32px]' key={i}>
                                <section className={`flex gap-[30px] ${isPhone ? "flex-col px-[30px]" : ""}`}>
                                    <h2 className={`text-[32px] ${!isPhone && "w-1/2"} grow-1 leading-[28px]`}>{description?.title?.[language]}</h2>
                                    <p className={`text-[9.5px] ${!isPhone && "w-1/2"}`}>{description?.description?.[language]}</p>
                                </section>
                            </article>
                        )
                    })
                }
            </section> */}

            {/* gallery 2 */}
            {/* <section className={`py-[25px] pb-[50px] grid ${isPhone ? "grid-cols-2 px-3 gap-y-[12px] gap-x-[6px]" : "grid-cols-4 px-[76px] gap-y-[11px] gap-x-[11px]"} `}>
                {content?.gallery2?.map(
                    (images, index) => (
                        <div className="relative w-fit" key={index}>
                            <img
                                src={ImagesFromRedux?.[`subService/${serviceId}/gallery2/${deepPath}/${index}`] || services?.[images.url]}
                                height={""}
                                width={""}
                                alt={"slideder image " + index}
                                className="aspect-[1/1.15] object-cover border border-gray-200"
                            />
                            {
                                index === 0 &&
                                <>

                                    <div className="absolute z-20 inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent grid">
                                        <h3 className='text-[#fff] self-end px-4 text-[15px]'>Work Include</h3>
                                    </div>
                                </>
                            }
                        </div>
                    )
                )}
            </section> */}
        </div >
    )
}

export default SubServiceDetails