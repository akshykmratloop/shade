import React, {useEffect, useRef, useState} from "react";
import styles from "@/components/History/History.module.scss";
import Button from "@/common/Button";
import Image from "next/image";
import Arrow from "../../assets/icons/right-wrrow.svg";
import historyBanner from "../../assets/images/history-banner.png";
// import Client from "../../assets/icons/client.svg";
// import AboutUs from "../../assets/images/aboutus.png";
import localFont from "next/font/local";
import {Swiper, SwiperSlide} from "swiper/react";
import {useRouter} from "next/router";
import {Img_url} from "@/common/CreateContent";
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
import {useGlobalContext} from "../../contexts/GlobalContext";
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

const HistoryPage = ({content}) => {
  const router = useRouter();
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;
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

  const ProjectSlider = {...recentProjects, ...markets, ...safety};

  const TruncateText = (text, length) => {
    if (text?.length > (length || 50)) {
      return `${text?.slice(0, length || 50)}...`;
    }
    return text;
  };

  return (
    <>
      {/* banner */}
      <section
        className={`${styles.history_banner_wrap} ${
          language === "en" && styles.leftAlign
        }`}
      >
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <img
            style={{objectPosition: "bottom"}}
            // src={historyBanner.src}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            alt="about-us"
            className={styles.backgroundImage}
            width={0}
            // fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            height={0}
          />
        </span>
        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text="بناء مستقبل أقوى" Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title}`}>
              {/* {currentContent?.homeBanner?.title[language]} */}
              {currentContent?.["1"]?.content?.title?.[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {/* {currentContent?.homeBanner?.description[language]} */}
              {currentContent?.["1"]?.content?.description?.[language]}
            </p>
          </div>
        </div>
      </section>

      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default HistoryPage;
