// import { useState } from "react";
// import InputText from "../../components/Input/InputText";
// import ErrorText from "../../components/Typography/ErrorText";
// import Joi from "joi"; // Import Joi for validation

import InputText from "../../components/Input/InputText";
import Button from "../../components/Button/Button";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { resetPassword } from "../../app/fetch";
import { useSelector } from "react-redux";
import PasswordValidation from "./components/PasswordValidation";
import validator from "../../app/valid";
import ErrorText from "../../components/Typography/ErrorText";
import updateToasify from "../../app/toastify";
import xSign from "../../assets/x-close.png"
import { useNavigate } from "react-router-dom";

// const passwordSchema = Joi.string()
//   .min(8)
//   .max(30)
//   .pattern(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//   )
//   .required()
//   .messages({
//     "string.empty": "Required",
//     "string.min": "Password must be at least 8 characters",
//     "string.max": "Password must be at most 30 characters",
//     "string.pattern.base":
//       "Password must contain at least one lowercase letter, one uppercase letter, one digit and one special character",
//   });

function ResetPasswordModalBody({ closeModal, close }) {
  const navigate = useNavigate()
  const email = useSelector(state => {
    console.log(state)
    return state.user.user.email
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  })
  const [errorMessage, setErrorMessage] = useState("")

  const updateFormValue = ({ updateType, value }) => {
    // Handling the password Object
    setErrorMessage("")
    setPasswordForm(prev => {
      return { ...prev, [updateType]: value } // key == [updateType], value == value
    })
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Reseting Password", { autoClose: 2000 })
    const validation = validator(passwordForm, setErrorMessage) // checks if any field is empty
    if (!validation) {
      
      updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
      return
    };
    if (passwordForm.new_password !== passwordForm.repeat_password) {
      updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
      return setErrorMessage(
        "The passwords do not match. Please make sure both password fields are the same."
      );
    }
    
    const payload = {
      email: email || "",
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
      repeat_password: passwordForm.repeat_password,
    }
    
    const response = await resetPassword(payload); // making the request for reseting password
    
    if (response.ok) { // handling the successful response of the reset password
      updateToasify(loadingToastId, "Request successful!", "success", 2000) // updating the toaster
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      localStorage.clear()
      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } else {
      updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
    }

  }

  return (
    <>
      <div className="">

        {/* Close Button */}
        <button

          className="absolute top-4 right-4 text-stone-500 hover:text-stone-700"
        >
          {/* <X onClick={close} size={24} /> */}
        </button>


        <form>
          <InputText placeholder="Enter current password"
            type={"password"}
            name={"currentPassword"}
            defaultValue={passwordForm.old_password}
            updateType="old_password"
            containerStyle="my-2"
            labelTitle={"Old password"}
            updateFormValue={updateFormValue} />
          <InputText placeholder="Enter new password"
            type={"password"}
            name={"newPassword"}
            defaultValue={passwordForm.new_password}
            labelTitle={"New password"}
            updateType="new_password"
            containerStyle="my-2"
            updateFormValue={updateFormValue} />
          <InputText placeholder="Confirm new password"
            type={"password"}
            name={"reapeatPassword"}
            defaultValue={passwordForm.repeat_password}
            updateType="repeat_password"
            labelTitle={"Repeat new password"}
            containerStyle="my-2"
            updateFormValue={updateFormValue} />
          <PasswordValidation new_password={passwordForm.new_password} />

          <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
            <img src={xSign} alt="" className='h-3 translate-y-[4px]' />
            {errorMessage}</ErrorText>
          <Button functioning={submitForm} text="Reset" classes={"btn mt-4 w-full btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800"} />
        </form>
      </div>
    </>
  );
}

export default ResetPasswordModalBody;
