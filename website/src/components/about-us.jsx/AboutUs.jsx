import React, { useState } from "react";
import styles from "./about.module.scss";
import localFont from "next/font/local";
import Button from "@/common/Button";
import Image from "next/image";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { aboutUsIcons } from "../../assets/index";
import patch from "../../contexts/svg/path.jsx";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

import dynamic from "next/dynamic";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
  ssr: false,
});

const AboutUs = ({ content }) => {
  const [isModal, setIsModal] = useState(false);

  const { language } = useGlobalContext();
  const currentContent = content;
  const handleContactUSClose = () => {
    setIsModal(false);
  };
  return (
    <div style={{ marginBottom: "10vh" }}>
      <section className={styles.about_us_services_wrapper}>
        <div className={`container ${styles.main_container}`}>
          <div className={styles.about_content}>
            {/* <AnimatedText text={currentContent?.services?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title} ${BankGothic.className}`}>
              {currentContent?.['1']?.content?.title[language]}
            </h2>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.['1']?.content?.subtitle[language]}
            </p>
          </div>

          <div className={styles.card_group}>
            {currentContent?.['1']?.content?.cards.map((card, index) => (
              <div className={styles.card} key={index}>
                <Image
                  src={aboutUsIcons[card?.icon]}
                  width="44"
                  height="44"
                  alt="icon"
                  className={styles.icon}
                />
                <h5 className={`${styles.title} ${BankGothic.className}`}>
                  {card?.title?.[language]}
                </h5>
                <p className={`${styles.subTitle} ${BankGothic.className}`}>
                  {card?.description?.[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.about_us_wrapper} ${language === "en" && styles.leftAlign
          }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.about_us_wrap}>
            <div className={styles.about_us_banner_wrap}>
              <video
                src={currentContent?.['2']?.content?.video}
                autoPlay
                loop
                muted
                playsInline
                className={styles.thumbnailVideo}
              />
            </div>

            <div className={styles.about_content}>
              {/* <AnimatedText text={currentContent?.main?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
              <h2 className={`${styles.title} ${BankGothic.className}`}>
                {currentContent?.['2']?.content?.title?.[language]}
              </h2>
              <div
                className={`${styles.description} ${BankGothic.className}`}
                dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.descriptions?.[language] }}
              />
              {/* </div> */}
              <Button
                className={styles.view_btn}
                onClick={() => setIsModal(true)}
              >
                {currentContent?.['2']?.content?.button?.[0]?.text?.[language]}
              </Button>
            </div>
          </div>
        </div>
      </section >


      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </div>
  );
};

export default AboutUs;
