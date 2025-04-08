import React, { useEffect } from "react";
// import styles from "@/components/news-and-blogs/NewsBlogDetail.module.scss";
// import Image from "next/image";
// import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
// import { useRouter } from "next/router";
import { newsBlogs } from "../../../../assets/index";
import content from "./content.json"
import { TruncateText } from "../../../../app/capitalizeword";
import { updateContent } from "../../../common/homeContentSlice";
import { useDispatch, useSelector } from "react-redux";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import { useGlobalContext } from "../../contexts/GlobalContext";

const NewsBlogDetailPage = ({ language, newsId }) => {
    const dispatch = useDispatch();
    const context = useSelector(state => state.homeContent.present)
    // const router = useRouter();
    // console.log(router.query)
    // const { newsId } = router.query;

    // const { language, content } = useGlobalContext();

    const currentContent = context.newsBlogsDetails?.filter((item) => item?.id == newsId)[0];

    // if (!currentContent) {
    //     // of project not found
    //     return (
    //         <div
    //             style={{
    //                 height: "700px",
    //                 width: "100%",
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //             }}
    //         >
    //             <h1>
    //                 {language === "en"
    //                     ? "News Not Found"
    //                     : "هذه الصفحة قيد التطوير وسوف يتم تحديثها قريبا..."}
    //             </h1>
    //         </div>
    //     );
    // }

    const { banner, newsPoints } = currentContent ?? {};

    useEffect(() => {
        // if (!currentContent?.[newsId]) {
        //     dispatch(updateContent({ currentPath: "careerDetails", payload: [...content.careerDetails, { ...structureOfCareerDetails, id: 4 }] }))
        // } else {
        dispatch(updateContent({ currentPath: "newsBlogsDetails", payload: content.newsBlogsDetails }))
        // }
    }, [])

    return (
        <div className="px-10">
            <section
                className={`mt-[50px] mb-5 ${language === "ar" ? "text-right" : ""}`}
            >
                <div className="container">
                    <div className="relative pb-8 border-b border-[#E8E7E7] mb-8 px-8">
                        <img
                            src={banner?.bannerImage}
                            alt=""
                            width={972}
                            height={380}
                            className="w-full h-[380px] object-cover object-center mb-7"
                        />

                        <button
                            className={`absolute top-[50px] bg-white p-3 flex items-center gap-2 text-[16px] font-bold text-[rgba(14,23,47,0.7)] ${language === "ar" ? "right-8" : "left-8"
                                }`}
                        // onClick={() => router.push(`/news-and-blogs`)}
                        >
                            <img
                                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"
                                alt=""
                                width={20}
                                height={20}
                                className={`${language === "ar" ? "scale-x-100" : "scale-x-[-1]"}`}
                            />
                            {banner?.button?.[language]}
                        </button>

                        <h2 className={`text-[28px] font-bold text-black mb-5`}>
                            {banner?.title[language]}
                        </h2>
                        <p className={`text-[16px] font-light text-[#718096]`}>
                            {banner?.subTitle[language]}
                        </p>
                    </div>

                    {newsPoints?.map((item, index) => (
                        <div key={index} className="mb-12">
                            <h2 className={`text-[20px] font-normal text-[#292E3D] mb-4`}>
                                {item?.title[language]}
                            </h2>
                            <div className={`text-[12px] font-light text-[rgba(0,26,88,0.51)] leading-6 mb-6`} dangerouslySetInnerHTML={{ __html: item?.content[language] }} />
                        </div>
                    ))}
                </div>
            </section>


            <section className={`${language === "en" ? "text-left" : "text-right"} pb-[88px]`}>
                <div className="container">
                    <h2 className={`text-[28px] font-normal text-[rgba(14,23,47,0.7)] mb-6 `}>
                        {content?.newsBlogs?.latestNewCards?.heading[language]}
                    </h2>

                    <div className="grid grid-cols-3 gap-y-6 justify-items-center">
                        {currentContent?.latestNews?.map((card, index) => {
                            if(!card.display) return
                            return (
                            <div
                                className="w-[240px] rounded border border-[#e2e2e2] bg-white shadow-[0_5px_4px_0_rgba(221,221,221,0.25)] overflow-hidden"
                                key={index}
                            >
                                <img
                                    src={newsBlogs[card.image]}
                                    alt=""
                                    className="w-full h-[154px] object-cover object-center"
                                // width={280}
                                // height={154}
                                />

                                <div className="flex flex-col items-start gap-4 p-4">
                                    <h2
                                        title={card.title[language]}
                                        className={`text-[16px] font-bold text-black h-[37px] mb-2 `}
                                    >
                                        {TruncateText(card.title[language], 30)}
                                    </h2>

                                    <p
                                        title={card.description[language]}
                                        className={`text-[11px] font-light leading-4 text-[rgba(0,26,88,0.51)] h-[80px] mb-5 `}
                                    >
                                        {TruncateText(card.description[language], 130)}
                                    </p>

                                    <div className="flex justify-between items-center gap-5 w-full">
                                        <h6 className={`text-[10px] font-light text-[#718096] `}>
                                            {card.date[language]}
                                        </h6>

                                        <button
                                            // onClick={() => router.push(`/blog/${card.id}`)}
                                            className={`text-[12px] font-bold text-[#00b9f2] bg-transparent border-none cursor-pointer `}
                                        >
                                            {card.readMore[language]}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default NewsBlogDetailPage;
