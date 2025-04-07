import React, { useEffect, useState } from "react";
// import styles from "@/components/career/career_detail.module.scss";
// import Image from "next/image";
// import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
import { Link } from "react-router-dom";
// import { useRouter } from "next/router";
import content from './content.json'
import { useSelector, useDispatch } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
// import ApplyModal from "./ApplyModal";

// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });

// import { useGlobalContext } from "../../contexts/GlobalContext";

const CareerDetailPage = ({ contentOn, language, careerId, screen }) => {
    const dispatch = useDispatch()
    const contentFromRedux = useSelector(state => state.homeContent.present.careerDetails)
    const ImageFromRedux = useSelector(state => state.homeContent.present.images)
    const isLeftAlign = language === 'en'
    // const router = useRouter();
    //   const [isModal, setIsModal] = useState(false);


    const currentContent = contentFromRedux?.filter(
        (item) => item?.id == careerId
    )[0];

    const { banner, jobDetails } = currentContent || {};

    //   const handleApply = () => {
    //     setIsModal(true);
    //   };
    //   const handleApplyClose = () => {
    //     setIsModal(false);
    //   };

    useEffect(() => {
        // if (!currentContent[projectId - 1]) {
        //     dispatch(updateContent({ currentPath: "careerDetails", payload: [...content.careerDetails, { ...structureOfPageDetails, id: content.projectDetail.length + 1 }] }))
        // } else {
        dispatch(updateContent({ currentPath: "careerDetails", payload: content.careerDetails }))
        // }
    }, [])

    return (
        <div className="px-10" dir={isLeftAlign? "ltr" : "rtl"}>
            <section className={`mt-[50px] mb-[20px] ${language === "ar" ? "text-right" : ""}`}>
                <div className="container mx-auto px-4">
                    <div className="relative mb-[20px]">
                        <img
                            src={ImageFromRedux?.[`careerBanner/${careerId}`] || banner?.bannerImage}
                            alt=""
                            width={972}
                            height={380}
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
                        <h2 className="text-[#292E3D] text-[28px] font-bold mb-5">
                            {banner?.title[language]}
                        </h2>
                        <p className="text-[#0E172FB3] text-[16px] font-light">
                            {banner?.subTitle[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container mx-auto px-4 flex gap-[50px]">
                    <div className="">
                        {jobDetails?.leftPanel?.sections.map((section, index) => (
                            <div key={index} className="mb-[30px]">
                                <h2 className="text-[#292E3D] text-[20px] font-bold mb-3">
                                    {section?.title[language]}
                                </h2>
                                <ul className="list-disc pl-5">
                                    <div className="text-[#0E172FB3] text-[12px] font-light mb-1 importantList" dangerouslySetInnerHTML={{__html: section?.content[language]}} />
                                      
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="min-w-[300px]">
                        <div className="bg-gray-100 p-7 mb-6">
                            <button
                                className="block mx-auto py-1 px-4 bg-[#00B9F2] text-white rounded-md"
                            // onClick={handleApply}
                            >
                                {jobDetails?.rightPanel?.button?.text[language]}
                            </button>
                            <h3 className="text-[#292E3D] text-[24px] font-bold my-8">
                                {jobDetails?.rightPanel?.title[language]}
                            </h3>
                            {jobDetails?.rightPanel?.tailwraps?.map((tail, index) => (
                                <div className="flex items-center gap-4 mb-5" key={index}>
                                    <img
                                        src={tail.icon}
                                        alt={tail?.title[language]}
                                        width={32}
                                        height={32}
                                    />
                                    <div>
                                        <h5 className="text-[#B7B7B7] text-[15px] font-light">
                                            {tail?.description[language]}
                                        </h5>
                                        <h6 className="text-[#292E3D] text-[15px] font-light">
                                            {tail?.title[language]}
                                        </h6>
                                    </div>
                                </div>
                            ))}
                            <Link
                                href={jobDetails?.rightPanel?.viewAllButton?.link}
                                className="text-[#00B9F2] underline mt-12 block"
                            >
                                {jobDetails?.rightPanel?.viewAllButton?.text[language]}
                            </Link>
                        </div>

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
                    {jobDetails?.button?.text[language]}
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
