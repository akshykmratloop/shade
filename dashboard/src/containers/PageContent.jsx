import Header from "./Header"
import { Route, Routes } from 'react-router-dom'
import routes from '../routes'
import { Suspense, lazy } from 'react'
import SuspenseContent from "./SuspenseContent"
import { useSelector } from 'react-redux'
import { useEffect, useRef } from "react"

const Page404 = lazy(() => import('../pages/protected/404'))


function PageContent(){
    const mainContentRef = useRef(null);
    const {pageTitle} = useSelector(state => state.header)


    // Scroll back to top on new page load
    useEffect(() => {
        mainContentRef.current.scroll({
            top: 0,
            behavior: "smooth"
          });
      }, [pageTitle])

    return(
        <div className="flex flex-col flex-8 w-full overflow-x-hidden">
            <Header/>
            <main className="flex-1 overflow-y-scroll pt-0 px-3 pb-8 bg-base-100 customscroller" ref={mainContentRef}>
                <Suspense fallback={<SuspenseContent />}>
                        <Routes>
                            {
                                routes.map((route, key) => {
                                    return(
                                        <Route
                                            key={key}
                                            exact={true}
                                            path={route.path === "/resources"?`${route.path}/*`:route.path}
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
