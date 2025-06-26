import {useGlobalContext} from "@/contexts/GlobalContext";
import {useRouter} from "next/router";
import styles from "@/components/services/serviceSubpage.module.scss";
import React from "react";
import localFont from "next/font/local";
import {Img_url} from "@/common/CreateContent";
import Link from "next/link";

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
                  <h2 className={styles.services_card_content_heading}>
                    {item.titleEn}
                  </h2>
                  <p className={styles.services_card_content_para}>
                    {item.description?.[language]}
                  </p>
                  <Link
                    href={`/service/${slug}/${item.slug}`}
                    className={styles.services_card_content_button}
                  >
                    {
                      currentContent?.["2"]?.content?.button?.[0]?.text?.[
                        language
                      ]
                    }{" "}
                    &#8594;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.other_service_section}>
        <div className="container">
          <h2 className={styles.other_service_heading}>Other Service</h2>
          <div className={styles.other_service_wrapper}>
            {currentContent?.["3"]?.items?.map((item, idx) => (
              <div key={idx} className={styles.other_service_card}>
                <img
                  src={Img_url + item.image}
                  alt=""
                  width={435}
                  height={206}
                />
                <div className={styles.other_service_card_details}>
                  <h2 className={styles.other_service_card_heading}>
                    {item.titleEn}
                  </h2>
                  <p className={styles.other_service_card_para}>
                    {item.description?.[language]}
                  </p>
                  <button className={styles.other_service_card_button}>
                    {
                      currentContent?.["3"]?.content?.button?.[0]?.text?.[
                        language
                      ]
                    }
                  </button>{" "}
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
