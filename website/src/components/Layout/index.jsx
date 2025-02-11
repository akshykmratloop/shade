import { useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import SideBarNavigation from "../sidebar";
import { GlobalContextProvider, useGlobalContext } from "../../contexts/GlobalContext";
import Loader from "@/common/Loader";

const Layout = ({ children }) => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(false);

  return (
    <GlobalContextProvider>
      <ContentWrapper isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar}>
        {children}
      </ContentWrapper>
    </GlobalContextProvider>
  );
};

const ContentWrapper = ({ children, isOpenNavbar, setIsOpenNavbar }) => {
  const { language, content } = useGlobalContext(); // Access the current language and content

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
