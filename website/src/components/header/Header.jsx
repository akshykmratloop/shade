"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/header/Header.module.scss";
import Logo from "@/assets/brand-logo/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import ContactUsModal from "./ContactUsModal";
import { useGlobalContext } from "../../contexts/GlobalContext";
import createContent from "@/common/CreateContent";

const BankGothic = localFont({
  src: "../../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

const Header = ({ isOpenNavbar, setIsOpenNavbar }) => {
  const [openNav, setOpenNav] = useState(false)
  const { language, toggleLanguage, headerData } = useGlobalContext();
  const currentContent = createContent(headerData.content).content;
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const moreModalRef = useRef(null);
  const pathname = usePathname();

  const navItems = currentContent?.["1"]?.content || [];
  const mainNavItems = navItems.slice(0, 6);
  const extraNavItems = navItems.slice(6);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreModalRef.current && !moreModalRef.current.contains(e.target)) {
        setIsMoreModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleNavbar = () => setIsOpenNavbar(!isOpenNavbar);
  const handleNavbar = () => setOpenNav(!openNav)
  const handleContactUS = () => setIsModal(true);
  const handleContactUSClose = () => setIsModal(false);

  return (
    <>
      <div className="container">
        <header className={`${styles.headerWrapper} ${scrolled ? styles.stickyActive : ""}`}>
          <div className={styles.header}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <Image
                src={Logo}
                alt="Logo"
                className={styles.logoImage}
                width={63}
                height={63}
              />
            </Link>

            {/* Desktop Menu */}
            <nav className={styles.menu}>
              {mainNavItems.map((nav, i) => (
                <Link
                  key={i}
                  href={nav?.url}
                  className={`${styles.menuItem} ${pathname === nav?.url ? styles.active : ""}`}
                >
                  {nav?.nav?.[language]}
                </Link>
              ))}
              {extraNavItems.length > 0 && (
                <p
                  onClick={() => setIsMoreModalOpen(true)}
                  className={styles.menuItem}
                >
                  {currentContent?.["2"]?.content?.extraKey?.[language]}
                </p>
              )}
              {isMoreModalOpen && (
                <div ref={moreModalRef} className={`${styles.moremenu} ${language === "en" ? styles.moremenuLTR : styles.moremenuRTL}`}>
                  <ul>
                    {extraNavItems.map((item, ind) => (
                      <li key={item.url + ind}>
                        <Link
                          onClick={() => setIsMoreModalOpen(false)}
                          href={item.url}
                          className={`${pathname === item?.url ? styles.active : ""}`}
                        >
                          {item?.nav?.[language]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>

            {/* Controls */}
            <div className={styles.group_btn}>
              {/* Language Toggle */}
              <div title="language toggler" className={styles.lang_switch}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={language === "en"}
                    onChange={toggleLanguage}
                  />
                  <span className={`${styles.slider} ${styles.blue}`}>
                    <span className={styles.shortName}>
                      <p
                        className={`${language === "en" && styles.notActive} ${language === "ar" && styles.notActive}`}
                      >
                        {language === "en" ? "ARB" : "ENG"}
                      </p>
                      <p
                        className={`${language === "en" && styles.active} ${language === "ar" && styles.active}`}
                      >
                        {language === "en" ? "ENG" : "ARB"}
                      </p>
                    </span>
                  </span>
                </label>
              </div>

              {/* Contact Button */}
              <button
                className={`${styles.contactButton} bank-light ${BankGothic.className} ${language === "en" && styles.noPadding}`}
                onClick={handleContactUS}
              >
                {currentContent?.['2']?.content?.contact?.[language]}
              </button>

              {/* Hamburger */}
              <button className={styles.humberger} onClick={handleNavbar}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Menu */}
          {
            // isOpenNavbar 
            openNav
            && (
              <nav className={styles.mobileMenu}>
                <ul>
                  {navItems.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.url}
                        className={`${pathname === item?.url ? styles.active : ""}`}
                        onClick={() => setOpenNav(false)}
                      >
                        {item?.nav?.[language]}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      className={`${styles.mobileContactButton} bank-light`}
                      onClick={() => {
                        handleContactUS();
                        setOpenNav(false);
                      }}
                    >
                      {currentContent?.['2']?.content?.contact?.[language]}
                    </button>
                  </li>
                </ul>
              </nav>
            )}
        </header>
      </div>

      {/* Contact Modal */}
      <ContactUsModal isModal={isModal} onClose={handleContactUSClose} />
    </>
  );
};

export default Header;
