import React, { useEffect } from "react";
import content from "./content.json"
import { newsBlogs } from "../../../../assets/index";
import { useDispatch, useSelector } from "react-redux";
import { TruncateText } from "../../../../app/capitalizeword";

import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { updateContent } from "../../../common/homeContentSlice";
// import styles from "@/components/news-and-blogs/newsblogs.module.scss";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import dynamic from 'next/dynamic';
// import localFont from "next/font/local";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });


const NewsBlogspage = ({ language, screen }) => {
    const isLeftAlign = language === 'en'
    const isPhone = screen > 768
    const dispatch = useDispatch()
    const currentContent = useSelector((state) => state.homeContent.present.newsBlogs)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const bannerTitle = currentContent?.bannerSection?.title?.[language];
    const bannerDescription = currentContent?.bannerSection?.description[language];
    const mainCard = currentContent?.mainCard;
    const latestNews = currentContent?.latestNewCards;
    const trendingCard = currentContent?.trendingCard;
    // const TruncateText = (text, length) => TruncateText(text, length || 200);


    // const handleNavigate = (id) => {
    //     // router.push(`blog/${id}`);
    // };


    useEffect(() => {
        dispatch(updateContent({ currentPath: "newsBlogs", payload: content.newsBlogs }))
    }, [])
    return (
        <div>
            {/**Banner Section */}
            <section className={`relative px-5 w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1000 * 0.436,
                    backgroundImage: ImageFromRedux.newsBanner ? `url(${ImageFromRedux.newsBanner})` :
                        "url('https://loopwebsite.s3.ap-south-1.amazonaws.com/Hero+(2).png')"
                }}>
                <div className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {bannerTitle}
                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold w-[70%] mb-6 word-spacing-5`}>
                            {bannerDescription}
                        </p>
                        {/* <button
                            className={`relative px-5 py-2 ${isPhone ? "text-xs" : "text-sm"} font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        // onClick={() => router.push("/services")}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"}`}
                            />
                            <p>
                                {currentContent?.banner?.button?.[language]}
                            </p>
                        </button> */}
                    </div>
                </div>
            </section>

            {/** main card */}
            {!mainCard?.id ? "" :
                <section className={`py-[88px] px-[100px]`}>
                    <div className="container">
                        <div className={`flex items-center ${!isLeftAlign&&"flex-row-reverse text-right"} justify-center gap-[50px] p-2 mx-auto rounded-md border border-gray-300 bg-white shadow-md shadow-gray-200`}>
                            <div className="p-[30px]">
                                <h2 title={mainCard?.title?.[language]} className="text-[#292E3D] text-[20px] font-bold mb-4">
                                    {TruncateText(mainCard?.title?.[language], 20)}
                                </h2>
                                <p
                                    title={mainCard?.description?.[language]}
                                    className="text-xs text-[rgba(0,26,88,0.51)] font-light leading-[22px] mb-6"
                                >
                                    {TruncateText(mainCard?.description?.[language], 150)}
                                </p>
                                <div className="flex items-center justify-between gap-5">
                                    <h6 className="text-[12px] text-gray-600 font-light">
                                        {mainCard?.date?.[language]}
                                    </h6>
                                    <button
                                        className="text-[14px] text-[#00b9f2] font-bold bg-transparent border-none cursor-pointer"
                                    // onClick={() => handleNavigate(mainCard?.id)}
                                    >
                                        {mainCard?.readMore?.[language]}
                                    </button>
                                </div>
                            </div>
                            <img
                                src={mainCard?.image.slice(0,5) === "https"? mainCard.image: newsBlogs?.[mainCard.image]}
                                className="rounded-md mr-1 h-[200px] object-cover object-left"
                                alt=""
                                width={333}
                            />
                        </div>
                    </div>
                </section>
            }

            {/* latest card */}
            <section className={`pb-20 ${language === "en" ? "text-left" : "text-right"}`}>
                <div className="container mx-auto px-16">
                    <h2 className={`text-[28px] text-[#0E172F] opacity-70 font-normal mb-6`}>
                        {latestNews?.heading[language]}
                    </h2>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-items-center ${isLeftAlign ? '' : 'scale-x-[-1]'}`}>
                        {latestNews?.cards?.map((card, index) => {
                            if(!card.display) return null
                            return (
                            <div key={index} className="rounded-md border border-gray-300 bg-white shadow-md overflow-hidden min-h-[390px]">
                                <img
                                    src={card.image.slice(0, 5) === "https" ? card.image : newsBlogs[card.image]}
                                    alt=""
                                    className="object-cover object-center w-full h-[130px]"
                                    width={180}
                                />
                                <div className="p-2 flex-auto flex flex-col justify-between min-h-[68%]">
                                    <div>
                                        <h2
                                            title={card?.title?.[language]}
                                            className={`text-[16px] font-bold mb-2 text-[#292E3D] ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                        >
                                            {TruncateText(card?.title?.[language], 25)}
                                        </h2>
                                        <p
                                            title={card.description[language]}
                                            className={`text-[13px] font-light text-[#001A58]/50 leading-4 mb-5 ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                        >
                                            {TruncateText(card.description[language], 150)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h6 className={`text-[10px] font-light text-gray-600 text- ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}>
                                            {card.date[language]}
                                        </h6>
                                        <button
                                            // onClick={() => router.push(`blog/${card.id}`)}
                                            className={`text-[10px] font-bold text-[#00B9F2] border-none bg-transparent cursor-pointer ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
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

            {/* Trending Card */}
            <section className={`${language === "en" ? "text-left" : "text-right"} pb-20 px-20`}>
                <div className="container mx-auto">
                    <div className={`flex items-start ${!isLeftAlign&&"flex-row-reverse text-right"} gap-11 mx-auto rounded-md overflow-hidden bg-[rgba(20,80,152,0.06)]`}>
                        <div className="p-8 flex-1">
                            <button className="px-8 py-2 flex justify-center items-center gap-2 rounded-3xl bg-[#145098] text-white text-sm font-normal tracking-wide mb-8 border-none cursor-pointer">
                                {trendingCard?.button?.text[language]}
                            </button>
                            <h2
                                title={trendingCard?.title?.[language]}
                                className="font-bold text-lg leading-6 text-[#292E3D]"
                            >
                                {TruncateText(trendingCard?.title?.[language] ?? "", 35)}
                            </h2>
                            <p
                                title={trendingCard?.description[language]}
                                className="text-xs font-light leading-5 text-[rgba(0,26,88,0.51)] mb-6 h-[150px]"
                            >
                                {TruncateText(trendingCard?.description[language] ?? "", 150)}
                            </p>
                            <div className="flex items-center justify-between gap-5">
                                <h6 className="text-xs font-light text-gray-600">
                                    {trendingCard?.date[language]}
                                </h6>
                                <button
                                    className="text-sm font-bold text-[#00b9f2] bg-transparent border-none cursor-pointer"
                                // onClick={() => handleNavigate(trendingCard.id)}
                                >
                                    {trendingCard?.readMore[language]}
                                </button>
                            </div>
                        </div>
                        <img
                            src={trendingCard?.image}
                            alt="Trending Card Image"
                            width={439}
                            // height={329}
                            className="rounded-md h-[360px] self-center"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsBlogspage;
// {/* <section
// className={` ${language === "en" && styles.leftAlign}   ${
//   styles.news_blogs_banner_wrap
// }`}
// >
// <div
//   className="container"
//   style={{ position: "relative", height: "100%" }}
// >
//   <div className={styles.content}>
//     {/* <AnimatedText text="خبر & المدونات" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
//     <h1 className={`${styles.title} `}>{bannerTitle}</h1>
//     <p className={`${styles.description} ${BankGothic.className}`}>
//       {bannerDescription}
//     </p>
//   </div>
// </div>
// </section>

// {/* Main Card */}
// <section
// className={` ${language === "en" && styles.leftAlign}   ${
//   styles.main_card_wrap
// }`}
// >
// <div className="container">
//   <div className={styles.card}>
//     <div className={styles.card_body}>
//       <h2
//         title={mainCard.title[language]}
//         className={`${BankGothic.className} ${styles.title}`}
//       >
//         {mainCard.title[language]}
//       </h2>
//       <p
//         title={mainCard.description[language]}
//         className={`${BankGothic.className} ${styles.subTitle}`}
//       >
//         {TruncateText(mainCard.description[language])}
//       </p>
//       <div className={styles.date_wrap}>
//         <h6 className={`${BankGothic.className} ${styles.date}`}>
//           {mainCard.date[language]}
//         </h6>
//         <button
//           className={`${BankGothic.className} ${styles.seeMore}`}
//           onClick={() => handleNavigate(mainCard.id)}
//         >
//           {mainCard.readMore[language]}
//         </button>
//       </div>
//     </div>
//     <Image
//       src={mainCard.image}
//       className={styles.image}
//       alt=""
//       width={433}
//       height={224}
//     />
//   </div>
// </div>
// </section>

// {/* Latest News Cards */}
// <section
// className={` ${language === "en" && styles.leftAlign}   ${
//   styles.latest_new_card_wrap
// }`}
// >
// <div className="container">
//   <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
//     {latestNews?.heading[language]}
//   </h2>
//   <div className={styles.card_group}>
//     {latestNews?.cards?.map((card, index) => (
//       <div className={styles.card} key={index}>
//         <Image
//           src={newsBlogs[card.image]}
//           alt=""
//           className={styles.card_image}
//           width={280}
//           height={154}
//         />
//         <div className={styles.card_body}>
//           <h2
//             title={card.title[language]}
//             className={`${BankGothic.className} ${styles.title}`}
//           >
//             {TruncateText(card.title[language], 40)}
//           </h2>
//           <p
//             title={card.description[language]}
//             className={`${BankGothic.className} ${styles.subTitle}`}
//           >
//             {TruncateText(card.description[language], 150)}
//           </p>
//           <div className={styles.date_wrap}>
//             <h6 className={`${BankGothic.className} ${styles.date}`}>
//               {card.date[language]}
//             </h6>
//             <button
//            //   onClick={() => router.push(`blog/${card.id}`)}
//               className={`${BankGothic.className} ${styles.seeMore}`}
//             >
//               {card.readMore[language]}
//             </button>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
// </section>

// {/* Trending Card */}
// <section
// className={` ${language === "en" && styles.leftAlign}   ${
//   styles.trending_card_wrap
// }`}
// >
// <div className="container">
//   <div className={styles.card}>
//     <div className={styles.card_body}>
//       <button className={styles.trending_btn}>
//         {trendingCard?.button?.text[language]}
//       </button>
//       <h2
//         title={trendingCard.title[language]}
//         className={`${BankGothic.className} ${styles.title}`}
//       >
//         {TruncateText(trendingCard.title[language], 35)}
//       </h2>
//       <p
//         title={trendingCard.description[language]}
//         className={`${BankGothic.className} ${styles.subTitle}`}
//       >
//         {TruncateText(trendingCard.description[language], 150)}
//       </p>
//       <div className={styles.date_wrap}>
//         <h6 className={`${BankGothic.className} ${styles.date}`}>
//           {trendingCard.date[language]}
//         </h6>
//         <button
//           className={`${BankGothic.className} ${styles.seeMore}`}
//           onClick={() => handleNavigate(trendingCard.id)}
//         >
//           {trendingCard.readMore[language]}
//         </button>
//       </div>
//     </div>
//     <Image src={trendingCard.image} alt="" width={579} height={429} />
//   </div>
// </div>
// </section> */}