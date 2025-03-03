import React from "react";

import styles from "./pagination.module.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { PiDotsThreeOutlineThin } from "react-icons/pi";
const Pagination = ({
  totalDocuments,
  handlePageChange,
  selectedPage,
  itemPerPage,
}) => {
  const itemsPerPage = itemPerPage ? itemPerPage : 10;

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  const renderPages = () => {
    const pages = [];
    const startPage =
      Math.floor((selectedPage - 1) / itemsPerPage) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPages);

    if (startPage > 1) {
      pages.push(
        <div
          key="start"
          className={styles.list_numbers_icon}
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
          className={selectedPage === i ? `${styles.active_page}` : ""}
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
          className={styles.list_numbers_icon}
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

  //   const handleLastPage = () => {
  //     handlePageChange(totalPages);
  //   };

  return (
    <div className={styles.pagination_wrap}>
      <div className={styles.back_arrow} onClick={handlePrevPage}>
        <FaChevronLeft />
      </div>
      {renderPages()}
      <div className={styles.next_arrow} onClick={handleNextPage}>
        <FaChevronRight />
      </div>
    </div>
  );
};

export default Pagination;
