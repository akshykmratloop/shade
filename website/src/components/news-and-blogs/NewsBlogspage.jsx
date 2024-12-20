import React from "react";
import styles from "@/components/news-and-blogs/newsblogs.module.scss";
import Arrow from "../../assets/icons/right-wrrow.svg";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
// import dynamic from 'next/dynamic';
import localFont from "next/font/local";
// import Button from '@/common/Button';
import Image from "next/image";
import { useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useGlobalContext } from "../../contexts/GlobalContext";
import {newsBlogs} from "../../assets/index"
const NewsBlogspage = () => {
  const { language, content } = useGlobalContext();
  const currentContent = content?.newsBlogs;

  const bannerTitle = currentContent?.bannerSection?.title[language];
  const bannerDescription =
    currentContent?.bannerSection?.description[language];

  const mainCard = currentContent?.mainCard;
  const latestNews = currentContent?.latestNewCards;
  const trendingCard = currentContent?.trendingCard;

  const roter = useRouter();

  const TruncateText = (text, length) => useTruncate(text, length || 200);

  const handleNavigate = (id) => {
    roter.push(`blog/${2}`);
  };

  return (
    <>
     <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.news_blogs_banner_wrap
        }`}
      >

        <div className="container" style={{position :"relative" , height :"100%"}}>
          <div className={styles.content}>
            {/* <AnimatedText text="خبر & المدونات" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title} `}>
              {bannerTitle}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {bannerDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Card */}
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.main_card_wrap
        }`}
      >


        <div className="container">
          <div className={styles.card}>
            <div className={styles.card_body}>
              <h2 className={`${BankGothic.className} ${styles.title}`}>
                {mainCard.title[language]}
              </h2>
              <p className={`${BankGothic.className} ${styles.subTitle}`}>
                {TruncateText(mainCard.description[language])}
                
              </p>
              <div className={styles.date_wrap}>
                <h6 className={`${BankGothic.className} ${styles.date}`}>
                  {mainCard.date[language]}
                </h6>
                <button
                  className={`${BankGothic.className} ${styles.seeMore}`}
                  onClick={() => handleNavigate(2)}
                >
                  {mainCard.readMore[language]}
                </button>
              </div>
            </div>
            <Image src={mainCard.image} className={styles.image} alt="" width={433} height={224} />
          </div>
        </div>
      </section>

      {/* Latest News Cards */}
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.latest_new_card_wrap
        }`}
      >

        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {latestNews?.heading[language]}
          </h2>
          <div className={styles.card_group}>
            {latestNews?.cards?.map((card, index) => (
              <div className={styles.card} key={index}>
                <Image
                  src={newsBlogs[card.image]}
                  alt=""
                  className={styles.card_image}
                  width={280}
                  height={154}
                />
                <div className={styles.card_body}>
                  <h2 className={`${BankGothic.className} ${styles.title}`}>
                    {TruncateText(card.title[language],40)}
                  </h2>
                  <p className={`${BankGothic.className} ${styles.subTitle}`}>
                    {TruncateText(card.description[language],150)}
                  </p>
                  <div className={styles.date_wrap}>
                    <h6 className={`${BankGothic.className} ${styles.date}`}>
                      {card.date[language]}
                    </h6>
                    <button
                      className={`${BankGothic.className} ${styles.seeMore}`}
                    >
                      {card.readMore[language]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Card */}
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.trending_card_wrap
        }`}
      >

        <div className="container">
          <div className={styles.card}>
            <div className={styles.card_body}>
              <button className={styles.trending_btn}>
                {trendingCard?.button?.text[language]}
              </button>
              <h2 className={`${BankGothic.className} ${styles.title}`}>
                {TruncateText(trendingCard.title[language],35)}
              </h2>
              <p className={`${BankGothic.className} ${styles.subTitle}`}>
                {TruncateText(trendingCard.description[language],150)}
              </p>
              <div className={styles.date_wrap}>
                <h6 className={`${BankGothic.className} ${styles.date}`}>
                  {trendingCard.date[language]}
                </h6>
                <button className={`${BankGothic.className} ${styles.seeMore}`}>
                  {trendingCard.readMore[language]}
                </button>
              </div>
            </div>
            <Image src={trendingCard.image} alt="" width={579} height={429} />
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsBlogspage;
