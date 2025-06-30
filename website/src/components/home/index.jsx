import React, { useEffect, useRef, useState } from "react";
// import styles from "@/components/home/Home.module.scss";
import styles from "@/components/home/Home.module.scss";
import Button from "@/common/Button";
import Image from "next/image";
import Arrow from "../../assets/icons/right-wrrow.svg";
// import Client from "../../assets/icons/client.svg";
// import AboutUs from "../../assets/images/aboutus.png";
import localFont from "next/font/local";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { Img_url } from "@/common/CreateContent";
// import required modules
import {
  Pagination,
  Navigation,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useGlobalContext } from "../../contexts/GlobalContext";
import blankImage from "../../assets/images/blankImage.webp";
import background from "../../assets/images/Hero.png";
// import dynamic from 'next/dynamic';
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import ContactUsModal from "../header/ContactUsModal";

import {
  services,
  experience,
  recentProjects,
  markets,
  safety,
  clients,
  testimonials,
} from "../../assets/index";
import patch from "../../contexts/svg/path.jsx";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const HomePage = ({ content }) => {
  const router = useRouter();
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  const scrollRef = useRef(null);

  // Create refs for the navigation buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);
  const [activeRecentProjectSection, setActiveRecentProjectSection] =
    useState(0);
  const [isModal, setIsModal] = useState(false);
  const redirectionUrlForRecentProject = ["/project", "/market", "/"];
  const [swiperInstance, setSwiperInstance] = useState(null);
  // Helper function to chunk array into groups of 4
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const handleContactUSClose = () => {
    setIsModal(false);
  };

  // Inside your component, before the return statement:
  const projectsPerSlide = 4;

  let projectChunks = chunkArray(
    content?.["5"]?.sections?.[activeRecentProjectSection]?.items || [],
    projectsPerSlide
  );

  const ProjectSlider = { ...recentProjects, ...markets, ...safety };

  const TruncateText = (text, length) => {
    if (text?.length > (length || 50)) {
      return `${text?.slice(0, length || 50)}...`;
    }
    return text;
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const children = container.firstChild?.children;
    if (!children || children.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index >= children.length) index = 0;

      const child = children[index];
      if (child) {
        container.scrollTo({
          left: child.offsetLeft - 64, // Adjust for padding (`px-16`)
          behavior: "smooth"
        });
      }

      index++;
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* banner */}
      <section
        className={`${styles.home_banner_wrap} `}
      >
        <span
          className={`${language === "en" && styles.leftAlign} ${styles.backgroundContainer
            }`}
        >
          <img
            style={{ objectPosition: "bottom", objectFit: "cover" }}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            alt="about-us"
            className={styles.backgroundImage}
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
          <div className={styles.gradientOverlay}>
            <div
              className={styles.gradientBlob}
              style={{
                width: 950,
                height: 650
              }}
            ></div>
          </div>
          <h1 className={`${styles.title}`}>
            {currentContent?.["1"]?.content?.title?.[language]}
          </h1>
          <p className={`${styles.description} ${BankGothic.className} bank-light`}>
            {currentContent?.["1"]?.content?.description?.[language]}
          </p>
          <Button
            className={`${styles.view_btn}  ${language === "en" && styles.noPadding
              }`}
            onClick={() => router.push("/project")}
            style={{
            }}
          >
            <span>
              {currentContent?.[1]?.content?.button?.[0]?.text?.[language]}
            </span>
            <Image
              src={Arrow}
              width="18"
              height="17"
              alt=""
              style={{
                transform: isLeftAlign && "scaleX(-1)",
              }}
              className={`${styles.arrow_btn}`}
            />
          </Button>


        </div>
        {/* </div> */}
      </section>

      {/* about us section */}
      <section
        dir={isLeftAlign ? "ltr" : "rtl"}
        className={`${styles.about_us_wrapper} ${language === "en" && styles.englishVersion
          }`}
      >
        <div className={`container ${styles.main_container}`} dir={isLeftAlign ? "ltr" : "rtl"}>
          <div className={`${styles.about_content} ${isLeftAlign ? styles.englishPosition : styles.arabicPosition}`}>
            <h2 className={`${styles.title}`}>
              {currentContent?.["2"]?.content?.title?.[language]}
            </h2>
            <div>
              <div
                dir={isLeftAlign ? "ltr" : "rtl"}
                className={`${styles.description} ${BankGothic.className}`}
                dangerouslySetInnerHTML={{
                  __html:
                    currentContent?.["2"]?.content?.description?.[language],
                }}
              />
            </div>
            <Button
              className={styles.view_btn}
              onClick={() => router.push("/about-us")}
            >
              {currentContent?.["2"]?.content?.button?.[0]?.text?.[language]}
            </Button>
          </div>

          <div className={styles.about_us_banner_wrap}>
            <img
              src={`${Img_url}${content?.["2"]?.content?.images?.[0]?.url}`}
              alt="about-us"
              className=""
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </section>
      {/* service section */}
      <section className={styles.service_wrapper}>
        <div className={`container`}>
          <h2 className={`${styles.title}`}>
            {currentContent?.["3"]?.content?.title?.[language]}{" "}
            {/* Dynamic title */}
          </h2>

          <div className={styles.service_cards}>
            {currentContent?.["3"]?.items?.map((card, key) => (
              <div
                className={styles.card}
                key={key}
                onClick={() => router.push("/services")}
              >
                <div className={styles.card_body}>
                  <Image
                    className={styles.icon}
                    src={Img_url + card?.icon}
                    width={40}
                    height={40}
                    alt="services-icon"
                    // fill
                    sizes="100vw"
                  />

                  <h5 className={styles.span}></h5>
                  <h5 className={styles.card_title}>{card?.[titleLan]} </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* experience section */}
      <section className={styles.experince_wrapper}>
        <div className={`container ${styles.main_container}`}>
          <div className={styles.experience_colums}>
            <div
              className={`${styles.experince_cards} ${language === "ar" && styles.arabicVersion
                }`}
            >
              {currentContent?.["4"]?.content?.cards?.map((item, key) => (
                <div className={styles.card} key={key}>
                  <div className={styles.card_body}>
                    {/* <Image src={item.url} width="66" height="66" alt="about-us" className={styles.icon} /> */}
                    <Image
                      className={styles.icon}
                      src={Img_url + item.icon}
                      width={60}
                      height={key === 1 ? 47 : 60}
                      alt="cards-icon"
                    />
                    <h3 className={styles.count}>{item.count}</h3>
                    <h5 className={styles.card_title}>
                      {item.title[language]}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.experince_content}>
              {/* <AnimatedText text="32 عاما من الخبرة" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

              <h2 className={`${styles.title}`}>
                {" "}
                {currentContent?.[4]?.content?.title[language]}
              </h2>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.[4]?.content?.description[language]}
              </p>

              <Button
                className={`${styles.view_btn} ${language === "ar" && styles.arabicVersion
                  }`}
                onClick={() => setIsModal(true)}
              >
                {currentContent?.[4]?.content?.button?.[0]?.text[language]}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* recent project section */}
      <section className={styles.recent_project_wrapper}>
        <div className={`container ${styles.main_container}`}>
          <div className={styles.back_btn_wrapper}>
            {activeRecentProjectSection === 2 ? (
              ""
            ) : (
              <button
                type="button"
                className={styles.back_btn}
                onClick={() =>
                  router.push(
                    redirectionUrlForRecentProject[activeRecentProjectSection]
                  )
                }
              >
                {currentContent?.["5"]?.content?.buttons[0]?.text[language]}{" "}
                &nbsp;
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/5d82e78b-cb95-4768-abfe-247369079ce6-bi_arrow-up.svg"
                  width="18"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                    }`}
                />{" "}
              </button>
            )}
          </div>
          <div className={styles.recent_project}>
            <div className={styles.leftDetails}>
              {currentContent?.["5"]?.sections?.map((section, index) => (
                <div
                  key={index}
                  className={`${styles.recent_project_content}  ${language === "ar" && styles.arabicVersion
                    }`}
                >
                  <span
                    className={
                      activeRecentProjectSection === index
                        ? styles.title
                        : styles.subtitle
                    }
                    onClick={() => setActiveRecentProjectSection(index)}
                  >
                    <h2
                      className={
                        activeRecentProjectSection === index
                          ? styles.title
                          : styles.subtitle
                      }
                    >
                      {section?.content?.title?.[language]}
                    </h2>
                  </span>

                  <p
                    className={`${activeRecentProjectSection === index
                      ? styles.description
                      : styles.descriptionHide
                      } ${BankGothic.className}`}
                  >
                    {section?.content?.description?.[language]}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Swiper
                key={language}
                modules={[Pagination, Navigation]}
                className={styles.mySwiper}
                // pagination={{
                //   clickable: true,
                // }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onSwiper={(swiper) => {
                  setSwiperInstance(swiper);
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
              >
                {projectChunks.map((chunk, slideIndex) => (
                  <SwiperSlide key={slideIndex}>
                    <div className={styles.recent_project_cards}>
                      {chunk?.map((project, cardIndex) => {
                        console.log(project)
                        return (
                          <div className={styles.card} key={cardIndex}>
                            <div className={styles.card_img_wrap}>
                              <Image
                                // className={styles.card_img}
                                className={
                                  project.image
                                    ? styles.card_img
                                    : styles.card_imgFade
                                }
                                alt={project?.[titleLan]}
                                src={
                                  Img_url +
                                  project.image
                                }
                                height={247}
                                width={350}
                              />
                            </div>
                            <div className={styles.card_body}>
                              <h5
                                title={project?.[titleLan]}
                                className={styles.title}
                              >
                                {TruncateText(project?.[titleLan], 45)}
                              </h5>
                              <p
                                title={project?.subtitle?.[language]}
                                className={styles.subtitle}
                              >
                                {TruncateText(project?.subtitle?.[language], 25)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom buttons */}

              <div
                className={`${styles.btn_wrapper} ${projectChunks?.length <= 1 && styles.hide_btn_wrapper
                  }`}
              >
                <button ref={prevRef} className={styles.custom_prev}>
                  <Image
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                    width="18"
                    height="17"
                    alt=""
                    className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                      }`}
                  />
                  &nbsp;
                  {
                    currentContent?.recentProjectsSection?.buttons[1]?.text[
                    language
                    ]
                  }
                </button>
                <button ref={nextRef} className={styles.custom_next}>
                  {" "}
                  {
                    currentContent?.recentProjectsSection?.buttons[2]?.text[
                    language
                    ]
                  }{" "}
                  &nbsp;
                  <Image
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                    width="18"
                    height="17"
                    alt=""
                    className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* client section */}
      <section className={styles.Client_wrapper}>
        {/* <Image
          src="https://frequencyimage.s3.ap-south-1.amazonaws.com/98d10161-fc9a-464f-86cb-7f69a0bebbd5-Group%2061%20%281%29.svg"
          width="143"
          height="144"
          alt="about-us"
          className={styles.ellips}
        /> */}
        {/* <Image
          src="https://frequencyimage.s3.ap-south-1.amazonaws.com/216c2752-9d74-4567-a5fc-b5df034eba6e-Group%2062%20%281%29.svg"
          width="180"
          height="181"
          alt="about-us"
          className={styles.ellips2}
        /> */}
        <div className={`container ${styles.main_container}`}>
          <div className={styles.Client_content}>
            {/* <AnimatedText text="عملائنا السعداء" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h2 className={`${styles.title}`}>
              {currentContent?.["6"]?.content?.title[language]}
            </h2>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.["6"]?.content?.description[language]}
            </p>
          </div>
          <div ref={scrollRef} className={styles.Client_cards}>
            {currentContent?.["6"]?.content?.clientsImages?.map(
              (client, key) => (
                <div className={styles.card} key={key}>
                  <div className={styles.card_body}>
                    <Image
                      src={Img_url + client?.url}
                      width={66}
                      height={66}
                      alt="about-us"
                      className={styles.client}
                    // style={{objectFit:"cover"}}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* testomonials section  */}
      <section
        className={` ${styles.testimonial_wrapper} ${language !== "en" && styles.rightAlignment
          }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.testimonials_content}>
            {/* <AnimatedText text="ماذا يقول عملاؤنا عنا؟" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h2 className={`${styles.title}`}>
              {currentContent?.["7"]?.content?.title[language]}
            </h2>
          </div>

          <div className={styles.testimonials_client}>
            <Swiper
              key={language} // This will force remount on language change
              modules={[Navigation, Autoplay, EffectCoverflow]}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1}
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
              // breakpoints={{
              //   724: { slidesPerView: 2 },
              //   600: { slidesPerView: 2 },
              // }}
              breakpoints={{
                600: {
                  slidesPerView: 1.5,
                  centeredSlides: true, // make sure it's there
                },
                768: {
                  slidesPerView: 1.5,
                  centeredSlides: true, // make sure it's there
                },
                950: {
                  slidesPerView: 2,
                  centeredSlides: true,
                },
              }}
              rtl={language === "ar"}
            >

              {currentContent?.["7"]?.items?.map((testimonial, index) => (
                <SwiperSlide
                  key={index}
                  className={`${styles.swiperSlide} ${styles.testimonial_slide}`}
                >
                  <div className={styles.testimonial_card}>
                    <Image
                      src={testimonials?.[testimonial?.image]}
                      height={70}
                      width={70}
                      alt={testimonial?.name}
                      className={styles.testimonial_image}
                    />
                    <div className={styles.testimonial_content}>
                      <h3 className={styles.name}>{testimonial?.[titleLan]}</h3>
                      <p className={styles.position}>
                        {
                          testimonial?.liveModeVersionData?.sections?.[0]
                            ?.content?.position?.[language]
                        }
                      </p>
                      <p className={styles.quote}>
                        {
                          testimonial?.liveModeVersionData?.sections?.[0]
                            ?.content?.quote?.[language]
                        }
                      </p>
                      <div
                        className={styles.company_wrap}
                        style={{
                          flexDirection: isLeftAlign ? "row" : "row-reverse",
                          justifyContent: isLeftAlign ? "flex-start" : "end",
                        }}
                      >
                        <Image
                          src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                          height={18}
                          width={18}
                          alt={testimonial.name}
                          className={styles.company_icon}
                        />
                        <p className={styles.company}>
                          {
                            testimonial?.liveModeVersionData?.sections?.[0]
                              ?.content?.company?.[language]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom buttons */}
            <div className={styles.testimonial_wrapper_btn}>
              <button ref={testimonialPrevRef} className={styles.custom_next}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
                    }`}
                />{" "}
              </button>
              <button ref={testimonialNextRef} className={styles.custom_prev}>
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

      {/* new project section */}
      <section className={styles.new_project_wrapper}>
        <div className={`container ${styles.main_container}`}>
          <div className={styles.Client_content}>
            <h2 className={`${styles.title}`}>
              {currentContent?.["8"]?.content?.title[language]}
            </h2>
            {/* <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.['8']?.content?.description[
                language
              ].replace(
                currentContent?.newProjectSection?.highlightedText[language],
                `"${currentContent?.newProjectSection?.highlightedText[language]}"`
              )}

              <i className={language === "ar" && styles.arabicVersion}>
                {patch()}
              </i>
            </p> */}

            <div
              className={`${styles.description} ${BankGothic.className}`}
              dangerouslySetInnerHTML={{
                __html: currentContent?.["8"]?.content?.description?.[language],
              }}
            />
            {/* {currentContent?.newProjectSection?.description2[language]} */}
            {/* </div> */}

            <Button
              className={styles.view_btn}
              onClick={() => setIsModal(true)}
            >
              {currentContent?.["8"]?.content?.button?.[0]?.text?.[language]}
            </Button>
          </div>
        </div>
      </section>
      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default HomePage;
