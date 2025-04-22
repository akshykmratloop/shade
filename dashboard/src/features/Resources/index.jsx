import { Routes, Route } from "react-router-dom";
import Resources from "./Resources";
import EditPage from "./EditPage";
import { lazy, Suspense } from "react";
import SuspenseContent from "../../containers/SuspenseContent";


const Resource = () => {
    const Page404 = lazy(() => import('../../pages/protected/404'))
    return (
        <Suspense fallback={<SuspenseContent />}>
            <Routes>
                <Route index element={<Resources />} />
                <Route path="edit/*" element={<EditPage />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Suspense>
    );
};

export default Resource;