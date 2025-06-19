import {useGlobalContext} from "@/contexts/GlobalContext";
import {useRouter} from "next/router";
import styles from "@/components/services/serviceSubpage.module.scss";
import React from "react";
import localFont from "next/font/local";
import {Img_url} from "@/common/CreateContent";

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const ServiceSubPages = ({content}) => {
  const {query} = useRouter();
  const {slug} = query;
  // console.log("Safety Detail Page content:", content);

  const currentContent = content || {};
  console.log("Serviceio Page Content:", currentContent);
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";
  return (
    <div>
      <section
        className={`${styles.serviceSubPage_banner_wrap} `}
        // style={{
        //   backgroundImage: `url(${Img_url + currentContent?.["1"]?.content?.images?.[0]?.url})`,
        //   backgroundRepeat: "no-repeat",
        //   backgroundSize: "cover",
        // }}
      >
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <img
            style={{objectPosition: "bottom", objectFit: "cover"}}
            // style={{ objectFit: "cover" }}
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
        {/* <div className="container" style={}> */}
        <div className={styles.content}>
          {/* <div className="wrapper">
            <div
              className="glow-circle"
            // style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
            ></div>
          </div> */}
          {/* <AnimatedText text="بناء مستقبل أقوى" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

          <h1 className={`${styles.title}`}>
            {currentContent?.["1"]?.content?.title?.[language]}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.["1"]?.content?.description?.[language]}
          </p>
          {/* <Button
            className={`${styles.view_btn}  ${
              language === "en" && styles.noPadding
            }`}
            onClick={() => router.push("/project")}
          >
            <Image
              src={Arrow}
              width="18"
              height="17"
              alt=""
              className={`${styles.arrow_btn}`}
            />
            <span>
              {currentContent?.[1]?.content?.button?.[0]?.text?.[language]}
            </span>
          </Button> */}
        </div>
        {/* </div> */}
      </section>

      <section>
        <div className="container">
          <div className={styles.services_card_wrapper}>
            {currentContent?.["2"]?.items?.map((item, idx) => (
              <div className={styles.services_card} key={idx}>
                <img
                  src={Img_url + item.image}
                  alt=""
                  width={280}
                  height={190}
                />
                <div className={styles.services_card_content}>
                  <h2>{item.titleEn}</h2>
                  <p></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceSubPages;
