import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate3.module.scss";
import React from "react";
import banner from "@/assets/images/hero.png";
import templateImg from "@/assets/images/templateImage.png";
import templateIcon from "../../assets/icons/templateIcon.svg";
import {sync} from "framer-motion";

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

// const secondSection = [
//   {
//     id: 1,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
//   {
//     id: 2,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
//   {
//     id: 3,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
//   {
//     id: 4,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
//   {
//     id: 5,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
//   {
//     id: 6,
//     icon: templateIcon || "",
//     title: "Education",
//     description:
//       "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
//   },
// ];

// const thirdSection = [
//   {
//     id: 1,
//     title: "Project Description",
//     description:
//       "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
//   },
//   {
//     id: 2,
//     title: "Project Description",
//     description:
//       "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
//   },
//   {
//     id: 3,
//     title: "Project Description",
//     description:
//       "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran.",
//   },
// ];

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

      {/*  <section className={styles.template_second_section}>
        <div className="container">
          <div className={styles.template_second_section_card_wrapper}>
            {secondSection.map((item) => (
              <div
                key={item.id}
                className={styles.template_second_section_card}
              >
                <div className={styles.template_second_section_card_header}>
                  <img src={item.icon.src} alt="icon" />
                  <h2 className={styles.template_second_section_card_heading}>
                    {item.title}
                  </h2>
                </div>
                <p className={styles.template_second_section_card_desc}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.template_third_section}>
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
