import { useEffect, useState } from 'react'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import BackroundImage from './components/BackroundImg';
import { checkRegex } from '../../app/emailregex'
import Button from '../../components/Button/Button';
import xSign from "../../assets/x-close.png";
import OTPpage from './components/OTP';
import { forgotPassReqVerify, forgotPassReq } from '../../app/fetch';
import validator from '../../app/valid';
import updateToasify from '../../app/toastify';
import { toast, ToastContainer } from 'react-toastify';
import UpdatePassword from './components/UpdatePassword';
import getFingerPrint from '../../app/deviceId';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [formObj, setFormObj] = useState({
        email: "",
        otpOrigin: "forgot_Pass",
        deviceId: "",
    })

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const validation = validator(formObj, setErrorMessage) // checks if any field is empty
        const validEmail = checkRegex(formObj.email, setErrorMessage) // checks if email is under valid format
        if (!validation || validEmail) return;
        else {
            setLoading(true)
            const loadingToastId = toast.loading("Processing your request... Please wait!", { autoClose: 2000, style: { backgroundColor: "#3B82F6", color: "#fff" } }); // starting the loading in toaster

            // Call API to send password reset link
            const response = await forgotPassReq(formObj);
            if (response.message.ok) {
                setLoading(false)
                setOtpSent(true)
                localStorage.setItem(formObj.otpOrigin, JSON.stringify(formObj))
                updateToasify(loadingToastId, "Request successful!", "success", 2000) // updating the toaster
                return;
            }
            setLoading(false)
            updateToasify(loadingToastId, response.message, "failure", 2000) // updating the toaster
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setFormObj({ ...formObj, [updateType]: value })
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        if(token && user){
            navigate('/app/welcome')
        }
    }, [])

    useEffect(() => {
        localStorage.removeItem("MFA_Login")
        localStorage.removeItem("otpTimestamp/MFA_Login")
        const stateOfOTP = localStorage.getItem(formObj.otpOrigin)
        setOtpSent(stateOfOTP)
    }, [])

    useEffect(() => {
        async function FP() {
            const deviceId = await getFingerPrint()
            setFormObj(prev => {
                return { ...prev, deviceId: deviceId }
            })
        }
        FP()
    }, [])
    return (
        <div className="min-h-screen h-[100vh] bg-base-200 flex">
            <BackroundImage />
            <div className='flex justify-center w-full sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-2/5 sm:px-20 md:px-20 lg:px-24 bg-base-200'>
                <div className='sm:py-[20vh] sm:py-20 w-[24rem]'>

                    <h2 className='text-2xl font-semibold mb-2'>Forgot Password</h2>

                    {
                        otpSent && <OTPpage otpSent={setOtpSent} formObj={formObj} request={forgotPassReqVerify} stateUpdater={{ setOtpVerified, setLinkSent: setOtpSent }} />

                    }

                    {
                        (!otpSent && !otpVerified) &&
                        <div className='w-[24rem]'>
                            <p className='my-8 text-stone-500'>Enter your email, and we'll send you an OTP to verify your identity. After verification, you can reset your password.</p>
                            <form onSubmit={(e) => submitForm(e)}>
                                <div className="mb-4 relative">
                                    <InputText
                                        placeholder={"Enter your email id"}
                                        type="emailId"
                                        defaultValue={formObj.email}
                                        updateType="email"
                                        containerStyle="mt-4"
                                        labelTitle="Email Id"
                                        updateFormValue={updateFormValue}
                                        name={"emailId"}
                                    />
                                    <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} absolute top-[63px] flex mt-6 text-xs gap-1 justify-center `}>
                                        <img src={xSign} alt="" className='h-3 translate-y-[4px]' />
                                        {errorMessage}</ErrorText>
                                </div>

                                <Button type={"submit"} classes={"btn mt-5 w-full dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} text={"Get OTP"} />
                            </form>
                            <div className='text-center mt-6 text-primary'>
                                <Link to="/login">
                                    <span className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">Sign In</span>
                                </Link>
                            </div>
                        </div>
                    }
                    {
                        otpVerified && <UpdatePassword userObj={formObj} />
                    }
                </div>


            </div>
            <ToastContainer theme="colored" />
        </div>
    )
}

export default ForgotPassword


































// <>
//     <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success' /></div>
//     <p className='my-4 text-xl font-bold '>OTP has been Sent</p>
//     <p className='mt-4 mb-8 font-semibold '>Check your email and enter OTP</p>
//     <div className='flex gap-2 flex-col justify-center items-center'>
//         <OtpInputField
//             label="Enter 6 digit Otp sent to your email"
//             value={otp.otp}
//             onChange={(otpValue) =>
//                 setOtp((preData) => ({
//                     ...preData,
//                     otp: otpValue,
//                 }))
//             }
//             numInputs={6}
//             inputContainerClassName="w-1/2"
//             inputClassName="bg-white rounded-[8px] border border-solid border-transparent cursor-pointer shadow-custom flex justify-center items-center pl-[20px] text-lg"
//             labelClassName=""
//         />
//         <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center`}>
//             <img src={xSign} className='h-3 translate-y-[4px]' />
//             {errorMessage}</ErrorText>
//     </div>
//     <div className='text-center mt-4'><button onClick={SubmitOTP} className="btn border-none btn-block btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700">Submit</button></div>
// </>