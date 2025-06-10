import content from '../content.json'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateMainContent } from '../../../../common/homeContentSlice';
import { services } from '../../../../../assets/index'
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SubServiceDetails = ({ serviceId, content, language, screen, deepPath }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const ImagesFromRedux = useSelector(state => state.homeContent.present.images)
    let isLeftAlign = language === "en";

    const dispatch = useDispatch()
    const swiperRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (swiperRef.current) {
                swiperRef.current.update();
                swiperRef.current.autoplay?.start();
            }
        }, 100); // slight delay ensures DOM is ready

        return () => clearTimeout(timer);
    }, []);


    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "subOfsubService", payload: content.subOfsubService }))
    // }, [])
    return (
        <div dir={isLeftAlign ? 'ltr' : "rtl"}>
            {/* banner */}
            <section className={`${isPhone ? "" : "px-[75px]"} py-[50px] pb-[25px]`}>
                <article className={`flex flex-col gap-[34px] ${isPhone ? "" : ""}`}>
                    <section className={`flex gap-[30px] ${isPhone ? "flex-col px-[30px]" : ""}`}>
                        <h2 className={`text-[35px] ${isPhone ? "" : "w-1/2"}`}>
                            {content?.[1]?.content?.title?.[language]}
                        </h2>
                        <div className={`text-[9.5px] ${isPhone ? "" : "w-1/2"}`}
                            dangerouslySetInnerHTML={{ __html: content?.[1]?.content?.description?.[language] }}
                        />
                    </section>
                    <div>
                        <img src={content?.[1]?.content?.images?.[0]?.url} alt="" className={`${isPhone ? "aspect-[2/1]" : "aspect-[3.5/1]"} object-cover`} />
                    </div>
                    <section className={`flex gap-[30px]  ${isPhone ? "flex-col px-[30px]" : ""}`}>
                        <h2 className='text-[32px]  flex-1 leading-[28px]'>{content?.[2]?.content?.title?.[language]}</h2>
                        <div className='text-[9.5px] flex-1' dangerouslySetInnerHTML={{ __html: content?.[2]?.content?.description?.[language] }} />
                    </section>
                </article>
            </section>

            {/* Services */}
            <section className={` py-[20px] grid ${isPhone ? "grid-cols-1 px-[30px]" : "grid-cols-2 px-[75px]"} gap-x-[20px] gap-y-[30px] auto-rows-fr`}>
                {
                    content?.descriptions?.map((description, i) => {

                        return (
                            <article className='px-[37px] py-[20px] bg-[#00B9F212]' key={i + description?.title?.[language]}>
                                <h3 className={`text-[25px]`}>{description?.title?.[language]}</h3>
                                <p className={`text-[11px]`}>{description?.description?.[language]}</p>
                            </article>
                        )
                    })
                }
            </section>

            {/* gallery 1 and slider */}
            <section className='py-[25px]'>
                <div className={`relative w-[full] ${!isLeftAlign && "scale-x-[-1]"}`} dir='ltr'>
                    <Swiper
                        modules={[Autoplay, EffectCoverflow]}
                        grabCursor={true}
                        slidesPerView={isPhone ? 1 : 3}
                        loop={true}
                        spaceBetween={2}
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
                        breakpoints={{
                            724: { slidesPerView: isPhone ? 1 : 2.5 },
                            500: { slidesPerView: 1 },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)} // 👈 capture swiper instance
                    >
                        {content?.gallery1?.map(
                            (images, index) => (
                                <SwiperSlide key={index}
                                    dir={isLeftAlign ? "ltr" : "rtl"}
                                >
                                    <div className="">
                                        <img
                                            src={ImagesFromRedux?.[`subService/${serviceId}/gallery/${deepPath}/${index}`] || services?.[images.url]}
                                            height={""}
                                            width={""}
                                            alt={"slideder image " + index}
                                            className={`${isPhone ? "w-full" : "w-[374px]"} aspect-[2/1] object-cover border border-gray-200`}
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </div>
            </section>

            {/* description section */}
            <section className={`${!isPhone && "px-[75px]"} py-[25px] flex flex-col gap-[25px]`}>
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
            </section>

            {/* gallery 2 */}
            <section className={`py-[25px] pb-[50px] grid ${isPhone ? "grid-cols-2 px-3 gap-y-[12px] gap-x-[6px]" : "grid-cols-4 px-[76px] gap-y-[11px] gap-x-[11px]"} `}>
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
            </section>
        </div >
    )
}

export default SubServiceDetails