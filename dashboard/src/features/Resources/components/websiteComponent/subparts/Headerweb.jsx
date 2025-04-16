import React, { useEffect, useState } from "react";
// import styles from "@/components/header/Header.module.scss";
// import Logo from "@/assets/brand-logo/logo.svg";
import Logo from "../../../../assets/brand-logo/logo.svg"
import content from '../content.json'
import { useDispatch, useSelector } from "react-redux";
// import Image from "next/image";
// import Link from "next/link";
import { Link, useLocation } from "react-router-dom";
import { updateContent } from "../../../../common/homeContentSlice";
// import { usePathname } from "next/navigation";
// import localFont from "next/font/local";
// import ContactUsModal from "./ContactUsModal";
// import { useGlobalContext } from "../../contexts/GlobalContext";

// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothic_Md_BT.ttf",
//     display: "swap",
// });

const Header = ({ isOpenNavbar, setIsOpenNavbar, language, screen, setLanguage }) => {
    // const { language, toggleLanguage, content } = useGlobalContext();
    // const currentContent = content?.header;
    // const router = useRouter()
    // const pathname = usePathname();
    const dispatch = useDispatch()
    const isLeftAlign = language === "en"
    const [scrolled, setScrolled] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const currentContent = useSelector((state) => state.homeContent.present.header)

    const changeLangugage = () => {
        setLanguage(prev => {
            if(prev === "en"){
                return "ar"
            }else{
                return "en"
            }
        })
    }

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

    useEffect(() => {
        dispatch(updateContent({ currentPath: "header", payload: (content?.header) }))
    }, [])

    return (
        <div>
            <div className="container mx-auto px-4 relative h-[500px] border border-cyan-400 pt-6">
                <header className={`w-full border transform bg-white z-50 transition-all duration-200 rounded-[40px] shadow-lg px-2 py-2 ${scrolled ? "bg-gray-300 bg-opacity-20 backdrop-blur-md shadow-none" : ""}`}
                >
                    <div className={` flex justify-between items-center ${!isLeftAlign && "flex-row-reverse"} px-6`}>
                        <Link href="/" className="flex items-center">
                            <img src={Logo} alt="Logo" width={50} height={50} className={`transition-all duration-200`} />
                        </Link>

                        <nav className={`hidden lg:flex ${isLeftAlign? 'gap-6':"space-x-10"}`}>
                            {[
                                "section 1",
                                "section 2",
                                "section 3",
                                "section 4",
                                "section 5",
                                "section 6",
                                "section 7"
                            ].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item}`}
                                    className={`text-[#001A5882] text-xs transition duration-200 ${false ? "text-gray-800 font-semibold" : "hover:text-[#145098]"}`}
                                > 
                                    {currentContent?.[item]?.title?.[language]}
                                </Link>
                            ))}
                        </nav>

                        <div className={`flex items-center ${!isLeftAlign && "flex-row-reverse"} gap-4`}>
                            <label className={`relative inline-flex items-center cursor-pointer `} >
                                <input type="checkbox" checked={language === "en"} onChange={changeLangugage} className="sr-only peer" />
                                <div className="w-[100px] h-8 bg-blue-200 rounded-[3px] relative flex gap-4 items-center p-1 px-0">
                                    <div
                                        className={`absolute left-[5px] top-1 h-6 w-11 bg-[#00b9f2] rounded-[3px] transition-transform duration-500 ${language === "en" ? "translate-x-[45px]" : ""}`}
                                    ></div>
                                    <span className={`absolute left-3 text-xs font-medium ${isLeftAlign ? "text-[#001A5882]" : "text-white"}`}>ARB</span>
                                    <span className={`absolute right-3 text-xs font-medium ${isLeftAlign ? "text-white" : "text-[#001A5882]"}`}>ENG</span>
                                </div>
                            </label>

                            <button
                                className="p-2 py-2 text-white text-sm bg-[#00b9f2] rounded-md shadow-md hover:bg-blue-700 transition-all"
                                onClick={handleContactUS}
                            >
                                {currentContent?.["section 8"]?.title?.[language]}
                            </button>

                            <button className="lg:hidden flex flex-col items-center space-y-1" onClick={handleNavbar}>
                                <span className="w-8 h-1 bg-green-600 rounded"></span>
                                <span className="w-8 h-1 bg-green-600 rounded"></span>
                                <span className="w-8 h-1 bg-green-600 rounded"></span>
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            {/* <ContactUsModal  isModal={isModal} onClose={handleContactUSClose} /> */}
        </div>
    );
};

export default Header;
