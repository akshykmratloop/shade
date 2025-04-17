import React, { useEffect, useRef, useState } from "react";
import content from "./content.json"
// import styles from "./Career.module.scss";
// import localFont from "next/font/local";
import { motion } from "framer-motion";
// import ApplyModal from "./ApplyModal";
// import Pagination from "../../common/Pagination";
import Pagination from "./subparts/Pagination";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import Arrow from "../../../../assets/icons/right-wrrow.svg"
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";

const CareerPage = ({ language, screen }) => {
    const isLeftAlign = language === 'en'
    const contentRef = useRef([]);
    const dispatch = useDispatch()
    const isPhone = screen < 760
    const isTablet = screen > 761 && screen < 1100
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const currentContent = useSelector((state) => state.homeContent.present.careers)
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
        let filtered = currentContent?.jobListSection?.jobs || [];

        if (term) {
            filtered = filtered.filter((job) =>
                job.title.value[language].toLowerCase().includes(term.toLowerCase())
            );
        }

        // Filter only displayed jobs
        filtered = filtered.filter((job) => job.display);

        setFilteredJobs(filtered);
        setTotalDocuments(filtered.length);

        // Reset page number if fewer than 10 jobs are displayed
        if (filtered.length <= itemsPerPage) {
            setSelectedPage(1);
        }
    };


    const debouncedSearchJobs = debounce(searchJobs, 300);

    const handleChange = (e) => {
        const value = e.target.value;
        debouncedSearchJobs(value);
    };

    useEffect(() => {
        let isMounted = true; // Flag to track if component is mounted

        dispatch(updateContent({ currentPath: "careers", payload: content.careers }));

        return () => {
            isMounted = false; // Mark as unmounted when component unmounts
        };
    }, [])

    // useEffect to reset filtered jobs when content changes
    useEffect(() => {
        const displayedJobs = currentContent?.jobListSection?.jobs?.filter(job => job.display) || [];
        setFilteredJobs(displayedJobs);
        setTotalDocuments(displayedJobs.length);

        // Reset pagination when job count is below 10
        if (displayedJobs.length <= itemsPerPage) {
            setSelectedPage(1);
        }
    }, [currentContent]);


    const handlePageChange = (result) => {
        setSelectedPage(result);
    };

    const paginatedJobs = filteredJobs.slice(
        (selectedPage - 1) * itemsPerPage,
        selectedPage * itemsPerPage
    );


    return (
        <div className="w-full">
            {/* banner */}
            <section className={`relative h-full w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1200 * 0.436,
                    backgroundImage: ImageFromRedux.careersBanner ? `url(${ImageFromRedux.careersBanner})` :
                        "url('https://loopwebsite.s3.ap-south-1.amazonaws.com/Hero+(2).jpg')"
                }}>
                <div className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {currentContent?.bannerSection?.title[language]}

                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5`}>
                            {currentContent?.bannerSection?.description[language]}
                        </p>
                        {/* <button
                            className={`relative px-5 py-2 ${isPhone ? "text-xs" : "text-sm"} font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        // onClick={() => router.push("/services")}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"}`}
                            />
                            <p>
                                {currentContent?.bannerSection?.button?.[language]}
                            </p>
                        </button> */}
                    </div>
                </div>
            </section>

            {/* filters and search */}
            <section
                className={`${language === "en" ? "text-left" : ""} py-8 pt-16 px-20`}
            >
                <div className="container">
                    <div
                        className={`flex items-center gap-5 
                ${isPhone ? "flex-col" : isTablet ? "gap-4 flex-col-reverse" : "justify-between"} 
                ${!isLeftAlign && !isPhone && !isTablet ? "flex-row-reverse" : ""}`}
                    >
                        <div
                            className={`flex items-center ${!isLeftAlign && "flex-row-reverse"} gap-2.5 p-2 border rounded-lg border-gray-300  
                    ${isPhone ? "w-full" : isTablet ? "px-4" : "w-auto"}`}
                        >
                            <img
                                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/material-symbols_search+(1).svg"
                                alt="icon"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <input
                                dir={!isLeftAlign ? "rtl" : "ltr"}
                                title={currentContent?.filterSection?.inputBox?.placeholder[language]}
                                placeholder={currentContent?.filterSection?.inputBox?.placeholder[language]}
                                className={`w-full border-none focus:outline-none text-gray-700 text-base font-light`}
                                aria-label={currentContent?.filterSection?.inputBox?.aria_label[language]}
                                onChange={(e) => handleChange(e, "Job Search")}
                            />
                        </div>
                        <div
                            className={`flex items-center gap-8 
                    ${isPhone ? "flex-col w-full gap-4" : isTablet ? "gap-6" : ""} relative`}
                        >
                            {currentContent?.filterSection?.filtersSelections?.map((filter, index) => (
                                <div key={index} className={`relative flex ${isPhone ? "w-full justify-between" : ""} bg-transparent`}>
                                    <img
                                        src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined+(1).svg"
                                        alt="icon"
                                        width={20}
                                        height={20}
                                        className={`${isPhone ? "absolute top-2 left-2 z-[1]" : ""} `}
                                    />
                                    <select
                                        className={`border-none z-[2] bg-transparent text-gray-700 text-center text-sm font-light focus:outline-none
                                ${isPhone ? "w-full text-left p-2 border rounded-lg" : isTablet ? "px-2" : ""}`}
                                        aria-label={filter?.title[language]}
                                        onChange={(e) => handleChange(e, filter.title[language])}
                                    >
                                        <option value="">{filter?.title[language]}</option>
                                        {filter.options.map((option, optIndex) => (
                                            <option key={optIndex} value={option?.value}>
                                                {option?.title[language]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* jobs */}
            <section className={`w-full ${isLeftAlign ? "text-left" : "text-right"} px-12`}>
                {paginatedJobs?.length < 1 && (
                    <div className="flex h-24 w-full items-center justify-center">
                        <h1>Oops... Not found !</h1>
                    </div>
                )}
                <div className={`container mx-auto p-4 ${isPhone && "px-2"}`}>
                    <div className="space-y-8">
                        {paginatedJobs?.map((job, index) => {
                            if (!job.display) return null;
                            return (
                                <div key={job.id} className={`rounded-lg bg-gray-100 py-8 ${isPhone ? "px-2" : "px-4"} shadow-md`}>
                                    {/* Ensure flex-row-reverse for mirroring layout */}
                                    <div
                                        className={`flex items-center justify-between cursor-pointer ${isPhone ? "flex-col gap-2" : isTablet ? "flex-wrap gap-1" : "gap-5"} ${!isLeftAlign ? "flex-row-reverse" : ""}`}
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <div className={`flex ${isPhone ? "" : isTablet ? "" : "w-3/4"} ${isPhone ? "w-[80%] pl-2" : ""} items-center gap-2 ${!isLeftAlign && "flex-row-reverse"}`}>
                                            <img
                                                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined+(1).svg"
                                                alt="icon"
                                                width={28}
                                                height={28}
                                            />
                                            <div>
                                                <h5 className="text-md font-bold text-gray-800">{job?.title?.key[language]}</h5>
                                                <p className="text-sm font-light text-gray-600">{job?.title?.value[language]}</p>
                                            </div>
                                        </div>
                                        <div className={` ${isPhone ? "" : isTablet ? "" : "w-1/2"} ${isPhone ? " w-[70%] pl-5" : `${!isLeftAlign?"border-r pr-5":"border-l pl-5"} `} border-gray-300`}>
                                            <h5 className="text-sm font-light text-gray-600">{job?.location?.key[language]}</h5>
                                            <p className="text-md font-bold text-gray-800">{job?.location?.value[language]}</p>
                                        </div>
                                        <div className={` ${isPhone ? "" : isTablet ? "" : "w-1/2"} ${isPhone ? " w-[70%] pl-5" : "border-l border-r px-5"} border-gray-300 border-gray-300 `}>
                                            <h5 className="text-sm font-light text-gray-600">{job?.deadline?.key[language]}</h5>
                                            <p className="text-md font-bold text-gray-800">{job?.deadline?.value[language]}</p>
                                        </div>
                                        <div className={`mt-4 ${isPhone ? "" : isTablet ? "" : ""} flex items-center gap-6 ${!isLeftAlign && "flex-row-reverse"} ${isTablet ? "w-" : ""}`}>
                                            <button
                                                className="rounded bg-[#00b9f2] px-3 w-[102px] py-2 text-white text-xs"
                                                onClick={() => {
                                                    setIsModal(true);
                                                    setSelectedJob(job?.title?.value[language]);
                                                }}
                                            >
                                                {currentContent?.jobListSection?.buttons[0]?.text[language]}
                                            </button>
                                            <button
                                                className="rounded border border-[#00b9f2] px-6 py-2 text-[#00b9f2] text-xs"
                                            >
                                                {currentContent?.jobListSection?.buttons[1]?.text[language]}
                                            </button>
                                        </div>
                                    </div>

                                    <motion.div
                                        ref={(el) => (contentRef.current[index] = el)}
                                        initial={false}
                                        animate={
                                            activeIndex === index
                                                ? { height: contentRef.current[index]?.scrollHeight || "auto", opacity: 1 }
                                                : { height: 0, opacity: 0 }
                                        }
                                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="mt-5 list-disc space-y-3 pl-6 text-gray-700">
                                            {job.descriptionList.map((desc, i) => (
                                                <li key={i}>{desc[language]}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* pagination */}
            <section className="flex justify-end gap-5 h-[94px] pr-12">
                <Pagination
                    totalDocuments={totalDocuments}
                    handlePageChange={handlePageChange}
                    selectedPage={selectedPage}
                    language={language}
                />
            </section>




        </div>
    );
};

export default CareerPage;



// {/*
//  <section
//         className={` ${language === "en" && styles.leftAlign}   ${
//           styles.career_banner_wrap
//         }`}
//       >
//         <div
//           className="container"
//           style={{ height: "100%", position: "relative" }}
//         >
//           <div className={styles.content}>
//             {/* <AnimatedText text="مهنة" Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}

//             <h1 className={`${styles.title} `}>
//               {currentContent?.bannerSection?.title[language]}
//             </h1>
//             <p className={`${styles.description} ${BankGothic.className}`}>
//               {currentContent?.bannerSection?.description[language]}
//             </p>
//             {/* <Button
//               className={styles.view_btn}
//               onClick={() => setIsModal(true)}
//             >
//               <Image
//                 src={Arrow}
//                 width="18"
//                 height="17"
//                 alt=""
//                 className={styles.arrow_btn}
//               />
//               {currentContent?.bannerSection?.button?.text[language]}
//             </Button> */}
//           </div>
//         </div>
//       </section>

//       <section
//         className={` ${language === "en" && styles.leftAlign}   ${
//           styles.job_filter_container
//         }`}
//       >
//         <div className="container">
//           <div className={styles.job_wrap}>
//             <div className={styles.serach_wrap}>
//               <Image
//                 src="https://loopwebsite.s3.ap-south-1.amazonaws.com/material-symbols_search+(1).svg"
//                 alt="icon"
//                 width={24}
//                 height={24}
//                 className={styles.icon}
//               />
//               <input
//                 title={
//                   currentContent?.filterSection?.inputBox?.placeholder[language]
//                 }
//                 placeholder={
//                   currentContent?.filterSection?.inputBox?.placeholder[language]
//                 }
//                 className={`${BankGothic.className} ${styles.input_form}`}
//                 aria-label={
//                   currentContent?.filterSection?.inputBox?.aria_label[language]
//                 }
//                 onChange={(e) => handleChange(e, "Job Search")} // Update to call handleChange
//               />
//             </div>
//             <div className={styles.select_filter_wrap}>
//               {currentContent?.filterSection?.filtersSelections?.map(
//                 (filter, index) => (
//                   <div key={index} className={styles.select_wrapper}>
//                     <select
//                       className={`${BankGothic.className} ${styles.select_form}`}
//                       aria-label={filter?.title[language]}
//                       onChange={(e) => handleChange(e, filter.title[language])}
//                     >
//                       {/* // Updated here */}
//                       <option value="" disabled selected>
//                         {filter?.title[language]}
//                       </option>
//                       {filter.options.map((option, optIndex) => (
//                         <option key={optIndex} value={option?.value}>
//                           {option?.title[language]}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section
//         className={` ${language === "en" && styles.leftAlign}   ${
//           styles.job_List_container
//         }`}
//       >
//         {paginatedJobs?.length < 1 && (
//           <>
//             <div
//               style={{
//                 height: "100px",
//                 width: "100%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <h1>
//                 {language === "en"
//                   ? "Oops... Not found !"
//                   : "Oops... Not found !"}
//               </h1>
//             </div>
//           </>
//         )}
//         <div className="container">
//           <div className={styles.accordion}>
//             {paginatedJobs?.map((job, index) => (
//               <div key={job.id} className={styles.accordion_item}>
//                 <div className={styles.accordion_title}>
//                   <div
//                     className={styles.Accordion_head}
//                     onClick={() => toggleAccordion(index)}
//                   >
//                     <div className={styles.jobname_wrap}>
//                       <Image
//                         src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined+(1).svg"
//                         alt="icon"
//                         width={28}
//                         height={28}
//                         className={styles.icon}
//                       />
//                       <div>
//                         <h5
//                           className={`${styles.title} ${BankGothic.className}`}
//                         >
//                           {job?.title?.key[language]}
//                         </h5>
//                         <p
//                           className={`${styles.subtitle} ${BankGothic.className}`}
//                         >
//                           {job?.title?.value[language]}
//                         </p>
//                       </div>
//                     </div>
//                     <div className={styles.job_location_wrap}>
//                       <h5 className={`${styles.title} ${BankGothic.className}`}>
//                         {job?.location?.key[language]}
//                       </h5>
//                       <p
//                         className={`${styles.subtitle} ${BankGothic.className}`}
//                       >
//                         {job?.location?.value[language]}
//                       </p>
//                     </div>
//                     <div className={styles.job_apply_wrap}>
//                       <h5 className={`${styles.title} ${BankGothic.className}`}>
//                         {job?.deadline?.key[language]}
//                       </h5>
//                       <p
//                         className={`${styles.subtitle} ${BankGothic.className}`}
//                       >
//                         {job?.deadline?.value[language]}
//                       </p>
//                     </div>
//                   </div>
//                   <div className={styles.button_group}>
//                     <Button
//                       className={styles.primary}
//                       onClick={() => {
//                         setIsModal(true);
//                         setSelectedJob(job?.title?.value[language]);
//                       }}
//                     >
//                       {
//                         currentContent?.jobListSection?.buttons[0]?.text[
//                           language
//                         ]
//                       }
//                     </Button>
//                     <Button
//                       className={styles.outline}
//                       onClick={() => router.push(`/career/${job.id}`)}
//                     >
//                       {
//                         currentContent?.jobListSection?.buttons[1]?.text[
//                           language
//                         ]
//                       }
//                     </Button>
//                   </div>
//                 </div>

//                 <motion.div
//                   ref={(el) => (contentRef.current[index] = el)}
//                   initial={false}
//                   animate={
//                     activeIndex === index
//                       ? {
//                           height:
//                             contentRef.current[index]?.scrollHeight || "auto",
//                           opacity: 1,
//                         }
//                       : { height: 0, opacity: 0 }
//                   }
//                   transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
//                   className={`${styles.accordion_content}`}
//                 >
//                   <ul className={styles.job_list_wrap}>
//                     {job.descriptionList.map((desc, i) => (
//                       <li key={i} className={BankGothic.className}>
//                         {desc[language]}
//                       </li>
//                     ))}
//                   </ul>
//                 </motion.div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className={styles.paginationSection}>
//         <Pagination
//           totalDocuments={totalDocuments}
//           handlePageChange={handlePageChange}
//           selectedPage={selectedPage}
//         />
//       </section>

//       <ApplyModal
//         isModal={isModal}
//         jobTitle={selectedJob}
//         onClose={() => setIsModal(false)}
//       /> 
// */}
