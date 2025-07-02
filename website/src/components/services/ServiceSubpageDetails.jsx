import React, { useEffect, useRef, useState } from "react";
import bannerImg from "@/assets/images/about.png";
import styles from "@/components/services/serviceSubpageDetails.module.scss";
import localFont from "next/font/local";
import { backendAPI, useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "next/router";
import createContent, { Img_url } from "@/common/CreateContent";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const bannerSection = {
  id: "1",
  title: "project service",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  image: bannerImg,
};

const secondSection = {
  id: "2",
  title: "Why you Should Partner?",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  items: [
    {
      id: "3",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "4",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "5",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "6",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
  ],
};

const thirdSection = [
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
];

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const ServiceSubpageDetails = ({ }) => {
  const { query } = useRouter();
  const { child } = query;
  const [content, setContent] = useState({})
  // console.log("Safety Detail Page content:", content);

  const swiperRef = useRef(null);


  const currentContent = content || {};
  console.log("Serviceio Page Content:", currentContent);
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";



  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${backendAPI}${child}`); // note => the market is slug, since the backend require slug to get content in this scenario

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
  }, [child])


  return (
    <div>
      <section className={styles.banner_section}>
        <div className="container">
          <div className={styles.banner_content}>
            <h1>{content?.[1]?.content?.title?.[language]}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: content?.[1]?.content?.description?.[language] }}
            >
            </div>
          </div>
          <div className={styles.banner_image}>
            <img src={
              Img_url + content?.[1]?.content?.images?.[0]?.url
            } alt="" />
          </div>
        </div>
      </section>

      <section className={styles.second_section}>
        <div className="container">
          <div className={styles.second_section_header}>
            <h2>{content?.[2]?.content?.title?.[language]}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: content?.[2]?.content?.description?.[language] }}
            ></div>
          </div>
          <div className={styles.second_section_items_wrapper}>
            {content?.[2]?.content?.points.map((point, i) => (
              <div key={point?.title?.[language]} className={styles.second_section_item}>
                <h3>{point?.title?.[language]}</h3>
                <p>{point?.description?.[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.carouselSection}>
        <div
          className={`${styles.carouselWrapper} ${!isLeftAlign ? styles.scaleReverse : ""
            }`}
          dir="ltr"
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            grabCursor={true}
            slidesPerView={2.5}
            loop={true}
            spaceBetween={10}
            slidesOffsetBefore={isLeftAlign ? 15 : -10}
            autoplay={{
              delay: 2400,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 250,
              modifier: 2,
              slideShadows: false,
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              1024: { slidesPerView: 2.5 },
              768: { slidesPerView: 1.5 },
              480: { slidesPerView: 1 },
              0: { slidesPerView: 1 },
            }}

          >
            {content?.[3]?.content?.images?.map((image, index) => (
              <SwiperSlide
                key={index}
                dir={isLeftAlign ? "ltr" : "rtl"}
              >
                <div>
                  <img
                    src={Img_url + image.url}
                    height={300}
                    width=""
                    alt={image.title?.[language]}
                    className={styles.carouselImage}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    </div>
  );
};

export default ServiceSubpageDetails;
