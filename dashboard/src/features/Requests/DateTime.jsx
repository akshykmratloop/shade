import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimeCustom.css";
import CloseModalButton from "../../components/Button/CloseButton";
import { schedulePublish } from "../../app/fetch";
import { runToast } from "../Component/ToastPlacer";
import { isSameDay } from "date-fns";

const DateTime = ({ onClose, display, requestId, parentClose }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState(""); // Empty for placeholder
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [showTimePopup, setShowTimePopup] = useState(false);

    const modalRef = useRef(null);
    const timePopupRef = useRef(null);

    const now = new Date();

    const isToday = date && isSameDay(date, now);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();


    const closeModal = () => onClose(false);

    const handleTimeClick = () => {
        setShowTimePopup(true);
    };

    const handleHourSelect = (selectedHour) => {
        setHour(selectedHour);
        const newTime = `${selectedHour}:${minute || "00"}`;
        setTime(newTime);
    };

    const handleMinuteSelect = (selectedMinute) => {
        setMinute(selectedMinute);
        const newTime = `${hour || "00"}:${selectedMinute}`;
        setTime(newTime);
        setShowTimePopup(false);
    };

    const SubmitDate = async () => {
        if (!date || hour === "" || minute === "") {
            console.error("Date, hour, or minute not selected.");
            return;
        }

        const finalDate = new Date(date);          // clone the chosen day
        finalDate.setHours(Number(hour));
        finalDate.setMinutes(Number(minute), 0, 0);

        if (finalDate < new Date()) {              // ⛔ still in the past
            alert("Please choose a future date and time.");
            return;
        }

        const isoTimestamp = finalDate.toISOString();

        // Now you can use this ISO string as needed
        try {
            const response = await schedulePublish(requestId, { date: isoTimestamp })
            // console.log(response)
            if (response.ok) {
                runToast("SUCCESS", "Request has been scheduled to publish")
                closeModal()
                parentClose()
            } else {
                // Throw new Error("")
                runToast("ERROR", "An Error Occured")
            }
        } catch (err) {
            console.error(err)
            runToast("ERROR", err.message || "An Error Occured")
        }
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (display) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [display]);

    useEffect(() => {
        const handleClickOutsideTimePopup = (event) => {
            if (
                timePopupRef.current &&
                !timePopupRef.current.contains(event.target) &&
                !event.target.closest(".react-datepicker") && // allow clicks on datepicker popup
                !event.target.closest(".time-input") // allow clicking on time input
            ) {
                setShowTimePopup(false);
            }
        };

        if (showTimePopup) {
            document.addEventListener("mousedown", handleClickOutsideTimePopup);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideTimePopup);
        };
    }, [showTimePopup]);

    return (
        <div
            className="w-screen h-screen fixed top-0 left-0 z-[52] bg-black/40 font-poppins"
            style={{ display: display ? "block" : "none" }}
        >
            <div
                className="w-[420px] dark:bg-[#232b3a] absolute z-[55] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700"
                ref={modalRef}
            >
                <h2 className="font-semibold text-[20px] mb-4 text-[#29469D] dark:text-white tracking-wide">Publish Schedule</h2>
                <CloseModalButton onClickClose={closeModal} />
                <div className="flex flex-col gap-6 mt-2">
                    <div className="flex gap-4 mt-2 bg-[#f7f8fa] dark:bg-[#232b3a] rounded-lg px-6 py-6 border border-gray-100 dark:border-gray-700">
                        {/* Date Picker */}
                        <div className="w-1/2 flex flex-col">
                            <label className="block mb-2 text-[14px] font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <DatePicker
                                selected={date}
                                onChange={(d) => setDate(d)}
                                minDate={now}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Select a date"
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black dark:bg-[#232b3a] dark:text-white dark:border-gray-600 text-[15px] datepicker-input"
                                popperClassName="z-[9999] custom-datepicker-popper"
                            />
                        </div>
                        {/* Time Picker */}
                        <div className="w-1/2 flex flex-col relative">
                            <label className="block mb-2 text-[14px] font-medium text-gray-700 dark:text-gray-300">Time</label>
                            <input
                                type="text"
                                value={time}
                                onFocus={handleTimeClick}
                                readOnly
                                placeholder="Select a time"
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 time-input text-black dark:bg-[#232b3a] dark:text-white dark:border-gray-600 text-[15px] cursor-pointer"
                            />
                            {showTimePopup && (
                                <div
                                    ref={timePopupRef}
                                    className="absolute left-0 top-full mt-2 flex gap-3 bg-white dark:bg-[#232b3a] p-4 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 min-w-[180px] custom-time-popup"
                                >
                                    {/* Hour Picker */}
                                    <div>
                                        <div className="mb-2 text-[13px] font-semibold text-gray-700 dark:text-gray-300">Hour</div>
                                        <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto hideScroller">
                                            {Array.from({ length: 24 }, (_, i) => {
                                                const value = String(i).padStart(2, "0");
                                                const tooPast = isToday && i < currentHour;
                                                return (
                                                    <button
                                                        key={value}
                                                        className="px-2 py-1 text-[15px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 font-medium transition-colors"
                                                        onClick={() => handleHourSelect(value)}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {/* Minute Picker */}
                                    <div>
                                        <div className="mb-2 text-[13px] font-semibold text-gray-700 dark:text-gray-300">Minute</div>
                                        <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto hideScroller">
                                            {Array.from({ length: 60 }, (_, i) => {
                                                const value = String(i).padStart(2, "0");
                                                const tooPast =
                                                    isToday &&
                                                    Number(hour) === currentHour &&                // same hour
                                                    i < currentMinute;                             // but minute already passed
                                                return (
                                                    <button
                                                        key={value}
                                                        className="px-2 py-1 text-[15px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 font-medium transition-colors"
                                                        onClick={() => handleMinuteSelect(value)}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end text-[15px] mt-4">
                        <button onClick={() => closeModal()} className="bg-red-600 font-[500] py-2 rounded-lg text-white w-[110px] shadow-sm hover:bg-red-700 transition-colors">Cancel</button>
                        <button onClick={() => SubmitDate()} className="bg-[#29469D] font-[500] py-2 rounded-lg text-white w-[110px] shadow-sm hover:bg-blue-800 transition-colors">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTime;
