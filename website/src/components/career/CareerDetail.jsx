import React, { useState } from "react";
import styles from "@/components/career/career_detail.module.scss";
import Image from "next/image";
import localFont from "next/font/local";
import { useTruncate } from "@/common/useTruncate";
import Button from "@/common/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import ApplyModal from "./ApplyModal";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

import { useGlobalContext } from "../../contexts/GlobalContext";

const CareerDetailPage = () => {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const { careerId } = router.query;

  const { language, content } = useGlobalContext();
  const currentContent = content?.careerDetails?.filter(
    (item) => item?.id == careerId
  )[0];



  if (!currentContent) { // of project not found 
    return (
      <div style={{height : "700px", width : "100%",
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
      }}>
        <h1>{language === "en" ? "This page is under development and will be updated soon..." : "هذه الصفحة قيد التطوير وسوف يتم تحديثها قريبا..."}</h1>
      </div>);
  }
  
  const { banner, jobDetails } = currentContent;

  const handleApply = () => {
    setIsModal(true);
  };  
  const handleApplyClose = () => {
    setIsModal(false);
  };
  return (
    <>
      <section
        className={` ${language === "ar" && styles.rightAlign}   ${
          styles.news_career_details_wrapper
        }`}
      >
        <div className={`container`}>
          <div className={styles.details_content}>
            <Image
              src={banner?.bannerImage}
              alt=""
              width={972}
              height={380}
              className={styles.banner}
            />
            <button
              className={styles.back_btn}
              onClick={() => router.push(`/career`)}
            >
              <Image
                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"
                alt=""
                width={20}
                height={20}
                className={styles.icons}
              />
              {banner?.button?.text[language]}
            </button>

            <h2 className={`${styles.title} ${BankGothic.className}`}>
              {banner?.title[language]}{" "}
            </h2>
            <p className={`${styles.subtitle} ${BankGothic.className}`}>
              {banner?.subTitle[language]}
            </p>
          </div>
        </div>
      </section>


      <section
        className={` ${language === "en" && styles.rightAlign}   ${
          styles.career_wrap
        }`}
      >
        <div className={`container`}>
          <div className={styles.career_detail_content_wrap}>
            <div className={styles.left_panel}>
              {jobDetails?.leftPanel?.sections.map((section, index) => (
                <div key={index}>
                  <h2 className={`${styles.title} ${BankGothic.className}`}>
                    {section?.title[language]}{" "}
                    {/* Or section.title.en for English */}
                  </h2>
                  <ul className={styles.list_item_wrap}>
                    {section?.content[language]?.map((item, idx) => (
                      <li
                        key={idx}
                        className={`${styles.list_item} ${BankGothic.className}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.right_panel}>
              <div className={styles.card}>
                <Button
                  type="button"
                  className={styles.apply_btn}
                  onClick={handleApply}
                >
                  {jobDetails?.rightPanel?.button?.text[language]}
                </Button>

                <h3 className={styles.main_title}>
                  {jobDetails?.rightPanel?.title[language]}
                </h3>

                {jobDetails?.rightPanel?.tailwraps?.map((tail, index) => (
                  <div className={styles.tail_wrap} key={index}>
                    <Image
                      src={tail.icon}
                      alt={tail?.title[language]}
                      width={32}
                      height={32}
                      className={styles.icons}
                    />
                    <div>
                      <h5 className={styles.subTitle}>
                        {tail?.description[language]}
                      </h5>
                      <h6 className={styles.title}>{tail?.title[language]}</h6>
                    </div>
                  </div>
                ))}

                <Link
                  href={jobDetails?.rightPanel?.viewAllButton?.link}
                  className={styles.viw_all_btn}
                >
                  {jobDetails?.rightPanel?.viewAllButton?.text[language]}
                </Link>
              </div>

              <div className={styles.social_wrapper}>
                <h5 className={styles.title}>
                  {jobDetails?.rightPanel?.socialShare?.title[language]}
                </h5>

                <div className={styles.social_media_list}>
                  {jobDetails?.rightPanel?.socialShare?.socialLinks?.map(
                    (link) => {
                      return (
                        <Link href={link?.link} key={link.id}>
                          <Image
                            src={link.icon}
                            alt=""
                            width={54}
                            height={54}
                            className={styles.social_icon}
                          />
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button className={`${styles.apply_now_btn} ${language === 'en' && styles.leftAlign}`} onClick={handleApply}>
            {jobDetails?.button?.text[language]}
          </Button>
        </div>
      </section>

      <ApplyModal isModal={isModal} onClose={handleApplyClose} />
    </>
  );
};

export default CareerDetailPage;
