import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import styles from "./market.module.scss";
import Arrow from "../../assets/icons/right-wrrow.svg";
import "swiper/css";
import "swiper/css/pagination";
import localFont from "next/font/local";
import Image from "next/image";
import Button from "@/common/Button";
import rightQuote from "../../assets/icons/right-quote.png"
import bracket_l from "../../assets/icons/bracket-l.svg"
// import bracket_l from "@/assets/icons/bracket-l.svg"
import bracket_r from "../../assets/icons/bracket-r.svg"
import patch from "../../contexts/svg/path.jsx";
// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { testimonials } from "../../assets/index";
import dynamic from "next/dynamic";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useRouter } from "next/router";
const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
  ssr: false,
});
import { projectPageData } from "../../assets/index";
import { Img_url } from "@/common/CreateContent";
import Link from "next/link";

const MarketPage = ({ content }) => {
  console.log(content)
  const router = useRouter();
  const currentPath = router.asPath;

  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);
  const [activeTab, setActiveTab] = useState("buildings");
  const { language } = useGlobalContext();
  const currentContent = content;
  const [isModal, setIsModal] = useState(false);
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr"

  const [filterMarketItems, setFilterMarketItems] = useState([]);
  const [visibleMarketItemsCount, setVisibleMarketItemCount] = useState(6);

  const handleContactUSClose = () => {
    setIsModal(false);
  };

  console.log(bracket_l.src)

  useEffect(() => {
    setFilterMarketItems(
      currentContent?.tabSection?.marketItems
        ? currentContent?.tabSection?.marketItems.filter(
          (item) => item?.type === activeTab
        )
        : []
    );
    setVisibleMarketItemCount(6);
  }, [activeTab, currentContent]); // Added currentContent as a dependency

  const TruncateText = (text, length) => {
    if (text?.length > (length || 50)) {
      return `${text.slice(0, length || 50)}...`;
    }
    return text;
  };

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.market_banner_wrap
          }`}

        style={{
          background: `url(${Img_url + currentContent?.[1]?.content?.images?.[0]?.url}) no-repeat center / cover`
        }}
      >
        <div
          className="container"
          style={{ height: "100%", position: "relative" }}
        >
          <div className={styles.content}>
            {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title} `}>
              {currentContent?.[1]?.content?.title?.[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.[1]?.content?.description?.[language]}
            </p>
            <Button
              className={styles.view_btn}
              onClick={() => router.push("/services")}
            >
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />
              &nbsp;{currentContent?.[1]?.content?.button?.[0]?.text?.[language]}
            </Button>
          </div>
        </div>
      </section >

      {/* sub heading */}
      < section
        dir={isLeftAlign ? "ltr" : "rtl"}

        className={`${styles.subHeading}`
        }>
        <h2
          // style={{ fontSize: '60px' }}
          className={`${styles.title}`}>
          {currentContent?.['3']?.content?.introSection?.title?.[language]}
        </h2>
        <div
          style={{ wordSpacing: '2px', lineHeight: '20px' }}
          className={`${styles.description} bank-light`}
          dangerouslySetInnerHTML={{ __html: currentContent?.['3']?.content?.introSection?.description?.[language] }}
        />
      </section >

      {/* market cards */}
      <div className={`${styles.subMarkets}`}
        dir={isLeftAlign ? "ltr" : "rtl"}
      >
        {
          currentContent?.['3']?.items?.map((e, i) => {
            let odd = i % 2 !== 0
            return (
              <section
                style={{
                  // height: '359px',
                  // flexDirection: odd ? "row-reverse" : ""
                }}
                className={`${styles.card} ${odd ? styles.row_reverse : ""}`} key={e.id}>
                <div className={` ${styles.Imagediv}`}
                // style={{ width: '463px', height: '100%' }}
                >
                  <img
                    src={Img_url + e.image}
                    alt=""
                    style={{
                      // width: '463px',
                      height: '100%'
                    }}
                  />
                </div>
                <article
                  dir={isLeftAlign ? "ltr" : "rtl"}
                  className={`${styles.article}`}>
                  <h3 className={`${styles.title}`}
                    style={{
                      fontSize: '32px',
                    }}
                  >{TruncateText(e?.[titleLan], 35)} </h3>
                  <div className={`${styles.description} bank-light`}
                    style={{
                      fontSize: '16px',
                      wordSpacing: '2px'
                    }}
                    dangerouslySetInnerHTML={{ __html: TruncateText(e?.description?.[language], 350) }}
                  >
                  </div>
                  <Link
                    href={`${currentPath}/${e.slug}`}
                    className={`${styles.button} ${isLeftAlign ? "flex-row-reverse" : ""} bankgothic-medium-dt`}
                    style={{
                      fontSize: '16px',
                      padding: '15px',
                      flexDirection: "row-reverse",
                    }}
                  >
                    <Image
                      src={Arrow}
                      alt="Arrow"
                      style={{
                        // fontSize: '16px',
                        // padding: '15px',
                        scale: isLeftAlign ? "-1" : "",
                      }}
                      className={` ${isLeftAlign ? 'scale-x-[-1]' : ''}  w-[11px] h-[11px]`}
                    />
                    <p>
                      {currentContent?.["3"]?.content?.button?.[0]?.text?.[language]}
                    </p>
                  </Link>
                </article>
              </section>
            )
          })
        }
      </div>

      {/* quote */}
      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.market_cot_wrap
          }`}
      >
        <div className="container">
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.braketBefore}
                style={{ backgroundImage: `url(${bracket_l.src})` }}
              >
              </div>
              <div
                style={{ backgroundImage: `url(${bracket_r.src})` }}
                className={styles.braketAfter}>
              </div>

              <Image
                src={rightQuote}
                width="50"
                height="50"
                alt=""
                style={{ opacity: ".3" }}
                className={styles.arrow_btn}
              />
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.[2]?.content?.text[language]}
              </p>
              <h5 className={`${styles.title} ${BankGothic.className}`}>
                -{currentContent?.[2]?.content?.author[language]}
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* testomonials section  */}
      <section
        className={` ${language !== "en" && styles.rightAlignment}   ${styles.testimonial_wrapper
          }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.testimonials_content}>
            {/* <AnimatedText text={currentContent?.testimonialSection?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title}`}>
              {currentContent?.[4]?.content?.title[language]}
            </h2>
          </div>

          <div className={styles.testimonials_client}>
            <Swiper
              modules={[Navigation, Autoplay, EffectCoverflow]}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2}
              loop={true}
              spaceBetween={10}
              effect="coverflow"
              className={styles.mySwiper_testimonial}
              navigation={{
                prevEl: testimonialPrevRef.current,
                nextEl: testimonialNextRef.current,
              }}
              onSwiper={(swiper) => {
                swiper.params.navigation.prevEl = testimonialPrevRef.current;
                swiper.params.navigation.nextEl = testimonialNextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 250,
                modifier: 2,
                slideShadows: false,
              }}
              autoplay={{ delay: 2500 }}
              breakpoints={{
                724: { slidesPerView: 2.2 },
                500: { slidesPerView: 1 },
              }}
              rtl={true}
            >
              {currentContent?.[4]?.items?.map(
                (testimonial, index) => (
                  <SwiperSlide
                    key={index}
                    className={`${styles.swiperSlide} ${styles.testimonial_slide}`}
                  >
                    <div className={styles.testimonial_card}>
                      <Image
                        src={Img_url + testimonial?.liveModeVersionData?.sections?.[0]?.content.images?.[0]?.url}
                        height={70}
                        width={70}
                        alt={testimonial?.name?.[language]}
                        className={styles.testimonial_image}
                      />
                      <div className={styles.testimonial_content}>
                        <h3 className={styles.name}>
                          {testimonial?.[titleLan]}
                        </h3>
                        <p className={styles.position}>
                          {testimonial?.liveModeVersionData?.sections?.[0]?.content?.position?.[language]}
                        </p>
                        <p className={styles.quote}>
                          {testimonial?.liveModeVersionData?.sections?.[0]?.content?.quote?.[language]}
                        </p>
                        <div className={styles.company_wrap}
                          // dir={isLeftAlign ? "ltr" : "rtl"}
                          style={{ flexDirection: isLeftAlign ? "row" : "row-reverse", justifyContent: isLeftAlign ? "flex-start" : "end" }}
                        >
                          <Image
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={testimonial?.name?.[language]}
                            className={styles.company_icon}
                          />
                          <p className={styles.company}>
                            {testimonial?.liveModeVersionData?.sections?.[0]?.content.company?.[language]}
                          </p>


                        </div>
                      </div>

                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>

            <div className={styles.testimonial_wrapper_btn}>
              <button ref={testimonialPrevRef} className={styles.custom_prev}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                    }`}
                />
              </button>
              <button ref={testimonialNextRef} className={styles.custom_next}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default MarketPage;
