import React, { useState, useEffect } from "react";
// import styles from "./project.module.scss";
// import localFont from "next/font/local";
import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { projectPageData } from "../../../../assets/index";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import dynamic from "next/dynamic";
// import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// import { useGlobalContext } from "../../contexts/GlobalContext";
// const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
    // ssr: false,
// });

const ProjectPage = ({ language, screen }) => {
    const isLeftAlign = language = "en"
    // const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    // const { language, content } = useGlobalContext();
    const currentContent = content?.projectsPage;
    // const [isModal, setIsModal] = useState(false);
    const [filteredProject, setFilteredProject] = useState([]);
    const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);

    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };
    useEffect(() => {
        if (activeTab === "all") {
            setFilteredProject(currentContent?.projectsSection.projects);
        } else {
            setFilteredProject(
                currentContent?.projectsSection?.projects
                    ? currentContent?.projectsSection.projects.filter(
                        (project) => project?.status === activeTab
                    )
                    : []
            );
            setVisibleProjectsCount(6);
        }
    }, [activeTab, currentContent]); // Added currentContent as a dependency

    const TruncateText = (text, length) => {
        if (text.length > (length || 50)) {
            return `${text.slice(0, length || 50)}...`;
        }
        return text;
    };

    return (
        <div>
            <section
                className={`relative h-[715px] w-full bg-cover bg-center bg-no-repeat ${isLeftAlign ? "scale-x-[-1]" : ""
                    }`}
                style={{
                    backgroundImage:
                        'url("https://frequencyimage.s3.ap-south-1.amazonaws.com/a4a2a992-c11e-448b-bdfe-54b14574958d-Hero%20%281%29%20%281%29.png")',
                }}
            >
                <div className="container h-full relative">
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 right-5 ${isLeftAlign ? "scale-x-[-1] text-left" : "text-right"
                            }`}
                    >
                        <h1 className="text-black text-[70px] font-medium leading-[77px] tracking-[-3.5px] mb-4">
                            {currentContent?.bannerSection?.title[language]}
                        </h1>
                        <p className="text-gray-500 text-[16px] font-bold leading-[28px] mb-6 w-[55%] ml-auto word-spacing-[5px]">
                            {currentContent?.bannerSection?.description[language]}
                        </p>
                        <button
                            className="relative px-[60px] py-[16px] text-[18px] font-medium text-white bg-sky-500 rounded-md flex items-center"
                            // onClick={() => setIsModal(true)}
                        >
                            <img
                                src={Arrow}
                                width={18}
                                height={17}
                                alt="Arrow"
                                className="absolute left-8 top-1/2 transform -translate-y-1/2"
                            />
                            {currentContent?.bannerSection?.button?.text[language]}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectPage;




//
//<section
//className={` ${language === "en" && styles.leftAlign}   ${
//  styles.market_tab_container
//}`}
//>
//<div className="container">
//  <div className={styles.tabContainer}>
//    {/* Tabs */}
//    <div className={styles.tabs}>
//     {currentContent?.projectsSection?.tabs?.map((tab, index) => (
//        <button
//         key={index}
//         className={`${styles.tabButton} ${
//          activeTab === tab?.id ? styles.activeTab : ""
//      }`}
//    onClick={() => setActiveTab(tab?.id)}
//        >
//        {tab.title[language]}
//       </button>
//    ))}
//  </div>

//    {/* Cards */}
//    <div className={styles.card_group}>
//     {filteredProject
//    ?.slice(0, visibleProjectsCount)
//      ?.map((item, index) => (
//    <div className={styles.card} key={index}>
//   <Image
//    src={projectPageData[item.url]}
//     width="339"
//   height="190"
// alt={item.title[language]}
//className = { styles.card_image }
//   />
//          <h5 title={item?.title[language]} className={`${styles.title} ${BankGothic.className}`}>
//          {TruncateText(item.title[language], 45)}
//      </h5>
//    <p
//  title={item?.address[language]}
//  className={`${styles.description} ${BankGothic.className}`}
//  >
//   {TruncateText(item.address[language], 25)}
//
//          </p>
//        <button
//        className={`${styles.button} ${BankGothic.className}`}
//      onClick={() => router.push(`/project/${item?.id}`)}
//  >
//  {item.button.text[language]}
//<Image
//  className={` ${
//    language === "en" && styles.leftAlign
//  }   ${styles.icon}`}
//  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
//  width={22}
//  height={22}
//  alt="icon"
// />
// </button>
//          </div >
//      ))}
//</div >
//
//{
//   visibleProjectsCount<filteredProject.length && ( // Show button only if there are more projects
//     <div className={styles.button_wrap}>
//       <Button
//         className={styles.view_more_btn}
//       onClick={() =>
//         setVisibleProjectsCount(visibleProjectsCount + 6)
//   } // Increase count by 4
//  >
//    {currentContent?.projectsSection?.button?.text[language]}
//  <Image
//    src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
//  width={24}
//                    height={24}
//                  alt="icon"
//            />
//      </Button>
//        </div>
//   )
//}
//  </div >
//</div >
//</section >
//    <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
