import React from "react";
import styles from "./ProjectDetail.module.scss";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";

// Import local font
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { useLanguage } from "../../contexts/LanguageContext";

const ProjectDetailPage = () => {
  const { language, content } = useLanguage();
  const currentContent = content?.projectDetail;
  const {
    project_wrapper,
    solution_Content,
    showcase_gallery_wrap,
    latest_new_card_wrap,
  } = currentContent;
  const router = useRouter();

  const TruncateText = (text, length) => useTruncate(text, length || 200);


  return (
    <>
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
                    className={`${language ==='en' && styles.leftAlign} ${styles.icon}`}
                  />
                  {project_wrapper?.backButton[language]}
                </Link>
                <h1 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                  {project_wrapper?.title[language]}
                </h1>
                <p className={`${styles.subtitle} ${BankGothic.className}`}>
                  {project_wrapper?.subtitle[language]}
                </p>
                <Link href={project_wrapper?.url} className={styles.url}>
                  <span className={BankGothic.className}>
                    {project_wrapper?.url}
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
            {project_wrapper?.projectInforCard?.map((card, index) => {
              return (
                <div key={index} className={styles.card}>
                  <Image
                    src={card?.icon}
                    alt=""
                    className={styles.card_image}
                    width={28}
                    height={28}
                  />
                  <h5 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                    {card?.key[language]}
                  </h5>
                  <p className={`${styles.subtitle} ${BankGothic.className}`}>
                    {TruncateText(card?.value[language],25)}

                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Content Wrap */}
      <section className={styles.solution_content_wrap}>
        <div className={`container ${styles.detailsRows}`}>
          {/* Project Description */}
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <h1 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                {solution_Content?.projectDescription?.title[language]}
              </h1>

            </div>
            <div className={styles.right_panel}>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {solution_Content?.projectDescription?.description[language]}
              </p>
            </div>
          </div>

          {/* Demolition Works */}
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <h1 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                {solution_Content?.demolitionWorks?.title[language]}
              </h1>
            </div>
            <div className={styles.right_panel}>
              <p className={`${styles.description} ${BankGothic.className}`}>
                {solution_Content?.demolitionWorks?.description[language]}
              </p>
            </div>
          </div>

          {/* New Networks */}
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <h1 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                {solution_Content?.newNetworks?.title[language]}
              </h1>
            </div>
            <div className={styles.right_panel}>
              <p
                className={`${styles.description} ${BankGothic.className}`}
              >
                {solution_Content?.newNetworks?.description[language]}
              </p>
            </div>
          </div>

          {/* Work Includes */}
          <div className={styles.content_wrap}>
            <div className={styles.left_panel}>
              <h1 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                {solution_Content?.workIncludes?.title[language]}
              </h1>
            </div>
            <div className={styles.right_panel}>
              <p
                className={`${styles.description} ${BankGothic.className}`}
              >
                {solution_Content?.workIncludes?.description[language]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* showcase_gallery_wrap */}
      <section className={styles.showcase_gallery_wrap}>
        <div className="container">
          <div className={styles.showcase_gallery}>
            {showcase_gallery_wrap?.images?.map((image, index) => (
              <div key={index} className={styles.showcase_gallery_img_wrap}>
                <Image
                  src={image.url}
                  width={index === 1 ? 432 : 488}
                  height={index === 1 ? 232 : 396}
                  alt={image.alt[language]}
                  className={styles.gallery_img}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* latest_new_card_wrap */}
      <section className={styles.latest_new_card_wrap}>
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {latest_new_card_wrap?.title[language]}
          </h2>
          <div className={styles.card_group}>
            {latest_new_card_wrap?.projects?.slice(0, 3).map((project, key) => (
              <div className={styles.card} key={key}>
                <Image
                  src={project?.imageUrl}
                  width="339"
                  height="190"
                  alt="icon"
                  className={styles.card_image}
                />
                <h5 className={`${styles.title} ${BankGothic.className} ${language ==='ar' && styles.rightAlign}`}>
                  {project?.title[language]}
                </h5>
                <p className={`${styles.description} ${BankGothic.className}`}>
                  {project?.description[language]}
                </p>
                <button
                  className={`${styles.button} ${BankGothic.className}`}
                  onClick={() => router.push("/project/56756757656")}
                >
                  {latest_new_card_wrap?.button?.text[language]}
                  <Image
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                    width={22}
                    height={22}
                    alt="icon"
                    className={`${language ==='en' && styles.leftAlign} ${styles.icon}`}

                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;
