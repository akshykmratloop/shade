import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate2.module.scss";
import React from "react";
import banner from "@/assets/images/Hero.png";
import templateImg from "@/assets/images/swccWaterSupply.jpg";
import templateIcon from "../../assets/icons/templateIcon.svg";
import checkIcon from "@/assets/icons/check.svg";
import {Img_url} from "@/common/CreateContent";

const firstSection = {
  id: 1,
  // img: templateImg,
  title: "Market We Deal",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  cards: [
    {
      id: 2,
      paragraph:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
    },
    {
      id: 3,
      paragraph:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
    },
    {
      id: 4,
      paragraph:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
    },
    {
      id: 5,
      paragraph:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content",
    },
    {
      id: 6,
      paragraph:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content lahflahlfhajlhfljhaklfjklajfkljaklkfjklajfklajfklajfkl fjaklfja flkja klfjaklf ajf lajf akfjlka jflas flkasf ",
    },
  ],
};

const secondSection = [
  {
    id: 1,
    image: templateImg || "",
    title: "lorem Ipsum",
    pointers: [
      "Shade Corporation prioritizes the safety and well-being of its employees, suppliers, clients, and all stakeholders across every project.",
      "We maintain a strict zero-tolerance approach toward violations of Health, Safety, and Environmental (HSE) standards.",
      "Since inception, Shade has upheld an exemplary HSE record, with no major lost-time incidents due to safety, health, or environmental issues.",
      "HSE is embedded in our operational culture, ensuring every team member is accountable for maintaining the highest safety standards.",
    ],
  },
  {
    id: 2,
    image: templateImg || "",
    title: "lorem Ipsum",
    pointers: [
      "Shade Corporation prioritizes the safety and well-being of its employees, suppliers, clients, and all stakeholders across every project.",
      "We maintain a strict zero-tolerance approach toward violations of Health, Safety, and Environmental (HSE) standards.",
      "Since inception, Shade has upheld an exemplary HSE record, with no major lost-time incidents due to safety, health, or environmental issues.",
      "HSE is embedded in our operational culture, ensuring every team member is accountable for maintaining the highest safety standards.",
    ],
  },
  {
    id: 3,
    image: templateImg || "",
    title: "lorem Ipsum",
    pointers: [
      "Shade Corporation prioritizes the safety and well-being of its employees, suppliers, clients, and all stakeholders across every project.",
      "We maintain a strict zero-tolerance approach toward violations of Health, Safety, and Environmental (HSE) standards.",
      "Since inception, Shade has upheld an exemplary HSE record, with no major lost-time incidents due to safety, health, or environmental issues.",
      "HSE is embedded in our operational culture, ensuring every team member is accountable for maintaining the highest safety standards.",
    ],
  },
];

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

const NewTemplate2 = ({content}) => {
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";

  const currentContent = content;

  console.log("NewTemplate2 content:", currentContent);
  return (
    <div>
      <section className={`${styles.template2_banner_wrap} `}>
        <div
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
            // width={0}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // height={0}
          />
        </div>
        <div
          className={`${language === "en" && styles.leftAlign} ${
            styles.content_gradient
          }`}
        >
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

      <section className={styles.template2_first_section}>
        <div className="container">
          <div className={styles.template2_first_section_header}>
            <h2 className={styles.template2_first_section_heading}>
              {currentContent?.["2"]?.content?.title[language]}
            </h2>
            <p className={styles.template2_first_section_desc}>
              {currentContent?.["2"]?.content?.description[language]}
            </p>
          </div>
          <div className={styles.template2_first_section_card_wrapper}>
            {currentContent?.["3"]?.content?.cards.map((card, i) => (
              <div
                key={card.id + i}
                className={styles.template2_first_section_card}
              >
                <p className={styles.template2_first_section_card_para}>
                  {card.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.template2_second_section}>
        <div className="container">
          <div className={styles.template2_second_section_card_wrapper}>
            {currentContent?.["4"]?.content?.cards.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id+index}
                  className={`${styles.template2_second_section_card} ${
                    isEven ? styles.card_layout_left : styles.card_layout_right
                  }`}
                >
                  {isEven ? (
                    <>
                      {/* Content First */}
                      <div
                        className={styles.template2_second_section_card_content}
                      >
                        <h2
                          className={
                            styles.template2_second_section_card_heading
                          }
                        >
                          {item.title[language]}
                        </h2>
                        {item.description.map((desc, idx) => (
                          <div
                            key={idx}
                            className={
                              styles.template2_second_section_card_pointers
                            }
                          >
                            <img src={checkIcon.src} alt="" />
                            <p
                              className={
                                styles.template2_second_section_card_points
                              }
                            >
                              {desc[language]}
                            </p>
                          </div>
                        ))}
                      </div>
                      {/* Image Second */}
                      <div
                        className={styles.template2_second_section_card_image}
                      >
                        <img
                          src={
                            item.images?.[0]?.url
                              ? Img_url + item.images?.[0]?.url
                              : ""
                          }
                          alt=""
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Image First */}
                      <div
                        className={styles.template2_second_section_card_image}
                      >
                        <img
                          src={
                            item.images?.[0]?.url
                              ? Img_url + item.images?.[0]?.url
                              : ""
                          }
                          alt=""
                        />
                      </div>
                      {/* Content Second */}
                      <div
                        className={styles.template2_second_section_card_content}
                      >
                        <h2
                          className={
                            styles.template2_second_section_card_heading
                          }
                        >
                          {item.title[language]}
                        </h2>
                        {item.description.map((desc, idx) => (
                          <div
                            key={idx}
                            className={
                              styles.template2_second_section_card_pointers
                            }
                          >
                            <img src={checkIcon.src} alt="" />
                            <p
                              className={
                                styles.template2_second_section_card_points
                              }
                            >
                              {desc[language]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.template2_third_section}>
        <div className="container">
          <div className={styles.template2_third_section_content_wrapper}>
            <div className={styles.template2_third_section_content}>
              <h2 className={styles.template2_third_section_content_heading}>
                {currentContent?.["5"]?.content?.title[language]}
              </h2>
              <p className={styles.template2_third_section_content_para}>
                {currentContent?.["5"]?.content?.description[language]}
              </p>
            </div>

            <div className={styles.template2_third_section_content_images}>
              {currentContent?.["5"]?.content?.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image?.url ? Img_url + image.url : ""}
                  alt={image?.altText?.[language] || "image"}
                />
              ))}
            </div>
            {/* <div className={styles.template2_third_section_content_images}>
              <img src={templateImg.src} alt="" />
              <img src={templateImg.src} alt="" />
              <img src={templateImg.src} alt="" />
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewTemplate2;
