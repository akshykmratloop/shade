import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useContext } from "react";
import { Context } from "../Context/Context";

const Paginations = ({ currentPage, totalPages, setCurrentPage, data, }) => {
    const setTotalPages = totalPages || 0
    const scrollContainerRef = useContext(Context);

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const maxVisiblePages = 5;
    let pages = [];

    if (setTotalPages <= maxVisiblePages) {
        pages = Array.from({ length: setTotalPages }, (_, i) => i + 1);
    } else if (currentPage <= maxVisiblePages) {
        pages = [...Array(maxVisiblePages).keys()].map(i => i + 1);
        pages.push("...");
    } else if (currentPage > setTotalPages - maxVisiblePages) {
        pages.push("...");
        pages = pages.concat([...Array(maxVisiblePages).keys()].map(i => setTotalPages - maxVisiblePages + 1 + i));
    } else {
        pages = pages.concat([...Array(maxVisiblePages).keys()].map(i => currentPage - Math.floor(maxVisiblePages / 2) + i));
        pages.push("...");
    }

    return (
        <div className="flex justify-end items-center mt-6 gap-2 pr-2" style={{
            // display: !(data?.length > 0) && "none"
        }}>
            <button
                onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1))
                    scrollToTop()
                }}
                disabled={currentPage === 1 || !setTotalPages}
                className={`w-[2rem] p-2 flex items-center justify-center  text-sm rounded-full ${currentPage === 1 ? "bg-[#ededed] cursor-not-allowed dark:text-[black]" : "bg-[#29469c] text-white"}`}
            >
                <FaAngleLeft />
            </button>

            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (page === "...") {
                            if (index === 0) {
                                setCurrentPage(1); // "..." at the beginning
                            } else if (index === pages.length - 1) {
                                setCurrentPage(setTotalPages); // "..." at the end
                            }
                        } else {
                            setCurrentPage(page);
                        }
                        scrollToTop()
                    }}
                    className={`px-3 py-1 pt-2 ${page > 9 ? "pl-2 pr-2" : ""} rounded-full w-[2rem] h-[2rem] ${page === "..." ? "hover:underline text-[23px] -translate-x-1 -translate-y-1" : currentPage === page ? "bg-[#29469c] text-white text-sm" : "bg-[#ededed] dark:text-[black] text-sm"}`}
                >
                    {page}
                </button>
            ))}


            <button
                onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, setTotalPages))
                    scrollToTop()
                }}
                disabled={currentPage === setTotalPages || !setTotalPages}
                className={`w-[2rem] p-2 flex items-center justify-center text-sm rounded-full ${(currentPage === setTotalPages || setTotalPages === 0) ? "bg-[#ededed] cursor-not-allowed dark:text-[black]" : "bg-[#29469C] text-white"}`}
            >
                <FaAngleRight />
            </button>
        </div>
    )
}

export default Paginations