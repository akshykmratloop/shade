import React from "react";
import styles from "@/components/services/services.module.scss";
import Arrow from "../../assets/icons/right-wrrow.svg";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
// import dynamic from 'next/dynamic';
import localFont from "next/font/local";
import Button from "@/common/Button";
import Image from "next/image";
// import { useTruncate } from '@/common/useTruncate';
import patch from "../../contexts/svg/path.jsx";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useLanguage } from "../../contexts/LanguageContext";

const Services = () => {
  const { language, content } = useLanguage();
  const currentContent = content?.services;

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.services_banner_wrap
        }`}
      >
        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title} ${BankGothic.className}`}>
              {currentContent?.banner?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.banner?.description[language]}
            </p>
            <Button className={styles.view_btn}>
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />
              &nbsp;{currentContent?.banner?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.services_card_wrap
        }`}
      >
        <div className="container">
          <div className={styles.service_card_group}>
            {currentContent?.serviceCards.map((card, index) => (
              <div className={styles.service_card} key={index}>
                <div className={styles.card_body}>
                  <h2 className={styles.title}>{card.title[language]}</h2>
                  <p className={styles.subTitle}>{card.subtitle[language]}</p>

                  {card.listTitle && (
                    <>
                      <h6 className={styles.des_title}>
                        {card.listTitle[language]}
                      </h6>
                      <ul className={styles.list_wrap}>
                        {card.listItems?.map((item, itemIndex) => (
                          <li key={itemIndex} className={styles.list_item}>
                            - {item[language]}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {card.description && (
                    <p className={styles.subTitle}>
                      {card.description[language]}
                    </p>
                  )}
                </div>
                <Image
                  src={card.image}
                  alt=""
                  className={styles.card_image}
                  width={463}
                  height={250}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.new_project_wrapper
        }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.Client_content}>
            {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title}`}>
              {currentContent?.newProject?.title[language]}
            </h2>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description1[language].replace(
                currentContent?.newProject?.highlightedText[language],
                `"${currentContent?.newProject?.highlightedText[language]}"`
              )}{" "}
              <i className={language === "ar" && styles.arabicVersion}>
                {patch()}
              </i>
            </p>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description2[language]}
            </p>
            <Button
              className={` ${language === "en" && styles.leftAlign}   ${
                styles.view_btn
              }`}
            >
              {currentContent?.newProject?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
