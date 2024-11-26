"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Career.module.scss";
import localFont from "next/font/local";
import Image from "next/image";
import Button from "@/common/Button";
import Arrow from "../../assets/icons/right-wrrow.svg";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
// import dynamic from 'next/dynamic';
import ApplyModal from "./ApplyModal";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { useLanguage } from "../../contexts/LanguageContext";

const CareerPage = () => {
  const contentRef = useRef([]);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModal, setIsModal] = useState(false);

  const { language, content } = useLanguage();
  const currentContent = content?.career;

  // const [height, setHeight] = useState(0);

  // useEffect(() => {
  //     if (contentRef.current) {
  //         setHeight(activeIndex ? contentRef.current.scrollHeight : 0);
  //     }
  // }, [activeIndex]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e, filterTitle) => {
    console.log(`Selected ${e.target.value} for ${filterTitle}`);
    // Handle the state update here (if you want to store selected values in state)
  };

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.career_banner_wrap
        }`}
      >
        <div className="container">
          <div className={styles.content}>
            {/* <AnimatedText text="مهنة" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title} ${BankGothic.className} `}>
              {currentContent?.bannerSection?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.bannerSection?.description[language]}
            </p>
            <Button
              className={styles.view_btn}
              onClick={() => setIsModal(true)}
            >
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />
              {currentContent?.bannerSection?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.job_filter_container
        }`}
      >
        <div className="container">
          <div className={styles.job_wrap}>
            <div className={styles.serach_wrap}>
              <Image
                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/material-symbols_search+(1).svg"
                alt="icon"
                width={24}
                height={24}
                className={styles.icon}
              />
              <input
                placeholder={
                  currentContent?.filterSection?.inputBox?.placeholder[language]
                }
                className={`${BankGothic.className} ${styles.input_form}`}
                aria-label={
                  currentContent?.filterSection?.inputBox?.aria_label[language]
                }
              />
            </div>
            <div className={styles.select_filter_wrap}>
              {currentContent?.filterSection?.filtersSelections?.map(
                (filter, index) => (
                  <div key={index} className={styles.select_wrapper}>
                    <select
                      className={`${BankGothic.className} ${styles.select_form}`}
                      aria-label={filter?.title[language]}
                      onChange={(e) => handleChange(e, filter.title[language])}
                    >
                      {/* // Updated here */}
                      <option value="" disabled selected>
                        {filter?.title[language]}
                      </option>
                      {filter.options.map((option, optIndex) => (
                        <option key={optIndex} value={option?.value}>
                          {option?.title[language]}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.job_List_container
        }`}
      >
        <div className="container">
          <div className={styles.accordion}>
            {currentContent?.jobListSection?.jobs?.map((job, index) => (
              <div key={job.id} className={styles.accordion_item}>
                <div className={styles.accordion_title}>
                  <div
                    className={styles.Accordion_head}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className={styles.jobname_wrap}>
                      <Image
                        src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined+(1).svg"
                        alt="icon"
                        width={28}
                        height={28}
                        className={styles.icon}
                      />
                      <div>
                        <h5
                          className={`${styles.title} ${BankGothic.className}`}
                        >
                          {job?.title?.key[language]}
                        </h5>
                        <p
                          className={`${styles.subtitle} ${BankGothic.className}`}
                        >
                          {job?.title?.value[language]}
                        </p>
                      </div>
                    </div>
                    <div className={styles.job_location_wrap}>
                      <h5 className={`${styles.title} ${BankGothic.className}`}>
                        {job?.location?.key[language]}
                      </h5>
                      <p
                        className={`${styles.subtitle} ${BankGothic.className}`}
                      >
                        {job?.location?.value[language]}
                      </p>
                    </div>
                    <div className={styles.job_apply_wrap}>
                      <h5 className={`${styles.title} ${BankGothic.className}`}>
                        {job?.deadline?.key[language]}
                      </h5>
                      <p
                        className={`${styles.subtitle} ${BankGothic.className}`}
                      >
                        {job?.deadline?.value[language]}
                      </p>
                    </div>
                  </div>
                  <div className={styles.button_group}>
                    <Button
                      className={styles.primary}
                      onClick={() => setIsModal(true)}
                    >
                      {
                        currentContent?.jobListSection?.buttons[0]?.text[
                          language
                        ]
                      }
                    </Button>
                    <Button
                      className={styles.outline}
                      onClick={() => router.push(`/career/${35354}`)}
                    >
                      {
                        currentContent?.jobListSection?.buttons[1]?.text[
                          language
                        ]
                      }
                    </Button>
                  </div>
                </div>

                <motion.div
                  ref={(el) => (contentRef.current[index] = el)}
                  initial={false}
                  animate={
                    activeIndex === index
                      ? {
                          height:
                            contentRef.current[index]?.scrollHeight || "auto",
                          opacity: 1,
                        }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className={`${styles.accordion_content}`}
                >
                  <ul className={styles.job_list_wrap}>
                    {job.descriptionList.map((desc, i) => (
                      <li key={i} className={BankGothic.className}>
                        {desc[language]}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ApplyModal isModal={isModal} onClose={() => setIsModal(false)} />
    </>
  );
};

export default CareerPage;
