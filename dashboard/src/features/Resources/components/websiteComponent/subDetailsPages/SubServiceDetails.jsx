import content from '../content.json'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateContent } from '../../../../common/homeContentSlice';
import { services } from '../../../../../assets/index'
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SubServiceDetails = ({ serviceId, contentOn, language, screen, deepPath }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const ImagesFromRedux = useSelector(state => state.homeContent.present.images)
    let isLeftAlign = language === "en";

    const dispatch = useDispatch()
    let pageIndex
    const currentContent = contentOn?.[serviceId]?.filter(
        (item, i) => {
            if (item?.id == deepPath) pageIndex = i
            return item?.id == deepPath
        }
    )[0];

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


    useEffect(() => {
        dispatch(updateContent({ currentPath: "subOfsubService", payload: content.subOfsubService }))
    }, [])
    return (
        <div dir={isLeftAlign ? 'ltr' : "rtl"}>
            {/* banner */}
            <section className='px-[75px] py-[50px] pb-[25px]'>
                <article className='flex flex-col gap-[34px]'>
                    <section className='flex gap-[30px]'>
                        <h2 className='text-[35px] w-1/2'>{currentContent?.banner?.title?.[language]}</h2>
                        <div className='text-[9.5px] w-1/2' dangerouslySetInnerHTML={{ __html: currentContent?.banner?.description?.[language] }} />
                    </section>
                    <div>
                        <img src={ImagesFromRedux?.[`subServiceBanner/${serviceId}/${deepPath}`] || services?.[currentContent?.banner?.image]} alt="" className='aspect-[3.5/1] object-cover' />
                    </div>
                    <section className='flex gap-[30px]'>
                        <h2 className='text-[32px]  flex-1 leading-[28px]'>{currentContent?.subBanner?.title?.[language]}</h2>
                        <div className='text-[9.5px] flex-1' dangerouslySetInnerHTML={{ __html: currentContent?.subBanner?.description?.[language] }} />
                    </section>
                </article>
            </section>

            {/* Services */}
            <section className='px-[75px] py-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[30px] auto-rows-fr'>
                {
                    currentContent?.descriptions?.map((description, i) => {

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
                        slidesOffsetBefore={isLeftAlign ? 15 : -10}
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
                        {currentContent?.gallery1?.map(
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
                                            className="w-[374px] aspect-[2/1] object-cover border border-gray-200"
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </div>
            </section>

            {/* description section */}
            <section className='px-[75px] py-[25px] flex flex-col gap-[25px]'>
                {
                    currentContent?.descriptions2?.map((description, i) => {

                        return (
                            <article className='flex flex-col gap-[32px]' key={i}>
                                <section className='flex gap-[30px]'>
                                    <h2 className='text-[32px] w-1/2 grow-1 leading-[28px]'>{description?.title?.[language]}</h2>
                                    <p className='text-[9.5px] w-1/2'>{description?.description?.[language]}</p>
                                </section>
                            </article>
                        )
                    })
                }
            </section>

            {/* gallery 2 */}
            <section className='px-[76px] py-[25px] pb-[50px] grid grid-cols-4 gap-y-[11px] gap-x-[11px]'>
                {currentContent?.gallery2?.map(
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

                                    <div className="absolute z-20 inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent border border-cyan-600 grid">
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