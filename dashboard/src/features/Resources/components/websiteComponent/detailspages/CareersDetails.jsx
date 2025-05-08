import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateMainContent } from "../../../../common/homeContentSlice";
import content from '../content.json'
import structureOfCareerDetails from "../structures/structureOFCareerDetails.json";

// import styles from "@/components/career/career_detail.module.scss";
// import Image from "next/image";
// import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
// import { useRouter } from "next/router";
// import ApplyModal from "./ApplyModal";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });
// import { useGlobalContext } from "../../contexts/GlobalContext";

const CareerDetailPage = ({ contentOn, language, careerId, screen }) => {
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 767;
    const isPhone = screen < 767;
    const dispatch = useDispatch()
    const contentFromRedux = useSelector(state => state.homeContent.present.careerDetails)
    const ImageFromRedux = useSelector(state => state.homeContent.present.images)
    const isLeftAlign = language === 'en';

    const currentContent = contentFromRedux?.filter(
        (item) => item?.id == careerId
    )[0];

    const { banner, jobDetails } = currentContent || {};

    // const router = useRouter();
    //   const [isModal, setIsModal] = useState(false);
    //   const handleApply = () => {
    //     setIsModal(true);
    //   };
    //   const handleApplyClose = () => {
    //     setIsModal(false);
    //   };


    useEffect(() => {
        if (!currentContent?.[careerId]) {
            dispatch(updateMainContent({ currentPath: "careerDetails", payload: [...content.careerDetails, { ...structureOfCareerDetails, id: 4 }] }))
        } else {
            dispatch(updateMainContent({ currentPath: "careerDetails", payload: content.careerDetails }))
        }
    }, [])

    return (
        <div className={`${isPhone ? "px-1": "px-10"}`} dir={isLeftAlign ? "ltr" : "rtl"}>
            <section className={`mt-[50px] mb-[20px] ${language === "ar" ? "text-right" : ""}`}>
                <div className="container mx-auto px-4">
                    <div className="relative mb-[20px]">
                        <img
                            src={ImageFromRedux?.[`careerBanner/${careerId}`] || banner?.bannerImage || "https://loopwebsite.s3.ap-south-1.amazonaws.com/image+13.jpg"}
                            alt=""
                            className="w-full h-[380px] object-cover object-center mb-7"
                        />
                        <button
                            className="absolute top-[50px] flex items-center gap-2 text-gray-700 font-bold px-3 py-2 bg-white border-none cursor-pointer"
                        // onClick={() => router.push(`/career`)}
                        >
                            <img
                                src={"https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"}
                                alt=""
                                width={20}
                                height={20}
                                className="transform scale-x-[-1]"
                            />
                            {banner?.button?.[language]}
                        </button>
                        <h2 className={`text-[#292E3D] text-[28px] font-bold mb-5`}>
                            {banner?.title[language] || "Heading"}
                        </h2>
                        <p className={`text-[#0E172FB3] text-[16px] font-light`}>
                            {banner?.subTitle[language] || "Description"}
                        </p>
                    </div>
                </div>
            </section>

            <section className={`${isPhone ? "px-5": ""} py-5`}>
                <div className={`container mx-auto px-4 flex ${isTablet || isPhone ? "flex-col" : ""} gap-[50px]`}>
                    <div className={`${isTablet || isPhone ? "" : "min-w-[383.6px]"}`}>
                        {jobDetails?.leftPanel?.sections.map((section, index) => (
                            <div key={index} className="mb-[30px]">
                                <h2 className="text-[#292E3D] text-[20px] font-bold mb-3">
                                    {section?.title[language] || "Section Heading"}
                                </h2>
                                <ul className="list-disc pl-5">
                                    <div className="text-[#0E172FB3] text-[12px] font-light mb-1 importantList" dangerouslySetInnerHTML={{ __html: section?.content[language] || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quo sapiente cum eaque dignissimos ex! Libero expedita qui quo vitae!" }} />

                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className={`${isTablet ? "w-[350px] self-center":isPhone ? "" : "min-w-[300px]"}`}>
                        <div className="bg-gray-100 p-7 mb-6">
                            <button
                                className="block mx-auto py-1 px-4 bg-[#00B9F2] text-white rounded-md"
                            // onClick={handleApply}
                            >
                                {jobDetails?.rightPanel?.button?.[language] || "button"}
                            </button>
                            <h3 className="text-[#292E3D] text-[24px] font-bold my-8">
                                {jobDetails?.rightPanel?.title[language] || "Summary"}
                            </h3>
                            {jobDetails?.rightPanel?.tailwraps?.map((tail, index) => (
                                <div className="flex items-center gap-4 mb-5" key={index}>
                                    <img
                                        src={ImageFromRedux?.[`careerRightPanel/${careerId}/${index}`] || tail.icon || "https://loopwebsite.s3.ap-south-1.amazonaws.com/subway_location.svg"}
                                        alt={tail?.title[language]}
                                        width={32}
                                        height={32}
                                    />
                                    <div>
                                        <h5 className="text-[#B7B7B7] text-[15px] font-light">
                                            {tail?.description[language] || "Lorem Ipsum"}
                                        </h5>
                                        <h6 className="text-[#292E3D] text-[15px] font-light">
                                            {tail?.title[language] || "Lorem Ipsum"}
                                        </h6>
                                    </div>
                                </div>
                            ))}
                            <Link
                                to={jobDetails?.rightPanel?.viewAllButton?.link}
                                className="text-[#00B9F2] underline mt-12 block"
                            >
                                {jobDetails?.rightPanel?.viewAllButton?.text[language] || "Redirect"}
                            </Link>
                        </div>

                        {/* Social Share currently inpresent in the data */}
                        <div>
                            <h5 className="text-[#292E3D] text-[17px] font-light mb-4">
                                {jobDetails?.rightPanel?.socialShare?.title[language]}
                            </h5>
                            <div className="flex items-center gap-4">
                                {jobDetails?.rightPanel?.socialShare?.socialLinks?.map((link) => (
                                    <Link href={link?.link} key={link.id}>
                                        <img
                                            src={link.icon}
                                            alt=""
                                            width={42}
                                            height={42}
                                            className="w-[42px] h-[42px]"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="block mx-auto mt-[32px] mb-[50px] py-[6px] px-4 bg-[#00B9F2] text-white rounded-md"
                // onClick={handleApply}
                >
                    {jobDetails?.button?.[language] || "Apply Here"}
                </button>
            </section>

            {/* <ApplyModal
        isModal={isModal}
        jobTitle={banner?.title[language]}
        onClose={handleApplyClose}
      /> */}
        </div>
    );
};

export default CareerDetailPage;
