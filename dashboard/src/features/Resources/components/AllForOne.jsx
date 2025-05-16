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

const AllForOne = ({ language, screen, content, subPath, setLanguage, fullScreen, currentPath, deepPath, showDifference = false, live, hideScroll }) => {
    let translateForFullScreen = ""

    return (
        <div
            className={`dark:text-[#2A303C] mt-0 
            ${fullScreen ? "overflow-y-hidden" : "overflow-y-scroll"}
             ${hideScroll ? "rm-scroll":"customscroller"} transition-custom border-stone-200 border mx-auto w-full bankgothic-medium-dt bg-[white]`}
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
                />
            }
            {
                currentPath === "solution" &&
                <SolutionPage language={language} currentContent={content} screen={screen} />
            }
            {
                currentPath === "about-us" &&
                <AboutUs language={language} currentContent={content} screen={screen} />
            }
            {
                currentPath === "service" ? subPath ? deepPath ?
                    <SubServiceDetails language={language} contentOn={tempContent?.subOfsubService} serviceId={subPath} screen={screen} deepPath={deepPath} /> :
                    <ServiceDetails language={language} contentOn={tempContent?.serviceDetails} serviceId={subPath} screen={screen} /> :
                    <Services language={language} currentContent={tempContent?.services} screen={screen} /> : ""
            }
            {/* {
                (currentPath === "service" && subPath) &&
                <ServiceDetails language={language} contentOn={content?.serviceDetails} serviceId={subPath} screen={screen} />
            } */}
            {
                currentPath === "markets" &&
                <MarketPage language={language} currentContent={content?.markets} screen={screen} />
            }
            {
                currentPath === 'projects' || currentPath === 'project' ? subPath ?
                    <ProjectDetailPage language={language} contentOn={content?.projectDetail} projectId={subPath} screen={screen} /> :
                    <ProjectPage language={language} currentContent={content?.projects} screen={screen} /> : ""
            }
            {
                currentPath === "careers" ? subPath ?
                    <CareerDetailPage language={language} contentOn={content?.careerDetails} careerId={subPath} screen={screen} /> :
                    <CareerPage language={language} currentContent={content?.career} screen={screen} /> : ""
            }
            {
                currentPath === "news" ? subPath ?
                    <NewsBlogDetailPage language={language} contentOn={content?.newsBlogsDetails} newsId={subPath} screen={screen} /> :
                    <NewsPage language={language} currentContent={content?.newsBlogs} screen={screen} /> : ""
            }

            {/* sub pages */}
            {
                currentPath === "footer" &&
                <Footer language={language} currentContent={content?.footer} screen={screen} />
            }
            {
                currentPath === "header" &&
                <Header language={language} currentContent={content?.header} screen={screen} setLanguage={setLanguage} />
            }
            {
                currentPath === "testimonials" || currentPath === "testimonial" &&
                <Testimonials language={language} currentContent={content?.footer} screen={screen} testimonyId={subPath} />
            }
            {
                currentPath === 'contactus-modal' &&
                <ContactUsModal language={language} currentContent={content?.contactUsModal} screen={screen} />
            }
        </div>
    )
}

export default AllForOne