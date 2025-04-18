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

const MarketPage = () => {
  const router = useRouter();

  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);
  const [activeTab, setActiveTab] = useState("buildings");
  const { language, content } = useGlobalContext();
  const currentContent = content?.market;
  const [isModal, setIsModal] = useState(false);

  const [filterMarketItems, setFilterMarketItems] = useState([]);
  const [visibleMarketItemsCount, setVisibleMarketItemCount] = useState(6);

  const handleContactUSClose = () => {
    setIsModal(false);
  };

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
    if (text.length > (length || 50)) {
      return `${text.slice(0, length || 50)}...`;
    }
    return text;
  };

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.market_banner_wrap
        }`}
      >
        <div
          className="container"
          style={{ height: "100%", position: "relative" }}
        >
          <div className={styles.content}>
            {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title} `}>
              {currentContent?.banner?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.banner?.description[language]}
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
              &nbsp;{currentContent?.banner?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.market_cot_wrap
        }`}
      >
        <div className="container">
          <div className={styles.content}>
            <div className={styles.card}>
              <Image
                src="https://frequencyimage.s3.ap-south-1.amazonaws.com/314d64b5-770d-4d55-9faf-b273f55d1a5c-%E2%80%9C.svg"
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.quote?.text[language]}
              </p>
              <h5 className={`${styles.title} ${BankGothic.className}`}>
                -{currentContent?.quote?.author[language]}
              </h5>
            </div>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.market_tab_container
        }`}
      >
        <div className="container">
          <div className={styles.tabContainer}>
            {/* Tabs */}
            <div className={styles.tabs}>
              {currentContent?.tabSection?.tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`${styles.tabButton} ${
                    activeTab === tab?.id ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(tab?.id)}
                >
                  {tab.title[language]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className={styles.card_group}>
              {filterMarketItems
                ?.slice(0, visibleMarketItemsCount)
                ?.map((item, index) => (
                  <div className={styles.card} key={index}>
                    <Image
                      src={projectPageData[item.imgUrl]}
                      width="339"
                      height="190"
                      alt={item.title[language]}
                      className={styles.card_image}
                    />
                    <h5
                      title={item?.title[language]}
                      className={`${styles.title} ${BankGothic.className}`}
                    >
                      {TruncateText(item.title[language], 45)}
                    </h5>
                    <button
                      onClick={() => router.push(`/market/${index + 1}`)}
                      className={`${styles.button} ${BankGothic.className}`}
                    >
                      {currentContent?.tabSection?.button[0]?.text[language]}
                      <Image
                        className={` ${
                          language === "en" && styles.leftAlign
                        }   ${styles.icon}`}
                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                        width={22}
                        height={22}
                        alt="icon"
                      />
                    </button>
                  </div>
                ))}
            </div>
            {visibleMarketItemsCount < filterMarketItems.length && ( // Show button only if there are more projects
              <div className={styles.button_wrap}>
                <Button
                  className={styles.view_more_btn}
                  onClick={() =>
                    setVisibleMarketItemCount(visibleMarketItemsCount + 6)
                  } // Increase count by 4
                >
                  {currentContent?.tabSection?.button[1]?.text[language]}
                  <Image
                    src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                    width={24}
                    height={24}
                    alt="icon"
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* testomonials section  */}

      <section
        className={` ${language !== "en" && styles.rightAlignment}   ${
          styles.testimonial_wrapper
        }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.testimonials_content}>
            {/* <AnimatedText text={currentContent?.testimonialSection?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title}`}>
              {currentContent?.testimonialSection?.title[language]}
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
              {currentContent?.testimonialSection?.testimonials?.map(
                (testimonial, index) => (
                  <SwiperSlide
                    key={index}
                    className={`${styles.swiperSlide} ${styles.testimonial_slide}`}
                  >
                    <div className={styles.testimonial_card}>
                     
                      <div className={styles.testimonial_content}>
                        <h3 className={styles.name}>
                          {testimonial.name[language]}
                        </h3>
                        <p className={styles.position}>
                          {testimonial.position[language]}
                        </p>
                        <p className={styles.quote}>
                          {testimonial.quote[language]}
                        </p>
                        <div className={styles.company_wrap}>
                        <p className={styles.company}>
                            {testimonial.company[language]}
                          </p>
                          <Image
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={testimonial.name[language]}
                            className={styles.company_icon}
                          />
                        
                        </div>
                      </div>
                      <Image
                        src={testimonials?.[testimonial?.image]}
                        height={70}
                        width={70}
                        alt={testimonial.name[language]}
                        className={styles.testimonial_image}
                      />
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
                  className={`${styles.arrow_btn} ${
                    language === "en" && styles.leftAlign
                  }`}
                />
              </button>
              <button ref={testimonialNextRef} className={styles.custom_next}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${
                    language === "en" && styles.leftAlign
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.about_new_project_wrapper
        }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.Client_content}>
            {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title}`}>
              {currentContent?.newProject?.title[language]}
            </h2>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description1[language].replace(
                currentContent?.newProject?.highlightedText[language],
                `"${currentContent?.newProject?.highlightedText[language]}"`
              )}
              <i>{patch()}</i>
            </p>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description2[language]}
            </p>
            <Button
              onClick={() => setIsModal(true)}
              className={` ${language === "en" && styles.leftAlign}   ${
                styles.view_btn
              }`}
            >
              {currentContent?.newProject?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>
      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default MarketPage;
