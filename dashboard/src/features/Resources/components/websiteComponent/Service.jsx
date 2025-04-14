import React, { useEffect, useState } from "react";
// import styles from "@/components/services/services.module.scss";
import Arrow from "../../../../assets/icons/right-wrrow.svg"; ///assets/icons/right-wrrow.svg
import { useDispatch } from "react-redux";
import content from "./content.json"
import { updateContent } from "../../../common/homeContentSlice";

const Services = ({ currentContent, screen, language }) => {
    const isLeftAlign = language === 'en'
    const dispatch = useDispatch()



    useEffect(() => {
        dispatch(updateContent({ currentPath: "services", payload: (content?.services) }))
    }, [])
    return (
        <div className="">
            <section
                className={`relative w-full py-[100px] px-10 bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{ backgroundImage: "url('https://loopwebsite.s3.ap-south-1.amazonaws.com/Hero+(4).png')" }}
            >
                <div className="container relative h-full flex items-center justify-end">
                    <div className={`${isLeftAlign ? 'scale-x-[-1] text-left' : 'text-right'} w-1/2 space-y-4 p-6 flex flex-col ${isLeftAlign?"items-start":"items-end"}`}>
                        <h1 className="text-black text-[45px] font-medium leading-[77px] tracking-[-3.5px] mb-4">
                            {currentContent?.banner?.title[language]}
                        </h1>
                        <p className="text-para-light text-[12px] font-semibold leading-[26px]  word-spacing-5">
                            {currentContent?.banner?.description[language]}
                        </p>
                        <button
                            className={`relative items-center flex ${isLeftAlign ? "" : "flex-row-reverse"} gap-1 text-[12px] font-medium px-[12px] py-[6px] px-[12px] bg-[#00b9f2] text-white rounded-md`}
                            onClick={() => { }}
                        >
                            {currentContent?.banner?.button?.text[language]}

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
        </div>
    );
};

export default Services;


//   <section
//     className={` ${language === "en" && styles.leftAlign}   ${
//       styles.services_banner_wrap
//     }`}
//   >
//     <div className="container" style={{ height :"100%", position :"relative"}} >
//       <div className={styles.content}>
//         {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
//         <h1 className={`${styles.title} `}>
//           {currentContent?.banner?.title[language]}
//         </h1>
//         <p className={`${styles.description} ${BankGothic.className}`}>
//           {currentContent?.banner?.description[language]}
//         </p>
//         <Button className={styles.view_btn}
//         onClick={() => router.push('/project')}
//         >
//           <Image
//             src={Arrow}
//             width="18"
//             height="17"
//             alt=""
//             className={styles.arrow_btn}
//           />
//           &nbsp;{currentContent?.banner?.button?.text[language]}
//         </Button>
//       </div>
//     </div>
//   </section>

//   <section
//     className={` ${language === "en" && styles.leftAlign}   ${
//       styles.services_card_wrap
//     }`}
//   >
//     <div className="container">
//       <div className={styles.service_card_group}>
//         {currentContent?.serviceCards.map((card, index) => (
//           <div className={styles.service_card} key={index}>
//             <div className={styles.card_body}>
//               <h2 className={styles.title}>{card.title[language]}</h2>
//               <p className={styles.subTitle}>{card.subtitle[language]}</p>

//               {card.listTitle && (
//                 <>
//                   <h6 className={styles.des_title}>
//                     {card.listTitle[language]}
//                   </h6>
//                   <ul className={styles.list_wrap}>
//                     {card.listItems?.map((item, itemIndex) => (
//                       <li key={itemIndex} className={styles.list_item}>
//                         - {item[language]}
//                       </li>
//                     ))}
//                   </ul>
//                 </>
//               )}

//               {card.description && (
//                 <p className={styles.subTitle}>
//                   {card.description[language]}
//                 </p>
//               )}
//             </div>
//             <Image
//               src={card.image}
//               alt=""
//               className={styles.card_image}
//               width={463}
//               height={250}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>

//   <section
//     className={` ${language === "en" && styles.leftAlign}   ${
//       styles.new_project_wrapper
//     }`}
//   >
//     <div className={`container ${styles.main_container}`}>
//       <div className={styles.Client_content}>
//         {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
//         <h2 className={`${styles.title}`}>
//           {currentContent?.newProject?.title[language]}
//         </h2>
//         <p className={`${styles.description} ${BankGothic.className}`}>
//           {currentContent?.newProject?.description1[language].replace(
//             currentContent?.newProject?.highlightedText[language],
//             `"${currentContent?.newProject?.highlightedText[language]}"`
//           )}{" "}
//           <i className={language === "ar" && styles.arabicVersion}>
//             {patch()}
//           </i>
//         </p>
//         <p className={`${styles.description} ${BankGothic.className}`}>
//           {currentContent?.newProject?.description2[language]}
//         </p>
//         <Button
//           onClick={() => setIsModal(true)}

//           className={` ${language === "en" && styles.leftAlign}   ${
//             styles.view_btn
//           }`}
//         >
//           {currentContent?.newProject?.button?.text[language]}
//         </Button>
//       </div>
//     </div>
//   </section>
//   <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />