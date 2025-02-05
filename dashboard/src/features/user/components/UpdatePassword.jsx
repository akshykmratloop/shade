import { useState } from "react";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import Button from "../../../components/Button/Button";
import xSign from "../../../assets/x-close.png";
import checkSign from "../../../assets/check.png"
import { PassUpdate } from "../../../app/fetch";

const passwordValidationRules = [
    {
        text: "Password must be at least 8 characters long.",
        test: (password) => password.length >= 8,
    },
    {
        text: "Password must contain at least one uppercase letter.",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        text: "Password must contain at least one lowercase letter.",
        test: (password) => /[a-z]/.test(password),
    },
    {
        text: "Password must contain at least one digit.",
        test: (password) => /\d/.test(password),
    },
    {
        text: "Password must contain at least one special character (@, $, !, %, *, ?, &).",
        test: (password) => /[@$!%*?&]/.test(password),
    },
];

const UpdatePassword = ({ userObj }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwords, setPasswords] = useState({
        new_password: "",
        repeat_password: "",
    });

    const [validationStatus, setValidationStatus] = useState(
        passwordValidationRules.map(() => false)
    );

    const validatePassword = (password) => {
        const status = passwordValidationRules.map((rule) => rule.test(password));
        setValidationStatus(status);
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setPasswords((prev) => ({ ...prev, [updateType]: value }));
        if (updateType === "new_password") validatePassword(value);
    };

    const submitForm = async (e) => {
        e.preventDefault();
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
        console.log(response);
    };

    return (
        <form>
            <p className="my-8 text-stone-500">
                Verification successful! Please set a new password. Use a strong password for better security.
            </p>

            <div className="mb-4 relative">
                <InputText
                    placeholder={"Enter Your New Password"}
                    name={"password"}
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
            <ul className={`${passwords.new_password.length>0?"block":"hidden"}`}>
                {passwordValidationRules.map((rule, index) => (
                    <li
                        key={index}
                        className={`text-sm flex gap-1 ${validationStatus[index] ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        <img src={validationStatus[index]?checkSign:xSign} className="h-3 translate-y-[4px]" /> {rule.text}
                    </li>
                ))}
            </ul>

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
