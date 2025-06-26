import React, { useEffect, useState } from "react";
import styles from "@/components/header/Header.module.scss";
import Logo from "@/assets/brand-logo/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import ContactUsModal from "./ContactUsModal";
import { useGlobalContext } from "../../contexts/GlobalContext";
import createContent from "@/common/CreateContent";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

const Header = ({ isOpenNavbar, setIsOpenNavbar }) => {
  const { language, toggleLanguage, content, headerData } = useGlobalContext();
  const currentContent = createContent(headerData.content).content;

  console.log(currentContent)
  const navItems = currentContent?.["1"]?.content || [];
  const mainNavItems = navItems.slice(0, 6);
  const extraNavItems = navItems.slice(6);
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
          className={`${styles.headerWrapper} ${scrolled ? styles.stickyActive : ""
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
              {
                mainNavItems?.map((nav, i) => {
                  return (<Link
                    key={i}
                    href={nav?.url}
                    className={`${styles.menuItem} ${pathname === "/solution" ? styles.active : ""
                      }`}
                  >
                    {nav?.nav?.[language]}
                  </Link>)
                })
              }
              {extraNavItems.length > 0 && (
                <p
                  onClick={() => setIsMoreModalOpen(true)}
                  className={`${styles.menuItem}`}
                >
                  <p className={``}>
                    {currentContent?.["2"]?.content?.extraKey?.[language]}
                  </p>
                </p>
              )}
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
                        className={`${language === "en" && styles.notActive} ${language === "ar" && styles.notActive
                          }`}
                      >
                        {language === "en" ? "ARB" : "ENG"}
                      </p>
                      <p
                        className={`${language === "en" && styles.active} ${language === "ar" && styles.active
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
                {currentContent?.contact?.[language]}
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

      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default Header;
