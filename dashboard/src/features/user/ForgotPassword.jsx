import { useState } from 'react'
import { Link } from 'react-router-dom'
// import LandingIntro from './LandingIntro'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'
import BackroundImage from './components/BackroundImg';
import emailRegex from '../../app/emailregex'
import Button from '../../components/Button/Button'

function ForgotPassword() {
    const INITIAL_USER_OBJ = {
        emailId: ""
    }
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ)

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (userObj.emailId.trim() === "") return setErrorMessage("Email Id is required! (use any value)")
        if (!(emailRegex.checkRegex(userObj.emailId))) return setErrorMessage("Email format is invalid! (please provide a valid email)")
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
    }

    return (
        <div className="min-h-screen bg-base-200 flex">
            <BackroundImage />
            <div className='py-24 px-32 flex-1'>
                <h2 className='text-2xl font-semibold mb-2'>Forgot Password</h2>

                {
                    linkSent &&
                    <>
                        <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success' /></div>
                        <p className='my-4 text-xl font-bold '>Link Sent</p>
                        <p className='mt-4 mb-8 font-semibold '>Check your email to reset password</p>
                        <div className='text-center mt-4'><Link to="/login" ><button className="btn border-none btn-block btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700">Login</button></Link></div>
                    </>
                }

                {
                    !linkSent &&
                    <>
                        <p className='my-8 text-stone-500'>Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText placeholder={"Enter your email id"} type="emailId" defaultValue={userObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                            </div>
                            <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                            <Button type={"submit"} classes={"btn mt-2 w-full dark:bg-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")} text={"Get OTP"} />
                        </form>
                    </>
                }

            </div>
        </div>
    )
}

export default ForgotPassword