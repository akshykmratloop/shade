import React, { useEffect, useRef, useState } from "react";
import styles from "./ProjectDetail.module.scss";
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
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { language } = useGlobalContext();
  const [content, setContent] = useState()

  const testimonialPrevRef = useRef(null);
  const testimonialNextRef = useRef(null);

  const currentContent = content;

  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const introSection = currentContent?.[1]?.content
  const urlSection = currentContent?.[2]?.content
  const projectInforCard = currentContent?.[2]?.content || []
  const descriptionSection = currentContent?.[3]?.content || []
  const gallerySection = currentContent?.[4]?.content
  const moreProjects = currentContent?.[5]

  // const TruncateText = (text, length) => useTruncate(text, length || 200);


  const TruncateText = (text, length) => {
    if (text.length > (length || 50)) {
      return `${text.slice(0, length || 50)}...`;
    }
    return text;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${backendAPI}${projectId}`); // note => the market is slug, since the backend require slug to get content in this scenario

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
  }, [projectId])
  return (
    <>
      {/* Intro Section */}
      <section className={styles.project_wrapper}>
        <div className="container">
          <div className={styles.project_info_wrap}>
            <div className={styles.left_panel}>
              <div>
                {/* Link to previous page */}
                <Link
                  href="/project"
                  className={`${styles.back_btn} ${BankGothic.className}`}
                >
                  <Image
                    src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back+(1).svg"
                    alt="Back Icon"
                    width={20}
                    height={20}
                    className={`${language === "en" && styles.leftAlign} ${styles.icon
                      }`}
                  />
                  {introSection?.button?.[0]?.text?.[language]}
                </Link>
                <h1
                  className={`${styles.title} ${BankGothic.className} ${language === "ar" && styles.rightAlign
                    }`}
                >
                  {introSection?.title?.[language]}
                </h1>
                <p className={`${styles.subtitle} ${BankGothic.className}`}>
                  {introSection?.subtitle?.[language]}
                </p>
                <Link href={introSection?.link?.url || ""} className={styles.url}>
                  <span className={BankGothic.className}>
                    {introSection?.link?.text}
                  </span>
                </Link>
              </div>
            </div>
            <div className={styles.right_panel}>
              <Image
                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"
                alt="Project Hero"
                width={683}
                height={303}
              />
            </div>
          </div>

          {/* Project Info List */}

          <div className={styles.project_info_list}>
            {projectInforCard?.map((card, index) => {
              return (
                <div key={index} className={styles.card}>
                  <Image
                    src={card?.icon}
                    alt=""
                    className={styles.card_image}
                    width={28}
                    height={28}
                  />
                  <h5
                    className={`${styles.title} ${BankGothic.className} ${language === "ar" && styles.rightAlign
                      }`}
                  >
                    {card?.key[language]}
                  </h5>
                  <p
                    title={card?.value[language]}
                    className={`${styles.subtitle} ${BankGothic.className}`}
                  >
                    {TruncateText(card?.value[language], 25)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className={styles.solution_content_wrap}>
        <div className={`container ${styles.detailsRows}`}>
          {/* Project Description */}

          {descriptionSection?.map((item, index) => {
            return (
              <div key={index} className={styles.content_wrap}>
                <div className={styles.left_panel}>
                  <h1
                    className={`${styles.title} ${BankGothic.className} ${language === "ar" && styles.rightAlign
                      }`}
                  >
                    {item?.title[language]}
                  </h1>
                </div>
                <div className={styles.right_panel}>
                  <div
                    className={`${styles.description} ${BankGothic.className}`}
                    dangerouslySetInnerHTML={{ __html: item?.description[language] }}
                  >
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery Section */}
      <section
        className={` 
          ${styles.testimonial_wrapper} 
          ${language !== "en" && styles1.rightAlignment
          }`}
      >
        <div className={`container `}>
          <div className={styles.testimonials_content}>
            {/* <AnimatedText text="ماذا يقول عملاؤنا عنا؟" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h2 className={`${styles.title}`}>
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
              className={styles.mySwiper_testimonial}
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
              {(gallerySection?.images || [])?.map(
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
          </div>
        </div>
      </section>

      {/* More Projects */}
      <section className={styles.latest_new_card_wrap}>
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {moreProjects?.title[language]}
          </h2>
          <div className={styles.card_group}>
            {moreProjects?.items?.map((project, key) => {
              // if (project.slug === slug) return null
              return (
                <div key={key} className="rounded-md p-3 flex flex-col items-start gap-2 ">
                  <img
                    src={projectPageData?.[project?.url] || "https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"}
                    // width={339}
                    // height={0}
                    alt="icon"
                    className="w-full aspect-[12/8]"
                  />
                  <h5 className={`text-[#292E23D] text-lg font-bold mt-4 h-11  ${language === 'ar' ? 'text-right' : ''}`}
                  // style={{ fontSize: fontSize.subProjectBoxHeading }}
                  >{TruncateText(project?.[titleLan], 25) || "Project Name"}</h5>
                  <p className={`text-gray-700 text-sm font-light mt-2 ${!isLeftAlign && "text-right"}`}
                  // style={{ fontSize: fontSize.mainPara }}
                  >{project?.location?.[language] || "Project Description"}</p>
                  <button
                    className="text-[#00b9f2] text-base font-normal flex items-center gap-2 mt-2 cursor-pointer bg-transparent border-none"
                  // onClick={() => router.push("/project/56756757656")}
                  >
                    {moreProjects?.content?.button?.text?.[language]}
                    <img
                      src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                      width={18}
                      height={18}
                      alt="icon"
                      className={`${language === 'en' ? 'scale-x-[-1]' : ''} `}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;
