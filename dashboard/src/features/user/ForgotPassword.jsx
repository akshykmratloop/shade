import { useState } from 'react'
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

function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [userObj, setUserObj] = useState({
        email: "",
        otpOrigin: "forgot_Pass",
        deviceId: String(Math.floor(100000 + Math.random() * 900000)),
    })

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const validation = validator(userObj, setErrorMessage) // checks if any field is empty
        const validEmail = checkRegex(userObj.email, setErrorMessage) // checks if email is under valid format
        if (!validation || validEmail) return;
        else {
            setLoading(true)
            const loadingToastId = toast.loading("loging in", { autoClose: 2000 }); // starting the loading in toaster

            // Call API to send password reset link
            const response = await forgotPassReq(userObj);

            if (response.message.ok) {
                setLoading(false)
                setLinkSent(true)
                updateToasify(loadingToastId, "Request successful!", "success", 2000) // updating the toaster
                return;
            }
            setLoading(false)
            updateToasify(loadingToastId, "Request unsuccessful!", "failure", 2000) // updating the toaster
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setUserObj({ ...userObj, [updateType]: value })
    }

    return (
        <div className="min-h-screen h-[100vh] bg-base-200 flex">
            <BackroundImage />
            <div className='flex justify-center w-full lg:flex-1 md:flex-2 px-20 sm:flex-2 bg-base-200'>
                <div className='sm:py-[20vh] sm:py-20 w-[24rem]'>

                    <h2 className='text-2xl font-semibold mb-2'>Forgot Password</h2>

                    {
                        linkSent && <OTPpage loginObj={userObj} request={forgotPassReqVerify} stateUpdater={{ setOtpVerified, setLinkSent }} />

                    }

                    {
                        (!linkSent && !otpVerified) &&
                        <div className='w-[24rem]'>
                            <p className='my-8 text-stone-500'>Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>
                            <form onSubmit={(e) => submitForm(e)}>
                                <div className="mb-4">
                                    <InputText
                                        placeholder={"Enter your email id"}
                                        type="emailId"
                                        defaultValue={userObj.email}
                                        updateType="email"
                                        containerStyle="mt-4"
                                        labelTitle="Email Id"
                                        updateFormValue={updateFormValue}
                                        name={"emailId"}
                                    />
                                </div>
                                <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
                                    <img src={xSign} alt="" className='h-3 translate-y-[4px]' />
                                    {errorMessage}</ErrorText>
                                <Button type={"submit"} classes={"btn mt-2 w-full dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} text={"Get OTP"} />
                            </form>
                        </div>
                    }
                    {
                        otpVerified && <UpdatePassword userObj={userObj} />
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