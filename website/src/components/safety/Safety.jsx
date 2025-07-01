import React, {useEffect, useRef, useState} from "react";
import styles from "./Safety.module.scss";
import localFont from "next/font/local";
import {useRouter} from "next/router";
import {Img_url} from "@/common/CreateContent";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import {useGlobalContext} from "../../contexts/GlobalContext";
import ContactUsModal from "../header/ContactUsModal";
import Image from "next/image";
import checkSvg from "../../assets/icons/check.svg";
import Button from "@/common/Button";
import Link from "next/link";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

//

const SafetyPage = ({content}) => {
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
        className={`${styles.safety_banner_wrap} ${
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

      <section className={styles.safety_card_wrap}>
        <div className="container">
          <div className={styles.safety_card_container}>
            {currentContent?.["2"]?.items?.map((item, idx) => {
              // pick the right title key based on language
              const titleKey = language === "en" ? "titleEn" : "titleAr";
              const isReversed = idx % 2 === 1;
              return (
                <div
                  key={item.id ?? idx}
                  className={`${styles.safety_card}  ${
                    isReversed ? styles.reverse : ""
                  }`}
                >
                  {/* Image (if any) */}
                  {
                    <div className={styles.safety_card_image_wrap}>
                      <img
                        src={Img_url + item.image}
                        alt={"safety image"}
                        // width={400}
                        // height={300}
                        className={styles.safety_card_image}
                      />
                    </div>
                  }

                  {/* Details */}
                  <div className={styles.safety_card_details}>
                    <h1 className={styles.title}>{item[titleKey]}</h1>
                    <div
                      className={`${styles.description} ${BankGothic.className}`}
                    >
                      {item.descriptions?.map((descObj, i) => (
                        <div className={styles.description_item} key={i}>
                          <Image
                            key={i}
                            src={checkSvg}
                            alt="description"
                            // width={100}
                            // height={100}
                            className={styles.description_image}
                          />
                          <p>{descObj[language]}</p>
                        </div>
                      ))}
                      {/* <Button /> */}
                      <div className={styles.read_more_btns}>
                        {/* <a
                          onClick={() => {
                            router.push(`/safety/${item?.slug}`);
                            console.log("item.id", item.slug);
                          }}
                          href={currentContent?.["2"]?.content?.button ?? "#"}
                          className={styles.read_more_btn}
                        >
                          {
                            currentContent?.["2"]?.content?.button?.[0]?.text?.[
                              language
                            ]
                          }
                        </a> */}
                        <Link
                          key={item.id}
                          href={`/safety/${item.slug}`}
                          className={styles.read_more_btn}
                        >
                          {currentContent["2"].content.button[0].text[language]}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default SafetyPage;
