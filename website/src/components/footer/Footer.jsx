import React from "react";
import styles from "@/components/footer/Footer.module.scss";
import Link from "next/link";
import Logo from "@/assets/brand-logo/foot-logo.svg";
import Facebook from "@/assets/icons/facebook.svg";
import Instagram from "@/assets/icons/instagram.svg";
import Twitter from "@/assets/icons/twitter.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import Image from "next/image";
import Button from "@/common/Button";
import localFont from "next/font/local";
import { useLanguage } from "../../contexts/LanguageContext";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});

const Footer = () => {

  const { language, content } = useLanguage();
  const currentContent = content?.footer;

  return (
    <footer className={styles.footerWrapper}>
      <span className={styles.bubble1}></span>
      <span className={styles.bubble2}></span>
      <div className="container">
        <div className={styles.footerHead}>
          <div className={styles.logo}>
            <Image
              src={Logo}
              alt="Logo"
              className={styles.logoImage}
              width={138}
              height={138}
            />
          </div>
          <p className={styles.footerDescription}>
            {currentContent?.companyInfo?.address[language]}
          </p>
        </div>
        <div className={styles.footerBody}>
          <div className={styles.otherLink}>
            <h5 className={styles.footertitle}>
              {currentContent?.aboutUs?.title[language]}
            </h5>
            {currentContent?.aboutUs?.links?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`${styles.url} ${BankGothic.className}`}
              >
                {link[language]}
              </Link>
            ))}
          </div>

          <div className={styles.companyLink}>
            <h5 className={styles.footertitle}>
              {currentContent?.markets?.title[language]}
            </h5>
            {currentContent?.markets?.links?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`${styles.url} ${BankGothic.className}`}
              >
                {link[language]}
              </Link>
            ))}
          </div>

          <div className={styles.companyLink}>
            <h5 className={styles.footertitle}>
              {currentContent?.services?.title[language]}
            </h5>
            {currentContent?.services?.links?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`${styles.url} ${BankGothic.className}`}
              >
                {link[language]}
              </Link>
            ))}
          </div>

          <div className={styles.addressWrap}>
            <h5 className={styles.footertitle}>
              {currentContent?.contact?.title[language]}
            </h5>

            <div className={styles.contactWrap}>
              <p className={`${styles.address} ${BankGothic.className}`}>
                {currentContent?.contact?.phone[language]}
              </p>
            </div>
            <div className={styles.contactWrap}>
              <p className={`${styles.address} ${BankGothic.className}`}>
                {currentContent?.contact?.fax[language]}
              </p>
            </div>

            <h6 className={styles.basic_title}>
              {currentContent?.contact?.helpText[language]}
            </h6>

            <Button className={styles.contact_btn}>
              {currentContent?.contact?.button[language]}
            </Button>

            <ul className={styles.socialMedia}>
              <li className={styles.socialMediaItem}>
                <Link href="#" className={styles.socialMediaLink}>
                  <Image
                    src={Linkedin}
                    alt="Youtube"
                    className={styles.Icon}
                    width={24}
                    height={24}
                  />
                </Link>
              </li>
              <li className={styles.socialMediaItem}>
                <Link href="#" className={styles.socialMediaLink}>
                  <Image
                    src={Instagram}
                    alt="Instagram"
                    className={styles.Icon}
                    width={24}
                    height={24}
                  />
                </Link>
              </li>
              <li className={styles.socialMediaItem}>
                <Link href="#" className={styles.socialMediaLink}>
                  <Image
                    src={Twitter}
                    alt="Twitter"
                    className={styles.Icon}
                    width={24}
                    height={24}
                  />
                </Link>
              </li>
              <li className={styles.socialMediaItem}>
                <Link href="#" className={styles.socialMediaLink}>
                  <Image
                    src={Facebook}
                    alt="Facebook"
                    className={styles.Icon}
                    width={24}
                    height={24}
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* <div className={styles.websiteLink}></div> */}
        </div>
        {/* <div className={styles.footer}>
          <p className={styles.copyRightTitle}>
            {currentContent?.copyright.text[language]}
          </p>

          <ul className={styles.securityList}>
            {currentContent?.security.links.map((link, index) => (
              <li key={index} className={styles.securityItem}>
                <Link href={link.url} className={styles.securityLink}>
                  {link[language]}
                </Link>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
