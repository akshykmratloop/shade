import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { PiDotsThreeOutlineThin } from "react-icons/pi";

const Pagination = ({ totalDocuments, handlePageChange, selectedPage, itemPerPage }) => {
  const itemsPerPage = itemPerPage ? itemPerPage : 10;
  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  const renderPages = () => {
    const pages = [];
    const startPage = Math.floor((selectedPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    if (startPage > 1) {
      pages.push(
        <div
          key="start"
          className="cursor-pointer text-gray-500 hover:text-blue-400 text-lg"
          onClick={() => handlePageChange(1)}
        >
          <PiDotsThreeOutlineThin />
        </div>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <h5
          key={i}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm transition-all ${
            selectedPage === i ? "text-blue-400 border border-blue-400" : "text-gray-500"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </h5>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <div
          key="end"
          className="cursor-pointer text-gray-500 hover:text-blue-400 text-lg"
          onClick={() => handlePageChange(totalPages)}
        >
          <PiDotsThreeOutlineThin />
        </div>
      );
    }

    return pages;
  };

  const handleNextPage = () => {
    if (selectedPage + 1 <= totalPages) {
      handlePageChange(selectedPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (selectedPage - 1 >= 1) {
      handlePageChange(selectedPage - 1);
    }
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <div
        className="w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500 text-sm hover:text-blue-400"
        onClick={handlePrevPage}
      >
        <FaChevronLeft />
      </div>
      {renderPages()}
      <div
        className="w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500 text-sm hover:text-blue-400"
        onClick={handleNextPage}
      >
        <FaChevronRight />
      </div>
    </div>
  );
};

export default Pagination;