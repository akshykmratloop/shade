import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputText from '../../components/Input/InputText';
import Button from '../../components/Button/Button';
import BackroundImage from './components/BackroundImg';
import { checkRegex } from '../../app/emailregex';
import { ToastContainer, toast } from 'react-toastify';
import { login, mfaLogin, mfaVerify } from '../../app/fetch';
import { updateUser } from '../common/userSlice';
import { useDispatch } from 'react-redux';
import updateToasify from '../../app/toastify';
import validator from '../../app/valid';
import OTPpage from './components/OTP';
import { validatePasswordMessage } from './components/PasswordValidation';
import getFingerPrint from '../../app/deviceId';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorEmailMessage, setErrorEmailMessage] = useState("")
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [loginWithOtp, setLoginWithOtp] = useState(false) // state for login with otp
    const [otpSent, setOtpSent] = useState(false);

    function clearingMessages() { // clearing the error messages 
        setErrorEmailMessage("")
        setErrorPasswordMessage("")
    }

    const [formObj, setFormObj] = useState({
        email: "",
        otpOrigin: "MFA_Login",
        deviceId: "",
        password: "",
    })

    function LoginWithOTP() {
        setLoginWithOtp(prev => !prev)
        clearingMessages()
    }

    const submitForm = async () => {
        clearingMessages();
        setLoading(true)

        const validEmail = checkRegex(formObj.email, setErrorEmailMessage) // checks if email is under valid format

        let payload;
        let response;
        let loadingToastId;
        if (loginWithOtp) { // proceeding with login with otp
            if (validEmail) {
                setLoading(false)
                return
            };
            payload = { //payload for otp login
                email: formObj.email,
                otpOrigin: formObj.otpOrigin,
                deviceId: formObj.deviceId
            }
            loadingToastId = toast.loading("requesting OTP!", { autoClose: 2000, style: { backgroundColor: "#3B82F6", color: "#fff" } }); // starting the loading in toaster
            response = await mfaLogin(payload)
            console.log(response)
        } else { // proceeding with login with password
            const validation = validator(formObj, { email: setErrorEmailMessage, password: setErrorPasswordMessage }) // checks if any field is empty
            const validatePassword = validatePasswordMessage(formObj.password, setErrorPasswordMessage) // check the password validations

            if (!validation || validEmail || !validatePassword) { //if any field is empty or if email format is not valid or password validation failed
                setLoading(false)
                return
            };

            loadingToastId = toast.loading("loging in", { autoClose: 2000, style: { backgroundColor: "#3B82F6", color: "#fff" } }); // starting the loading in toaster
            payload = { // payload for login
                email: formObj.email,
                password: formObj.password
            }
            response = await login(payload)
        }

        if (response.token) {
            updateToasify(loadingToastId, "Request successful! 🎉", "success", 2000) // updating the toaster
            dispatch(updateUser(response.user))
            localStorage.setItem("user", JSON.stringify(response.user))
            localStorage.setItem("token", response.token);
            document.cookie = `authToken=${response.token}; path=/; Secure` // Saving token as cookie for Auth in backend queries
            setTimeout(() => {
                navigate('/app/welcome')
            }, 1000)
        } else if (response.otp) {
            updateToasify(loadingToastId, "OTP has been sent", "success", 800);
            localStorage.setItem(formObj.otpOrigin, JSON.stringify(formObj))
            setTimeout(() => {
                setOtpSent(true)
            }, 1000)
        }
        else {
            updateToasify(loadingToastId, `Request unsuccessful! ${response.message}`, "error", 2000) // updating the toaster
        }
        setLoading(false)

    }

    const updateFormValue = ({ updateType, value }) => {
        // Handling the login Object
        clearingMessages()
        setFormObj(prev => {
            return { ...prev, [updateType]: value } // key == [updateType], value == value
        })
    }

    const proceedLogin = (e) => {
        e.preventDefault();
        submitForm(e)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        if(token && user){
            navigate('/app/welcome')
        }
    }, [])

    useEffect(() => {
        async function FP() {
            const deviceId = await getFingerPrint()
            setFormObj(prev => {
                return { ...prev, deviceId }
            })
        }
        FP()
    }, [])

    useEffect(() => {
        localStorage.removeItem("forgot_Pass")
        localStorage.removeItem("otpTimestamp/forgot_Pass")
        const stateOfOTP = localStorage.getItem(formObj.otpOrigin)
        setOtpSent(stateOfOTP)
    }, [])
    return (
        <div className="min-h-screen h-screen bg-base-200 flex sm:h-[100vh]">
            <BackroundImage />

            <div className="flex justify-center w-full sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-2/5 sm:px-20 md:px-20 lg:px-24 bg-base-200">

                <div className='sm:pt-[20vh] sm:py-20 w-[24rem] flex flex-col items-center'>
                    <h2 className='text-2xl font-semibold mb-2'>Sign in to Dashboard</h2>
                    {otpSent ? <OTPpage otpSent={setOtpSent}  formObj={formObj} request={mfaVerify} /> :
                        <form onSubmit={proceedLogin}>
                            <div className="mb-4 relative flex flex-col">
                                <InputText placeholder={"Email/Phone Number"} errorMessage={errorEmailMessage} name={"email"} defaultValue={formObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                                <InputText display={loginWithOtp} errorMessage={errorPasswordMessage} defaultValue={formObj.password} name={"password"} placeholder={"Password"} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>
                            <div className='text-right text-primary' style={{ display: loginWithOtp ? "none" : "block" }}>
                                <Link to="/forgot-password">
                                    <span className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                                </Link>
                            </div>
                            <div className={`${loginWithOtp?"mt-8":"mt-3"} w-[22rem] h-[2.3rem]`}>
                                <Button text={loginWithOtp ? "Generate OTP" : "Login"} type="submit" classes={`rounded-md text-[.8rem] w-[22rem] h-[2.3rem] btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none` + (loading ? " loading" : "")} />
                                <Button functioning={LoginWithOTP} text={loginWithOtp ? "Sign In with Password" : "Sign In With OTP"} classes={"rounded-md text-[.8rem] mt-2 w-[22rem] h-[2.3rem] btn-stone hover:text-stone-50 hover:bg-stone-700 border border-stone-700 bg-stone-50 text-stone-800"} />
                            </div>
                        </form>
                    }
                </div>
            </div>
            <ToastContainer theme="colored" />
        </div>
    )
}

export default Login
