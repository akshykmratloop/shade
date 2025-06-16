import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Resources from "./Resources";
import EditPage from "./EditPage";
import { lazy, Suspense, useEffect, useRef } from "react";
import SuspenseContent from "../../containers/SuspenseContent";
import VersionTable from "./VersionTable";
import RequestTable from "./RequestTable";
import { useSelector } from "react-redux";


const Resource = () => {
    const Page404 = lazy(() => import('../../pages/protected/404'))
    const navigate = useNavigate()
    const isManager = useSelector(state => state.user.isManager)
    const isEditor = useSelector(state => state.user.isEditor)
    const firstRender = useRef(true);



    useEffect(() => { // Permission for Editor and Manager only
        if (firstRender.current) {
            firstRender.current = false;
            return; // 👈 skip first render
        }

        if (!isManager && !isEditor) {
            navigate('/app/welcome')
            return () => { }
        }

    }, [isEditor, isManager])
    return (
        <Suspense fallback={<SuspenseContent />}>
            <Routes>
                <Route path="/" element={<Navigate to={"pages"} />}></Route>
                <Route path="pages" element={<Resources />} />
                <Route path="versions/" element={<VersionTable />} />
                <Route path="requests/" element={<RequestTable />} />
                <Route path="edit/*" element={<EditPage />} />
                <Route path="*" element={<Page404 />} />

            </Routes>
        </Suspense>
    );
};

export default Resource;