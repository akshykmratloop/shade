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

const AllForOne = ({ language, screen, content, subPath, setLanguage, fullScreen, currentPath, deepPath, showDifference = false, live, hideScroll }) => {
    console.log(fullScreen)
    // console.log(content)
    const dispatch = useDispatch()
    const fontRegular = useSelector(state => state.fontStyle.regular)

    // const platform = useSelector(state => state.platform.platform)

    // useEffect(() => {
    //     if (platform !== "EDIT") {
    //         return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    //     }
    // }, [platform])
    const divRef = useRef(null);
    const [width, setWidth] = useState(0);

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
        <div
            ref={divRef}
            className={`dark:text-[#2A303C] mt-0 
            ${fullScreen ? "overflow-y-hidden" : "overflow-y-scroll"}
             ${hideScroll ? "rm-scroll" : "customscroller"} transition-custom border-stone-200 border mx-auto w-full ${fontRegular} bg-[white]`}
            style={{ width: screen > 950 ? "100%" : screen, wordBreak: "break-word" }}
        >
            {
                currentPath === "home" &&
                <HomePage language={language}
                    screen={screen}
                    fullScreen={fullScreen}
                    content={content}
                    highlight={showDifference}
                    liveContent={live}
                    width={width}
                />
            }
            {
                currentPath === "solution" &&
                <SolutionPage language={language} currentContent={content} screen={screen}
                    width={width}
                />
            }
            {
                currentPath === "about-us" &&
                <AboutUs language={language} currentContent={content} screen={screen}
                    width={width}
                />
            }
            {
                currentPath === "service" ? subPath ? deepPath ?
                    <SubServiceDetails
                        width={width}
                        language={language} content={content} serviceId={subPath} screen={screen} deepPath={deepPath} /> :
                    <ServiceDetails
                        width={width}
                        language={language} content={content} serviceId={subPath} screen={screen} /> :
                    <Services language={language}
                        width={width}
                        currentContent={content} screen={screen} /> : ""
            }
            {/* {
                (currentPath === "service" && subPath) &&
                <ServiceDetails language={language} contentOn={content?.serviceDetails} serviceId={subPath} screen={screen} />
            } */}
            {
                currentPath === "market" &&
                <MarketPage
                    width={width}
                    language={language} currentContent={content} screen={screen} />
            }
            {
                currentPath === 'projects' || currentPath === 'project' ? subPath ?
                    <ProjectDetailPage
                        width={width}
                        language={language} contentOn={content?.projectDetail} projectId={subPath} screen={screen} /> :
                    <ProjectPage
                        width={width}
                        language={language} currentContent={content} screen={screen} /> : ""
            }
            {
                currentPath === "careers" ? subPath ?
                    <CareerDetailPage
                        width={width}
                        language={language} contentOn={content?.careerDetails} careerId={subPath} screen={screen} /> :
                    <CareerPage
                        width={width}
                        language={language} currentContent={content} screen={screen} /> : ""
            }
            {
                currentPath === "news-blogs" ? subPath ?
                    <NewsBlogDetailPage
                        width={width}
                        language={language} contentOn={content?.newsBlogsDetails} newsId={subPath} screen={screen} /> :
                    <NewsPage language={language} content={content} screen={screen} /> : ""
            }

            {/* sub pages */}
            {
                currentPath === "footer" &&
                <Footer
                    width={width}
                    language={language} currentContent={content} screen={screen} />
            }
            {
                currentPath === "header" &&
                <Header
                    width={width}
                    language={language} currentContent={content} screen={screen} setLanguage={setLanguage} />
            }
            {
                currentPath === "testimonials" || currentPath === "testimonial" &&
                <Testimonials
                    width={width}
                    language={language} currentContent={content} screen={screen} testimonyId={subPath} />
            }
            {
                currentPath === 'contactus-modal' &&
                <ContactUsModal
                    width={width}
                    language={language} currentContent={content} screen={screen} />
            }
        </div>
    )
}

export default AllForOne