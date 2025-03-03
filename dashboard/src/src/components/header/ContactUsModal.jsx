"use client";

import ModalPortal from "@/common/ModalPortal";
import React, { useState } from "react";
import styles from "@/components/header/Header.module.scss";
import Image from "next/image";
import localFont from "next/font/local";
import Button from "@/common/Button";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

import { useGlobalContext } from "../../contexts/GlobalContext";

const ContactUsModal = ({ isModal, onClose }) => {
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

  const { language, content } = useGlobalContext();
  const currentContent = content?.contactUsModal;

  return (
    <ModalPortal
      childClassName={`${styles.contact_modal_wrapper}`}
      show={isModal}
      onClose={onClose}
    >
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`${styles.header_wrap} `}
      >
        <h1
          className={`${styles.heading} ${BankGothic.className}`}
        >
          {currentContent?.title[language]}
        </h1>
        <button className={styles.close_btn} onClick={onClose}>
          <Image
            src="https://loopwebsite.s3.ap-south-1.amazonaws.com/basil_cross-solid.svg"
            alt=""
            width="28"
            height="28"
          />
        </button>
      </div>

      <div className={styles.modal_Body}>
        {currentContent?.modalBody?.inputs?.map((input, index) => (
          <div
            key={index}
            className={`${styles.form_wrapper} ${
              language === "en" && styles.leftAlign
            }`}
          >
            <input
              type={input.type}
              name={input.name}
              placeholder={input?.placeholder[language]}
              value={formData[input.name]}
              onChange={handleChange}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`${styles.form_input}`}
            />
          </div>
        ))}

        {currentContent?.modalBody?.textArea?.map((textArea, index) => (
          <div key={index} className={styles.form_wrapper}>
            <textarea
              type={textArea.type}
              name={textArea.name}
              placeholder={textArea?.placeholder[language]}
              row="10"
              dir={language === "ar" ? "rtl" : "ltr"}
              //   value={formData[textArea.name]}
              //   onChange={handleChange}
              className={styles.form_inputarea}
            />
          </div>
        ))}

        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className={`${styles.btn_group} ${language === "en" && styles.centerBtn}`}
        >
          <Button type="button" className={styles.apply_btn}>
            {currentContent?.modalBody?.buttons[0]?.text[language]}
          </Button>
          <Button type="button" className={styles.close_btn} onClick={onClose}>
            {currentContent?.modalBody?.buttons[1]?.text[language]}
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ContactUsModal;
