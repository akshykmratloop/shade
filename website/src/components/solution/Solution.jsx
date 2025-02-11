import React,{useState} from "react";
import styles from "./solution.module.scss";
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
import patch from "../../contexts/svg/path.jsx";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
const ContactUsModal = dynamic(() => import('../header/ContactUsModal'), { ssr: false });

const SolutionPage = () => {
  const router = useRouter();
  const { language, content } = useGlobalContext();
  const currentContent = content?.solution;
  const [isModal, setIsModal] = useState(false);
  const handleContactUSClose = () => {
    setIsModal(false);
  };
  return (
    <>
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.solution_banner_wrap
        }`}
      >
        <div className="container" style={{position : "relative", height : "100%"}}>
          <div className={styles.content}>
            {/* <AnimatedText text={currentContent?.banner?.title[language]} Wrapper="h1" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h1 className={`${styles.title}`}>
              {currentContent?.banner?.title[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.banner?.description[language]}
            </p>
            <Button className={styles.view_btn}
            onClick={()=>router.push('/project')}
            >
              <Image
                src={Arrow}
                width="18"
                height="17"
                alt=""
                className={styles.arrow_btn}
              />
              &nbsp;{currentContent?.banner?.button?.text[language]}
            </Button>
          </div>
        </div>
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.solution_content_wrap
        }`}
      >
        <div className="container">
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <span> </span>
              <h1 className={`${styles.title}`}>
                {currentContent?.whatWeDo?.title[language]}
              </h1>
            </div>
            <div className={styles.right_panel}>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.whatWeDo?.description1[language]}
              </p>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {currentContent?.whatWeDo?.description2[language]}
              </p>
            </div>
          </div>
        </div>
      </section>

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
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.solution_content_wrap
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
      </section>

      <section className={styles.showcase_gallery_wrap}>
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
      </section>

      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.new_project_wrapper
        }`}
      >
        <div className={`container ${styles.main_container}`}>
          <div className={styles.Client_content}>
            {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
            <h2 className={`${styles.title}`}>
              {currentContent?.newProject?.title[language]}
            </h2>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description1[language].replace(
                currentContent?.newProject?.highlightedText[language],
                `"${currentContent?.newProject?.highlightedText[language]}"`
              )}
              <i className={language === "ar" && styles.arabicVersion}>
                {patch()}
              </i>
            </p>

            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.newProject?.description2[language]}
            </p>
            <Button className={styles.view_btn}
              onClick={() => setIsModal(true)}
            
            >
              {currentContent?.newProject?.button.text[language]}
            </Button>
          </div>
        </div>
      </section>
      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />

    </>
  );
};

export default SolutionPage;
