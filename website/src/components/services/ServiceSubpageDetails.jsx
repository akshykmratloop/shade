import React from "react";
import bannerImg from "@/assets/images/about.png";
import styles from "@/components/services/serviceSubpageDetails.module.scss";
import localFont from "next/font/local";
import {useGlobalContext} from "@/contexts/GlobalContext";
import {useRouter} from "next/router";

const bannerSection = {
  id: "1",
  title: "project service",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  image: bannerImg,
};

const secondSection = {
  id: "2",
  title: "Why you Should Partner?",
  description:
    "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia. Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia.",
  items: [
    {
      id: "3",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "4",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "5",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
    {
      id: "6",
      title: "Project Services 4",
      description:
        "We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure. We capitalize on our years of experience in the construction industry to clients by also maintaining their facilities and infrastructure.",
    },
  ],
};

const thirdSection = [
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
  {
    id: "3",
    image: bannerImg,
  },
];

const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const ServiceSubpageDetails = ({content}) => {
  const {query} = useRouter();
  const {slug} = query;
  // console.log("Safety Detail Page content:", content);

  const currentContent = content || {};
  console.log("Serviceio Page Content:", currentContent);
  const {
    language,
    // content
  } = useGlobalContext();
  const isLeftAlign = language === "en";
  const titleLan = isLeftAlign ? "titleEn" : "titleAr";
  return (
    <div>
      <section className={styles.banner_section}>
        <div className="container">
          <div className={styles.banner_content}>
            <h1>{bannerSection.title}</h1>
            <p>{bannerSection.description}</p>
          </div>
          <div className={styles.banner_image}>
            <img src={bannerSection.image.src} alt="" />
          </div>
        </div>
      </section>

      <section className={styles.second_section}>
        <div className="container">
          <div className={styles.second_section_header}>
            <h2>{secondSection.title}</h2>
            <p>{secondSection.description}</p>
          </div>
          <div className={styles.second_section_items_wrapper}>
            {secondSection.items.map((item) => (
              <div key={item.id} className={styles.second_section_item}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.third_section}>
        <div className="container">
          <div className={styles.third_section_items}>
            {thirdSection.map((item) => (
              <div key={item.id} className={styles.third_section_item}>
                <img src={item.image.src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceSubpageDetails;
