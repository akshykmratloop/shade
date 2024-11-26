import React, { useRef, useState } from "react";
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

// import dynamic from 'next/dynamic';

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useLanguage } from "../../contexts/LanguageContext";

const MarketPage = () => {
  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const { language, content } = useLanguage();
  const currentContent = content?.market;

  return (
    <>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.market_banner_wrap
        }`}
      >

        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title} ${BankGothic.className}`}>
              {currentContent?.banner?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.banner?.description[language]}
            </p>
            <Button className={styles.view_btn}>
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
                    activeTab === index ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title[language]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className={styles.card_group}>
              {currentContent?.tabSection?.tabs[activeTab]?.projects?.map(
                (project, index) => (
                  <div className={styles.card} key={index}>
                    <Image
                      src={project?.url}
                      width="339"
                      height="190"
                      alt={project.title[language]}
                      className={styles.card_image}
                    />
                    <h5 className={`${styles.title} ${BankGothic.className}`}>
                      {project.title[language]}
                    </h5>
                    <button
                      className={`${styles.button} ${BankGothic.className}`}
                    >
                      {currentContent?.tabSection?.button?.text[language]}
                      <Image
                      className={` ${language === "en" && styles.leftAlign}   ${
                        styles.icon
                      }`}
                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                        width={22}
                        height={22}
                        alt="icon"
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>


      <section
        className={` ${language === "en" && styles.leftAlign}   ${
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
                      <Image
                        src={testimonial.image}
                        height={70}
                        width={70}
                        alt={testimonial.name[language]}
                        className={styles.testimonial_image}
                      />
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
                          <Image
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={testimonial.name[language]}
                            className={styles.company_icon}
                          />
                          <p className={styles.company}>
                            {testimonial.company[language]}
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
                  className={`${styles.arrow_btn} ${language === 'en' && styles.leftAlign}`}

                />
              </button>
              <button ref={testimonialNextRef} className={styles.custom_next}>

                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${language === 'en' && styles.leftAlign}`}

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
              className={` ${language === "en" && styles.leftAlign}   ${
                styles.view_btn
              }`}
            >
              {currentContent?.newProject?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketPage;
