import React, {useEffect, useRef, useState} from "react";
// import styles from "@/History.module.scss";
import styles from "./History.module.scss";
import Button from "@/common/Button";
import Image from "next/image";
import Arrow from "../../assets/icons/right-wrrow.svg";
import historyBanner from "../../assets/images/history-banner.png";
// import Client from "../../assets/icons/client.svg";
// import AboutUs from "../../assets/images/aboutus.png";
import localFont from "next/font/local";
import {useRouter} from "next/router";
import {Img_url} from "@/common/CreateContent";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import {useGlobalContext} from "../../contexts/GlobalContext";
import ContactUsModal from "../header/ContactUsModal";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const HistoryPage = ({content}) => {
  const router = useRouter();
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;
  console.log("currentContent", currentContent);
  const [activeRecentProjectSection, setActiveRecentProjectSection] =
    useState(0);
  const [isModal, setIsModal] = useState(false);
  // Helper function to chunk array into groups of 4
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const handleContactUSClose = () => {
    setIsModal(false);
  };

  // Inside your component, before the return statement:
  const projectsPerSlide = 4;

  let projectChunks = chunkArray(
    content?.["5"]?.sections?.[activeRecentProjectSection]?.items || [],
    projectsPerSlide
  );

  const TruncateText = (text, length) => {
    if (text?.length > (length || 50)) {
      return `${text?.slice(0, length || 50)}...`;
    }
    return text;
  };

  return (
    <>
      {/* banner */}
      <section
        className={`${styles.history_banner_wrap} ${
          language === "en" && styles.leftAlign
        }`}
      >
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <img
            style={{objectPosition: "bottom"}}
            // src={historyBanner.src}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            alt="about-us"
            className={styles.backgroundImage}
            width={0}
            // fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            height={0}
          />
        </span>
        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text="بناء مستقبل أقوى" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title}`}>
              {/* {currentContent?.homeBanner?.title[language]} */}
              {currentContent?.["1"]?.content?.title?.[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {/* {currentContent?.homeBanner?.description[language]} */}
              {currentContent?.["1"]?.content?.description?.[language]}
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${styles.history_description_section} ${
          language === "en" && styles.leftAlign
        }`}
      >
        <div className="container">
          <h1 className={styles.title}>
            {currentContent?.["2"]?.content?.title?.[language]}
          </h1>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: currentContent?.["2"]?.content?.description?.[language],
            }}
          />
        </div>

        <div className="container">
          <div className={styles.history_image_container}>
            {currentContent?.["2"]?.content?.images?.map((imgObj, idx) => {
              // Compose the full URL (or empty string if it doesn't exist)
              const srcUrl = imgObj?.url ? Img_url + imgObj.url : "";

              return (
                <>
                  <img
                    src={srcUrl}
                    key={idx}
                    alt={`history-image-${idx}`}
                    className={styles.history_image}
                    width={273}
                    height={304}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </>
              );
            })}
          </div>
          <div
            className={`${styles.history_image_wrapper} ${
              language === "en" && styles.leftAlign
            }`}
          ></div>
        </div>
      </section>

      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default HistoryPage;
