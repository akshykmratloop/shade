import React, { useEffect, useState } from "react";
import style from "./marketDetails.module.scss";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";
import { projectPageData } from "../../assets/index";
import NotFound from "../../pages/404";
// Import local font
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { backendAPI, useGlobalContext } from "../../contexts/GlobalContext";
import createContent, { Img_url } from "@/common/CreateContent";
import { TruncateText } from "@/common/useTruncate";

const MarketDetailsPage = () => {
  const router = useRouter();
  const { marketId } = router.query;
  const { language } = useGlobalContext();

  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";
  const [content, setContent] = useState({})
  console.log(content)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${backendAPI}${marketId}`); // note => the market is slug, since the backend require slug to get content in this scenario

        if (!res.ok) {
          // If response failed (e.g., 404, 500), return empty object
          return {};
        }

        const apiData = await res.json();
        const cookedData = createContent(apiData.content)

        return setContent(cookedData.content);
      } catch (error) {
        // If fetch throws an error (e.g., network failure), return empty object
        return { props: { apiData: {} } };
      }
    }
    fetchContent()
  }, [marketId])

  return (
    <div style={{
      width: "100%",
    }}>
      <section
        className={`${style.bannerSection} ${isLeftAlign ? style.leftAlign : ""}`}
        style={{
          backgroundImage: `url("${Img_url + content?.['1']?.content?.images?.[0]?.url}")`,
        }}
      >
        {/* Banner Gradient */}
        <div className={style.bannerGradient}>
          <div className={style.gradientCircle}></div>
        </div>

        {/* Banner Text */}
        <div className={style.bannerContainer}>
          <div className={`${isLeftAlign ? style.textLeftAlign : ""} ${style.bannerText}`}>
            <h2 className={style.heading}>
              {content?.['1']?.content?.title?.[language]}
            </h2>
            <p className={style.description}>
              {content?.['1']?.content?.description?.[language]}
            </p>
          </div>
        </div>
      </section>

      <section className={style.serviceSection}>
        {/* Sub heading text */}
        <section className={style.subSection}>
          <h2 className={style.subheading}>
            {content?.[2]?.content?.title?.[language]}
          </h2>
          <div
            className={`${style.subdescription} bank-light`}
            dangerouslySetInnerHTML={{ __html: content?.[2]?.content?.description?.[language] }}
          />
        </section>
      </section>

      <section
        dir={isLeftAlign ? 'ltr' : 'rtl'}
        className={style.servicesSection}
      >
        <div className={style.servicesGrid}>
          {content?.['2']?.content?.points?.map((service, idx) => {
            return (
              <article key={idx} className={style.serviceCard}>
                <img
                  src={service.images?.[0]?.url ? Img_url + service.images?.[0]?.url : projectPageData.swccWaterSupply}
                  alt="img"
                  className={style.serviceCard__image}
                />
                <section className={style.serviceCard__content}>
                  <h1 className={style.serviceCard__title}>
                    {TruncateText(service?.title?.[language], 23)}
                  </h1>
                  <p className={`${style.serviceCard__description} bank-light`}>
                    {service?.description?.[language]}
                  </p>
                </section>
              </article>
            );
          })}
        </div>
      </section>


      <section className={style.otherMarketsSection}>
        <h3 className={style.otherMarketsSection__title}>Other Markets</h3>

        <section className={style.scrollContainer}>
          <section
            dir={isLeftAlign ? 'ltr' : 'rtl'}
            className={`${style.cardsRow} ${isLeftAlign ? style['cardsRow--leftAlign'] : ''}`}
          >
            {(content?.['3']?.items || [])?.map((service, idx) => {
              if (service.slug === marketId) return null;
              return (
                <article key={idx} className={style.card}>
                  <img
                    src={service.image ? Img_url + service.image : projectPageData.businessGate}
                    alt="img"
                    className={style.card__image}
                  />
                  <section className={style.card__content}>
                    <h1 className={style.card__title}>
                      {TruncateText(service?.[titleLan], 20)}
                    </h1>
                  </section>
                </article>
              );
            })}
          </section>
        </section>
      </section>

    </div>
  );
};

export default MarketDetailsPage;
