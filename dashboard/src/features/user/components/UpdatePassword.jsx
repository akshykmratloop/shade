import { useState } from "react";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import Button from "../../../components/Button/Button";
import xSign from "../../../assets/x-close.png";
import { PassUpdate } from "../../../app/fetch";



const UpdatePassword = ({ userObj }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwords, setPasswords] = useState({
        new_password: "",
        repeat_password: ""
    })

    const passwordValidationObject = [
        {
            text: "Password must be at least 8 characters long.",
            status: true
        },{
            text: "Password must contain at least one uppercase letter.",
            status: true
        },{
            text: "Password must contain at least one lowercase letter.",
            status: false
        },{
            text: "Password must contain at least one digit.",
            status: false
        },{
            text: "Password must contain at least one special character (@, $, !, %, *, ?, &).",
            status: false
        }
    ]

    const passwordValidation = (password) => {
        if (password.length < 8) {
            passwordValidationObject[0].update(0)
        } else passwordValidationObject[0].update(1)
        if (!/[A-Z]/.test(password)) {
            passwordValidationObject[1].update(0)
        } else passwordValidationObject[1].update(1)
        if (!/[a-z]/.test(password)) {
            passwordValidationObject[2].update(0)
        } else passwordValidationObject[2].update(1)
        if (!/\d/.test(password)) {
            passwordValidationObject[3].update(0)
        } else passwordValidationObject[3].update(1)
        if (!/[@$!%*?&]/.test(password)) {
            passwordValidationObject[1].update(0)
        } else passwordValidationObject[1].update(1)
    };

    const updateFormValue = ({ updateType, value }) => {
        // Handling the login Object
        setErrorMessage("")
        setPasswords(prev => {
            return { ...prev, [updateType]: value } // key == [updateType], value == value
        })

        passwordValidation(value)
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.repeat_password) {
            return setErrorMessage("The passwords do not match. Please make sure both password fields are the same.")
        }
        const paylaod = {
            new_password: passwords.new_password,
            repeat_password: passwords.repeat_password,
            email: userObj.email,
            otpOrigin: userObj.otpOrigin,
            deviceId: userObj.deviceId
        }
        const response = await PassUpdate(paylaod);
        console.log(response)
    }

    return (
        <form>
            <div className="mb-4 relative">
                <InputText placeholder={"Enter Your New Password"} name={"password"} type="password" updateType="new_password" containerStyle="mt-4" labelTitle="New Password" updateFormValue={updateFormValue} />
                <InputText name={"password"} placeholder={"Confirm Your New Password"} type="password" updateType="repeat_password" containerStyle="mt-4" labelTitle="Confirm New Password" updateFormValue={updateFormValue} />
            </div>

            <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
                <img src={xSign} className='h-3 translate-y-[4px]' />
                {errorMessage}</ErrorText>
            <Button functioning={submitForm} text={"Submit"} type="submit" classes={"btn mt-2 w-full btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} />
        </form>
    )
}

export default UpdatePassword