import InputText from "../../components/Input/InputText";
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import { useState } from "react";
import { resetPassword } from "../../app/fetch";
import { useSelector } from "react-redux";
import PasswordValidation from "./components/PasswordValidation";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import { useNavigate } from "react-router-dom";
import { validatePasswordMessage } from "./components/PasswordValidation";


function ResetPasswordModalBody() {
  const navigate = useNavigate()
  const email = useSelector(state => {
    return state.user.user.email
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  })
  const [errorOldPasswordMessage, setOldPasswordMessage] = useState("")
  const [errorNewPasswordMessage, setNewPasswordMessage] = useState("")
  const [errorRepeatPasswordMessage, setRepeatPasswordMessage] = useState("")
  // const errorMessagePosition = "top-[-22px] right-0"

  function clearingMessages() { // clearing the error messages 
    setOldPasswordMessage("")
    setNewPasswordMessage("")
    setRepeatPasswordMessage("")
  }

  const updateFormValue = ({ updateType, value }) => {
    // Handling the password Object
    clearingMessages()
    setPasswordForm(prev => {
      return { ...prev, [updateType]: value } // key == [updateType], value == value
    })
  }

  const submitForm = async (e) => { // submission of the reset passwordings
    e.preventDefault();
    const loadingToastId = toast.loading("Reseting Password", { autoClose: 2000 })
    const validation = validator(passwordForm, { old_password: setOldPasswordMessage, new_password: setNewPasswordMessage, repeat_password: setRepeatPasswordMessage }) // checks if any field is empty
    if (!validation) { // if the any field is empty
      updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
      return;
    };
    if (!validatePasswordMessage(passwordForm.new_password, setNewPasswordMessage)) return
    if (!validatePasswordMessage(passwordForm.old_password, setOldPasswordMessage)) return

    if (passwordForm.new_password !== passwordForm.repeat_password) { // if password does not match
      updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
      return setRepeatPasswordMessage("The passwords do not match.");
    }

    const payload = { // payload for fetch body 
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
    <div>
      <form className="flex flex-col items-center">
        <InputText placeholder="Enter current password"
          type={"password"}
          name={"currentPassword"}
          defaultValue={passwordForm.old_password}
          updateType="old_password"
          containerStyle="my-2"
          labelTitle={"Old password"}
          errorMessage={errorOldPasswordMessage}
          updateFormValue={updateFormValue} />
        <InputText placeholder="Enter new password"
          type={"password"}
          name={"newPassword"}
          defaultValue={passwordForm.new_password}
          labelTitle={"New password"}
          updateType="new_password"
          containerStyle="my-2"
          errorMessage={errorNewPasswordMessage}
          updateFormValue={updateFormValue} />
        <InputText placeholder="Confirm new password"
          type={"password"}
          name={"reapeatPassword"}
          defaultValue={passwordForm.repeat_password}
          updateType="repeat_password"
          labelTitle={"Repeat new password"}
          containerStyle="my-2"
          errorMessage={errorRepeatPasswordMessage}
          updateFormValue={updateFormValue} />
        <PasswordValidation new_password={passwordForm.new_password} />
        {/* 
          <ErrorText error={errorMessage ? 1 : 0} styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
            <img src={xSign} alt="" className='h-3 translate-y-[4px]' />
            {errorMessage}</ErrorText> */}
        <Button functioning={submitForm} text="Reset" classes={"h-[2.5rem] rounded-md w-[22rem] mt-4 text-sm btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800"} />
      </form>
    </div>
  );
}

export default ResetPasswordModalBody;
