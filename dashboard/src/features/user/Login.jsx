import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText';
import Button from '../../components/Button/Button';
import BackroundImage from './components/BackroundImg';
import { checkRegex } from '../../app/emailregex';
import { ToastContainer, toast } from 'react-toastify';
import xSign from "../../assets/x-close.png";
import { login, mfaLogin, mfaVerify } from '../../app/fetch';
import { updateUser } from '../common/userSlice';
import { useDispatch } from 'react-redux';
import updateToasify from '../../app/toastify';
import validator from '../../app/valid';
import OTPpage from './components/OTP';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const [errorEmailMessage, setErrorEmailMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [loginWithOtp, setLoginWithOtp] = useState(false) // state for login with otp
    const [otpSent, setOtpSent] = useState(false);

    const [loginObj, setLoginObj] = useState({
        email: "",
        otpOrigin: "MFA_Login",
        deviceId: String(Math.floor(100000 + Math.random() * 900000)),
        password: "",
    })

    function LoginWithOTP() {
        setLoginWithOtp(prev => !prev)
    }

    const submitForm = async () => {
        setErrorMessage("")

        setLoading(true)
        const loadingToastId = toast.loading("loging in", { autoClose: 2000 }); // starting the loading in toaster
        let payload;
        let response;
        if (loginWithOtp) {
            const validEmail = checkRegex(loginObj.email, setErrorEmailMessage) // checks if email is under valid format
            if (validEmail) {
                setLoading(false)
                updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
                return
            };
            payload = { //payload for otp login
                email: loginObj.email,
                otpOrigin: loginObj.otpOrigin,
                deviceId: loginObj.deviceId
            }
            response = await mfaLogin(payload)
        } else {
            const validation = validator(loginObj, setErrorMessage) // checks if any field is empty
            const validEmail = checkRegex(loginObj.email, setErrorEmailMessage) // checks if email is under valid format
            if (!validation || validEmail) {
                setLoading(false)
                updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
                return
            };
            payload = { // payload for login
                email: loginObj.email,
                password: loginObj.password
            }
            response = await login(payload)
        }

        if (response.token) {
            updateToasify(loadingToastId, "Request successful! 🎉", "success", 2000) // updating the toaster
            dispatch(updateUser(response.user))
            localStorage.setItem("user", JSON.stringify(response.user))
            localStorage.setItem("token", response.token);
            console.log(response.token)
            document.cookie = `authToken=${response.token}; path=/; Secure`
            console.log(document.cookie)
            setTimeout(() => {
                navigate('/app/welcome')
            }, 1000)
        } else if (response.otp) {
            setOtpSent(true)
            updateToasify(loadingToastId, "OTP has been sent", "success", 800);
        }
        else {
            updateToasify(loadingToastId, `Request unsuccessful! ${response.message}`, "failure", 2000) // updating the toaster
        }
        setLoading(false)

    }

    const updateFormValue = ({ updateType, value }) => {
        // Handling the login Object
        setErrorMessage("")
        setErrorEmailMessage("")
        setLoginObj(prev => {
            return { ...prev, [updateType]: value } // key == [updateType], value == value
        })
    }

    const proceedLogin = (e) => {
        e.preventDefault();
        submitForm(e)
    }

    return (
        <div className="min-h-screen h-screen bg-base-200 flex sm:h-[100vh]">
            <BackroundImage />

            <div className="flex justify-center w-full h-[100vh] lg:flex-1 md:flex-2 px-20 sm:flex-2 bg-base-200">
                {otpSent ? <OTPpage loginObj={loginObj} request={mfaVerify} /> :

                    <div className='sm:pt-[20vh] sm:py-20 w-[24rem]'>
                        <h2 className='text-2xl font-semibold mb-2'>Sign in to Dashboard</h2>
                        <form onSubmit={proceedLogin}>
                            <div className="mb-4 relative">
                                <InputText placeholder={"Email/Phone Number"} name={"email"} defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                                <ErrorText styleClass={`text-xs absolute left-[86px] gap-1 top-[87px] ${errorEmailMessage ? "flex" : "hidden"}`}>
                                    <img src={xSign} className='h-3 translate-y-[2px]' />
                                    {errorEmailMessage}</ErrorText>
                                <InputText display={loginWithOtp} defaultValue={loginObj.password} name={"password"} placeholder={"Password"} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>

                            <div className='text-right text-primary' style={{ display: loginWithOtp ? "none" : "block" }}>
                                <Link to="/forgot-password">
                                    <span className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                                </Link>
                            </div>

                            <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
                                <img src={xSign} className='h-3 translate-y-[4px]' />
                                {errorMessage}</ErrorText>
                            <Button text={loginWithOtp ? "Generate OTP" : "Login"} type="submit" classes={"btn mt-2 w-full btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} />
                        </form>
                        <Button functioning={LoginWithOTP} text={loginWithOtp ? "Sign In with Password" : "Sign In With OTP"} classes={"btn mt-2 w-full btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800"} />
                    </div>
                }
            </div>
            <ToastContainer theme="colored" />
        </div>
    )
}

export default Login






































// else {
//     const loadingToastId = toast.loading("loging in", { autoClose: 2000 })

//     // Call API to check user credentials and save token in localstorage
//     const response = await login(loginObj)
//     if (response.status) {
//         updateToasify(loadingToastId, "Login Failed!", "failure", 2000)
//     } else {
//         updateToasify(loadingToastId, "Request successful!🎉", "success", 2000)
//     }

// }

// const askForOtp = async () => {
//     const validEmail = checkRegex(otpLoginObj.email, setErrorEmailMessage) //checks for the valid email
//     if (validEmail) return; // terminating the submission, since the email is invalid

// }