import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import content from '../content.json'
import Logo from "../../../../../assets/brand-logo/foot-logo.svg"
import Facebook from "../../../../../assets/icons/facebook.svg"
import Instagram from "../../../../../assets/icons/instagram.svg"
import Twitter from "../../../../../assets/icons/twitter.svg"
import Linkedin from "../../../../../assets/icons/linkedin.svg"
import foot_layer from "../../../../../assets/images/foot_layer.png"
import foot_layer1 from "../../../../../assets/images/foot_layer1.png"
import { Img_url } from "../../../../../routes/backend";
// import { updateMainContent, updateImages } from "../../../../common/homeContentSlice";


const Footer = ({ language, screen, currentContent }) => {
    const isPhone = screen < 600
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()
    // const currentContent = useSelector((state) => state.homeContent.present.footer)
    // const imageFromRedux = useSelector(state => state.homeContent.present.images)
    // const socialIcons = useSelector((state) => {
    //     return state.homeContent.present.images.socialIcons
    // })
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

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "footer", payload: (content?.footer) }))
    //     // dispatch(updateImages({ src: social, section: "socialIcons" }))
    // }, [])
    return (
        <footer className="relative overflow-hidden bg-[#062233] border-t border-primary ">
            <div className="container relative mx-auto px-4 z-[2] p-6 px-8">
                <span className="absolute right-[82px] top-0 w-[265px] h-[234px] bg-no-repeat bg-contain z-[-1]"
                    style={{ backgroundImage: `url(${foot_layer1})` }} />
                <span className="absolute bottom-0 left-0 w-[200px] h-[180px] bg-no-repeat bg-contain bg-full bg-center z-[-1] "
                    style={{ backgroundImage: `url(${foot_layer})` }} />
                <div className="flex flex-col items-center gap-6 text-center mb-10 px-[80px]">
                    <div>
                        <img src={currentContent?.['1']?.content?.logo?.url ? currentContent?.['1']?.content?.logo?.url : Logo} alt="Logo" width={138} height={138} />
                    </div>
                    <p className="text-white text-xs font-medium leading-5">{currentContent?.['1']?.content?.address?.[language]}</p>
                </div>
                <div dir={isLeftAlign ? "ltr" : "rtl"} className={`flex flex-wrap justify-between ${isPhone && "flex-col"} gap-4  mb-12`}>
                    {currentContent?.['2']?.content?.map((section, i) => (
                        <div key={i + section?.title?.[language]} className="w-full md:w-auto">
                            <h5 className="text-white text-lg font-light mb-4">{section?.title[language]}</h5>
                            {section?.links?.map((link, index) => (
                                <Link key={index + link.url} href={link.url} className="block text-white text-base font-light mb-4 text-xs">
                                    {link[language]}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div dir={isLeftAlign ? "ltr" : "rtl"}
                    className="w-full md:w-auto flex flex-col gap-4 items-start">

                    <h5 className="text-white text-lg font-light">
                        {currentContent?.["3"]?.content?.title?.[language]}
                    </h5>

                    <p className="text-white text-base text-xs font-light">
                        {currentContent?.["3"]?.content?.fax?.[language]}
                    </p>

                    <p className="text-white text-base text-xs font-light">
                        {currentContent?.["3"]?.content?.phone?.[language]}
                    </p>

                    <h6 className="text-white text-base text-xs font-medium w-[50%]">
                        {currentContent?.["3"]?.content?.helpText?.[language]}
                    </h6>
                    <button
                        className="px-5 py-2 bg-[#00b9f2] text-white rounded-lg shadow-sm shadow-stone-100/50"
                        onClick={() => setIsModal(true)}
                    >
                        {currentContent?.["3"]?.content?.button?.[0]?.text?.[language]}
                    </button>
                    <div className="flex gap-4 mt-1 items-center">
                        {currentContent?.["3"]?.content?.socialLinks?.map((social, index) => (
                            <a key={index + social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                                {social.icon && <img src={Img_url + social.icon} alt="" width={20} height={20} />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* <ContactUsModal isModal={isModal} onClose={() => setIsModal(false)} /> */}
        </footer>
    );
};

export default Footer;