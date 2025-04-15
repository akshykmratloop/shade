import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import { services, projectPageData } from "../../../../assets/index";
import content from './content.json'
import structureOfServiceDetails from "./structures/structureOFServiceDetails.json";
import { TruncateText } from "../../../../app/capitalizeword";

const ServiceDetails = ({ serviceId, contentOn, language, screen }) => {
    const dispatch = useDispatch();
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 767;
    const isPhone = screen < 767;
    const isLeftAlign = language === 'en'
    const ImageFromRedux = useSelector(state => state.homeContent.present.images)
    const contentFromRedux = useSelector(state => state.homeContent.present.serviceDetails)

    const currentContent = contentFromRedux?.filter(
        (item) => item?.id == serviceId
    )[0];

    useEffect(() => {
        if (!currentContent?.[serviceId]) {
            dispatch(updateContent({ currentPath: "serviceDetails", payload: [...content.serviceDetails, { ...structureOfServiceDetails, id: contentFromRedux?.length + 1 }] }))
        } else {
            dispatch(updateContent({ currentPath: "serviceDetails", payload: content.serviceDetails }))
        }
    }, [])
    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"} className="w-full">
            {/* banner */}
            <section className={`py-[120px] px-20 bg-center object-cover text-center flex flex-col items-center`}
                style={{ backgroundImage: `linear-gradient(to bottom,#00000020 ,#fffffffb 100%), url(${services.contructionTowerImage})`, backgroundPosition: "bottom" }}
            >
                <h1 className={`text-[41px] text-[#292E3D]`}>
                    {currentContent?.banner?.title?.[language] || "Project Details"}
                </h1>
                <p className={`text-[#0E172FB2] text-[10px] w-2/3`}>
                    {currentContent?.banner?.description?.[language] || "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit voluptatum numquam inventore sit, necessitatibus vitae?"}
                </p>
            </section>

            {/* Sub services */}
            <section className={`grid grid-cols-2 gap-y-[27px] gap-x-[25px] px-[76px] py-[34px]`}>
                {
                    currentContent?.subServices?.map((subService, index) => {

                        return (
                            <article singleService className={`border-b flex gap-4 pb-[12px]`}>
                                <article className={` w-[197px] py-2`}>
                                    <img src={projectPageData.developmentOfHo} alt="" className={`w-[196px] h-[135px]`} />
                                </article>
                                <article className="w-[194px]">
                                    <h3 className="text-[17px]">Project Service {index + 1}</h3>
                                    <p className="text-[11px]">
                                        We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.
                                    </p>
                                    <button className="text-[#00B9F2] text-[11px]">
                                        Veiw Details
                                        <img src="" alt="" />
                                    </button>
                                </article>
                            </article>
                        )
                    })
                }
            </section>

            {/* Other Services */}
            <section className="w-[988px] overflow-x-scroll rm-scroll py-10">

                <section dir={isLeftAlign ? 'ltr' : 'rtl'}
                    className={`flex gap-10 ml-[76px] w-fit items`}>
                    {currentContent?.otherServices?.map((service, idx) => {
                        if (!service.display) return null
                        return (
                            <article
                                key={idx}
                                className="flex flex-col h-full bg-white \ overflow-hidden shadow w-[300px]"
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
                        )
                    })}
                </section>
            </section>
        </div>
    )
}

export default ServiceDetails