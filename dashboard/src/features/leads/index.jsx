import { Routes, Route } from "react-router-dom";
import Resources from "./Resources";
import EditPage from "./EditPage";
import { Suspense } from "react";
import SuspenseContent from "../../containers/SuspenseContent";

const Resource = () => {
    return (
        <Suspense fallback={<SuspenseContent />}>
            <Routes>
                <Route index element={<Resources />} />
                <Route path="edit" element={<EditPage />} />
            </Routes>
        </Suspense>
    );
};

export default Resource;