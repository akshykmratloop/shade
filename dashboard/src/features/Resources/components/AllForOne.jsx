import HomePage from "./websiteComponent/Home";
import SolutionPage from "./websiteComponent/Solutions";
import AboutUs from "./websiteComponent/About";
import MarketPage from "./websiteComponent/Market";
import ProjectPage from "./websiteComponent/Projects";
import CareerPage from "./websiteComponent/CareersPage";
import NewsPage from "./websiteComponent/NewsPage";
import Footer from "./websiteComponent/subparts/Footerweb";
import Header from "./websiteComponent/subparts/Headerweb";
import ProjectDetailPage from "./websiteComponent/detailspages/ProjectDetails";
import CareerDetailPage from "./websiteComponent/detailspages/CareersDetails";
import NewsBlogDetailPage from "./websiteComponent/detailspages/NewsDetails";
import Testimonials from "./websiteComponent/subparts/Testimonials";
import ContactUsModal from "./websiteComponent/subparts/ContactUsModal";
import Services from "./websiteComponent/Service";
import ServiceDetails from "./websiteComponent/detailspages/ServiceDetails";
import SubServiceDetails from "./websiteComponent/subDetailsPages/SubServiceDetails";
import tempContent from "./websiteComponent/content.json"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { updateMainContent } from "../../common/homeContentSlice";
import SnR from "./websiteComponent/SafetyAndResponsibility";
import SnRPolicies from "./websiteComponent/detailspages/SnRPolicies";
import History from "./websiteComponent/HistoryPage";
import VisionNMission from "./websiteComponent/VisionPage";
import HSnE from "./websiteComponent/HSE";

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useRef, useState } from "react";
// import { updateMainContent } from "../../common/homeContentSlice";

const AllForOne = ({
    language, screen, content, setLanguage, fullScreen,
    currentPath, subPath, deepPath, showDifference = false, live, hideScroll
}) => {
    // console.log(currentPath, subPath, deepPath)
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 767;
    const isPhone = screen < 767;
    const dispatch = useDispatch();
    const fontRegular = useSelector(state => state.fontStyle.regular);
    const divRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        if (divRef.current) observer.observe(divRef.current);
        return () => {
            if (divRef.current) observer.unobserve(divRef.current);
        };
    }, []);

    const baseProps = { width, language, screen, highlight: showDifference, liveContent: live, fullScreen };

    const renderPage = () => {
        switch (currentPath) {
            case "home":
                return <HomePage {...baseProps} content={content} />;
            case "solution":
                return <SolutionPage {...baseProps} currentContent={content} />;
            case "about-us":
                return <AboutUs {...baseProps} currentContent={content} />;
            case "service":
                if (subPath) {
                    return deepPath
                        ? <SubServiceDetails {...baseProps} serviceId={subPath} content={content} deepPath={deepPath} />
                        : <ServiceDetails {...baseProps} serviceId={subPath} content={content} />;
                }
                return <Services {...baseProps} currentContent={content} />;
            case "market":
                return <MarketPage {...baseProps} currentContent={content} />;
            case "projects":
            case "project":
                return subPath
                    ? <ProjectDetailPage {...baseProps} projectId={subPath} content={content} />
                    : <ProjectPage {...baseProps} currentContent={content} />;
            case "careers":
                return subPath
                    ? <CareerDetailPage {...baseProps} careerId={subPath} contentOn={content?.careerDetails} />
                    : <CareerPage {...baseProps} currentContent={content} />;
            case "news-blogs":
                return subPath
                    ? <NewsBlogDetailPage {...baseProps} newsId={subPath} contentOn={content} />
                    : <NewsPage {...baseProps} content={content} />;
            case "news":
                return <NewsBlogDetailPage {...baseProps} newsId={subPath} contentOn={content} />;
                
            case "footer":
                return <Footer {...baseProps} currentContent={content} />;
            case "header":
                return <Header {...baseProps} currentContent={content} setLanguage={setLanguage} />;
            case "testimonials":
            case "testimonial":
                return <Testimonials {...baseProps} testimonyId={subPath} currentContent={content} />;
            case "contactus-modal":
                return <ContactUsModal {...baseProps} currentContent={content} />;
            case "safety_responsibility":
                return subPath
                    ? <SnRPolicies {...baseProps} currentContent={content} />
                    : <SnR {...baseProps} currentContent={content} />;

            case "history":
                return <History {...baseProps} currentContent={content} />;

            case "vision":
                return <VisionNMission {...baseProps} currentContent={content} />

            case "hse":
                return <HSnE {...baseProps} currentContent={content} />

            default:
                return null;
        }
    };

    // console.log(fullScreen)

    return (
        <div
            ref={divRef}
            className={`dark:text-[#2A303C] mt-0 transition-custom border-stone-200 border mx-auto w-full ${fontRegular} bg-[white] 
            ${fullScreen ? "overflow-y-hidden" : "overflow-y-scroll"} 
            ${hideScroll ? "rm-scroll" : "customscroller"}`}
            style={{
                width: (fullScreen) ? isComputer ? "100%" : screen : screen > 950 ? "100%" : screen,
                wordBreak: "break-word",
            }}
        >
            {renderPage()}
        </div>
    );
};

export default AllForOne;
