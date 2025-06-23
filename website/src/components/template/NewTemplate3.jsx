import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate3.module.scss";
import React from "react";
import banner from "@/assets/images/Hero.png";
import templateImg from "@/assets/images/templateImage.png";
import templateIcon from "../../assets/icons/templateIcon.svg";

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
  return (
    <div>
      <section className={`${styles.template3_banner_section} `}>
        <div className="container">
          <div className={styles.template3_banner_wrapper}>
            <div className={styles.template3_banner_header}>
              <h1 className={styles.template3_banner_heading}>Lorem, ipsum </h1>
              <p className={styles.template3_banner_para}>
                Discover the exceptional excellence of Shade Corporation, the
                premier Engineering, Procurement, and Construction powerhouse in
                Saudi Arabia.
              </p>
              <p className={styles.template3_banner_para}>
                Discover the exceptional excellence of Shade Corporation, the
                premier Engineering, Procurement, and Construction powerhouse in
                Saudi Arabia.
              </p>
              <button>Lorem ipsum</button>
            </div>
            <div className={styles.template3_banner_image}>
              <img src="" alt="image" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.template3_first_section}>
        <div className="container">
          <div className={styles.template3_first_section_content_wrapper}>
            <div className={styles.template3_first_section_content}>
              <h1 className={styles.template3_first_section_content_heading}>
                Lorem, ipsum.
              </h1>
              <p className={styles.template3_first_section_content_para}>
                Discover the exceptional excellence of Shade Corporation, the
                premier Engineering, Procurement, and Construction powerhouse in
                Saudi Arabia. Discover the exceptional excellence of Shade
                Corporation, the premier Engineering, Procurement, and
                Construction powerhouse in Saudi Arabia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.template3_second_section}>
        <div className="container">
          <div className={styles.template3_second_section_card_wrapper}>
            <div className={styles.template3_second_section_card_header}>
              <h2>Lorem ipsum</h2>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs
                sssiiijee It is a long established fact that a reader will be
                distracted by the readable content of a page when fgdgdg It is a
                long established fact that a reader will a reader will
              </p>
            </div>
            {secondSection.map((item) => (
              <div
                key={item.id}
                className={styles.template3_second_section_card}
              >
                <img src={item.img.src} alt="img" />
                <h2 className={styles.template3_second_section_card_heading}>
                  {item.title}
                </h2>
                <p className={styles.template3_second_section_card_desc}>
                  {item.description}
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
              <img src={templateImg.src} alt="sec3_image" />
            </div>
            <div className={styles.template3_third_section_content}>
              <h2 className={styles.template3_third_section_content_heading}>
                {thirdSection.title}
              </h2>
              <p className={styles.template3_third_section_content_para}>
                {thirdSection.description}
              </p>
              <div className={styles.template3_third_section_card_wrapper}>
                {thirdSection.cards.map((card) => (
                  <div
                    key={card.id}
                    className={styles.template3_third_section_card}
                  >
                    <h3>{card.title}</h3>
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
