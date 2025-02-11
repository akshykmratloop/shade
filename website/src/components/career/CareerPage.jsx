"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Career.module.scss";
import localFont from "next/font/local";
import Image from "next/image";
import Button from "@/common/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ApplyModal from "./ApplyModal";
// import Pagination from "../../common/Pagination";
const Pagination = dynamic(() => import("../../common/Pagination"), {
  ssr: false,
});
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { useGlobalContext } from "../../contexts/GlobalContext";

const CareerPage = () => {
  const contentRef = useRef([]);
  const router = useRouter();

  const { language, content } = useGlobalContext();

  const currentContent = content?.career;

  const [activeIndex, setActiveIndex] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [selectedPage, setSelectedPage] = useState(1);

  const [totalDocuments, setTotalDocuments] = useState(0);

  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState(null);

  const [filteredJobs, setFilteredJobs] = useState(
    currentContent?.jobListSection?.jobs || []
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Search function
  const searchJobs = (term) => {
    setSearchTerm(term);
    if (term) {
      const filtered = currentContent?.jobListSection?.jobs.filter((job) =>
        job.title.value[language].toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
      setTotalDocuments(filtered?.length);
      if (filtered?.length <= 10) {
        setSelectedPage(1);
      }
    } else {
      setFilteredJobs(currentContent?.jobListSection?.jobs);
      setTotalDocuments(currentContent?.jobListSection?.jobs?.length);
    }
  };

  const debouncedSearchJobs = debounce(searchJobs, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    debouncedSearchJobs(value);
  };

  // useEffect to reset filtered jobs when content changes
  useEffect(() => {
    setFilteredJobs(currentContent?.jobListSection?.jobs);
    setTotalDocuments(currentContent?.jobListSection?.jobs?.length);
  }, [currentContent]);

  const handlePageChange = (result) => {
    setSelectedPage(result);
  };

  const paginatedJobs = filteredJobs.slice(
    (selectedPage - 1) * itemsPerPage,
    selectedPage * itemsPerPage
  );

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.career_banner_wrap
        }`}
      >
        <div
          className="container"
          style={{ height: "100%", position: "relative" }}
        >
          <div className={styles.content}>
            {/* <AnimatedText text="مهنة" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

            <h1 className={`${styles.title} `}>
              {currentContent?.bannerSection?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.bannerSection?.description[language]}
            </p>
            {/* <Button
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
            </Button> */}
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
                title={
                  currentContent?.filterSection?.inputBox?.placeholder[language]
                }
                placeholder={
                  currentContent?.filterSection?.inputBox?.placeholder[language]
                }
                className={`${BankGothic.className} ${styles.input_form}`}
                aria-label={
                  currentContent?.filterSection?.inputBox?.aria_label[language]
                }
                onChange={(e) => handleChange(e, "Job Search")} // Update to call handleChange
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
        {paginatedJobs?.length < 1 && (
          <>
            <div
              style={{
                height: "100px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1>
                {language === "en"
                  ? "Oops... Not found !"
                  : "Oops... Not found !"}
              </h1>
            </div>
          </>
        )}
        <div className="container">
          <div className={styles.accordion}>
            {paginatedJobs?.map((job, index) => (
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
                      onClick={() => {
                        setIsModal(true);
                        setSelectedJob(job?.title?.value[language]);
                      }}
                    >
                      {
                        currentContent?.jobListSection?.buttons[0]?.text[
                          language
                        ]
                      }
                    </Button>
                    <Button
                      className={styles.outline}
                      onClick={() => router.push(`/career/${job.id}`)}
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

      <section className={styles.paginationSection}>
        <Pagination
          totalDocuments={totalDocuments}
          handlePageChange={handlePageChange}
          selectedPage={selectedPage}
        />
      </section>

      <ApplyModal
        isModal={isModal}
        jobTitle={selectedJob}
        onClose={() => setIsModal(false)}
      />
    </>
  );
};

export default CareerPage;
