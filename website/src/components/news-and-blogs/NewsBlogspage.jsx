import React from "react";
import styles from "@/components/news-and-blogs/newsblogs.module.scss";
// import Arrow from "../../assets/icons/right-wrrow.svg";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
// import dynamic from 'next/dynamic';
import localFont from "next/font/local";
// import Button from '@/common/Button';
import Image from "next/image";
import { TruncateText, useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useGlobalContext } from "../../contexts/GlobalContext";
import { Img_url } from "@/common/CreateContent";
// import { newsBlogs } from "../../assets/index";
const NewsBlogspage = ({ content }) => {
  const router = useRouter();

  const { language } = useGlobalContext();
  const currentContent = content;
  const isLeftAlign = language === 'en';
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const banner = currentContent?.['1']?.content
  const mainCard = currentContent?.['2']?.items?.[0]
  const latestNews = currentContent?.['3']?.items;
  const trendingCard = currentContent?.['4']?.items?.[0];

  // const TruncateText = (text, length) => useTruncate(text, length || 200);
  // TruncateText

  const handleNavigate = (id) => {
    router.push(`blog/${id}`);
  };

  return (
    <>
      <section
        className={`${language === "en" && styles.leftAlign} ${styles.news_blogs_banner_wrap}`}
        style={{
          background: `url(${Img_url + banner?.images?.[0]?.url})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
        <div className={`${styles.gradientOverlay} ${isLeftAlign && styles.gradientBlobLTR}`} dir={isLeftAlign ? "ltr" : "rtl"}>
          <div className={`${styles.gradientBlob} `}></div>
        </div>

        <div className={styles.content}>
          <h1 className={`${styles.title} `}>{banner?.title?.[language]}</h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {banner?.description?.[language]}
          </p>
        </div>
      </section >

      {/* Main Card */}
      < section
        className={` ${language === "en" && styles.leftAlign}   ${styles.main_card_wrap
          }`
        }
      >
        <div className="container">
          <div className={styles.card}>
            <div className={styles.card_body}>
              <h2
                title={mainCard?.[titleLan]}
                className={`${BankGothic.className} ${styles.title}`}
              >
                {TruncateText(mainCard?.[titleLan], 20)}
              </h2>
              <div
                title={mainCard?.description?.[language]}
                className={`${BankGothic.className} ${styles.subTitle}`}
                dangerouslySetInnerHTML={{ __html: TruncateText(mainCard?.description?.[language], 150) }}
              >
                {/* {TruncateText(mainCard?.description?.[language], 150)} */}
              </div>
              <div className={styles.date_wrap}>
                <h6 className={`${BankGothic.className} ${styles.date}`}>
                  {mainCard?.date?.[language]}
                </h6>
                <button
                  className={`${BankGothic.className} ${styles.seeMore}`}
                  onClick={() => handleNavigate(mainCard.id)}
                >
                  {currentContent?.['2']?.button?.[0]?.text?.[language]}
                </button>
              </div>
            </div>
            <img
              src={Img_url + mainCard?.image}
              className={styles.image}
              alt=""
              width={433}
              height={224}
            />
          </div>
        </div>
      </section >

      {/* Latest News Cards */}
      < section
        className={`${language === "en" && styles.leftAlign}  ${styles.latest_new_card_wrap}`}
      >
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {content?.['3']?.content?.heading?.[language]}
          </h2>
          <div className={styles.card_group}>
            {latestNews?.map((card, index) => (
              <div className={styles.card} key={index}>
                <img
                  src={Img_url + card?.image}
                  alt=""
                  className={styles.card_image}
                  width={280}
                  height={154}
                />
                <div className={styles.card_body}>
                  <h2
                    title={card?.[titleLan]}
                    className={`${BankGothic.className} ${styles.title}`}
                  >
                    {TruncateText(card?.[titleLan], 25)}
                  </h2>
                  <div
                    title={card?.description?.[language]}
                    className={`${BankGothic.className} ${styles.subTitle}`}
                    dangerouslySetInnerHTML={{ __html: TruncateText(card?.description?.[language], 150) }}
                  >
                  </div>
                  <div className={styles.date_wrap}>
                    <h6 className={`${BankGothic.className} ${styles.date}`}>
                      {card?.date?.[language]}
                    </h6>
                    <button
                      onClick={() => router.push(`blog/${card.id}`)}
                      className={`${BankGothic.className} ${styles.seeMore}`}
                    >
                      {content?.['3']?.content.button?.[0]?.text?.[language]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Trending Card */}
      < section
        className={` ${language === "en" && styles.leftAlign}   ${styles.trending_card_wrap
          }`}
      >
        <div className="container">
          <div className={styles.card}>
            <div className={styles.card_body}>
              {/* <button className={styles.trending_btn}>
                {"Trending"}
              </button> */}
              <h2
                title={trendingCard?.[titleLan]}
                className={`${BankGothic.className} ${styles.title}`}
              >
                {TruncateText(trendingCard?.[titleLan], 35)}
              </h2>
              <div
                title={trendingCard?.description?.[language]}
                className={`${BankGothic.className} ${styles.subTitle}`}
                dangerouslySetInnerHTML={{ __html: TruncateText(trendingCard?.description?.[language], 150) }}
              >
              </div>
              <div className={styles.date_wrap}>
                <h6 className={`${BankGothic.className} ${styles.date}`}>
                  {trendingCard?.date?.[language]}
                </h6>
                <button
                  className={`${BankGothic.className} ${styles.seeMore}`}
                  onClick={() => handleNavigate(trendingCard?.id)}
                >
                  {trendingCard?.readMore?.[language]}
                </button>
              </div>
            </div>
            <img src={Img_url + trendingCard?.image} alt="" width={579} height={429} />
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsBlogspage;
