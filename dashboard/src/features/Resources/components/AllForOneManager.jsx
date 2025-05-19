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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMainContent } from "../../common/homeContentSlice";


const AllForOneManager = ({ currentPath, language, subPath, deepPath, content, contentIndex, outOfEditing }) => {
    const dispatch = useDispatch()

    let manager = null

    switch (currentPath) {
        case "home":
            manager = <HomeManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "solution":
            manager = <SolutionManager outOfEditing={outOfEditing} language={language} currentContent={content} currentPath={currentPath} indexes={contentIndex} />
            break;

        case "about-us":
            manager = <AboutManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "service":
            manager = subPath ? deepPath ?
                <SubServiceDetailManager serviceId={subPath} deepPath={deepPath} language={language} currentContent={content.subOfsubService} currentPath={"subOfsubService"} /> :
                <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} /> :
                <ServiceManager language={language} currentContent={content} currentPath={currentPath} indexes={contentIndex} />
            break;

        case "service":
            manager = subPath &&
                <ServiceDetailsManager serviceId={subPath} language={language} currentContent={content.serviceDetails} currentPath={"serviceDetails"} />
            break;

        case "market":
            manager = <MarketManager language={language} currentContent={content} currentPath={currentPath} />
            break;

        case "projects":
            manager = <ProjectContentManager language={language} currentContent={content} currentPath={currentPath} />
            break;

        case "project":
            manager = <ProjectDetailManager projectId={subPath} language={language} currentContent={content.projectDetail} currentPath={"projectDetail"} />
            break;

        case "careers":
            manager = <CareersManager language={language} currentContent={content} currentPath={currentPath} />
            break;

        case "career":
            manager = <CareerDetailManager careerId={subPath} language={language} currentContent={content} currentPath={"careerDetails"} />
            break;

        case "news":
            manager = subPath ?
                <NewsDetailManager newsId={subPath} language={language} currentContent={content} currentPath={"newsBlogsDetails"} /> :
                <NewsManager language={language} currentContent={content} currentPath={"newsBlogs"} />
            break;

        case "footer":
            manager = <FooterManager language={language} currentContent={content} currentPath={currentPath} />
            break;

        case "header":
            manager = <HeaderManager language={language} currentContent={content} currentPath={currentPath} />
            break;

        case "testimonial":
            manager = <TestimonyManager language={language} currentContent={content} testimonyId={subPath} currentPath={"testimonialSection"} />
            break;

        default:
    }

    useEffect(() => {
        return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    }, [])


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