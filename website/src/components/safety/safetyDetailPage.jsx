import {useRouter} from "next/router";
import styles from "@/components/Safety/Safety.module.scss";

import React from "react";
import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import {Img_url} from "@/common/CreateContent";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const SafetyDetailPage = ({content}) => {
  const {query} = useRouter();
  const {slug} = query;
  console.log("Safety Detail Page content:", content);

  const currentContent = content || {};
  console.log("Safety Detail Page Content:", currentContent);
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  return (
    <>
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

      <section className={styles.safety_detail_wrap}>
        <div className="container">
          <div className={styles.safety_detail_container}>
            <div className={styles.left}>
              <h1 className={styles.title}>
                {currentContent?.["2"]?.content?.title?.[language]}
              </h1>
              <div
                className={`${styles.description} ${BankGothic.className}`}
                dangerouslySetInnerHTML={{
                  __html:
                    currentContent?.["2"]?.content?.description?.[language],
                }}
              />
            </div>
            <div className={styles.right}>
              <div className={styles.safety_detail_card_wrap}>
                <div className={styles.safety_detail_card}>
                  <p className={styles.safety_detail_number}>
                    {String(1).padStart(3, "0")}
                  </p>
                  <div className={styles.safety_detail_title_wrap}>
                    <h1 className={styles.safety_detail_card_title}>
                      {
                        currentContent?.["2"]?.content?.procedures?.title?.[
                          language
                        ]
                      }
                    </h1>
                    <p className={styles.safety_detail_card_para}>
                      {
                        currentContent?.["2"]?.content?.procedures
                          ?.description?.[language]
                      }
                    </p>
                  </div>
                </div>
                {currentContent?.["2"]?.content?.procedures?.terms?.map(
                  (item, idx) => {
                    const displayNumber = String(idx + 2).padStart(3, "0");
                    return (
                      <div key={idx} className={styles.safety_detail_card}>
                        <p className={styles.safety_detail_number}>
                          {displayNumber}
                        </p>
                        <div className={styles.safety_detail_title_wrap}>
                          <h1 className={styles.safety_detail_card_title}>
                            {item?.title?.[language]}
                          </h1>
                          <p
                            className={styles.safety_detail_card_para}
                            dangerouslySetInnerHTML={{
                              __html: item?.description?.[language],
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SafetyDetailPage;
