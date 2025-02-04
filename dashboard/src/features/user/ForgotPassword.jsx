import { useState } from 'react'
// import { Link } from 'react-router-dom'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'
import BackroundImage from './components/BackroundImg';
import emailRegex from '../../app/emailregex'
import Button from '../../components/Button/Button';
import InputOTP from '../../components/Input/InputOTP';
import { OtpInputField } from '../../app/OTP';
import xSign from "../../assets/x-close.png";
import OTP from './components/OTP';

function ForgotPassword() {
    const INITIAL_USER_OBJ = {
        emailId: ""
    }
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ)
    const [otp, setOtp] = useState({ otp: "" })

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (userObj.emailId.trim() === "") return setErrorMessage("Email Id is required! (use any value)")
        if (!(emailRegex.checkRegex(userObj.emailId))) return setErrorMessage("Email format is invalid!")
        else {
            setLoading(true)
            // Call API to send password reset link
            setLoading(false)
            setLinkSent(true)
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setUserObj({ ...userObj, [updateType]: value })
        console.log(userObj)
    }

    const SubmitOTP = () => {
        if (!otp.otp || otp.otp.length <= 5) { setErrorMessage("Please enter OTP first") }
        else { setErrorMessage("") }
    }

    return (
        <div className="min-h-screen bg-base-200 flex">
            <BackroundImage />
            <div className='py-24 lg:px-32 sm:px-10 lg:flex-1 sm:flex-3'>
                <h2 className='text-2xl font-semibold mb-2'>Forgot Password</h2>

                {
                    linkSent && <OTP />
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
                }

                {
                    !linkSent &&
                    <>
                        <p className='my-8 text-stone-500'>Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText
                                    placeholder={"Enter your email id"}
                                    type="emailId"
                                    defaultValue={userObj.emailId}
                                    updateType="emailId"
                                    containerStyle="mt-4"
                                    labelTitle="Email Id"
                                    updateFormValue={updateFormValue}
                                    name={"emailId"}
                                />
                            </div>
                            <ErrorText styleClass={`${errorMessage ? "visible" : "invisible"} flex mt-6 text-sm gap-1 justify-center `}>
                                <img src={xSign} className='h-3 translate-y-[4px]' />
                                {errorMessage}</ErrorText>
                            <Button type={"submit"} classes={"btn mt-2 w-full dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} text={"Get OTP"} />
                        </form>
                    </>
                }

            </div>
        </div>
    )
}

export default ForgotPassword