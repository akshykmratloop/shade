import { useEffect, useState } from "react";
import Logo from "../../../../../assets/brand-logo/logo.svg";
import content from "../content.json";
import { Link } from "react-router-dom";

const Header = ({ language, screen, setLanguage, currentContent }) => {
    const isComputer = screen > 1100;
    const isTablet = screen < 1100 && screen >= 640;
    const isPhone = screen < 640;
    const isLeftAlign = language === "en";
    const [isOpenNavbar, setIsOpenNavbar] = useState()
    const [scrolled, setScrolled] = useState(false);
    const [isModal, setIsModal] = useState(false);

    const changeLangugage = () => {
        setLanguage((prev) => (prev === "en" ? "ar" : "en"));
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavbar = () => setIsOpenNavbar(!isOpenNavbar);
    const handleContactUS = () => setIsModal(true);
    const handleContactUSClose = () => setIsModal(false);

    return (
        <div>
            <div className="container mx-auto px-4 relative h-[500px] border border-cyan-400 pt-6">
                <header
                    dir={isLeftAlign ? "ltr" : "rtl"}
                    className={`w-full border transform bg-white z-50 transition-all duration-200 rounded-[40px] shadow-lg px-2 py-2 ${scrolled ? "bg-gray-300 bg-opacity-20 backdrop-blur-md shadow-none" : ""
                        }`}
                >
                    <div className={`flex justify-between items-center ${!isLeftAlign && "flex-row-reverse"} px-6`}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img src={Logo} alt="Logo" width={50} height={50} className="transition-all duration-200" />
                        </Link>

                        {/* Navigation */}
                        {isComputer ? (
                            <nav className={`flex ${isLeftAlign ? "gap-6" : "space-x-10"}`}>
                                {currentContent?.["1"]?.content?.map((item) => {
                                    if (item.order === 8) return null;
                                    return (
                                        <Link
                                            key={item.url}
                                            to={item.url}
                                            className={`text-[#001A5882] text-xs transition duration-200 hover:text-[#145098]`}
                                        >
                                            {item?.nav?.[language]}
                                        </Link>
                                    );
                                })}
                            </nav>
                        ) : null}

                        {/* Right side controls */}
                        <div className={`flex items-center ${!isLeftAlign && "flex-row-reverse"} gap-4`}>

                            {/* Hamburger for Tablet/Phone */}
                            {(isTablet || isPhone) && (
                                <button className="flex flex-col items-center space-y-1" onClick={handleNavbar}>
                                    <span className="w-8 h-1 bg-green-600 rounded"></span>
                                    <span className="w-8 h-1 bg-green-600 rounded"></span>
                                    <span className="w-8 h-1 bg-green-600 rounded"></span>
                                </button>
                            )}
                            {/* Language Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={language === "en"}
                                    onChange={changeLangugage}
                                    className="sr-only peer"
                                />
                                <div className="w-[100px] h-8 bg-blue-200 rounded-[3px] relative flex gap-4 items-center p-1 px-0">
                                    <div
                                        className={`absolute left-[5px] top-1 h-6 w-11 bg-[#00b9f2] rounded-[3px] transition-transform duration-500 ${language === "en" ? "translate-x-[45px]" : ""
                                            }`}
                                    ></div>
                                    <span className={`absolute left-3 text-xs font-medium ${isLeftAlign ? "text-[#001A5882]" : "text-white"}`}>
                                        ARB
                                    </span>
                                    <span className={`absolute right-3 text-xs font-medium ${isLeftAlign ? "text-white" : "text-[#001A5882]"}`}>
                                        ENG
                                    </span>
                                </div>
                            </label>

                            {/* Contact Us Button – show only if not phone */}
                            {!isPhone && (
                                <button
                                    className="p-2 py-2 text-white text-sm bg-[#00b9f2] rounded-md shadow-md hover:bg-blue-700 transition-all"
                                    onClick={handleContactUS}
                                >
                                    {currentContent?.["1"]?.content?.[7]?.nav?.[language]}
                                </button>
                            )}


                        </div>
                    </div>

                    {/* Mobile / Tablet Nav */}
                    {/* Mobile / Tablet Nav */}
                    {(isTablet || isPhone) && isOpenNavbar && (
                        <nav
                            className={`flex flex-col mt-4 space-y-2 px-6 ${!isLeftAlign ? "items-end" : "items-start"}`}
                        >
                            {currentContent?.["1"]?.content?.map((item) => {
                                if (item.order === 8) return null;
                                return (
                                    <Link
                                        key={item.url}
                                        to={item.url}
                                        className="text-[#001A5882] text-sm hover:text-[#145098] w-full"
                                    >
                                        {item?.nav?.[language]}
                                    </Link>
                                );
                            })}

                            {isPhone && (
                                <button
                                    className="p-2 text-white text-sm bg-[#00b9f2] rounded-md shadow-md hover:bg-blue-700 transition-all w-full text-center"
                                    onClick={handleContactUS}
                                >
                                    {currentContent?.["1"]?.content?.[7]?.nav?.[language]}
                                </button>
                            )}
                        </nav>
                    )}

                </header>
            </div>

            {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}
        </div>
    );
};

export default Header;


// import { useEffect, useState } from "react";
// import Logo from "../../../../../assets/brand-logo/logo.svg"
// import content from '../content.json'
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { updateMainContent } from "../../../../common/homeContentSlice";

// const Header = ({ isOpenNavbar, setIsOpenNavbar, language, screen, setLanguage, currentContent }) => {
//     // const currentContent = content?.header;
//     // const router = useRouter()
//     // const pathname = usePathname();
//     // const dispatch = useDispatch()
//     const isComputer = screen > 1100
//     const isTablet = screen < 1100 && 640 > screen
//     const isPhone = screen < 640
//     const isLeftAlign = language === "en"
//     const [scrolled, setScrolled] = useState(false);
//     const [isModal, setIsModal] = useState(false);
//     // const currentContent = useSelector((state) => state.homeContent.present.header)

//     const changeLangugage = () => {
//         setLanguage(prev => {
//             if (prev === "en") {
//                 return "ar"
//             } else {
//                 return "en"
//             }
//         })
//     }


//     useEffect(() => {
//         const handleScroll = () => {
//             if (window.scrollY > 50) {
//                 setScrolled(true);
//             } else {
//                 setScrolled(false);
//             }
//         };

//         window.addEventListener("scroll", handleScroll);

//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);



//     // const handleContactUs = () => {
//     //   // router.push('/contact-us', { scroll: false })
//     //   window.open("/contact-us", "_blank", "noopener,noreferrer");
//     // };

//     const handleNavbar = () => {
//         setIsOpenNavbar(!isOpenNavbar);
//     };

//     const handleContactUS = () => {
//         setIsModal(true);
//     };
//     const handleContactUSClose = () => {
//         setIsModal(false);
//     };

//     // useEffect(() => {
//     //     dispatch(updateMainContent({ currentPath: "header", payload: (content?.header) }))
//     // }, [])

//     return (
//         <div>
//             <div className="container mx-auto px-4 relative h-[500px] border border-cyan-400 pt-6">
//                 <header className={`w-full border transform bg-white z-50 transition-all duration-200 rounded-[40px] shadow-lg px-2 py-2 ${scrolled ? "bg-gray-300 bg-opacity-20 backdrop-blur-md shadow-none" : ""}`}
//                 >
//                     <div className={`flex justify-between items-center ${!isLeftAlign && "flex-row-reverse"} px-6`}>
//                         <Link href="/" className="flex items-center">
//                             <img src={Logo} alt="Logo" width={50} height={50} className={`transition-all duration-200`} />
//                         </Link>

//                         <nav className={`hidden lg:flex ${isLeftAlign ? 'gap-6' : "space-x-10"}`}>
//                             {currentContent?.['1']?.content?.map((item) => {
//                                 if (item.order === 8) return null
//                                 return (
//                                     <Link
//                                         key={item.url}
//                                         href={`${item?.url}`}
//                                         className={`text-[#001A5882] text-xs transition duration-200 ${false ? "text-gray-800 font-semibold" : "hover:text-[#145098]"}`}
//                                     >
//                                         {item?.nav?.[language]}
//                                     </Link>
//                                 )
//                             })}
//                         </nav>

//                         <div className={`flex items-center ${!isLeftAlign && "flex-row-reverse"} gap-4`}>
//                             <label className={`relative inline-flex items-center cursor-pointer `} >
//                                 <input type="checkbox" checked={language === "en"} onChange={changeLangugage} className="sr-only peer" />
//                                 <div className="w-[100px] h-8 bg-blue-200 rounded-[3px] relative flex gap-4 items-center p-1 px-0">
//                                     <div
//                                         className={`absolute left-[5px] top-1 h-6 w-11 bg-[#00b9f2] rounded-[3px] transition-transform duration-500 ${language === "en" ? "translate-x-[45px]" : ""}`}
//                                     ></div>
//                                     <span className={`absolute left-3 text-xs font-medium ${isLeftAlign ? "text-[#001A5882]" : "text-white"}`}>ARB</span>
//                                     <span className={`absolute right-3 text-xs font-medium ${isLeftAlign ? "text-white" : "text-[#001A5882]"}`}>ENG</span>
//                                 </div>
//                             </label>

//                             <button
//                                 className="p-2 py-2 text-white text-sm bg-[#00b9f2] rounded-md shadow-md hover:bg-blue-700 transition-all"
//                                 onClick={handleContactUS}
//                             >
//                                 {currentContent?.['1']?.content?.[7]?.nav?.[language]}
//                             </button>

//                             <button className="lg:hidden flex flex-col items-center space-y-1" onClick={handleNavbar}>
//                                 <span className="w-8 h-1 bg-green-600 rounded"></span>
//                                 <span className="w-8 h-1 bg-green-600 rounded"></span>
//                                 <span className="w-8 h-1 bg-green-600 rounded"></span>
//                             </button>
//                         </div>
//                     </div>
//                 </header>
//             </div>

//             {/* <ContactUsModal  isModal={isModal} onClose={handleContactUSClose} /> */}
//         </div>
//     );
// };

// export default Header;