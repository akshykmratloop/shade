import React from "react";
import styles from "@/components/organizational-chart/OrganizationChart.module.scss";
import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import org_chart from "../../assets/images/org_chart.svg";
import org_banner from "../../assets/images/orgBanner.jpg";
import Image from "next/image";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const OrganizationalChartPage = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;
  const fileUrl = currentContent?.["2"]?.content?.images?.[0]?.url;
  const fullUrl = fileUrl ? Img_url + fileUrl : null;

  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <section className={`${styles.org_banner_wrap} `}>
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <Image
            style={{objectPosition: "bottom", objectFit: "cover"}}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : org_banner
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
            {currentContent?.["1"]?.content?.title?.[language] ||
              "Organizational chart"}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.["1"]?.content?.description?.[language] ||
              "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum dignissimos totam inventore voluptate iure odio, rem deleniti quasi temporibus aliquam?"}
          </p>
        </div>
      </section>

      <section className={styles.chart_section_wrap}>
        <div className="container">
          {isPdf ? (
            <iframe
              src={fullUrl}
              width="100%"
              height="600px"
              style={{border: "none"}}
              title="Organizational Chart PDF"
            />
          ) : (
            <Image
              src={fullUrl || org_chart}
              alt="chart_image"
              width={"100%"}
              height={"100%"}
              className={styles.chartImage}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default OrganizationalChartPage;
