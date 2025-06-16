import React from "react";
import styles from "@/components/hse/Hse.module.scss";
import {Img_url} from "@/common/CreateContent";
import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import checkImg from "../../assets/icons/check.svg";
import Image from "next/image";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const HsePage = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  return (
    <>
      <section className={`${styles.hse_banner_wrap} `}>
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <img
            style={{objectPosition: "bottom", objectFit: "cover"}}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            alt="about-us"
            className={styles.backgroundImage}
            width={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            height={0}
          />
        </span>
        <div className={styles.content}>
          <h1 className={`${styles.title}`}>
            {currentContent?.["1"]?.content?.title?.[language]}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.["1"]?.content?.description?.[language]}
          </p>
        </div>
      </section>

      <section className={styles.hse_section_wrap}>
        <div className="container">
          <div className={styles.hse_section_card_wrapper}>
            {currentContent?.["2"]?.content?.cards.map((card, index) => (
              <div className={styles.hse_card}>
                <img
                  className={styles.hse_card_image}
                  src={
                    card.images?.[0]?.url ? Img_url + card.images?.[0]?.url : ""
                  }
                  alt="hse_card_Image"
                  width={80}
                  height={80}
                />
                <div className={styles.card_content}>
                  <h1 className={styles.hse_card_title}>
                    {card.title[language]}
                  </h1>
                  <p className={styles.hse_card_para}>
                    {card.description[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container">
          <img
            src={
              currentContent?.["2"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            alt="hse_section_image"
            width={"100%"}
            height={422}
          />
          <h1 className={styles.hse_section_title}>
            {currentContent?.["2"]?.content?.title[language]}
          </h1>
          <p className={styles.hse_section_description}>
            {currentContent?.["2"]?.content?.description[language]}
          </p>

          <div className={styles.hse_section_pointer_wrap}>
            {currentContent?.["2"]?.content?.sectionPointers.map(
              (pointer, index) => (
                <div key={index} className={styles.hse_section_pointer}>
                  <Image
                    src={checkImg}
                    alt="check_image"
                    width={16}
                    height={16}
                  />
                  <p className={styles.hse_section_pointer_text}>
                    {pointer.text[language]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HsePage;
