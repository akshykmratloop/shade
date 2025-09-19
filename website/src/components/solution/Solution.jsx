import React, { useRef, useState } from "react";
import styles from "./solution.module.scss";
import styles1 from "../home/Home.module.scss"
import localFont from "next/font/local";
import Button from "@/common/Button";
import Image from "next/image";
import Arrow from "../../assets/icons/right-wrrow.svg";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useRouter } from "next/router";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import dynamic from 'next/dynamic';
// import patch from "../../contexts/svg/path.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Img_url } from "@/common/CreateContent";
// import {
//   services,
//   experience,
//   recentProjects,
//   markets,
//   safety,
//   clients,
//   testimonials,
// } from "../../assets/index";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
const ContactUsModal = dynamic(() => import('../header/ContactUsModal'), { ssr: false });

const SolutionPage = ({ content }) => {
  const router = useRouter();
  const { language } = useGlobalContext();
  const currentContent = content;

  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);

  const [isModal, setIsModal] = useState(false);
  const handleContactUSClose = () => {
    setIsModal(false);
  };
  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.solution_banner_wrap
          }`}

        style={{
          backgroundImage: `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})`
        }}
      >

        <div className={styles.content}>
          {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
          <h1 className={`${styles.title}`}>
            {currentContent?.['1']?.content?.title?.[language]}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.['1']?.content?.description?.[language]}
          </p>
          <Button className={styles.view_btn}
            onClick={() => router.push('/project')}
          >

            &nbsp;{currentContent?.[1]?.content?.button?.[0]?.text[language]}
            <Image
              src={Arrow}
              width="18"
              height="17"
              alt=""
              className={styles.arrow_btn}
              style={{ transform: language === "en" && "scaleX(-1)" }}
            />
          </Button>
        </div>
        <div className={styles.gradientOverlay}>
          <div
            className={styles.gradientBlob}
            style={{
              // width: 950,
              // height: 650
            }}
          ></div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.solution_content_wrap
          }`}
      >
        {
          currentContent?.[2]?.content?.map((e, i) => {

            return (
              <div className="container" key={i}>
                <div className={styles.content_wrap}>
                  <div className={styles.left_panel}>
                    <span> </span>
                    <h1 className={`${styles.title}`}>
                      {e.title?.[language]}
                    </h1>
                  </div>
                  <div
                    className={styles.right_panel}
                  >
                    <div
                      className={`${styles.description} ${BankGothic.className}`}
                      dangerouslySetInnerHTML={{ __html: e.description?.[language] }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        }
      </section>

      <section
        className={` 
          ${styles.testimonial_wrapper} 
          ${language !== "en" && styles1.rightAlignment
          }`}
      >
        <div className={`container `}>
          <div className={styles1.testimonials_content}>
            {/* <AnimatedText text="ماذا يقول عملاؤنا عنا؟" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h2 className={`${styles1.title}`}>
              {currentContent?.['3']?.content?.title?.[language]}
            </h2>
          </div>

          <div
          //  className={styles1.testimonials_client}
          >
            <Swiper
              modules={[Navigation, Autoplay, EffectCoverflow]}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2} // Show 1 main slide and part of the other two
              loop={true}
              spaceBetween={10}
              effect="coverflow"
              className={styles1.mySwiper_testimonial}
              navigation={{
                prevEl: testimonialPrevRef.current,
                nextEl: testimonialNextRef.current,
              }}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 250, // Adjust this for the depth effect
                modifier: 2, // Adjust the scale modifier
                slideShadows: false, // Optional: Enable/disable shadows
              }}
              autoplay={{ delay: 2500 }}
              breakpoints={{
                0: {           // very small screens
                  slidesPerView: 1,
                  spaceBetween: 8,
                },
                500: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 1.5,
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 14,
                },
                1280: {
                  slidesPerView: 2.2,
                  spaceBetween: 16,
                },
              }}


              rtl={true} // Enable RTL for Arabic layout
            >
              {currentContent?.['3']?.content?.images?.map(
                (image, index) => (
                  <SwiperSlide
                    key={index}
                  >
                    <img
                      src={Img_url + image.url}
                      alt={image?.name}
                      style={{
                        width: '100%',
                        height: '60vh',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />

                    {/* </div> */}
                  </SwiperSlide>
                )
              )}
            </Swiper>

            {/* Custom buttons */}
            {/* <div className={styles1.testimonial_wrapper_btn}>
              <button ref={testimonialPrevRef} className={styles1.custom_next}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles1.arrow_btn} ${language === "en" && styles1.leftAlign
                    }`}
                />{" "}
              </button>
              <button ref={testimonialNextRef} className={styles1.custom_prev}>
                <Image
                  src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                  width="22"
                  height="17"
                  alt=""
                  className={`${styles1.arrow_btn} ${language === "en" && styles1.leftAlign
                    }`}
                />
              </button>
            </div> */}
          </div>
        </div>
      </section>
      {/* 
      <section className={styles.gallery_wrap}>
        <div className="container">
          <div className={styles.gallery}>
            {currentContent?.gallery?.images.map((image, index) => (
              <Image
                key={index}
                src={image.url}
                width={image.width}
                height={image.height}
                alt=""
                className={styles.gallery_img}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.solution_content_wrap
          }`}
      >
        <div className="container">
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <span> </span>

              <h1 className={`${styles.title}`}>
                {currentContent?.howWeDo?.title[language]}
              </h1>
            </div>
            <div className={styles.right_panel}>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.howWeDo?.description[language]}
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className={styles.showcase_gallery_wrap}>
        <div className="container">
          <div className={styles.showcase_gallery}>
            {currentContent?.gallery?.showcase.map((image, index) => (
              <div key={index} className={styles.showcase_gallery_img_wrap}>
                <Image
                  src={image.url}
                  width={image.width}
                  height={image.height}
                  alt=""
                  className={styles.gallery_img}
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}


      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />

    </>
  );
};

export default SolutionPage;
