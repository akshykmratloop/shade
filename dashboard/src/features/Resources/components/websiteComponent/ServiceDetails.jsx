import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import { services, projectPageData } from "../../../../assets/index";
import content from './content.json'
import structureOfServiceDetails from "./structures/structureOFServiceDetails.json"
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

    console.log(currentContent)

    useEffect(() => {


        if (!currentContent?.[serviceId]) {
            dispatch(updateContent({ currentPath: "serviceDetails", payload: [...content.serviceDetails, { ...structureOfServiceDetails, id: contentFromRedux?.length + 1 }] }))
        } else {
            dispatch(updateContent({ currentPath: "serviceDetails", payload: content.serviceDetails }))
        }
    }, [])
    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"}>
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

            <section>
                <article singleService>
                    <div>
                        <img src={""} alt="" />
                    </div>
                    <article>
                        <h3 className="text-[17px]">Project Service 1</h3>
                        <p className="text-[11px]">
                        We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.
                        </p>
                        <button className="text-[#00B9F2]">
                            Veiw Details
                            <img src="" alt="" />
                        </button>
                    </article>
                </article>
            </section>
        </div>
    )
}

export default ServiceDetails