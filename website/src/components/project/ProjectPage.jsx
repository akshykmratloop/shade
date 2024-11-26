import React, { useState } from "react";
import styles from "./project.module.scss";
import localFont from "next/font/local";
import Image from "next/image";
import Button from "@/common/Button";
import Arrow from "../../assets/icons/right-wrrow.svg";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
// import dynamic from 'next/dynamic';
import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useLanguage } from "../../contexts/LanguageContext";

const ProjectPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { language, content } = useLanguage();
  const currentContent = content?.projects;
  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.project_banner_wrap
        }`}
      >
        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text="مشروعنا" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title} ${BankGothic.className} `}>
              {currentContent?.bannerSection?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.bannerSection?.description[language]}
            </p>
            <Button className={styles.view_btn}>
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />{" "}
              {currentContent?.bannerSection?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>


      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.market_tab_container
        }`}
      >
        <div className="container">
          <div className={styles.tabContainer}>
            {/* Tabs */}
            <div className={styles.tabs}>
              {currentContent?.projectsSection?.tabs?.map((tab, index) => (
                <button
                  key={index}
                  className={`${styles.tabButton} ${
                    activeTab === index ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title[language]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className={styles.card_group}>
              {currentContent?.projectsSection?.tabs[activeTab]?.projects?.map(
                (item, index) => (
                  <div className={styles.card} key={index}>
                    <Image
                      src={item.url}
                      width="339"
                      height="190"
                      alt="icon"
                      className={styles.card_image}
                    />
                    <h5 className={`${styles.title} ${BankGothic.className}`}>
                      {item.title[language]}
                    </h5>
                    <p
                      className={`${styles.description} ${BankGothic.className}`}
                    >
                      {item.description[language]}
                    </p>
                    <button
                      className={`${styles.button} ${BankGothic.className}`}
                      onClick={() => router.push("/project/56756757656")}
                    >
                      {item.button.text[language]}
                      <Image
                       className={` ${language === "en" && styles.leftAlign}   ${
                        styles.icon
                      }`}
                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                        width={22}
                        height={22}
                        alt="icon"
                      />
                    </button>
                  </div>
                )
              )}
            </div>

            <div className={styles.button_wrap}>
              <Button className={styles.view_more_btn}>
                {currentContent?.projectsSection?.button?.text[language]}
                <Image
                  src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                  width={24}
                  height={24}
                  alt="icon"
                />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectPage;
