import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate3.module.scss";
import React from "react";
import banner from "@/assets/images/Hero.png";
import templateImg from "@/assets/images/templateImage.png";
import templateIcon from "../../assets/icons/templateIcon.svg";
import {Img_url} from "@/common/CreateContent";

const secondSection = [
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

const thirdSection = {
  id: 1,
  title: "Project services",
  description:
    " Our company has been the leading provided construction services to clients throughout the Dubai since 1992.",

  img: banner,
  cards: [
    {id: 1, title: "Faculty Services"},
    {id: 2, title: "Road Services"},
    {id: 3, title: "Tunnel Services"},
    {id: 4, title: "Plants Services"},
  ],
};

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const NewTemplate3 = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  console.log("NewTemplate3 Content:", currentContent);

  return (
    <div>
      <section className={`${styles.template3_banner_section} `}>
        <div className="container">
          <div className={styles.template3_banner_wrapper}>
            <div className={styles.template3_banner_header}>
              <h1 className={styles.template3_banner_heading}>
                {currentContent?.["1"]?.content?.title[language]}
              </h1>
              <p className={styles.template3_banner_para}>
                {currentContent?.["1"]?.content?.description[language]}
              </p>
              {currentContent?.["1"]?.content?.button && (
                <button className="bank-light">
                  {currentContent?.["1"]?.content?.button?.[0]?.text[language]}
                </button>
              )}
            </div>

            <div className={styles.template3_banner_image}>
              <img
                src={
                  currentContent?.["1"]?.content?.images
                    ? Img_url + currentContent?.["1"]?.content?.images?.[0]?.url
                    : ""
                }
                alt="image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.template3_first_section}>
        <div className="container">
          <div className={styles.template3_first_section_content_wrapper}>
            <div className={styles.template3_first_section_content}>
              <h1 className={styles.template3_first_section_content_heading}>
                {currentContent?.["2"]?.content?.title[language]}
              </h1>
              <p className={styles.template3_first_section_content_para}>
                {currentContent?.["2"]?.content?.description[language]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.template3_second_section}>
        <div className="container">
          <div className={styles.template3_second_section_card_wrapper}>
            <div className={styles.template3_second_section_card_header}>
              <h2>{currentContent?.["3"]?.content?.title[language]}</h2>
              <p>{currentContent?.["3"]?.content?.description[language]}</p>
            </div>
            {currentContent?.["3"]?.content?.cards?.map((item, idx) => (
              <div
                key={item.id || idx}
                className={styles.template3_second_section_card}
              >
                <img src={Img_url + item.images[0].url} alt="img" />
                <h2 className={styles.template3_second_section_card_heading}>
                  {item.title[language]}
                </h2>
                <p className={styles.template3_second_section_card_desc}>
                  {item.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.template3_third_section}>
        <div className="container">
          <div className={styles.template3_third_section_wrapper}>
            <div className={styles.template3_third_section_image_container}>
              <img
                src={Img_url + currentContent?.["4"]?.content?.images?.[0]?.url}
                alt="sec3_image"
              />
            </div>
            <div className={styles.template3_third_section_content}>
              <h2 className={styles.template3_third_section_content_heading}>
                {currentContent?.["4"]?.content?.title[language]}
              </h2>
              <p className={styles.template3_third_section_content_para}>
                {currentContent?.["4"]?.content?.description[language]}
              </p>
              <div className={styles.template3_third_section_card_wrapper}>
                {currentContent?.["4"]?.content?.cards.map((card) => (
                  <div
                    key={card.id}
                    className={styles.template3_third_section_card}
                  >
                    <h3>{card.title[language]}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*   <section className={styles.template_third_section}>
        <div className="container">
          <div className={styles.template_third_section_card_wrapper}>
            {thirdSection.map((item) => (
              <div key={item.id} className={styles.template_third_section_card}>
                <h2 className={styles.template_third_section_card_heading}>
                  {item.title}
                </h2>

                <p className={styles.template_third_section_card_desc}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default NewTemplate3;
