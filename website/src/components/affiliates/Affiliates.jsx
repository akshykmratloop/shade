import React from "react";
import styles from "@/components/affiliates/affiliates.module.scss";
import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import {Img_url} from "@/common/CreateContent";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const AffiliatesPage = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  console.log(currentContent, "currentContent");

  return (
    <>
      <section className={`${styles.affiliates_banner_wrap} `}>
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
            {currentContent?.["1"]?.content?.title?.[language] || "Affiliates"}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.["1"]?.content?.description?.[language] ||
              "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum quam dolores repellendus eveniet fuga placeat praesentium quisquam nobis natus aliquam!"}
          </p>
        </div>
      </section>

      <section className={styles.affiliates_section_wrap}>
        <div className="container">
          <div className={styles.affiliates_grid}>
            {currentContent?.["2"]?.content?.cards?.map((img, idx) => (
              <div key={idx} className={styles.affiliate_card}>
                <img
                  src={Img_url + img?.images[0]?.url}
                  alt={`affiliate-${idx}`}
                  className={styles.affiliate_image}
                  width={"100%"}
                  height={"100%"}
                />
                {img?.title?.[language] && (
                  <p className={styles.affiliate_title}>
                    {img?.title?.[language]}
                  </p>
                )}
                {/* <p>hello image</p> */}
              </div>
            ))}
            {/* <div className={styles.affiliate_card}>
              <img
                src=""
                alt={`affiliate`}
                className={styles.affiliate_image}
              />

              <p>hello image</p>
            </div>
            <div className={styles.affiliate_card}>
              <img
                src=""
                alt={`affiliate`}
                className={styles.affiliate_image}
              />

              <p>hello image</p>
            </div>
            <div className={styles.affiliate_card}>
              <img
                src=""
                alt={`affiliate`}
                className={styles.affiliate_image}
              />

              <p>hello image</p>
            </div>
            <div className={styles.affiliate_card}>
              <img
                src=""
                alt={`affiliate`}
                className={styles.affiliate_image}
              />

              <p>hello image</p>
            </div>
            <div className={styles.affiliate_card}>
              <img
                src=""
                alt={`affiliate`}
                className={styles.affiliate_image}
              />

              <p>hello image</p>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default AffiliatesPage;
