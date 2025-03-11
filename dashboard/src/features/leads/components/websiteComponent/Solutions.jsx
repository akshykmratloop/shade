import React, { useEffect, useState } from "react";
// import styles from "./solution.module.scss";
// import localFont from "next/font/local";
// import Button from "@/common/Button";
// import Image from "next/image";
import arrow from "../../../../assets/icons/right-wrrow.svg";  // ../../assets/icons/right-wrrow.svg
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import content from "./content.json"
// import { useGlobalContext } from "../../contexts/GlobalContext";
// import { useRouter } from "next/router";

// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });
// import dynamic from 'next/dynamic';
// import patch from "../../contexts/svg/path.jsx";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// const ContactUsModal = dynamic(() => import('../header/ContactUsModal'), { ssr: false });

const SolutionPage = ({ language, screen }) => {
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    // const router = useRouter();
    // const currentContent = content?.solution;
    const currentContent = useSelector((state) => state.homeContent.present.solution)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const dispatch = useDispatch()

    console.log(currentContent)

    const [isModal, setIsModal] = useState(false);
    const handleContactUSClose = () => {
        setIsModal(false);
    };

    const isLeftAlign = language === 'en'

    useEffect(() => {
        dispatch(updateContent({ currentPath: "solution", payload: content.solution }))

    }, [])
    return (
        <div className=" bankgothic-medium-dt">
            {/** banner */}
            <section
                className={`relative py-[10rem] w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''} px-12`}
                style={{ backgroundImage: ImageFromRedux.bannerBackground ? `url(${ImageFromRedux.bannerBackground})` : 'url("https://frequencyimage.s3.ap-south-1.amazonaws.com/310398e2-856d-4e59-b0b0-10e811ca1f82-solution%20%281%29.png")' }}
            >
                <div className="container h-full relative flex">
                    <div className={`text-${isLeftAlign ? 'left' : 'right'} w-full transform ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className="text-black text-[40px] font-medium leading-[77px] tracking-[-3.5px] mb-4">
                            {currentContent?.banner?.title[language]}
                        </h1>
                        <p className={`text-para-light text-left text-xs font-semibold leading-[26px] mb-6 ${isLeftAlign ? "" : "ml-auto"} w-[50%] word-spacing-[5px]`}>
                            {currentContent?.banner?.description[language]}
                        </p>
                        <button
                            className={`relative flex items-center text-xs text-[white] font-medium py-[12px] px-[48px] ${isLeftAlign ? "" : "ml-auto"} bg-sky-500 rounded-xl border-none cursor-pointer`}
                        // onClick={() => router.push('/project')}
                        >
                            <img
                                src={arrow}
                                width={18}
                                height={17}
                                alt="arrow"
                                className="absolute left-[32px] top-1/2 -translate-y-1/2"
                            />
                            &nbsp;{currentContent?.banner?.button?.[language]}
                        </button>
                    </div>
                </div>
            </section>

            {/** What we do */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"
                    }`}
            >
                <div className="container bankgothic-regular-db-mt">
                    <div className="grid grid-cols-[129px_1fr] gap-[67px]">
                        <div className="flex justify-center w-[190px] py-[14px]">
                            <span className="relative w-[10px] h-[20px]">
                                <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                            </span>
                            <h1 className="text-[20px] font-bold leading-[20px] pr-[20px]">
                                {currentContent?.whatWeDo?.title[language]}
                            </h1>
                        </div>
                        <div>
                            <p
                                className={`text-[18px] font-light leading-[40px] tracking-[-1.2px] mb-[32px] `}
                            >
                                {currentContent?.whatWeDo?.description1[language]}
                            </p>
                            <p
                                className={`text-[18px] font-light leading-[40px] tracking-[-1.2px] mb-[32px] `}
                            >
                                {currentContent?.whatWeDo?.description2[language]}
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/** gallary wrap */}
            <section className="max-w-[1180px] mx-auto pb-2 px-10">
                <div className="container">
                    <div className="flex flex-wrap items-start justify-between">
                        {currentContent?.gallery?.images.map((image, index) => (
                            <img
                                key={index}
                                src={ImageFromRedux[`Image ${index + 1}`] || image.url}
                                width={(image.width / 1532) * screen}
                                height={(image.height / 1532) * screen}
                                alt=""
                                className="object-cover"
                            />
                        ))}
                    </div>
                </div>
            </section>


            {/** HowWeDo */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"}`}
            >
                <div className="container">
                    <div className="grid grid-cols-[129px_1fr] gap-[67px]">
                        <div className="flex justify-center  w-[190px] py-[14px]">
                            <span className="relative w-[10px] h-[20px]">
                                <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                            </span>
                            <h1 className="text-right  font-bold text-[20px] leading-[20px] pr-[20px]">
                                {currentContent?.howWeDo?.title[language]}
                            </h1>
                        </div>
                        <div>
                            <p
                                className={` font-light text-[18px] leading-[40px] tracking-[-1.2px] mb-[32px]`}
                            >
                                {currentContent?.howWeDo?.description[language]}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/** Showcase gallery wrap */}
            <section className="pb-2 relative px-10">
                <div className="container">
                    <div className="flex items-center justify-between relative">
                        {currentContent?.gallery?.showcase.map((image, index) => (
                            <div
                                key={image.url+index}
                                className={` ${index === 0
                                    ? "relative before:content-[''] before:absolute before:top-[-24px] before:right-[-24px] before:border-t before:border-r before:border-[#97b3d8] before:h-[80px] before:w-[80px] before:z-[1] after:content-[''] after:absolute after:right-[-24px] after:bottom-[-24px] after:border-r after:border-b after:border-[#97b3d8] after:h-[80px] after:w-[80px] after:z-[1]"
                                    : index === currentContent.gallery.showcase.length - 1
                                        ? "relative before:content-[''] before:absolute before:top-[-24px] before:left-[-24px] before:border-t before:border-l before:border-[#97b3d8] before:h-[80px] before:w-[80px] before:z-[1] after:content-[''] after:absolute after:left-[-24px] after:bottom-[-24px] after:border-l after:border-b after:border-[#97b3d8] after:h-[80px] after:w-[80px] after:z-[1]"
                                        : index === 1
                                            ? "absolute z-20 shadow-[0px_0px_9px_2px_rgba(0,0,0,0.12)]"
                                            : ""
                                    }`}
                                style={{ left: index === 1 ? isTablet ? "232px" : 300 / 1182 * screen : "" }}
                            >
                                <img
                                    src={ ImageFromRedux[`Image ${index + 4}`] ? ImageFromRedux[`Image ${index + 4}`] : image.url}
                                    width={(image.width / 1532) * screen}
                                    height={(image.height / 1532) * screen}
                                    alt=""
                                    className={`${index === 1 ? "" : ""}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}

        </div>
    );
};

export default SolutionPage;


// {/* 






// <section className={styles.showcase_gallery_wrap}>
// <div className="container">
//     <div className={styles.showcase_gallery}>
//         {currentContent?.gallery?.showcase.map((image, index) => (
//             <div key={index} className={styles.showcase_gallery_img_wrap}>
//                 <Image
//                     src={image.url}
//                     width={image.width}
//                     height={image.height}
//                     alt=""
//                     className={styles.gallery_img}
//                 />
//             </div>
//         ))}
//     </div>
// </div>
// </section>

///////////////////////////////////////////////////////////////////////////////////////////

// <section
// className={` ${language === "en" && styles.leftAlign}   ${styles.new_project_wrapper
//     }`}
// >
// <div className={`container ${styles.main_container}`}>
//     <div className={styles.Client_content}>
//         {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
//         <h2 className={`${styles.title}`}>
//             {currentContent?.newProject?.title[language]}
//         </h2>
//         <p className={`${styles.description} ${BankGothic.className}`}>
//             {currentContent?.newProject?.description1[language].replace(
//                 currentContent?.newProject?.highlightedText[language],
//                 `"${currentContent?.newProject?.highlightedText[language]}"`
//             )}
//             <i className={language === "ar" && styles.arabicVersion}>
//                 {patch()}
//             </i>
//         </p>

//         <p className={`${styles.description} ${BankGothic.className}`}>
//             {currentContent?.newProject?.description2[language]}
//         </p>
//         <Button className={styles.view_btn}
//             onClick={() => setIsModal(true)}

//         >
//             {currentContent?.newProject?.button.text[language]}
//         </Button>
//     </div>
// </div>
// </section> */}