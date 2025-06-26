import {useGlobalContext} from "@/contexts/GlobalContext";
import localFont from "next/font/local";
import styles from "@/components/template/NewTemplate4.module.scss";
import React from "react";
import banner from "@/assets/images/Hero.png";
import templateImg from "@/assets/images/templateImage.png";
import templateIcon from "../../assets/icons/templateIcon.svg";
import {Img_url} from "@/common/CreateContent";

const firstSection = {
  id: 1,
  title: "Lorem ipsum",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  imgs: [
    {id: 1, img: templateImg},
    {id: 2, img: templateImg},
    {id: 3, img: templateImg},
    // {id: 4, img: templateImg},
  ],
};
const thirdSection = [
  {
    id: 1,
    icon: templateIcon || "",
    title: "Lorem ipsum",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will a reader will",
  },
  {
    id: 2,
    icon: templateIcon || "",
    title: "Lorem ipsum",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will a reader will",
  },
  {
    id: 3,
    icon: templateIcon || "",
    title: "Lorem ipsum",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will a reader will alksj akj fkajsfkl alskf jlkajsf lakjsf alksjf klajsf lasjflka sjflka sfklaj sklfja lskjfal skfjklajfekljflkejflk je flkej lfkjef jeklfj elfjelkjalkejflkaejf aelkjfalekfjlakefjlkaejf aklfj alejf aklefj laejf klajf klaejfa fjalkejflakefjla ekjl akj",
  },
];

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

  console.log("NewTemplate4 content:", currentContent);
  return (
    <div>
      <section className={`${styles.template4_banner_wrap} `}>
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
        <div
          className={`${language === "en" && styles.leftAlign} ${
            styles.content_gradient
          }`}
        >
          <div className={styles.content}>
            <h1 className={`${styles.title}`}>
              {currentContent?.["1"]?.content?.title?.[language]}
            </h1>
            <p className={`${styles.description} ${BankGothic.className}`}>
              {currentContent?.["1"]?.content?.description?.[language]}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.template4_first_section}>
        <div className="container">
          <div className={styles.template4_first_section_image_grid_wrapper}>
            {currentContent?.["2"]?.content?.images.map((item, idx) => {
              let posClass = "";
              switch (idx) {
                case 0:
                  posClass = styles.large;
                  break;
                case 1:
                  posClass = styles.top;
                  break;
                case 2:
                  posClass = styles.bottom;
                  break;
                default:
                  posClass = "";
              }

              return (
                <div
                  key={item.id + idx}
                  className={`${styles.template4_first_section_image_grid} ${posClass}`}
                >
                  {/* <div > */}
                  <img
                    className={styles.template4_first_section_image}
                    src={item.url ? Img_url + item.url : ""}
                    alt={item.altText?.[language] || "image"}
                  />
                  {/* </div> */}
                </div>
              );
            })}
          </div>

          <div className={styles.template4_first_section_content}>
            <h2 className={styles.template4_first_section_card_heading}>
              {currentContent?.["3"]?.content?.title[language]}
            </h2>
            <p
              className={`${styles.template4_first_section_card_desc} bank-light`}
            >
              {currentContent?.["3"]?.content?.description[language]}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.template4_second_section}>
        <div className="container">
          <div className={styles.template4_second_section_content}>
            <h2 className={styles.template4_second_section_content_heading}>
              {currentContent?.["4"]?.content?.title[language]}
            </h2>
            <div
              className={styles.template4_second_section_content_para}
              dangerouslySetInnerHTML={{
                __html: currentContent?.["4"]?.content?.description[language],
              }}
            ></div>
            {/* <p className={styles.template4_second_section_content_para}>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs
              sssiiijee It is a long established fact that a reader will be
              distracted by the readable content of a page when fgdgdg It is a
              long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee
              It is a long established fact that a reader will be distracted by
              the readable content of a
            </p> */}
          </div>
        </div>
      </section>

      <section className={styles.template4_third_section}>
        <div className="container">
          <div className={styles.template4_third_section_card_wrapper}>
            {currentContent?.["5"]?.content?.cards.map((item, idx) => (
              <div
                key={item.id + idx}
                className={styles.template4_third_section_card}
              >
                <div className={styles.template4_third_section_card_header}>
                  <img src={Img_url + item.images[0].url} alt="icon" />
                  <h2 className={styles.template4_third_section_card_heading}>
                    {item.title[language]}
                  </h2>
                </div>
                <p className={styles.template4_third_section_card_desc}>
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

export default NewTemplate2;
