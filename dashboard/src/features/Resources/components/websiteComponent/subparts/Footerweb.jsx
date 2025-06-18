import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../../../../assets/brand-logo/foot-logo.svg"
// import Facebook from "../../../../../assets/icons/facebook.svg"
// import Instagram from "../../../../../assets/icons/instagram.svg"
// import Twitter from "../../../../../assets/icons/twitter.svg"
// import Linkedin from "../../../../../assets/icons/linkedin.svg"
import foot_layer from "../../../../../assets/images/foot_layer.png"
import foot_layer1 from "../../../../../assets/images/foot_layer1.png"
import { Img_url } from "../../../../../routes/backend";
import dynamicSize, { differentText } from "../../../../../app/fontSizes";
// import { updateMainContent, updateImages } from "../../../../common/homeContentSlice";


const Footer = ({ language, screen, currentContent, highlight, liveContent }) => {
    const isPhone = screen < 600
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()

    const divRef = useRef(null);
    const [width, setWidth] = useState(0);

    const getDynamicSize = (size) => dynamicSize(size, width)

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current);
            }
        };
    }, []);

    return (
        <footer className="relative overflow-hidden bg-[#062233] border-t border-primary " ref={divRef}>
            <div className="container relative mx-auto px-4 z-[2] p-6 px-8"
                style={{ padding: `${getDynamicSize(24)} ${getDynamicSize(220)}` }}
            >
                <span className="absolute right-[82px] top-0 w-[265px] h-[234px] bg-no-repeat bg-contain z-[-1]"
                    style={{ backgroundImage: `url(${foot_layer1})`, width: getDynamicSize(362), height: getDynamicSize(362) }} />
                <span className="absolute bottom-0 left-0 w-[200px] h-[180px] bg-no-repeat bg-contain bg-full bg-center z-[-1] "
                    style={{ backgroundImage: `url(${foot_layer})`, width: getDynamicSize(265), height: getDynamicSize(234) }} />
                <div className="flex flex-col items-center gap-6 text-center mb-10 ">
                    <div
                        className={`${checkDifference(currentContent?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}`}
                    >
                        <img src={Img_url + currentContent?.['1']?.content?.images?.[0]?.url}
                            alt="Logo"
                            //  width={138} height={138}
                            style={{ width: getDynamicSize(138), height: getDynamicSize(138) }}
                        />
                    </div>
                    <p className={`text-white text-xs font-medium leading-5
                    ${checkDifference(currentContent?.['1']?.content?.address?.[language], liveContent?.['1']?.content?.address?.[language])}
                    `}
                        style={{ fontSize: getDynamicSize(16) }}
                    >{currentContent?.['1']?.content?.address?.[language]}</p>
                </div>
                <div dir={isLeftAlign ? "ltr" : "rtl"} className={`flex flex-wrap justify-between ${isPhone && "flex-col"} mb-8`}>
                    {currentContent?.['2']?.content?.map((section, i) => (
                        <div key={i + section?.title?.[language]} className="w-full md:w-auto">
                            <h5
                                style={{ fontSize: getDynamicSize(22) }}
                                className={`text-white text-lg font-light mb-4
                                        ${checkDifference(section?.title[language], liveContent?.['2']?.content?.[i]?.title?.[language])}
                                        `}
                            >{section?.title[language]}</h5>
                            {section?.links?.map((link, index) => (
                                <Link key={index + link.url} href={link.url} style={{ fontSize: getDynamicSize(16) }}
                                    className={`block text-white text-base font-light mb-4 text-xs
                                        ${checkDifference(section?.title[language], liveContent?.['2']?.content?.[i]?.links?.[index]?.link?.[language])}
                                        `}
                                >
                                    {link[language]}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div dir={isLeftAlign ? "ltr" : "rtl"}
                    className="w-full md:w-auto flex flex-col gap-4 items-start">

                    <h5 className={`text-white text-lg font-light
                    ${checkDifference(currentContent?.["3"]?.content?.title?.[language], liveContent?.["3"]?.content?.title?.[language])}
                    `}
                        style={{ fontSize: getDynamicSize(22) }}
                    >
                        {currentContent?.["3"]?.content?.title?.[language]}
                    </h5>

                    <p className={`text-white text-base text-xs font-light
                    ${checkDifference(currentContent?.["3"]?.content?.phone?.[language], liveContent?.["3"]?.content?.phone?.[language])}
                    `}
                        style={{ fontSize: getDynamicSize(16) }}
                    >
                        {currentContent?.["3"]?.content?.phone?.[language]}
                    </p>

                    <p className={`text-white text-base text-xs font-light
                    ${checkDifference(currentContent?.["3"]?.content?.fax?.[language], liveContent?.["3"]?.content?.fax?.[language])}

                    `}
                        style={{ fontSize: getDynamicSize(16) }}
                    >
                        {currentContent?.["3"]?.content?.fax?.[language]}
                    </p>

                    <h6 className={`text-white text-base text-xs font-medium w-[50%]
                    ${checkDifference(currentContent?.["3"]?.content?.helpText?.[language], liveContent?.["3"]?.content?.helpText?.[language])}
                    `}
                        style={{ fontSize: getDynamicSize(16) }}
                    >
                        {currentContent?.["3"]?.content?.helpText?.[language]}
                    </h6>
                    <button
                        className="px-5 py-2 bg-[#00b9f2] text-white rounded-lg shadow-sm shadow-stone-100/50"
                        style={{ fontSize: getDynamicSize(16) }}
                    >
                        <p className={`${checkDifference(currentContent?.["3"]?.content?.button?.[0]?.text?.[language], liveContent?.["3"]?.content?.button?.[0]?.text?.[language])}`}>
                            {currentContent?.["3"]?.content?.button?.[0]?.text?.[language]}
                        </p>
                    </button>
                    <div className="flex gap-4 mt-1 items-center">
                        {currentContent?.["3"]?.content?.socialLinks?.map((social, index) => (
                            <a key={index + social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                                {social.icon && <img src={Img_url + social.icon} alt="" width={20} height={20}
                                    style={{ width: getDynamicSize(24), height: getDynamicSize(24) }}
                                />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;