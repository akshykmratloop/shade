import Header from "./Header"
import { Route, Routes, useLocation } from 'react-router-dom'
import routes from '../routes'
import { Suspense, lazy } from 'react'
import SuspenseContent from "./SuspenseContent"
import { useSelector } from 'react-redux'
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Page404 = lazy(() => import('../pages/protected/404'))


function PageContent() {
    const navigate = useNavigate()
    const mainContentRef = useRef(null);
    const { pageTitle } = useSelector(state => state.header)
    const userRole = useSelector(state => state.user.currentRole)
    // const applied = useSelector(state => state)
    const location = useLocation()

    useEffect(() => {
        mainContentRef.current.scroll({
            top: 0,
            behavior: "smooth"
        });
    }, [pageTitle])

    useEffect(() => {
        let route = localStorage.getItem("route")
        if (route && location.pathname.split('/').length < 4) {
            navigate(route)
        }
    }, [])

    // useEffect(() => {
    //     if (userRole.role && userRole.permissions?.length === 0) {
    //         toast.error("The current role has no permissios", { hideProgressBar: true })
    //     }

    // }, [userRole])

    return (
        <div className="flex flex-col flex-8 w-full overflow-x-hidden">
            <Header />
            <main className="flex-1 overflow-y-scroll pt-0 px-3 pb-8 bg-base-100 customscroller" ref={mainContentRef}>
                <Suspense fallback={<SuspenseContent />}>
                    <Routes>
                        {
                            routes.map((route, key) => {
                                let path = route.path
                                if (route?.permission) {
                                    if (!userRole?.permissions?.includes(route.permission)) {
                                        return null
                                    }
                                }
                                return (
                                    <Route
                                        key={key}
                                        exact={true}
                                        path={route.path === "/resources" ? `${route.path}/*` : path}
                                        element={<route.component />}
                                    />
                                )
                            })
                        }

                        {/* Redirecting unknown url to 404 page */}
                        <Route path="*" element={<Page404 />} />
                    </Routes>
                </Suspense>
                <div className=""></div>
            </main>
        </div>
    )
}


export default PageContent
