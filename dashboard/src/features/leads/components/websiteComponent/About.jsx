import React, { useEffect, useState } from "react";
// import styles from "./about.module.scss";
// import localFont from "next/font/local";
// import Button from "@/common/Button";
// import Image from "next/image";
// import { useGlobalContext } from "../../contexts/GlobalContext";
import content from "./content.json"
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import { aboutUsIcons } from "../../../../assets/index"; // ../../assets/index
// import patch from "../../../../assets/icons/pa";  // ../../contexts/svg/path.jsx

// Font files can be colocated inside of `app`

// import dynamic from "next/dynamic";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
//     ssr: false,
// });

const AboutUs = ({ language, screen }) => {
    // const [isModal, setIsModal] = useState(false);
    const dispatch = useDispatch()

    // const { language, content } = useGlobalContext();
    const currentContent = useSelector((state) => state.homeContent.present.about)

    console.log(currentContent)
    // const currentContent = content?.aboutUs;
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };


    useEffect(() => {
        dispatch(updateContent({ currentPath: "about", payload: content.about}))
    }, [])
    return (
        <div>
            <section className="py-12">
                <div className="container mx-auto relative px-4">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-black text-3xl font-normal leading-none">
                            {currentContent?.services?.title[language]}
                        </h2>
                        <p className="text-black text-base font-light leading-7 mb-4">
                            {currentContent?.services?.subtitle[language]}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {currentContent?.services?.cards.map((card, index) => (
                            <div
                                className="p-6 border border-gray-200 rounded-lg shadow-md flex flex-col items-start gap-4"
                                key={index}
                            >
                                <img
                                    src={aboutUsIcons[card?.icon]}
                                    width="44"
                                    height="44"
                                    alt="icon"
                                    className="w-11 h-11"
                                />
                                <h5 className="text-black text-xl font-normal leading-none">
                                    {card.title[language]}
                                </h5>
                                <p className="text-black text-sm font-light leading-6">
                                    {card.description[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;



// {/* <>


// <section
//   className={`${styles.about_us_wrapper} ${
//     language === "en" && styles.leftAlign
//   }`}
// >
//   <div className={`container ${styles.main_container}`}>
//     <div className={styles.about_us_wrap}>
//       <div className={styles.about_us_banner_wrap}>
//         <video
//           src={currentContent?.main?.video}
//           autoPlay
//           loop
//           muted
//           playsInline
//           className={styles.thumbnailVideo}
//         />
//       </div>

//       <div className={styles.about_content}>
//         {/* <AnimatedText text={currentContent?.main?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
//         <h2 className={`${styles.title} ${BankGothic.className}`}>
//           {currentContent?.main?.title[language]}
//         </h2>
//         <div>
//           {currentContent?.main?.descriptions.map((desc, index) => (
//             <p
//               key={index}
//               className={`${styles.description} ${BankGothic.className}`}
//             >
//               {desc[language]}
//             </p>
//           ))}
//         </div>
//         <Button
//           className={styles.view_btn}
//           onClick={() => setIsModal(true)}
//         >
//           {currentContent?.main?.button?.text[language]}
//         </Button>
//       </div>
//     </div>
//   </div>
// </section>

// <section className={styles.about_new_project_wrapper}>
//   <div className={`container ${styles.main_container}`}>
//     <div className={styles.Client_content}>
//       {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
//       <h2 className={`${styles.title} ${BankGothic.className}`}>
//         {currentContent?.newProject?.title[language]}
//       </h2>
//       <p className={`${styles.description} ${BankGothic.className}`}>
//         {currentContent?.newProject?.description[language].replace(
//           currentContent?.newProject?.highlightedText[language],
//           `"${currentContent?.newProject?.highlightedText[language]}"`
//         )}
//         <i className={language === "ar" && styles.arabicVersion}>
//           {patch()}
//         </i>
//       </p>
//       <p className={`${styles.description} ${BankGothic.className}`}>
//         {currentContent?.newProject?.description2[language]}
//       </p>
//       <Button
//         className={`${styles.view_btn} ${
//           language === "en" && styles.leftAlign
//         }`}
//         onClick={() => setIsModal(true)}
//       >
//         {currentContent?.newProject?.button?.text[language]}
//       </Button>
//     </div>
//   </div>
// </section>
// <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
// </> */}
