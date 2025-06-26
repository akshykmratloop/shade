// libraries import
import React, { useEffect, useState, useRef } from "react";
// self modules
import { userLogs, deleteLogsByDateRange } from "../../app/fetch";
import TitleCard from "../../components/Cards/TitleCard";
import ShowLogs from "./ShowLog";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";
import Paginations from "../Component/Paginations";
import formatTimestamp from "../../app/TimeFormat";
// icons
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FiEye } from "react-icons/fi";
import { LuListFilter } from "react-icons/lu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Requests/DateTimeCustom.css";
import axios from "axios";

const CustomInput = React.forwardRef(({ value, onClick, onChange, placeholder, onClear, isEndDate }, ref) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isTyping, setIsTyping] = useState(false);

  // Update input value when prop value changes
  useEffect(() => {
    if (!isTyping) {
      setInputValue(value || "");
    }
  }, [value, isTyping]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);

    // Auto-complete date formats
    if (newValue.length >= 6) {
      let formattedDate = null;
      
      // Handle format: 11122025 or 11-12-2025 or 11/12/2025
      const cleanValue = newValue.replace(/[-\/]/g, '');
      
      if (cleanValue.length === 8) {
        const day = cleanValue.substring(0, 2);
        const month = cleanValue.substring(2, 4);
        const year = cleanValue.substring(4, 8);
        
        // Validate date
        const date = new Date(year, month - 1, day);
        if (date.getDate() == day && date.getMonth() == month - 1 && date.getFullYear() == year) {
          formattedDate = date;
        }
      } else if (cleanValue.length === 6) {
        // Handle format: 111225 (assuming current year)
        const day = cleanValue.substring(0, 2);
        const month = cleanValue.substring(2, 4);
        const year = "20" + cleanValue.substring(4, 6);
        
        const date = new Date(year, month - 1, day);
        if (date.getDate() == day && date.getMonth() == month - 1 && date.getFullYear() == year) {
          formattedDate = date;
        }
      }
      
      if (formattedDate) {
        setInputValue(formattedDate.toLocaleDateString('en-GB')); // DD/MM/YYYY format
        setIsTyping(false);
        onChange(formattedDate);
      }
    } else if (newValue.length === 0) {
      // Clear the date when input is empty
      setIsTyping(false);
      onChange(null);
    }
  };

  const handleInputBlur = () => {
    setIsTyping(false);
    // If input is empty, clear the date
    if (!inputValue.trim()) {
      onChange(null);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setIsTyping(false);
    onChange(null);
    if (onClear) onClear();
  };

  return (
    <div className="relative border border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] ">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onClick={onClick}
        ref={ref}
        placeholder={placeholder}
        title="Supported formats: DD/MM/YYYY, DD-MM-YYYY, DDMMYYYY"
        className=" h-9 px-2 font-[300] border border-gray-300 rounded text-xs dark:bg-slate-800 dark:text-white pr-6"
        style={{ boxShadow: "none", height : "100%", background : "none" }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

const TopSideButtons = ({
  removeFilter,
  applyFilter,
  filterParam,
  targetParam,
  setTargetParam,
  setFilterParam,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onDeleteLogsClick,
  dateFilterReady,
}) => {
  const statusFilters = ["Success", "Failure"];
  const targetFilters = ["user", "role", "resource"];

  const showFiltersAndApply = (status) => {
    applyFilter({ outcome: status, target: targetParam });
    setFilterParam(status);
  };
  const showTargetAndApply = (target) => {
    applyFilter({ outcome: filterParam, target });
    setTargetParam(target);
  };
  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam("");
    setTargetParam("");
  };

  const clearStartDate = () => {
    setStartDate(null);
  };

  const clearEndDate = () => {
    setEndDate(null);
  };

  return (
    <div className="float-right w-full flex items-center gap-3 border dark:border-neutral-600 rounded-lg p-1">
      {/* Date Range Filter */}
      <div className={`flex items-center ${dateFilterReady ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600 rounded-lg p-1' : ''}`}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate || new Date()}
          placeholderText="Start Date"
          dateFormat="dd/MM/yyyy"
          popperClassName="custom-datepicker-popper"
          customInput={
            <CustomInput 
              placeholder="Start Date" 
              onClear={clearStartDate}
            />
          }
        />

        <span className="text-[14px] font-[300] mx-2">to</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          placeholderText="End Date"
          dateFormat="dd/MM/yyyy"
          popperClassName="custom-datepicker-popper"
          customInput={
            <CustomInput 
              placeholder="End Date" 
              onClear={clearEndDate}
              isEndDate={true}
            />
          }
        />
        {/* {dateFilterReady && (
          <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            {startDate?.toLocaleDateString('en-GB')} - {endDate?.toLocaleDateString('en-GB')}
          </span>
        )} */}
      </div>
      {/* Outcome Filter */}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label
          tabIndex={0}
          className={`capitalize border text-[14px] self-center border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] w-[91px] flex items-center justify-center gap-1 font-[300] px-[14px] py-[10px] ${
            filterParam ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
          }`}
        >
          <LuListFilter className="w-5" />
          {filterParam ? capitalizeWords(filterParam) : 'Outcome'}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 text-[#0E2354] font-[400]"
        >
          {statusFilters.map((status, key) => (
            <li key={key}>
              <button
                className={`dark:text-gray-300 ${filterParam === status ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : ''}`}
                onClick={() => showFiltersAndApply(status)}
                style={{ textTransform: "capitalize" }}
              >
                {capitalizeWords(status)}
                {filterParam === status && <span className="ml-2">✓</span>}
              </button>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <button
              className="dark:text-gray-300"
              onClick={() => removeAppliedFilter()}
            >
              Remove Filter
            </button>
          </li>
        </ul>
      </div>
      {/* Target Filter */}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label
          tabIndex={0}
          className={`capitalize border text-[14px] self-center border-stone-300 dark:border-neutral-500 rounded-lg h-[40px] w-[91px] flex items-center gap-1 font-[300] px-[14px] py-[10px] ${
            targetParam ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
          }`}
        >
          <LuListFilter className="w-5 " />
          {targetParam ? capitalizeWords(targetParam) : 'Target'}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 text-[#0E2354] font-[400]"
        >
          {targetFilters.map((target, key) => (
            <li key={key}>
              <button
                className={`dark:text-gray-300 ${targetParam === target ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : ''}`}
                onClick={() => showTargetAndApply(target)}
                style={{ textTransform: "capitalize" }}
              >
                {capitalizeWords(target)}
                {targetParam === target && <span className="ml-2">✓</span>}
              </button>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <button
              className="dark:text-gray-300"
              onClick={() => removeAppliedFilter()}
            >
              Remove Filter
            </button>
          </li>
        </ul>
      </div>
      {/* Delete Logs Button */}
      <button
        className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-semibold"
        onClick={onDeleteLogsClick}
      >
        Delete Logs
      </button>
    </div>
  );
};

// DeleteLogsModal component
const DeleteLogsModal = ({ show, onClose, onDelete }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateFilterReady = !!(startDate && endDate);

  // Clear error when dates or modal open/close changes
  useEffect(() => {
    setError("");
  }, [startDate, endDate, show]);

  const handleDelete = async () => {
    setConfirming(false);
    setLoading(true);
    setError("");
    try {
      // Use local date string formatting
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const res = await deleteLogsByDateRange({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });
      if (!res.ok) throw new Error(res.error || "Failed to delete logs.");
      setLoading(false);
      onDelete();
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Failed to delete logs.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 min-w-[340px] relative">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Delete Logs</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate || new Date()}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              popperClassName="custom-datepicker-popper"
              customInput={
                <CustomInput 
                  placeholder="Start Date" 
                  onClear={() => setStartDate(null)}
                />
              }
            />
            <span className="text-[14px] font-[300] mx-2">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
              popperClassName="custom-datepicker-popper"
              customInput={
                <CustomInput 
                  placeholder="End Date" 
                  onClear={() => setEndDate(null)}
                  isEndDate={true}
                />
              }
            />
          </div>
          {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-semibold"
            onClick={() => { setError(""); onClose(); }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-60"
            disabled={!dateFilterReady || loading}
            onClick={() => setConfirming(true)}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
        {/* Confirmation Dialog */}
        {confirming && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 min-w-[320px]">
              <div className="mb-4 text-base dark:text-white">
                Are you sure you want to delete the logs for this range?
                <br />
                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  {startDate?.toLocaleDateString('en-GB')} - {endDate?.toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-semibold"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Logs() {
  const [logs, setLogs] = useState([]);
  const [originalLogs, setOriginalLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [filteredLogs, setFilteredLogs] = useState("");
  const [filterParam, setFilterParam] = useState("");
  const [targetParam, setTargetParam] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateFilterReady, setDateFilterReady] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const removeFilter = () => {
    setFilteredLogs("");
    setFilterParam("");
    setTargetParam("");
    setCurrentPage(1);
    setSearchValue("");
    setDebouncedValue("");
    setStartDate(null);
    setEndDate(null);
    setDateFilterReady(false);
  };

  const applyFilter = ({ outcome, target }) => {
    setFilterParam(outcome || "");
    setTargetParam(target || "");
    setFilteredLogs({ outcome, target });
    setCurrentPage(1);
  };

  // Update date filter ready state when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      setDateFilterReady(true);
    } else {
      setDateFilterReady(false);
    }
  }, [startDate, endDate]);

  function handleSearchInput(value) {
    if (value.length >= 3 || value.trim() === "") {
      setSearchValue(value);
    }
  }

  // Pagination logic
  const currentLogs = logs;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 700); // debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    async function fetchRoleData() {
      let query = { page: currentPage };
      if (debouncedValue) query.search = debouncedValue;
      if (filterParam) query.status = filterParam;
      if (targetParam) query.entity = targetParam;
      // Use local date string formatting to avoid UTC shift
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      if (dateFilterReady && startDate && endDate) {
        query.startDate = formatDate(startDate);
        query.endDate = formatDate(endDate);
      }
      const response = await userLogs(query);
      setLogs(response.logs ?? []);
      setOriginalLogs(response.logs ?? []); // Store the original unfiltered data
      setTotalPages(response.pagination?.totalPages || 0);
    }
    fetchRoleData();
  }, [
    currentPage,
    debouncedValue,
    filterParam,
    targetParam,
    dateFilterReady,
  ]);

  return (
    <div className="relative min-h-full">
      <TitleCard
        title={"Logs"}
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            filterParam={filterParam}
            targetParam={targetParam}
            setTargetParam={setTargetParam}
            setFilterParam={setFilterParam}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onDeleteLogsClick={() => setShowDeleteModal(true)}
            dateFilterReady={dateFilterReady}
          />
        }
      >
        <div className="min-h-[30rem] flex flex-col justify-between">
          <div className="overflow-x-auto w-full border dark:border-stone-600 rounded-2xl">
            <table className="table text-center min-w-full dark:text-[white]">
              <thead className="" style={{ borderRadius: "" }}>
                <tr
                  className="!capitalize"
                  style={{ textTransform: "capitalize" }}
                >
                  <th
                    className="font-medium text-[12px] text-left font-poppins leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white] text-[#42526D] px-[20px] py-[13px] !capitalize"
                    style={{ position: "static", width: "210px" }}
                  >
                    Action Perfomed
                  </th>
                  <th className="text-[#42526D] w-[150px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                    Action Type
                  </th>
                  <th className="text-[#42526D] w-[212px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                    Performed By
                  </th>
                  <th className="text-[#42526D] w-[150px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize">
                    Target
                  </th>
                  {/* <th className="text-[#42526D] w-[141px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] !capitalize text-center">
                    IP Address
                  </th> */}
                  <th className="text-[#42526D] w-[177px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">
                    Outcome
                  </th>
                  <th className="text-[#42526D] w-[217px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">
                    Date Time
                  </th>
                  <th className="text-[#42526D] w-[130px] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] dark:bg-slate-700 dark:text-[white]  px-[20px] py-[13px] text-center !capitalize">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {Array.isArray(logs) && currentLogs.length > 0 ? (
                  currentLogs?.map((log, index) => {
                    return (
                      <tr
                        key={index}
                        className="font-light "
                        style={{ height: "65px" }}
                      >
                        <td
                          className={`font-poppins h-[65px] truncate font-normal text-[14px] leading-normal text-[#101828] p-[10px] pl-5 flex items-center`}
                        >
                          <div className="flex flex-col">
                            <p className="dark:text-[white]">
                              {log.action_performed}
                            </p>
                          </div>
                        </td>

                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">{log?.actionType || "N/A"}</span>
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">
                            {TruncateText(log?.user?.user?.name, 12) || "N/A"}
                          </span>
                        </td>

                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">{log?.entity || "N/A"}</span>
                        </td>
                        {/* <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]">
                          <span className="">
                            {log?.ipAddress?.slice(7, this?.length) || "N/A"}
                          </span>
                        </td> */}
                        <td
                          className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[10px] dark:text-[white]"
                          style={{ whiteSpace: "wrap" }}
                        >
                          <span className="">
                            <p
                              className={`w-[85px] mx-auto 
                                before:content-['•'] before:text-2xl 
                                flex h-7 items-center text-[12px] 
                                justify-center gap-1 px-1 py-0 font-[500] 
                                ${
                                  log?.outcome === "Success"
                                    ? "text-green-600 bg-green-100 before:text-green-600 px-1"
                                    : log?.outcome === "Failed"
                                    ? "text-red-600 bg-red-100 before:text-red-600"
                                    : "text-stone-600 bg-stone-100 before:text-stone-600"
                                } rounded-2xl`}
                              style={{ textTransform: "capitalize" }}
                            >
                              {capitalizeWords(log?.outcome) || "N/A"}
                            </p>
                          </span>
                        </td>
                        <td className="font-poppins font-light text-[12px] leading-normal text-[#101828] px-[16px] py-[10px] dark:text-[white]">
                          {formatTimestamp(log?.timestamp) || "N/A"}
                        </td>
                        <td className="font-poppins font-light text-[14px] leading-normal text-[#101828] px-[26px] py-[8px] dark:text-[white]">
                          <div className="w-fit mx-auto flex gap-[15px] justify-center border border border-[1px] border-[#E6E7EC] dark:border-stone-400 rounded-[8px] p-[13.6px] py-[10px]">
                            <button
                              onClick={() => {
                                setSelectedLogs(log);
                                setShowDetailsModal(true);
                              }}
                            >
                              <span className="flex items-center gap-1 rounded-md text-[#101828]">
                                <FiEye
                                  className="w-5 h-6  text-[#3b4152] dark:text-stone-200"
                                  strokeWidth={1}
                                />
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-[14px]">
                    <td colSpan={8}>No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <Paginations
            data={logs}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </TitleCard>

      {/* log Details Modal */}
      <ShowLogs
        log={selectedLogs}
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* Delete Logs Modal */}
      <DeleteLogsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => {
          setShowDeleteModal(false);
          setCurrentPage(1); // Optionally reset to first page
          // Re-fetch logs
          setTimeout(() => {
            // Wait a moment for backend to process
            window.location.reload(); // Or trigger a state update to re-fetch logs
          }, 500);
        }}
      />
    </div>
  );
}

export default Logs;
