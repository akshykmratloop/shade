import React, { useEffect, useState } from "react";
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
import createContent from "@/common/CreateContent";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { language } = useGlobalContext();
  const [content, setContent] = useState()

  const currentContent = content

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
                    dangerouslySetInnerHTML={{__html: item?.description[language]}}
                  >
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery Section */}


      {/* More Projects */}
      <section className={styles.latest_new_card_wrap}>
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {moreProjects?.title[language]}
          </h2>
          <div className={styles.card_group}>
            {moreProjects?.projects?.slice(0, 3).map((project, key) => (
              <div className={styles.card} key={key}>
                <Image
                  src={projectPageData[project?.url]}
                  width="339"
                  height="190"
                  alt="icon"
                  className={styles.card_image}
                />
                <h5
                  className={`${styles.title} ${BankGothic.className} ${language === "ar" && styles.rightAlign
                    }`}
                >
                  {TruncateText(project?.title[language], 45)}
                </h5>
                <p className={`${styles.description} ${BankGothic.className}`}>
                  {project?.address[language]}
                </p>
                <button
                  className={`${styles.button} ${BankGothic.className}`}
                  onClick={() => router.push("/project/56756757656")}
                >
                  {moreProjects?.button?.text[language]}
                  <Image
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                    width={22}
                    height={22}
                    alt="icon"
                    className={`${language === "en" && styles.leftAlign} ${styles.icon
                      }`}
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
