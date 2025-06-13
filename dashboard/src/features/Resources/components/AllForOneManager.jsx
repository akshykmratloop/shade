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
import SnRManager from "./contentmanager/SnRManager";
import SnRPoliciesManager from "./contentmanager/SnRPolicyManager";
import HistoryManager from "./contentmanager/HistoryManager";
import VisionManager from "./contentmanager/VisionManager";
import HSnEManager from "./contentmanager/HSnEManager";
import MarketDetailsManager from "./contentmanager/CMforDetails/MarketDetailsManager";
import AffiliatesManager from "./contentmanager/AffiliatesManager";


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
                <SubServiceDetailManager outOfEditing={outOfEditing} serviceId={subPath} deepPath={deepPath} language={language} content={content} indexes={contentIndex} currentPath={"subOfsubService"} /> :
                <ServiceDetailsManager outOfEditing={outOfEditing} serviceId={subPath} language={language} content={content} indexes={contentIndex} currentPath={"serviceDetails"} /> :
                <ServiceManager outOfEditing={outOfEditing} language={language} currentContent={content} currentPath={currentPath} indexes={contentIndex} />
            break;

        case "service":
            manager = subPath &&
                <ServiceDetailsManager outOfEditing={outOfEditing} serviceId={subPath} language={language} currentContent={content.serviceDetails} indexes={contentIndex} currentPath={"serviceDetails"} />
            break;

        case "market":
            manager = subPath ?
                <MarketDetailsManager outOfEditing={outOfEditing} language={language} indexes={contentIndex} content={content} currentPath={currentPath} />
                : <MarketManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "project":
            manager =
                subPath ?
                    <ProjectDetailManager outOfEditing={outOfEditing} projectId={subPath} language={language} indexes={contentIndex} currentContent={content} currentPath={"projectDetail"} /> :
                    <ProjectContentManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "careers":
            manager = <CareersManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "career":
            manager = <CareerDetailManager outOfEditing={outOfEditing} careerId={subPath} language={language} indexes={contentIndex} currentContent={content} currentPath={"careerDetails"} />
            break;

        case "news-blogs":
            manager = <NewsManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={"newsBlogs"} />
            break;

        case "news":
            manager = <NewsDetailManager outOfEditing={outOfEditing} newsId={subPath} language={language} indexes={contentIndex} content={content} currentPath={"newsBlogsDetails"} />
            break;

        case "footer":
            manager = <FooterManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "header":
            manager = <HeaderManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "testimonial":
            manager = <TestimonyManager outOfEditing={outOfEditing} language={language} currentContent={content} indexes={contentIndex} testimonyId={subPath} currentPath={"testimonialSection"} />
            break;

        case "safety_responsibility":
            manager = subPath ?
                <SnRPoliciesManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} /> :
                <SnRManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "history":
            manager = <HistoryManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "vision":
            manager = <VisionManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "affiliates":
            manager = <AffiliatesManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        case "hse":
            manager = <HSnEManager outOfEditing={outOfEditing} language={language} content={content} indexes={contentIndex} currentPath={currentPath} />
            break;

        default:
    }

    useEffect(() => {
        return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    }, [])


    return (
        <div className="">
            {manager}
        </div>
    )
}

export default AllForOneManager