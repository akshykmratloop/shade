import InputText from "../components/Input/InputText";
import Button from "../components/Button/Button";
import { X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { resetPassword } from "../app/fetch";
import { useSelector } from "react-redux";
import PasswordValidation from "../features/user/components/PasswordValidation";
import validator from "../app/valid";
import ErrorText from "../components/Typography/ErrorText";
import updateToasify from "../app/toastify";
import xSign from "../assets/x-close.png"


const ResetPass = ({ display, close }) => {
    const email = useSelector(state => {
        console.log(state)
        return state
    })
    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        new_password: "",
        repeat_password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const updateFormValue = ({ updateType, value }) => {
        // Handling the password Object
        setErrorMessage("")
        setPasswordForm(prev => {
            return { ...prev, [updateType]: value } // key == [updateType], value == value
        })
    }

    const submitForm = (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading("Reseting Password", { autoClose: 2000 })
        const validation = validator(passwordForm, setErrorMessage) // checks if any field is empty
        if (!validation) {
            updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
            return
        };
        if (passwordForm.new_password !== passwordForm.repeat_password) {
            return setErrorMessage(
                "The passwords do not match. Please make sure both password fields are the same."
            );
        }

    }
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 bg-base-200 bg-opacity-50 ${display}`}>
            <div className="relative p-24 shadow-lg rounded-md w-full max-w-lg bg-base-300">

                {/* Close Button */}
                <button

                    className="absolute top-4 right-4 text-stone-500 hover:text-stone-700"
                >
                    <X onClick={close} size={24} />
                </button>

                <h1 className="text-lg font-semibold mb-6 text-center">Reset Password</h1>

                <form onSubmit={submitForm}>
                    <InputText placeholder="Enter current password"
                        type={"password"}
                        name={"currentPassword"}
                        defaultValue={passwordForm.old_password}
                        updateType="old_password"
                        containerStyle="my-2"
                        updateFormValue={updateFormValue} />
                    <InputText placeholder="Enter new password"
                        type={"password"}
                        name={"newPassword"}
                        defaultValue={passwordForm.new_password}
                        updateType="new_password"
                        containerStyle="my-2"
                        updateFormValue={updateFormValue} />
                    <InputText placeholder="Confirm new password"
                        type={"password"}
                        name={"reapeatPassword"}
                        defaultValue={passwordForm.repeat_password}
                        updateType="repeat_password"
                        containerStyle="my-2"
                        updateFormValue={updateFormValue} />
                    <PasswordValidation new_password={passwordForm.new_password} />

                    <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
                        <img src={xSign} alt="" className='h-3 translate-y-[4px]' />
                        {errorMessage}</ErrorText>
                    <Button text="Reset" classes={"btn mt-4 w-full btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800"} />
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ResetPass