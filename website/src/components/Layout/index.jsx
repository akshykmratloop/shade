import { useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import SideBarNavigation from "../sidebar";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";
import Loader from "@/common/Loader";

const Layout = ({ children }) => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(false);

  return (
    <LanguageProvider>
      <ContentWrapper isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar}>
        {children}
      </ContentWrapper>
    </LanguageProvider>
  );
};

const ContentWrapper = ({ children, isOpenNavbar, setIsOpenNavbar }) => {
  const { language, content } = useLanguage(); // Access the current language and content

  if (!content) return <Loader/>; // Render loading state

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`app ${language}`}>
      <Header isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar} />
      <main>{children}</main>
      <Footer />
      <SideBarNavigation isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar} />
    </div>
  );
};

export default Layout;
