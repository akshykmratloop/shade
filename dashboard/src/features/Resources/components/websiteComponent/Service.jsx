import React, { useEffect, useState } from "react";
import Arrow from "../../../../assets/icons/right-wrrow.svg"; ///assets/icons/right-wrrow.svg
import { useDispatch, useSelector } from "react-redux";
import content from "./content.json"
import { updateContent } from "../../../common/homeContentSlice";
import { services, projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";
const Services = ({ currentContent, screen, language }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const ImagesFromRedux = useSelector(state => state.homeContent.present.images);
    const dispatch = useDispatch()



    useEffect(() => {
        dispatch(updateContent({ currentPath: "services", payload: (content?.services) }))
    }, [])
    return (
        <div className="">
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{ backgroundImage: `linear-gradient(to right,#00000020 30%,#fffffffb 100%) ,url("${ImagesFromRedux?.['ServiceBanner'] || services.contructionTowerImage}")`, backgroundPosition: "bottom" }}
            >
                <div className="container relative h-full flex items-center justify-end">
                    <div className={`${isLeftAlign ? 'scale-x-[-1] text-left' : 'text-right'} ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} space-y-4 p-6 flex flex-col ${isLeftAlign ? "items-start" : "items-end"}`}>
                        <h1 className={`text-[#292E3D]  font-medium ${isPhone ? "text-[40px] leading-[50px]" : isTablet ? "text-[45px] leading-[55px]" : "text-[45px] leading-[77px]"} tracking-[-3.5px] mb-4`}>
                            {currentContent?.banner?.title[language]}
                        </h1>
                        <p className="text-[#0E172FB2] text-[12px] font-semibold leading-[26px]  word-spacing-5">
                            {currentContent?.banner?.description[language]}
                        </p>
                        <button
                            className={`relative items-center flex ${isLeftAlign ? "" : "flex-row-reverse"} gap-1 text-[12px] font-medium px-[12px] py-[6px] px-[12px] bg-[#00b9f2] text-white rounded-md`}
                            onClick={() => { }}
                        >
                            {currentContent?.banner?.button?.[language]}

                            <img
                                src={Arrow}
                                width="10"
                                height="11"
                                alt=""
                                style={{ transform: isLeftAlign ? "rotate(180deg)" : "" }}
                            />
                        </button>
                    </div>
                </div>
            </section>
            <section dir={isLeftAlign ? 'ltr' : 'rtl'}
                className={`grid ${isPhone ? " py-[80px] grid-cols-1" : "py-[20px] grid-cols-2"} ${isTablet ? "px-[60px]" : isPhone ? "px-[40px]" : "px-[100px]"} gap-x-[28px] gap-y-10 auto-rows-fr`}>
                {currentContent?.serviceCards?.map((service, idx) => (
                    <article
                        key={idx}
                        className="flex flex-col h-full bg-white \ overflow-hidden shadow"
                    >
                        <img src={service.image} alt="img" className="w-full object-cover h-[176px]" />
                        <section className="bg-[#F8F8F8] py-[14px] px-[18px] flex flex-col justify-between flex-1">
                            <h1 className="text-[#292E3D] text-[22px] font-[400]">
                                {TruncateText(service?.title?.[language], isTablet ? 15 : 23)}
                            </h1>
                            <p className="text-[#292E3D] text-[10px] mb-2">
                                {service?.subtitle?.[language]}
                            </p>
                            <button className={`text-[#00B9F2] flex gap-1 items-center mt-auto ${!isLeftAlign && "flex-rows-reverse"}`}>
                                {service?.button?.[language]}
                                <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                    alt=""
                                    className={`${isLeftAlign && "rotate-[180deg]"} w-[16px] h-[16px]`}
                                />
                            </button>
                        </section>
                    </article>
                ))}
            </section>

            {!(currentContent?.serviceCards.lenght > 6) &&
                < div className="flex justify-center py-10" >
                    <button className="bg-[#00B9F2] text-[#fff] p-[11px] rounded-[6px]">
                        {currentContent?.button?.[language]}
                    </button>
                </div>}

        </div >
    );
};

export default Services;