import React, { useState, useEffect } from "react";
import styles from "./project.module.scss";
import localFont from "next/font/local";
import Image from "next/image";
import Button from "@/common/Button";
import Arrow from "../../assets/icons/right-wrrow.svg";
import { projectPageData } from "../../assets/index";
// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useGlobalContext } from "../../contexts/GlobalContext";
const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
  ssr: false,
});

const ProjectPage = ({ content }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { language } = useGlobalContext();
  const currentContent = content
  const [isModal, setIsModal] = useState(false);
  const [filteredProject, setFilteredProject] = useState([]);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);

  const handleContactUSClose = () => {
    setIsModal(false);
  };
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredProject(currentContent?.projectsSection?.projects);
    } else {
      setFilteredProject(
        currentContent?.projectsSection?.projects
          ? currentContent?.projectsSection?.projects?.filter(
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
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.project_banner_wrap
          }`}
      >
        <div
          className="container"
          style={{ height: "100%", position: "relative" }}
        >
          <div className={styles.content}>
            {/* <AnimatedText text="مشروعنا" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title}`}>
              {currentContent?.[1]?.content?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.[1]?.content?.description[language]}
            </p>
            <Button
              className={styles.view_btn}
              onClick={() => setIsModal(true)}
            >
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />{" "}
              {currentContent?.[1]?.content?.button?.[0]?.text[language]}
            </Button>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.market_tab_container
          }`}
      >
        <div className="container">
          <div className={styles.tabContainer}>
            {/* Tabs */}
            <div className={styles.tabs}>
              {currentContent?.projectsSection?.tabs?.map((tab, index) => (
                <button
                  key={index}
                  className={`${styles.tabButton} ${activeTab === tab?.id ? styles.activeTab : ""
                    }`}
                  onClick={() => setActiveTab(tab?.id)}
                >
                  {tab.title[language]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className={styles.card_group}>
              {filteredProject
                ?.slice(0, visibleProjectsCount)
                ?.map((item, index) => (
                  <div className={styles.card} key={index}>
                    <Image
                      src={projectPageData[item.url]}
                      width="339"
                      height="190"
                      alt={item.title[language]}
                      className={styles.card_image}
                    />
                    <h5 title={item?.title[language]} className={`${styles.title} ${BankGothic.className}`}>
                      {TruncateText(item.title[language], 45)}
                    </h5>
                    <p
                      title={item?.address[language]}
                      className={`${styles.description} ${BankGothic.className}`}
                    >
                      {TruncateText(item.address[language], 25)}

                    </p>
                    <button
                      className={`${styles.button} ${BankGothic.className}`}
                      onClick={() => router.push(`/project/${item?.id}`)}
                    >
                      {item.button.text[language]}
                      <Image
                        className={` ${language === "en" && styles.leftAlign
                          }   ${styles.icon}`}
                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                        width={22}
                        height={22}
                        alt="icon"
                      />
                    </button>
                  </div>
                ))}
            </div>

            {visibleProjectsCount < filteredProject?.length && ( // Show button only if there are more projects
              <div className={styles.button_wrap}>
                <Button
                  className={styles.view_more_btn}
                  onClick={() =>
                    setVisibleProjectsCount(visibleProjectsCount + 6)
                  } // Increase count by 4
                >
                  {currentContent?.projectsSection?.button?.text[language]}
                  <Image
                    src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                    width={24}
                    height={24}
                    alt="icon"
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default ProjectPage;
