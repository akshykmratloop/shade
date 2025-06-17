import React from "react";
import styles from "@/components/vision/VisionMission.module.scss";
import {useRouter} from "next/router";
import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import {Img_url} from "@/common/CreateContent";

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const VisionMissionPage = ({content}) => {
  const router = useRouter();
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  const bgColors = ["#84E2FE", "#06D5FF", "#00B9F2"];

  return (
    <>
      <section className={`${styles.vision_mission_banner_wrap} `}>
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

      <section className={`${styles.vision_mission_wrap} ${styles[language]}`}>
        <div className="container">
          <div className={styles.vision_mission_section_head}>
            <h1 className={styles.vision_mission_section_head_title}>
              {currentContent?.["2"]?.content?.title?.[language]}
            </h1>
            <div
              className={styles.vision_mission_section_head_description}
              dangerouslySetInnerHTML={{
                __html: currentContent?.["2"]?.content?.description?.[language],
              }}
            />
          </div>
          <div className={styles.vision_mission_core_card_wrap}>
            {currentContent?.["2"]?.content?.cards.map((card, index) => (
              <div
                key={index}
                className={`${styles.vision_mission_core_card} ${styles[language]}`}
              >
                <div className={styles.side_border}></div>
                <img
                  src={
                    card.image?.url
                      ? Img_url + card.image.url
                      : "/images/placeholder.png"
                  }
                  alt={card.title[language]}
                  className={styles.card_image}
                />
                <h2 className={styles.card_title}>{card.title[language]}</h2>
                <div
                  className={styles.card_description}
                  dangerouslySetInnerHTML={{
                    __html: card.description[language],
                  }}
                />
              </div>
            ))}
          </div>

          <div className={styles.visions_section_wrap}>
            {currentContent?.["3"]?.content?.cards.map((card, index) => (
              <div key={index} className={styles.visions_section_card}>
                <h1
                  className={`${styles.visions_section_card_title} ${
                    styles[`card_${index}`]
                  }`}
                  style={{backgroundColor: bgColors[index % 3]}}
                >
                  {card.title[language]}
                </h1>
                <h1 className={styles.visions_section_card_para}>
                  {card.description[language]}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VisionMissionPage;
