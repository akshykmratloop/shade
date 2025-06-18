import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useContext, useMemo } from "react";
import { Context } from "../Context/Context";

const Paginations = ({ currentPage, totalPages = 0, setCurrentPage, data }) => {
  const scrollContainerRef = useContext(Context);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const maxVisiblePages = 5;
  const pages = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= maxVisiblePages) {
      return [...Array(maxVisiblePages).keys()].map((i) => i + 1).concat("...");
    }
    if (currentPage > totalPages - maxVisiblePages) {
      return ["..."].concat(
        [...Array(maxVisiblePages).keys()].map(
          (i) => totalPages - maxVisiblePages + 1 + i
        )
      );
    }
    return [
      "...",
      ...[...Array(maxVisiblePages).keys()].map(
        (i) => currentPage - Math.floor(maxVisiblePages / 2) + i
      ),
      "...",
    ];
  }, [currentPage, totalPages]);

  if (!data?.length || totalPages <= 1) return null;

  console.log(currentPage, "current=====");

  return (
    <div className="flex justify-end items-center mt-6 gap-2 pr-2">
      <button
        onClick={() => {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
          scrollToTop();
        }}
        disabled={currentPage === 1}
        className={`w-[2rem] p-2 flex items-center justify-center text-sm rounded-full transition-colors duration-150
          ${
            currentPage === 1
              ? "bg-[#ededed] cursor-not-allowed dark:text-[black]"
              : "bg-[#29469c] text-white hover:bg-[#1d3466]"
          }`}
      >
        <FaAngleLeft />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => {
            if (page === "...") return;
            setCurrentPage(page);
            scrollToTop();
          }}
          disabled={page === "..." || page === currentPage}
          className={`px-3 py-1 rounded-full w-[2rem] h-[2rem] text-sm transition-colors duration-150
            ${
              page === "..."
                ? "bg-transparent text-[23px] -translate-x-1 -translate-y-1 cursor-default"
                : currentPage === page
                ? "bg-[#29469c] text-white font-bold"
                : "bg-[#ededed] dark:text-[black] hover:bg-[#d1d5db]"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
          scrollToTop();
        }}
        disabled={currentPage === totalPages}
        className={`w-[2rem] p-2 flex items-center justify-center text-sm rounded-full transition-colors duration-150
          ${
            currentPage === totalPages
              ? "bg-[#ededed] cursor-not-allowed dark:text-[black]"
              : "bg-[#29469C] text-white hover:bg-[#1d3466]"
          }`}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Paginations;
