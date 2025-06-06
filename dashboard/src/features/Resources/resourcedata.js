import landingPage from "../../assets/resourcepage/landingPage.png"
import aboutUS from "../../assets/resourcepage/aboutUs.png"
import solutionPage from "../../assets/resourcepage/solution-page.png"
import marketpage from "../../assets/resourcepage/marketPage.png"
import careerspage from "../../assets/resourcepage/CareersPage.png"
import servicePage from "../../assets/resourcepage/ourService.png"
import news from "../../assets/resourcepage/News-Blogs.png"
import projectpage from "../../assets/resourcepage/OurProject.png"


const resources = {
    pages: [
        { "Home": landingPage, },
        { "About": aboutUS, },
        { "Solution": solutionPage, },
        { "Services": servicePage, },
        { "Markets": marketpage, },
        { "Projects": projectpage, },
        { "Careers": careerspage, },
        { "News": news },
    ],
    services: [
        { subPage: 1, heading: "Construction Management", src: "", assign: true },
    ],
    subServices: [
        { subOfSubPage: 1, subPage: 1, supPage: "services", heading: "Sub Service 1", src: "", assign: true },
    ],
    markets: [
        { heading: "Home", src: "https://shade-six.vercel.app/", assign: true },
        { heading: "Solution", src: "https://shade-six.vercel.app/solution", assign: true },
        { heading: "About", src: "https://shade-six.vercel.app/about-us", assign: true },
        { heading: "Service", src: "https://shade-six.vercel.app/services", assign: false },
        { heading: "Markets", src: "https://shade-six.vercel.app/market", assign: true },
        { heading: "Projects", src: "https://shade-six.vercel.app/project", assign: true },
        { heading: "Careers", src: "https://shade-six.vercel.app/career", assign: true },
        { heading: "News", src: "https://shade-six.vercel.app/news-and-blogs", assign: true },
    ],
    projects: [
        { subPage: 1, heading: "IT Lab of Excellence", src: "https://shade-six.vercel.app/project/1", assign: true },
        { subPage: 2, heading: "Non-Metallic Manufacturing Plant", src: "https://shade-six.vercel.app/project/2", assign: true },
        { subPage: 3, heading: "Business Gate", src: "https://shade-six.vercel.app/project/3", assign: false },
        { subPage: 4, heading: "Construction of OME Building - NAPD Khursaniy...", src: "https://shade-six.vercel.app/project/4", assign: true },
    ],
    testimonials: [
        { subPage: 1, heading: "Testimony 1", src: "", assign: true },
        { subPage: 2, heading: "Testimony 2", src: "", assign: true },
        { subPage: 3, heading: "Testimony 3", src: "", assign: false },
        { subPage: 4, heading: "Testimony 4", src: "", assign: false },
        { subPage: 5, heading: "Testimony 5", src: "", assign: true },
        { subPage: 6, heading: "Testimony 6", src: "", assign: false }
    ],
    careers: [
        { subPage: "se1", heading: "Software Engineer", src: "https://shade-six.vercel.app/career/se1", assign: true },
        { subPage: "pm1", heading: "Project Manager", src: "https://shade-six.vercel.app/career/pm1", assign: true },
        { subPage: "da1", heading: "Data Analyst", src: "https://shade-six.vercel.app/career/de1", assign: true },
    ],
    news: [
        { subPage: "news1", heading: "Youth Overcoming Disability", src: "https://shade-six.vercel.app/blog/news1", assign: true },
        { subPage: "news2", heading: "Saudi Robots Join Millions in Performing the Hajj", src: "https://shade-six.vercel.app/blog/news2", assign: true },
        { subPage: "news3", heading: "Technology Serving People with Disabilities", src: "https://shade-six.vercel.app/blog/news3", assign: true },
        { subPage: "news4", heading: "Inspiring Success Stories", src: "https://shade-six.vercel.app/blog/news4", assign: true }
    ],
    subPage: [
        { heading: "Header", src: "", assign: true },
        { heading: "Footer", src: "", assign: true },
        { heading: "ContactUs-Modal", src: "", assign: false },
        { heading: "ApplyJob-Modal", src: "", assign: false },
    ],
    header: [
    ],
    footer: [
    ]
}

const pagesImages = {
    "home": landingPage,
    "about-us": aboutUS,
    "solution": solutionPage,
    "service": servicePage,
    "market": marketpage,
    "project": projectpage,
    "careers": careerspage,
    "news-blogs": news
}

export { pagesImages }
export default resources
