// ToastController.js
import { useState, useEffect } from "react";
import ToasterUI from "./Toaster";

let toastController = {
    runToast: () => {
        // throw new Error("ToastPlacer is not mounted yet.");
    },
};

const ToastPlacer = () => {
    const [toastUp, setToastUp] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        toastController.runToast = (type, message) => {
            setType(type);
            setMessage(message);
            setToastUp(true);
            if (type === "LOAD") {
                setTimeout(() => setToastUp(false), 10000); // optional auto-close
            } else {
                setTimeout(() => setToastUp(false), 2000); // optional auto-close
            }
        };
    }, []);

    return (
        <div className="fixed top-4 right-4"
        style={{zIndex: "60"}}
        >
            {toastUp && <ToasterUI type={type} message={message} />}
        </div>
    );
};

export const runToast = (...args) => toastController.runToast(...args);

export default ToastPlacer;
