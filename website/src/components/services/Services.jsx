import React, { useState } from "react";
import styles from "@/components/services/services.module.scss";
import Arrow from "../../assets/icons/right-wrrow.svg";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Button from "@/common/Button";
import Image from "next/image";
import { TruncateText, useTruncate } from "@/common/useTruncate";
import patch from "../../contexts/svg/path.jsx";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useRouter } from "next/router";
import { Img_url } from "@/common/CreateContent";
const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
  ssr: false,
});

const Services = ({ content }) => {
  const router = useRouter();

  const { language } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";
  const currentContent = content;
  const [isModal, setIsModal] = useState(false);
  const handleContactUSClose = () => {
    setIsModal(false);
  };

  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${styles.services_banner_wrap
          }`}
        style={{
          backgroundImage: `url(${Img_url + currentContent?.[1]?.content?.images?.[0]?.url
            })`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100vh",
        }}
        dir={isLeftAlign ? "ltr" : "rtl"}
      >
        <div className={`${styles.gradientOverlay} ${isLeftAlign && styles.gradientBlobLTR}`} dir={isLeftAlign ? "ltr" : "rtl"}>
          <div className={`${styles.gradientBlob} `}></div>
        </div>

        <div className={styles.content}>
          {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
          <h1 className={`${styles.title} `}>
            {currentContent?.[1]?.content?.title[language]}
          </h1>
          <p className={`${styles.description} ${BankGothic.className}`}>
            {currentContent?.[1]?.content?.description[language]}
          </p>
          <Button
            className={styles.view_btn}
            onClick={() => router.push("/project")}
          >
            <p>
              {currentContent?.[1]?.content?.button?.[0]?.text[language]}
            </p>
            <Image
              src={Arrow}
              width="18"
              height="17"
              alt=""
              className={styles.arrow_btn}
              style={{ transform: isLeftAlign && 'scaleX(-1)' }}
            />
          </Button>
        </div>
      </section>

      <section
        dir={isLeftAlign ? "ltr" : "rtl"}
        className={`${styles.service_section} ${styles.desktop}  ${isLeftAlign ? styles.align_left : styles.align_right
          }`}
      >
        {currentContent?.["2"]?.items?.map((service, idx) => {
          return (
            <article key={idx} className={`${styles.service_card}`}>
              <img
                src={Img_url + service.image}
                alt="img"
                className={`${styles.service_image}`}
              />
              <section className={`${styles.service_content}`}>
                <h1 className={`${styles.service_title}`}>
                  {TruncateText(service?.[titleLan], 23)}
                </h1>
                <p className={`${styles.service_description} bank-light`}>
                  {service?.description?.[language]}
                </p>
                <a href={`/service/${service.slug}`}>
                  <button
                    className={`${styles.service_button} ${!isLeftAlign ? styles.reverse : ""
                      } bank-light`}
                  >
                    {
                      currentContent?.["2"]?.content?.button?.[1]?.text?.[
                      language
                      ]
                    }
                    <img
                      src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                      alt=""
                      className={`${styles.arrow_icon} ${isLeftAlign ? styles.rotated : ""
                        }`}
                    />
                  </button>
                </a>
              </section>
            </article>
          );
        })}
      </section>

      {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}
    </>
  );
};

export default Services;
