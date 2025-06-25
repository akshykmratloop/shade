import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
            className="w-screen h-screen fixed top-0 left-0 z-[52] bg-black/40"
            style={{ display: display ? "block" : "none" }}
        >
            <div
                className="w-[45%] dark:bg-[#1e293b] absolute z-[55] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4  bg-white p-10 shadow-2xl rounded-md"
                ref={modalRef}
            >
                <h2 className="font-[500] text-[18px]">Publish Schedule</h2>
                <CloseModalButton onClickClose={closeModal} />
                <div className="flex flex-col gap-6">

                    <div className="flex gap-6 mt-6 shadow-[0px_1px_5px_#00000050] rounded-md px-10 py-5">
                        {/* Date Picker */}
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium">Date:</label>
                            <DatePicker
                                selected={date}
                                onChange={(d) => setDate(d)}
                                minDate={now}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Select a date"
                                className="w-full h-[5vh] px-3 py-2 border border-gray-400 rounded-md 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                            bg-white text-black dark:bg-[#1e293b] dark:text-white
                                            dark:border-gray-600"
                            />
                        </div>

                        {/* Time Picker */}
                        <div className="w-1/2 relative">
                            <label className="block mb-2 font-medium">Select Time:</label>
                            <input
                                type="text"
                                value={time}
                                onFocus={handleTimeClick}
                                readOnly
                                placeholder="Select a time"
                                className="w-full h-[5vh] px-3 py-2 text-xs border 
                                            border-gray-400 rounded-md focus:outline-none 
                                            focus:ring-2 focus:ring-blue-500 time-input 
                                            text-black dark:bg-[#1e293b] dark:text-white 
                                            dark:border-gray-600"
                            />

                            {showTimePopup && (
                                <div
                                    ref={timePopupRef}
                                    className="absolute top-full mt-2 flex gap-4 bg-white p-4 shadow-[0_4px_10px_#00000056] shadow-lg z-50"
                                >
                                    {/* Hour Picker */}
                                    <div>
                                        <h4 className="mb-2 font-semibold text-sm text-gray-700">Hour</h4>
                                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto overflow-x-hidden hideScroller">
                                            {Array.from({ length: 24 }, (_, i) => {
                                                const value = String(i).padStart(2, "0");
                                                const tooPast = isToday && i < currentHour;
                                                return (
                                                    <button
                                                        key={value}
                                                        disabled={tooPast}
                                                        className={`px-2 py-1 text-[14px] border rounded
                                                                        hover:bg-blue-100
                                                                        ${tooPast ? "opacity-40 cursor-not-allowed" : ""}`}
                                                        onClick={() => !tooPast && handleHourSelect(value)}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Minute Picker */}
                                    <div>
                                        <h4 className="mb-2 font-semibold text-sm text-gray-700">Minute</h4>
                                        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-scroll overflow-x-hidden hideScroller">
                                            {Array.from({ length: 60 }, (_, i) => {
                                                const value = String(i).padStart(2, "0");
                                                const tooPast =
                                                    isToday &&
                                                    Number(hour) === currentHour &&                // same hour
                                                    i < currentMinute;                             // but minute already passed
                                                return (
                                                    <button
                                                        key={value}
                                                        disabled={tooPast}
                                                        className={`px-2 py-1 text-[14px] border rounded
                                                                    hover:bg-blue-100
                                                                    ${tooPast ? "opacity-40 cursor-not-allowed" : ""}`}
                                                        onClick={() => !tooPast && handleMinuteSelect(value)}
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

                    <div className="flex gap-2 justify-end text-sm">
                        <button onClick={() => closeModal()} className="bg-red-600 align-center font-[300] py-2 rounded-[4px] text-[white] w-[150px]">Cancel</button>
                        <button onClick={() => SubmitDate()} className="bg-[#29469D] align-center font-[300] py-2 rounded-[4px] text-[white] w-[150px]">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTime;
