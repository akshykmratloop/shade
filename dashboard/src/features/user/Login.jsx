import { useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText';
import Button from '../../components/Button/Button';
import BackroundImage from './components/BackroundImg';
import emailRegex from '../../app/emailregex';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: "",
        emailId: ""
    }
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)
    const [loginWithOtp, setLoginWithOtp] = useState(false)

    function LoginWithOTP() {
        setLoginWithOtp(prev => !prev)
    }

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (loginObj.emailId.trim() === "") return setErrorMessage("Email Id is required! (use any value)");
        if (!(emailRegex.checkRegex(loginObj.emailId))) return setErrorMessage("Invalid email format! (please provide a valid email)");
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required! (use any value)")
        else {
            setLoading(true)
            // Call API to check user credentials and save token in localstorage
            const loadingToastId = toast.loading("login successful", { autoClose: 1000 })
            localStorage.setItem("token", "DumyTokenHere")
            setLoading(false)
            // window.location.href = '/app/welcome'
            setTimeout(() => {

                toast.update(loadingToastId, {
                    render: "Request successful! 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            }, 2000)
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        // Handling the login Object
        setErrorMessage("")
        setLoginObj(prev => {
            return { ...prev, [updateType]: value } // key == [updateType], value == value
        })
    }

    return (
        <div className="min-h-screen bg-base-200 flex">
            <BackroundImage />

            <div className="mx-auto flex justify-center flex-1 bg-base-200">
                <div className='lg:py-32 px-10 sm:py-20' style={{ width: "24rem" }}>
                    <h2 className='text-2xl font-semibold mb-2'>Sign in to Dashboard</h2>
                    <form onSubmit={(e) => submitForm(e)}>
                        <div className="mb-4">
                            <InputText placeholder={"Email/Phone Number"} type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                            <InputText display={loginWithOtp} defaultValue={loginObj.password} placeholder={"Password"} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                        </div>

                        <div className='text-right text-primary' style={{ display: loginWithOtp ? "none" : "block" }}>
                            <Link to="/forgot-password">
                                <span className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                            </Link>
                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <Button text={loginWithOtp ? "Generate OTP" : "Login"} type="submit" classes={"btn mt-2 w-full btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} />
                    </form>
                    <Button functioning={LoginWithOTP} text={loginWithOtp ? "Sing In with Password" : "Sing In With OTP"} classes={"btn mt-2 w-full btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800" + (loading ? " loading" : "")} />
                </div>
            </div>
            <ToastContainer theme="colored"
             />
        </div>
    )
}

export default Login