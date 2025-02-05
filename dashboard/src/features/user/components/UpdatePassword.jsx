import { useState } from "react";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import Button from "../../../components/Button/Button";
import xSign from "../../../assets/x-close.png";
import { PassUpdate } from "../../../app/fetch";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordValidation from "./PasswordValidation";

const UpdatePassword = ({ userObj }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwords, setPasswords] = useState({
        new_password: "",
        repeat_password: "",
    });

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setPasswords((prev) => ({ ...prev, [updateType]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (passwords.new_password !== passwords.repeat_password) {
            return setErrorMessage(
                "The passwords do not match. Please make sure both password fields are the same."
            );
        }
        const paylaod = {
            new_password: passwords.new_password,
            repeat_password: passwords.repeat_password,
            email: userObj.email,
            otpOrigin: userObj.otpOrigin,
            deviceId: userObj.deviceId,
        };
        const response = await PassUpdate(paylaod);
        if(response.ok){
            toast.success(response.message);
            setTimeout(() => {
                navigate("/login")
            }, 1000)
        }else{
            setLoading(false)
            toast.error(response.message);
        }
    };

    return (
        <form>
            <p className="my-8 text-stone-500">
                Verification successful! Please set a new password. Use a strong password for better security.
            </p>

            <div className="mb-4 relative">
                <InputText
                    name={"password"}
                    placeholder={"Enter Your New Password"}
                    type="password"
                    updateType="new_password"
                    containerStyle="mt-4"
                    labelTitle="New Password"
                    updateFormValue={updateFormValue}
                />
                <InputText
                    name={"password"}
                    placeholder={"Confirm Your New Password"}
                    type="password"
                    updateType="repeat_password"
                    containerStyle="mt-4"
                    labelTitle="Confirm New Password"
                    updateFormValue={updateFormValue}
                />
            </div>

            {/* Password Validation Checklist */}
            <PasswordValidation new_password={passwords.new_password} />

            <ErrorText
                styleClass={`${errorMessage ? "visible" : "invisible"
                    } flex mt-6 text-sm gap-1 justify-center`}
            >
                <img src={xSign} className="h-3 translate-y-[4px]" />
                {errorMessage}
            </ErrorText>
            <Button
                functioning={submitForm}
                text={"Submit"}
                type="submit"
                classes={
                    "btn mt-2 w-full btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" +
                    (loading ? " loading" : "")
                }
            />
        </form>
    );
};

export default UpdatePassword;
