import React, { useState } from "react";
// import styles from "@/components/career/career_detail.module.scss";
// import Image from "next/image";
// import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
import { Link } from "react-router-dom";
// import { useRouter } from "next/router";
import content from './content.json'
// import ApplyModal from "./ApplyModal";

// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });

// import { useGlobalContext } from "../../contexts/GlobalContext";

const CareerDetailPage = ({ contentOn, language, careerId, screen }) => {
    // const router = useRouter();
    //   const [isModal, setIsModal] = useState(false);
    

    const currentContent = content?.careerDetails?.filter(
        (item) => item?.id == careerId
    )[0];

    //   if (!currentContent) {
    //     // of project not found
    //     return (
    //       <div
    //         style={{
    //           height: "700px",
    //           width: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <h1>
    //           {language === "en"
    //             ? "This page is under development and will be updated soon..."
    //             : "هذه الصفحة قيد التطوير وسوف يتم تحديثها قريبا..."}
    //         </h1>
    //       </div>
    //     );
    //   }

    const { banner, jobDetails } = currentContent;

    //   const handleApply = () => {
    //     setIsModal(true);
    //   };
    //   const handleApplyClose = () => {
    //     setIsModal(false);
    //   };
    return (
        <div>
            <section className={`mt-[140px] mb-[20px] ${language === "ar" ? "text-right" : ""}`}>
                <div className="container mx-auto px-4">
                    <div className="relative mb-[52px]">
                        <img
                            src={banner?.bannerImage}
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
                                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="transform scale-x-[-1]"
                            />
                            {banner?.button?.text[language]}
                        </button>
                        <h2 className="text-black text-[32px] font-bold mb-5">
                            {banner?.title[language]}
                        </h2>
                        <p className="text-gray-500 text-[18px] font-light">
                            {banner?.subTitle[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-[146px]">
                    <div>
                        {jobDetails?.leftPanel?.sections.map((section, index) => (
                            <div key={index} className="mb-[72px]">
                                <h2 className="text-black text-[24px] font-bold mb-6">
                                    {section?.title[language]}
                                </h2>
                                <ul className="list-disc pl-5">
                                    {section?.content[language]?.map((item, idx) => (
                                        <li key={idx} className="text-gray-700 text-[16px] font-light mb-4">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="bg-gray-100 p-8 mb-6">
                            <button
                                className="block mx-auto py-3 px-4 bg-blue-500 text-white rounded-md"
                                // onClick={handleApply}
                            >
                                {jobDetails?.rightPanel?.button?.text[language]}
                            </button>
                            <h3 className="text-black text-[24px] font-bold my-10">
                                {jobDetails?.rightPanel?.title[language]}
                            </h3>
                            {jobDetails?.rightPanel?.tailwraps?.map((tail, index) => (
                                <div className="flex items-center gap-4 mb-12" key={index}>
                                    <img
                                        src={tail.icon}
                                        alt={tail?.title[language]}
                                        width={32}
                                        height={32}
                                    />
                                    <div>
                                        <h5 className="text-gray-400 text-[17px] font-light mb-2">
                                            {tail?.description[language]}
                                        </h5>
                                        <h6 className="text-black text-[17px] font-light">
                                            {tail?.title[language]}
                                        </h6>
                                    </div>
                                </div>
                            ))}
                            <Link
                                href={jobDetails?.rightPanel?.viewAllButton?.link}
                                className="text-blue-500 underline mt-12 block"
                            >
                                {jobDetails?.rightPanel?.viewAllButton?.text[language]}
                            </Link>
                        </div>

                        <div>
                            <h5 className="text-black text-[17px] font-light mb-4">
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
                    className="block mx-auto mt-[72px] mb-[199px] py-4 px-4 bg-blue-500 text-white rounded-md"
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
