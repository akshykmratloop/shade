import React, { useEffect, useState } from "react";
import styles from "@/components/header/Header.module.scss";
import Logo from "@/assets/brand-logo/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import ContactUsModal from "./ContactUsModal";
import { useLanguage } from "../../contexts/LanguageContext";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

const Header = ({ isOpenNavbar, setIsOpenNavbar }) => {
  const { language, toggleLanguage, content } = useLanguage();
  const currentContent = content?.header;
  // const router = useRouter()
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const handleContactUs = () => {
  //   // router.push('/contact-us', { scroll: false })
  //   window.open("/contact-us", "_blank", "noopener,noreferrer");
  // };

  const handleNavbar = () => {
    setIsOpenNavbar(!isOpenNavbar);
  };

  const handleContactUS = () => {
    setIsModal(true);
  };
  const handleContactUSClose = () => {
    setIsModal(false);
  };

  return (
    <>
      <div className="container">
        <header
          className={`${styles.headerWrapper} ${
            scrolled ? styles.stickyActive : ""
          }`}
        >
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <Image
                src={Logo}
                alt="Logo"
                className={styles.logoImage}
                width={63}
                height={63}
              />
            </Link>

            <nav className={styles.menu}>
              <Link
                href="/solution"
                className={`${styles.menuItem} ${
                  pathname === "/solution" ? styles.active : ""
                }`}
              >
                {currentContent?.solution[language]}
              </Link>
              <Link
                href="/about-us"
                className={`${styles.menuItem} ${
                  pathname === "/about-us" ? styles.active : ""
                }`}
              >
                {currentContent?.about[language]}
              </Link>
              <Link
                href="/services"
                className={`${styles.menuItem} ${
                  pathname === "/services" ? styles.active : ""
                }`}
              >
                {currentContent?.services[language]}
              </Link>
              <Link
                href="/market"
                className={`${styles.menuItem} ${
                  pathname === "/market" ? styles.active : ""
                }`}
              >
                {currentContent?.market[language]}
              </Link>
              <Link
                href="/project"
                className={`${styles.menuItem} ${
                  pathname === "/project" ? styles.active : ""
                }`}
              >
                {currentContent?.project[language]}
              </Link>
              <Link
                href="/career"
                className={`${styles.menuItem} ${
                  pathname === "/career" ? styles.active : ""
                }`}
              >
                {currentContent?.career[language]}
              </Link>
              <Link
                href="/news-and-blogs"
                className={`${styles.menuItem} ${
                  pathname === "/news-and-blogs" ? styles.active : ""
                }`}
              >
                {currentContent?.news[language]}
              </Link>
            </nav>

            <div className={styles.group_btn}>
              <div title="language toggler" className={styles.lang_switch}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={language === "en"}
                    onChange={toggleLanguage} // Switch language on toggle
                  />
                  <span className={styles.slider + " " + styles.blue}>
                    <span className={styles.shortName}>
                      <p
                        className={`${language === "en" && styles.notActive} ${
                          language === "ar" && styles.notActive
                        }`}
                      >
                        {language === "en" ? "ARB" : "ENG"}
                      </p>
                      <p
                        className={`${language === "en" && styles.active} ${
                          language === "ar" && styles.active
                        }`}
                      >
                        {language === "en" ? "ENG" : "ARB"}
                      </p>
                    </span>
                  </span>
                </label>
              </div>
              <button
                className={`${styles.contactButton} ${BankGothic.className} ${language === "en" && styles.noPadding}`}
                onClick={handleContactUS}
              >
                {currentContent?.contact[language]}
              </button>
              <button className={styles.humberger} onClick={handleNavbar}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <ContactUsModal  isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default Header;
