import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { openModal } from "../common/modalSlice"
import { getLeadsContent } from "./leadSlice"
import { MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import Navbar from "../../containers/Navbar"
import bgImg from "../../assets/homepage.png"
import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { FiInfo } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

const TopSideButtons = () => {
    const dispatch = useDispatch()
    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New Lead", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }))
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New</button>
        </div>
    )
}

function Resources() {
    const dispatch = useDispatch()
    const divRef = useRef(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isSmall, setIsSmall] = useState(false)

    useEffect(() => {
        dispatch(getLeadsContent())
    }, [])

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setIsCollapsed(entry.contentRect.width < 1100);
                setIsSmall(entry.contentRect.width < 1200);
            }
        });

        if (divRef.current) observer.observe(divRef.current);

        return () => observer.disconnect();
    }, []);

    const pages = [
        { heading: "Home page", bgImg: bgImg, },
        { heading: "About page", bgImg: bgImg, },
        { heading: "Service page", bgImg: bgImg, },
        { heading: "Home page", bgImg: bgImg, },
        { heading: "About page", bgImg: bgImg, },
        { heading: "Service page", bgImg: bgImg, },
        { heading: "Home page", bgImg: bgImg, },
        { heading: "About page", bgImg: bgImg, },
        { heading: "Service page", bgImg: bgImg, },
        { heading: "Service page", bgImg: bgImg, },
    ]

    return (
        <div className="customscroller" ref={divRef}>
            <Navbar />
            <div className="grid grid-cols-2 mt-4 lg:grid-cols-3 gap-12 w-full px-8">
                {pages.map((page, index) => (
                    <div key={index} className="w-full">
                        <h3 className="font-bold mb-3">{page.heading}</h3>
                        <div className="relative rounded-lg overflow-hidden border border-[2px] border-primary">
                            {/* Info Icon */}
                            <div className="absolute top-2 right-2 z-50 text-[1.5rem] p-2 rounded-full text-stone-600">
                                <FiInfo />
                            </div>

                            {/* Background Image with Adjusted Dark Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90 via-60%"></div>
                            {/* <img
                                src={page.bgImg}
                                alt={page.heading}
                                className="w-[30vw]  object-cover  transition-all duration-300 ease-in-out"
                            /> */}
                            <div className="relative aspect-[9/10] overflow-hidden">
                                {/* Iframe */}
                                <iframe
                                    src="https://shade-six.vercel.app/"
                                    className="absolute top-0 left-0 w-[1200px] h-[150vh] border-none scale-[0.4] origin-top-left"
                                ></iframe>

                                {/* Dark Gradient Overlay */}
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/100 via-black/40 to-transparent"></div>
                            </div>




                            {/* Bottom Text Options */}
                            <div className={`absolute bottom-2 left-0 w-full text-center text-white justify-center items-center flex  ${isCollapsed ? "gap-2" : "gap-6"} py-1`}>
                                {[
                                    { icon: <FaRegEye />, text: "View" },
                                    { icon: null, text: "|" },
                                    { icon: <FiEdit />, text: "Edit" },
                                    { icon: null, text: "|" },
                                    { icon: <IoSettingsOutline />, text: "Config" }
                                ].map((item, i) => (
                                    <span key={i} className={`flex ${isCollapsed ? "flex-col" : ""} gap-1 items-center text-center`}>
                                        {item.icon}
                                        <span className={`${isSmall ? "text-sm" : "text-base"}`}>
                                            {item.text}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Resources






// <TitleCard title="Current Leads" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

// {/* Leads List in table format loaded from slice after api call */}
// <div className="overflow-x-auto w-full">
// <table className="table w-full">
//     <thead>
//     <tr>
//         <th>Name</th>
//         <th>Email Id</th>
//         <th>Created At</th>
//         <th>Status</th>
//         <th>Assigned To</th>
//         <th></th>
//     </tr>
//     </thead>
//     <tbody>
//         {
//             leads.map((l, k) => {
//                 return(
//                     <tr key={k}>
//                     <td>
//                         <div className="flex items-center space-x-3">
//                             <div className="avatar">
//                                 <div className="mask mask-squircle w-12 h-12">
//                                     <img src={l.avatar} alt="Avatar" />
//                                 </div>
//                             </div>
//                             <div>
//                                 <div className="font-bold">{l.first_name}</div>
//                                 <div className="text-sm opacity-50">{l.last_name}</div>
//                             </div>
//                         </div>
//                     </td>
//                     <td>{l.email}</td>
//                     <td>{moment(new Date()).add(-5*(k+2), 'days').format("DD MMM YY")}</td>
//                     <td>{getDummyStatus(k)}</td>
//                     <td>{l.last_name}</td>
//                     <td><button className="btn btn-square btn-ghost" onClick={() => deleteCurrentLead(k)}><TrashIcon className="w-5"/></button></td>
//                     </tr>
//                 )
//             })
//         }
//     </tbody>
// </table>
// </div>
// </TitleCard>