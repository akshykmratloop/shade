import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate.module.scss";
import React from "react";
import banner from "@/assets/images/Hero.png";
import templateImg from "@/assets/images/templateImage.png";
import templateIcon from "../../assets/icons/templateIcon.svg";
import {Img_url} from "@/common/CreateContent";

const firstSection = [
  {
    id: 1,
    img: templateImg,
    title: "project services",
    description:
      "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
  },
  {
    id: 2,
    img: templateImg,
    title: "project services",
    description:
      "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
  },
  {
    id: 3,

    img: templateImg,
    title: "project services",
    description:
      "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
  },
  {
    id: 4,

    img: templateImg,
    title: "project services",
    description:
      "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
  },
];

const secondSection = [
  {
    id: 1,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
  {
    id: 2,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
  {
    id: 3,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
  {
    id: 4,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
  {
    id: 5,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
  {
    id: 6,
    icon: templateIcon || "",
    title: "Education",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
  },
];

const thirdSection = [
  {
    id: 1,
    title: "Project Description",
    description:
      "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
  },
  {
    id: 2,
    title: "Project Description",
    description:
      "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
  },
  {
    id: 3,
    title: "Project Description",
    description:
      "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
  },
];

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const NewTemplate = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  console.log("NewTemplate content:", currentContent);
  return (
    <div>
      <section className={`${styles.template_banner_wrap} `}>
        <span
          className={`${language === "en" && styles.leftAlign} ${
            styles.backgroundContainer
          }`}
        >
          <img
            style={{objectPosition: "bottom", objectFit: "cover"}}
            src={
              currentContent?.["1"]?.content?.images?.[0]?.url
                ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                : ""
            }
            // src={banner.src}
            alt="about-us"
            className={styles.backgroundImage}
            width={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            height={0}
          />
        </span>
        <div className={styles.content_gradient}>
          <div className={styles.content}>
            <h1 className={`${styles.title}`}>
              {currentContent?.["1"]?.content?.title?.[language] ||
                "Lorem ipsum"}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.["1"]?.content?.description?.[language] ||
                "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia"}
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.template_first_section}`}>
        <div className="container">
          <div className={`${styles.template_first_section_card_wrapper}`}>
            {currentContent?.["2"]?.content?.cards.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`${styles.template_first_section_card}`}
              >
                <div className={`${styles.template_first_section_card_image}`}>
                  <img
                    src={
                      item.images?.[0]?.url
                        ? Img_url + item.images?.[0]?.url
                        : ""
                    }
                    alt="image"
                  />
                </div>
                <h2 className={`${styles.template_first_section_card_heading}`}>
                  {item.title[language]}
                </h2>
                <p
                  className={`${styles.template_first_section_card_desc} bank-light`}
                >
                  {item.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.template_second_section}>
        <div className="container">
          <div className={styles.template_second_section_card_wrapper}>
            {currentContent?.["3"]?.content?.cards.map((item) => (
              <div
                key={item.id}
                className={styles.template_second_section_card}
              >
                <div className={styles.template_second_section_card_header}>
                  <img
                    src={
                      item.images?.[0]?.url
                        ? Img_url + item.images?.[0]?.url
                        : ""
                    }
                    style={{
                      width: "46px",
                      height: "46px"
                    }}
                    alt="icon"
                  />
                  <h2 className={styles.template_second_section_card_heading}>
                    {item.title[language]}
                  </h2>
                </div>
                <p
                  className={`${styles.template_second_section_card_desc} bank-light`}
                >
                  {item.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.template_third_section}>
        <div className="container">
          <div className={styles.template_third_section_card_wrapper}>
            {currentContent?.["4"]?.content?.cards.map((item) => (
              <div key={item.id} className={styles.template_third_section_card}>
                <h2 className={styles.template_third_section_card_heading}>
                  {item.title[language]}
                </h2>

                <p
                  className={`${styles.template_third_section_card_desc} bank-light`}
                >
                  {item.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewTemplate;
