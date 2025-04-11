import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import content from './content.json'
import Logo from "../../../../assets/brand-logo/foot-logo.svg"
import Facebook from "../../../../assets/icons/facebook.svg"
import Instagram from "../../../../assets/icons/instagram.svg"
import Twitter from "../../../../assets/icons/twitter.svg"
import Linkedin from "../../../../assets/icons/linkedin.svg"
import foot_layer from "../../../../assets/images/foot_layer.png"
import foot_layer1 from "../../../../assets/images/foot_layer1.png"
import { updateContent, updateImages } from "../../../common/homeContentSlice";


const Footer = ({ language, screen }) => {
    const isPhone = screen < 600
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()
    const currentContent = useSelector((state) => state.homeContent.present.footer)
    const imageFromRedux = useSelector(state => state.homeContent.present.images)
    const socialIcons = useSelector((state) => {
        return state.homeContent.present.images.socialIcons
    })
    // const { language, content } = useGlobalContext();
    // const currentContent = content?.footer;
    const [isModal, setIsModal] = useState(false);

    const handleContactUSClose = () => {
        setIsModal(false);
    };

    const social = [
        { id: 1, img: Linkedin, url: "https://www.linkedin.com/" },
        { id: 2, img: Instagram, url: "https://www.instagram.com/" },
        { id: 3, img: Twitter, url: "https://twitter.com/" },
        { id: 4, img: Facebook, url: "https://www.facebook.com/" },
    ]

    useEffect(() => {
        dispatch(updateContent({ currentPath: "footer", payload: (content?.footer) }))
        dispatch(updateImages({ src: social, section: "socialIcons" }))
    }, [])
    return (
        <footer className="relative overflow-hidden bg-[#062233] border-t border-primary ">
            <div className="container relative mx-auto px-4 z-[2] p-6">
                <span className="absolute right-[82px] top-0 w-[265px] h-[234px] bg-no-repeat bg-contain z-[-1]"
                    style={{ backgroundImage: `url(${foot_layer1})` }} />
                <span className="absolute bottom-0 left-0 w-[200px] h-[180px] bg-no-repeat bg-contain bg-full bg-center z-[-1] "
                    style={{ backgroundImage: `url(${foot_layer})` }} />
                <div className="flex flex-col items-center gap-6 text-center mb-10 ">
                    <div>
                        <img src={imageFromRedux.footerIcon ? imageFromRedux.footerIcon : Logo} alt="Logo" width={138} height={138} />
                    </div>
                    <p className="text-white text-xs font-medium leading-8">{currentContent?.companyInfo?.address[language]}</p>
                </div>
                <div dir={isLeftAlign ? "ltr" : "rtl"} className={`flex flex-wrap justify-between ${isPhone && "flex-col"} gap-4 px-8 mb-12`}>
                    {["Section 1", "Section 2", "Section 3"].map((section) => (
                        <div key={section} className="w-full md:w-auto">
                            <h5 className="text-white text-lg font-light mb-4">{currentContent?.[section]?.title[language]}</h5>
                            {currentContent?.[section]?.links?.map((link, index) => (
                                <Link key={index} href={link.url} className="block text-white text-base font-light mb-4 text-xs">
                                    {link[language]}
                                </Link>
                            ))}
                        </div>
                    ))}

                    <div dir={isLeftAlign ? "ltr" : "rtl"} className="w-full md:w-auto flex flex-col gap-4 items-start">
                        <h5 className="text-white text-lg font-light">
                            {currentContent?.["Section 4"]?.title[language]}
                        </h5>
                        {currentContent?.["Section 4"]?.links.slice(0, 2).map((link, index) => (
                            <p key={index} className="text-white text-base text-xs font-light">
                                {link[language]}
                            </p>
                        ))}
                        <h6 className="text-white text-base text-xs font-medium w-[50%]">
                            {currentContent?.["Section 4"]?.links[2]?.[language]}
                        </h6>
                        <button
                            className="px-5 py-2 bg-[#00b9f2] text-white rounded-lg shadow-sm shadow-stone-100/50"
                            onClick={() => setIsModal(true)}
                        >
                            {currentContent?.["Section 4"]?.links[3]?.[language]}
                        </button>
                        <div className="flex gap-4 mt-1 items-center">
                            {socialIcons?.map((social, index) => (
                                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                                    {social.img && <img src={social.img} alt="social" width={20} height={20} />}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* <ContactUsModal isModal={isModal} onClose={() => setIsModal(false)} /> */}
        </footer>
    );
};

export default Footer;