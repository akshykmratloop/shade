import React from "react";
import styles from "@/components/news-and-blogs/NewsBlogDetail.module.scss";
import Image from "next/image";
import localFont from "next/font/local";
import { useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";
import { newsBlogs } from "../../assets/index";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { useGlobalContext } from "../../contexts/GlobalContext";

const NewsBlogDetailPage = () => {
  const router = useRouter();
  console.log(router.query)
  const { blogId } = router.query;
  console.log(blogId, "blogId");

  const { language, content } = useGlobalContext();

  const currentContent = content?.newsBlogsDetails?.filter(
    (item) => item?.id == blogId
  )[0];

  if (!currentContent) {
    // of project not found
    return (
      <div
        style={{
          height: "700px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>
          {language === "en"
            ? "News Not Found"
            : "هذه الصفحة قيد التطوير وسوف يتم تحديثها قريبا..."}
        </h1>
      </div>
    );
  }

  const { banner, newsPoints } = currentContent;

  const TruncateText = (text, length) => useTruncate(text, length || 200);

  return (
    <>
      <section
        className={` ${language === "ar" && styles.rightAlign}   ${
          styles.news_blog_details_wrapper
        }`}
      >
        <div className={`container`}>
          <div className={styles.details_content}>
            <Image
              src={banner?.bannerImage}
              alt=""
              width={972}
              height={380}
              className={styles.banner}
            />
            <button
              className={styles.back_btn}
              onClick={() => router.push(`/news-and-blogs`)}
            >
              <Image
                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"
                alt=""
                width={20}
                height={20}
                className={styles.icons}
              />
              {banner?.button?.text[language]}
            </button>

            <h2 className={`${styles.title} ${BankGothic.className}`}>
              {banner?.title[language]}{" "}
            </h2>
            <p className={`${styles.subtitle} ${BankGothic.className}`}>
              {banner?.subTitle[language]}
            </p>
          </div>

          {newsPoints?.map((item, index) => (
            <div key={index} className={styles.news_blog_details_content}>
              {/* Title */}
              <h2 className={`${styles.title} ${BankGothic.className}`}>
                {item?.title[language]}
              </h2>

              {/* Content */}
              <p className={`${styles.subtitle} ${BankGothic.className}`}>
                {item?.content[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* <section className={styles.latest_new_card_wrap}>
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            آخر الأخبار
          </h2>
          <div className={styles.card_group}>
            {[1, 2, 3, 4].map((key) => (
              <div className={styles.card} key={key}>
                <Image
                  src="https://loopwebsite.s3.ap-south-1.amazonaws.com/image+(7).png"
                  alt=""
                  className={styles.card_image}
                  width={280}
                  height={154}
                />
                <div className={styles.card_body}>
                  <h2 className={`${BankGothic.className} ${styles.title}`}>
                    شباب يتحدون الإعاقة
                  </h2>
                  <p className={`${BankGothic.className} ${styles.subTitle}`}>
                    {truncate1}
                  </p>
                  <div className={styles.date_wrap}>
                    <h6 className={`${BankGothic.className} ${styles.date}`}>
                      20 مايو 2020
                    </h6>
                    <button
                      className={`${BankGothic.className} ${styles.seeMore}`}
                    >
                      اقرأ المزيد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section
        className={` ${language === "en" && styles.leftAlign}   ${
          styles.latest_new_card_wrap
        }`}
      >
        <div className="container">
          <h2 className={`${BankGothic.className} ${styles.main_heading}`}>
            {content?.newsBlogs?.latestNewCards?.heading[language]}
          </h2>
          <div className={styles.card_group}>
            {content?.newsBlogs?.latestNewCards?.cards
              ?.slice(0, 4)
              ?.map((card, index) => (
                <div className={styles.card} key={index}>
                  <Image
                    src={newsBlogs[card.image]}
                    alt=""
                    className={styles.card_image}
                    width={280}
                    height={154}
                  />
                  <div className={styles.card_body}>
                    <h2
                      title={card.title[language]}
                      className={`${BankGothic.className} ${styles.title}`}
                    >
                      {TruncateText(card.title[language], 40)}
                    </h2>
                    <p
                      title={card.description[language]}
                      className={`${BankGothic.className} ${styles.subTitle}`}
                    >
                      {TruncateText(card.description[language], 140)}
                    </p>
                    <div className={styles.date_wrap}>
                      <h6 className={`${BankGothic.className} ${styles.date}`}>
                        {card.date[language]}
                      </h6>
                      <button
                        onClick={() => router.push(`/blog/${card.id}`)}
                        className={`${BankGothic.className} ${styles.seeMore}`}
                      >
                        {card.readMore[language]}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsBlogDetailPage;
