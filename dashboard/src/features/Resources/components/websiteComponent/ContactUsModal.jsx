import ModalPortal from "./ModalPortal";
import React, { useEffect, useState } from "react";
import content from './content.json'
import { updateContent } from "../../../common/homeContentSlice";
import { useDispatch, useSelector } from "react-redux";

// import { useGlobalContext } from "../../contexts/GlobalContext";

const ContactUsModal = ({ isModal, onClose, language, screen, currentContent }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        walletLink: "",
        file: null,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            file: e.target.files[0],
        }));
    };


    useEffect(() => {
        dispatch(updateContent({ currentPath: "contactUsModal", payload: content.contactUsModal }))
    }, [])
    return (
        <div>
            <div
                dir={language === "ar" ? "rtl" : "ltr"}
                className="bg-gradient-to-r from-[#0b369c] to-[#00b9f2] px-8 py-5 flex items-center justify-between"
            >
                <h1 className="text-white text-[24px] font-bold leading-[25px] uppercase">
                    {currentContent?.title[language]}
                </h1>
                <button onClick={onClose} className="bg-transparent border-0 leading-none cursor-pointer">
                    <img
                        src="https://loopwebsite.s3.ap-south-1.amazonaws.com/basil_cross-solid.svg"
                        alt=""
                        width="28"
                        height="28"
                    />
                </button>
            </div>

            <div className="px-16 py-12">
                {currentContent?.modalBody?.inputs?.map((input, index) => (
                    <div
                        key={index}
                        className={`mb-6 ${language === "en" ? "text-left" : ""}`}
                    >
                        <input
                            type={input.type}
                            name={input.name}
                            placeholder={input?.placeholder[language]}
                            value={formData[input.name]}
                            onChange={handleChange}
                            dir={language === "ar" ? "rtl" : "ltr"}
                            className="w-full p-2 px-4 text-[14px] leading-6 font-light text-black/70 border border-gray-300 rounded-lg bg-white uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                ))}

                {currentContent?.modalBody?.textArea?.map((textArea, index) => (
                    <div key={index} className="mb-6">
                        <textarea
                            name={textArea.name}
                            placeholder={textArea?.placeholder[language]}
                            rows="6"
                            dir={language === "ar" ? "rtl" : "ltr"}
                            className="w-full p-4 text-[14px] leading-6 font-light text-black/70 border border-gray-300 rounded-lg bg-white uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                ))}

                <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className={`flex items-center ${language === "en" ? "justify-center" : "justify-end"} gap-4`}
                >
                    <button type="button" className="px-4 pt-[13px] pb-2 bg-primary text-white rounded-md shadow-md">
                        {currentContent?.modalBody?.buttons[0]?.text[language]}
                    </button>
                    <button
                        type="button"
                        className="px-4 pt-[13px] pb-2 rounded-md opacity-80 bg-[#da2c1e] shadow-[0_10px_20px_rgba(192,192,192,0.15)] text-white"
                        onClick={onClose}
                    >
                        {currentContent?.modalBody?.buttons[1]?.text[language]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactUsModal;
