// import for content manager
import HomeManager from "./contentmanager/HomeManager";
import SolutionManager from "./contentmanager/SolutionManager";
import AboutManager from "./contentmanager/AboutManager";
import MarketManager from "./contentmanager/MarketManager";
import ProjectContentManager from "./contentmanager/ProjectContentManager";
import CareersManager from "./contentmanager/CareersManager";
import NewsManager from "./contentmanager/NewsManager";
import FooterManager from "./contentmanager/CMforSubParts/FooterManager";
import HeaderManager from "./contentmanager/CMforSubParts/HeaderManager";
import ProjectDetailManager from "./contentmanager/CMforDetails/ProjectDetailManager";
import CareerDetailManager from "./contentmanager/CMforDetails/CareerDetailManager";
import NewsDetailManager from "./contentmanager/CMforDetails/NewsDetailsManager";
import TestimonyManager from "./contentmanager/CMforSubParts/TestimonyManager";
import ServiceManager from "./contentmanager/ServiceManager";
import ServiceDetailsManager from "./contentmanager/CMforDetails/ServiceDetailsManager";
import SubServiceDetailManager from "./contentmanager/subDetailsManagement/SubServiceDetailManagement";


const AllForOneManager = ({ currentPath, language, subPath, deepPath, content , contentIndex}) => {

    let manager = null

    switch (currentPath) {
        case "home":
            manager = <HomeManager language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "solutions":
            manager = <SolutionManager language={language} currentContent={content.solutions} currentPath={currentPath} />
            break;

        case "about":
            manager = <AboutManager language={language} currentContent={content.about} currentPath={currentPath} />
            break;

        case "services":
            manager = subPath ? deepPath ?
                <SubServiceDetailManager serviceId={subPath} deepPath={deepPath} language={language} currentContent={content.subOfsubService} currentPath={"subOfsubService"} /> :
                <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} /> :
                <ServiceManager language={language} currentContent={content.services} currentPath={currentPath} />
            break;

        case "service":
            manager = subPath &&
                <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} />
            break;

        case "markets":
            manager = <MarketManager language={language} currentContent={content.markets} currentPath={currentPath} />
            break;

        case "projects":
            manager = <ProjectContentManager language={language} currentContent={content.projects} currentPath={currentPath} />
            break;

        case "project":
            manager = <ProjectDetailManager projectId={subPath} language={language} currentContent={content.projectDetail} currentPath={"projectDetail"} />
            break;

        case "careers":
            manager = <CareersManager language={language} currentContent={content.careers} currentPath={currentPath} />
            break;

        case "career":
            manager = <CareerDetailManager careerId={subPath} language={language} currentContent={content.careerDetails} currentPath={"careerDetails"} />
            break;

        case "news":
            manager = subPath ?
                <NewsDetailManager newsId={subPath} language={language} currentContent={content.newsBlogsDetails} currentPath={"newsBlogsDetails"} /> :
                <NewsManager language={language} currentContent={content.newsBlogs} currentPath={"newsBlogs"} />
            break;

        case "footer":
            manager = <FooterManager language={language} currentContent={content.footer} currentPath={currentPath} />
            break;

        case "header":
            manager = <HeaderManager language={language} currentContent={content.header} currentPath={currentPath} />
            break;

        case "testimonial":
            manager = <TestimonyManager language={language} currentContent={content.testimonialSection} testimonyId={subPath} currentPath={"testimonialSection"} />
            break;

        default:
    }


    return (
        <div>
            {manager}
        </div>
    )
}

export default AllForOneManager




// {/* {
//                                 currentPath === "home" &&
//                                 <HomeManager language={language} currentContent={content.home?.editVersion?.sections} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === "solutions" &&
//                                 <SolutionManager language={language} currentContent={content.solutions} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === "about" &&
//                                 <AboutManager language={language} currentContent={content.about} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === "services" ? subPath ? deepPath ?
//                                     <SubServiceDetailManager serviceId={subPath} deepPath={deepPath} language={language} currentContent={content.subOfsubService} currentPath={"subOfsubService"} /> :
//                                     <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} /> :
//                                     <ServiceManager language={language} currentContent={content.services} currentPath={currentPath} /> : ""
//                             }
//                             {
//                                 (currentPath === "service" && subPath) &&
//                                 <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} />
//                             }
//                             {
//                                 currentPath === 'markets' &&
//                                 <MarketManager language={language} currentContent={content.markets} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === 'projects' || currentPath === 'project' ? subPath ?

//                                     <ProjectDetailManager projectId={subPath} language={language} currentContent={content.projectDetail} currentPath={"projectDetail"} /> :
//                                     <ProjectContentManager language={language} currentContent={content.projects} currentPath={currentPath} /> : ""
//                             }
//                             {
//                                 currentPath === 'careers' ? subPath ?
//                                     <CareerDetailManager careerId={subPath} language={language} currentContent={content.careerDetails} currentPath={"careerDetails"} /> :
//                                     <CareersManager language={language} currentContent={content.careers} currentPath={currentPath} /> : ""
//                             }
//                             {
//                                 currentPath === 'news' ? subPath ?
//                                     <NewsDetailManager newsId={subPath} language={language} currentContent={content.newsBlogsDetails} currentPath={"newsBlogsDetails"} /> :
//                                     <NewsManager language={language} currentContent={content.newsBlogs} currentPath={"newsBlogs"} /> : ""
//                             }
//                             {
//                                 currentPath === 'footer' &&
//                                 <FooterManager language={language} currentContent={content.footer} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === 'header' &&
//                                 <HeaderManager language={language} currentContent={content.header} currentPath={currentPath} />
//                             }
//                             {
//                                 currentPath === 'testimonials' || currentPath === 'testimonial' &&
//                                 <TestimonyManager language={language} currentContent={content.testimonialSection} testimonyId={subPath} currentPath={"testimonialSection"} />
//                             } */}