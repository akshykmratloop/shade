import React from 'react';
import styled from "@/common/button.module.scss"
import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

const Button = ({ className, onClick, type = "button",children }) => {
    return (
        <button type={type} className={`${className } ${BankGothic.className} ${styled.primary}`} onClick={onClick}>{children}</button>
    )
}

export default Button
