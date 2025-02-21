import { useEffect, useState } from "react";
import InputText from "../../../components/Input/InputText";
import Button from "../../../components/Button/Button";
import { PassUpdate } from "../../../app/fetch";
import { useNavigate } from "react-router-dom";
import PasswordValidation, { validatePasswordMessage } from "./PasswordValidation";
import { toast } from "react-toastify";
import validator from "../../../app/valid";

const UpdatePassword = ({ userObj }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [errorPassMessage, setErrorPassMessage] = useState("");
    const [errorConfPassMessage, setConfPassMessage] = useState("");
    const [formObj, setFormObj] = useState(userObj);
    const [passwords, setPasswords] = useState({
        new_password: "",
        repeat_password: "",
    });

    const updateFormValue = ({ updateType, value }) => {
        setConfPassMessage("");
        setErrorPassMessage("")
        setPasswords((prev) => ({ ...prev, [updateType]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true)

        // check the empty fields
        let emptyFields = validator(passwords, { new_password: setErrorPassMessage, repeat_password: setConfPassMessage })

        // check if the both passwords match
        if (passwords.new_password !== passwords.repeat_password) {
            setConfPassMessage(
                "The passwords do not match."
            );
            return setLoading(false)
        }

        // validate password if it met the requirements
        let validatePassword = validatePasswordMessage(passwords.new_password)
        if (!emptyFields || !validatePassword) {
            return setLoading(false);
        }

        // payload for the request
        const payload = {
            new_password: passwords.new_password,
            repeat_password: passwords.repeat_password,
            email: formObj?.email,
            otpOrigin: formObj?.otpOrigin,
            deviceId: formObj?.deviceId,
        };
        const response = await PassUpdate(payload); // request for new password
        if (response.ok) { // if everything goes correctly
            toast.success(response.message); // the success message
            setTimeout(() => {
                navigate("/login") // navigating to the login page after 1 sec
            }, 1000)
        } else {
            setLoading(false) // if something went wrong
            toast.error(response.message);
        }
    };

    useEffect(() => {
        const Theme = localStorage.getItem("theme")
        setFormObj(prev => JSON.parse(localStorage.getItem("forgot_Pass")))
        localStorage.clear() // clearing the otp state
        localStorage.setItem("theme", Theme)
        
    }, []);

    useEffect(() => {
        const handleBackButton = () => {
            // toast.warn("Password reset was interrupted. Please try again!", { autoClose: 3000 });
            alert("Password reset was interrupted. Please try again!")
        };
    
        window.addEventListener("popstate", handleBackButton);
    
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);

    return (
        <form>
            <p className="my-2 text-stone-500">
                Verification successful! Please set a new password. Use a strong password for better security.
            </p>

            <div className="mb-1 relative flex flex-col">
                <InputText
                    name={"password"}
                    placeholder={"Enter Your New Password"}
                    type="password"
                    updateType="new_password"
                    containerStyle="mt-4"
                    labelTitle="New Password"
                    updateFormValue={updateFormValue}
                    errorMessage={errorPassMessage} 
                />
                <InputText
                    name={"password"}
                    placeholder={"Confirm Your New Password"}
                    type="password"
                    updateType="repeat_password"
                    containerStyle="mt-4"
                    labelTitle="Confirm New Password"
                    updateFormValue={updateFormValue}
                    errorMessage={errorConfPassMessage}
                />
            </div>

            {/* Password Validation Checklist */}
            <PasswordValidation new_password={passwords.new_password} />
            <Button
                functioning={submitForm}
                text={"Submit"}
                type="submit"
                classes={
                    "btn mt-4 w-full btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" +
                    (loading ? " loading" : "")
                }
            />
        </form>
    );
};

export default UpdatePassword;
