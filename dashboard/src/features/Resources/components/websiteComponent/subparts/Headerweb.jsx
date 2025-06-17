import { useEffect, useRef, useState } from "react";
import Logo from "../../../../../assets/brand-logo/logo.svg";
import { Link } from "react-router-dom";

const Header = ({ language, screen, setLanguage, currentContent }) => {
    const isComputer = screen > 1100;
    const isTablet = screen < 1100 && screen >= 640;
    const isPhone = screen < 640;
    const isLeftAlign = language === "en";

    const [isOpenNavbar, setIsOpenNavbar] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

    const changeLangugage = () => {
        setLanguage((prev) => (prev === "en" ? "ar" : "en"));
    };

    const moreModalRef = useRef(null)

    // Separate nav items
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
                setIsMoreModalOpen(false)
            };
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const handleNavbar = () => setIsOpenNavbar(!isOpenNavbar);

    return (
        <div>
            <div className="container mx-auto px-4 relative h-[500px] pt-6">
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
                        {isComputer && (
                            <ul className="flex items-center gap-6">
                                {mainNavItems.map((item) => (
                                    <li
                                        key={item.url}
                                        to={item.url}
                                        className="text-[#001A5882] text-xs transition duration-200 hover:text-[#145098]"
                                    >
                                        {item?.nav?.[language]}
                                    </li>
                                ))}
                                {extraNavItems.length > 0 && (
                                    <button
                                        onClick={() => setIsMoreModalOpen(true)}
                                        className="text-[#001A5882] text-xs transition duration-200 hover:text-[#145098]"
                                    >
                                        {currentContent?.["2"]?.content?.extraKey?.[language]}
                                    </button>
                                )}
                            </ul>
                        )}

                        {/* Right side controls */}
                        <div className={`flex items-center ${!isLeftAlign && "flex-row-reverse"} gap-4`}>
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
                                    // onClick={handleContactUS}
                                >
                                    {currentContent?.["2"]?.content?.contact?.[language]}
                                </button>
                            )}
                            {/* Hamburger for Tablet/Phone */}
                            {(isTablet || isPhone) && (
                                <button className="flex flex-col items-center space-y-1" onClick={handleNavbar}>
                                    <span className="w-8 h-1 bg-[#00b9f2] rounded"></span>
                                    <span className="w-8 h-1 bg-[#00b9f2] rounded"></span>
                                    <span className="w-8 h-1 bg-[#00b9f2] rounded"></span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile / Tablet Nav */}
                    {(isTablet || isPhone) && isOpenNavbar && (
                        <nav
                            className={`flex flex-col mt-4 space-y-2 px-6 ${!isLeftAlign ? "items-end" : "items-start"}`}
                        >
                            {navItems.map((item) => (
                                <li
                                    key={item.url}
                                    to={item.url}
                                    className="text-[#001A5882] text-sm hover:text-[#145098] w-full"
                                >
                                    {item?.nav?.[language]}
                                </li>
                            ))}
                            {isPhone && (
                                <button
                                    className="p-2 text-white text-sm bg-[#00b9f2] rounded-md shadow-md hover:bg-blue-700 transition-all w-full text-center"
                                    // onClick={handleContactUS}
                                >
                                    {currentContent?.["2"]?.content?.contact?.[language]}
                                </button>
                            )}
                        </nav>
                    )}

                    {/* More Modal */}
                    {isMoreModalOpen && (
                        <div ref={moreModalRef} className="absolute top-[70%] mt-2 left-[58%] w-[150px] bg-white rounded-lg shadow-lg p-4 z-50">
                            <ul className={`flex flex-col space-y-2 ${!isLeftAlign ? "items-end" : "items-start"}`}>
                                {extraNavItems.map((item) => (
                                    <li key={item.url}>
                                        <Link
                                            to={item.url}
                                            className="text-[#001A5882] hover:text-[#145098]"
                                            onClick={() => setIsMoreModalOpen(false)}
                                        >
                                            {item?.nav?.[language]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </header>
            </div>
        </div>
    );
};

export default Header;
