import HomePage from "./websiteComponent/Home";
import SolutionPage from "./websiteComponent/Solutions";
import AboutUs from "./websiteComponent/About";
import MarketPage from "./websiteComponent/Market";
import ProjectPage from "./websiteComponent/Projects";
import CareerPage from "./websiteComponent/CareersPage";
import NewsPage from "./websiteComponent/NewsPage";
import Footer from "./websiteComponent/Footerweb";
import Header from "./websiteComponent/Headerweb";
import ProjectDetailPage from "./websiteComponent/ProjectDetails";
import CareerDetailPage from "./websiteComponent/CareersDetails";
import NewsBlogDetailPage from "./websiteComponent/NewsDetails";
import Testimonials from "./websiteComponent/Testimonials";
import ContactUsModal from "./websiteComponent/ContactUsModal";
import Services from "./websiteComponent/Service";

const AllForOne = ({ language, screen, content, subPath, setLanguage, fullScreen, currentPath }) => {
    let translateForFullScreen = "translate-y-[950px]"

    if (!subPath) {
        switch (currentPath) {
            case "home":
                translateForFullScreen = "translate-y-[950px]"
                break;

            case "solution":
                translateForFullScreen = "translate-y-[505px]";
                break;

            case "about":
                translateForFullScreen = "translate-y-[255px]";
                break;

            case "markets":
                translateForFullScreen = "translate-y-[410px]";
                break;

            case "projects":
                translateForFullScreen = "translate-y-[351px]"
                break;
            case "careers":
                translateForFullScreen = "translate-y-[545px]"
                break;

            case "news":
                translateForFullScreen = "translate-y-[520px]"
                break;
            case "footer":
                translateForFullScreen = "translate-y-[130px]"
                break;
        }
    } else {
        switch (currentPath) {
            case "home":
                translateForFullScreen = "translate-y-[950px]"
                break;

            case "solution":
                translateForFullScreen = "translate-y-[505px]";
                break;

            case "about":
                translateForFullScreen = "translate-y-[255px]";
                break;

            case "markets":
                translateForFullScreen = "translate-y-[410px]";
                break;

            case "projects":
                translateForFullScreen = "translate-y-[420px]"
                break;
            case "careers":
                translateForFullScreen = "translate-y-[285px]"
                break;

            case "news":
                translateForFullScreen = "translate-y-[360px]"
                break;

            case "testimonials":
                translateForFullScreen = "translate-y-[220px]"
                break;
        }
    }

    return (
        <div className={`dark:text-[#2A303C] mt-0 ${fullScreen && screen > 900 ? "scale-[1.45] " + translateForFullScreen : ""} ${fullScreen ? "overflow-y-hidden" : "overflow-y-scroll"} customscroller transition-custom border-stone-200 border mx-auto w-full bankgothic-medium-dt bg-[white]`}
            style={{ width: screen > 900 ? "100%" : screen, wordBreak: "break-word" }}
        >
            {
                currentPath === "home" &&
                <HomePage language={language} screen={screen} fullScreen={fullScreen} />
            }
            {
                currentPath === "solution" &&
                <SolutionPage language={language} currentContent={content.solution} screen={screen} />
            }
            {
                currentPath === "about" &&
                <AboutUs language={language} currentContent={content.about} screen={screen} />
            }
            {
                currentPath === "services" &&
                <Services language={language} currentContent={content.services} screen={screen} />
            }
            {
                currentPath === "markets" &&
                <MarketPage language={language} currentContent={content.markets} screen={screen} />
            }
            {
                currentPath === 'projects' ? subPath ?
                    <ProjectDetailPage language={language} contentOn={content.projectDetail} projectId={subPath} screen={screen} /> :
                    <ProjectPage language={language} currentContent={content.projects} screen={screen} /> : ""
            }
            {
                currentPath === "careers" ? subPath ?
                    <CareerDetailPage language={language} contentOn={content.careerDetails} careerId={subPath} screen={screen} /> :
                    <CareerPage language={language} currentContent={content.career} screen={screen} /> : ""
            }
            {
                currentPath === "news" ? subPath ?
                    <NewsBlogDetailPage language={language} contentOn={content.newsBlogsDetails} newsId={subPath} screen={screen} /> :
                    <NewsPage language={language} currentContent={content.newsBlogs} screen={screen} /> : ""
            }

            {/* sub pages */}
            {
                currentPath === "footer" &&
                <Footer language={language} currentContent={content.footer} screen={screen} />
            }
            {
                currentPath === "header" &&
                <Header language={language} currentContent={content.header} screen={screen} setLanguage={setLanguage} />
            }
            {
                currentPath === "testimonials" &&
                <Testimonials language={language} currentContent={content.footer} screen={screen} testimonyId={subPath} />
            }
            {
                currentPath === 'contactus-modal' &&
                <>
                    <ContactUsModal language={language} currentContent={content.contactUsModal} screen={screen} />
                </>
            }
        </div>
    )
}

export default AllForOne