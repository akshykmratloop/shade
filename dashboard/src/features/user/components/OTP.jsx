import { useState, useEffect } from "react";
import { OtpInputField } from "../../../app/OTP";
import ErrorText from "../../../components/Typography/ErrorText";
import xSign from "../../../assets/x-close.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../common/userSlice";
import { toast } from "react-toastify";
import { resendOTP } from "../../../app/fetch";
import updateToasify from "../../../app/toastify";

const OTP_TIMEOUT_SECONDS = 60; // timeout for resending the otp

const OTPpage = ({ formObj, request, stateUpdater, otpSent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState({ otp: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(0);
    const [payload, setPayload] = useState(null)

    useEffect(() => {
        // Load remaining time from localStorage
        const storedTimestamp = localStorage.getItem(`otpTimestamp/${formObj.otpOrigin}`);
        if (storedTimestamp) {
            const elapsedTime = Math.floor((Date.now() - storedTimestamp) / 1000);
            if (elapsedTime < OTP_TIMEOUT_SECONDS) {
                setTimer(OTP_TIMEOUT_SECONDS - elapsedTime);
            }
        }
        setPayload(prev => JSON.parse(localStorage.getItem(formObj.otpOrigin)))
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const handleResendOTP = async () => {
        // Reset the timer and request a new OTP
        const loadingToastId = toast.loading("Processing your request... Please wait!", { autoClose: 2000, style: { backgroundColor: "#3B82F6", color: "#fff" } }); // starting the loading in toaster
        const response = await resendOTP(payload ||
        {
            email: formObj.email,
            otpOrigin: formObj.otpOrigin,
            deviceId: formObj.deviceId,

        })

        updateToasify(loadingToastId, response.message, "info", 2000) // updating the toaster
        console.log(response)
        setTimer(response.minutes ? (response.minutes * 60) + response.seconds : OTP_TIMEOUT_SECONDS);
        localStorage.setItem(`otpTimestamp/${formObj.otpOrigin}`, Date.now());
    };

    const inputHandler = (otpValue) => {
        setErrorMessage("");
        setOtp((preData) => ({
            ...preData,
            otp: otpValue,
        }))
    }

    const SubmitOTP = async () => {
        if (!otp.otp || otp.otp.length <= 5) {
            setErrorMessage("Please enter OTP first");
            return
        } else {
            setErrorMessage("");
        }

        const payload = {
            email: formObj.email,
            otpOrigin: formObj.otpOrigin,
            deviceId: formObj.deviceId,
            otp: otp.otp,
        };

        const response = await request(payload);
        if (formObj.otpOrigin === "MFA_Login" || payload.otpOrigin === "MFA_Login") {
            dispatch(updateUser({ data: response.user, type: "login" }));
            localStorage.setItem("user", JSON.stringify(response.user))
            localStorage.setItem("token", response.token);
            localStorage.removeItem(formObj.otpOrigin)
            document.cookie = `authToken=${response.token}; path=/; Secure`
            toast.success("Login Successful!");
            setTimeout(() => {
                navigate("/app/welcome");
            }, 1000);
            return
        } else if (formObj.otpOrigin === "forgot_Pass" || payload.otpOrigin === "forgot_Pass") {
            toast.success("Verification complete!");
            setTimeout(() => {
                stateUpdater.setOtpVerified(true);
                stateUpdater.setLinkSent(false);
            }, 1000);
            localStorage.removeItem(`otpTimestamp/${formObj.otpOrigin}`);
            // localStorage.removeItem(formObj.otpOrigin);
        } else if (response.status === 'error') {
            toast.error(response.message);
        }
    };

    return (
        <div className="w-[24rem] my-16">
            <p className="mt-4 mb-8 font-semibold ">Check your email and enter OTP</p>
            <div className="flex gap-2 flex-col justify-center items-center relative">
                <OtpInputField
                    label="Enter 6 digit Otp sent to your email"
                    value={otp.otp}
                    onChange={inputHandler}
                    numInputs={6}
                    inputContainerClassName="w-1/2"
                    inputClassName="bg-white rounded-[6px] border border-solid border-transparent cursor-pointer shadow-custom flex justify-center items-center pl-[20px] text-lg"
                    labelClassName=""
                />
                <ErrorText
                    styleClass={`${errorMessage ? "visible" : "invisible"} absolute left-0 top-[32px] flex mt-6 text-sm gap-1 justify-right`}
                >
                    <img src={xSign} alt="" className="h-3 translate-y-[4px]" />
                    {errorMessage}
                </ErrorText>
            </div>
            <div className="text-center mt-16">
                <div className="flex justify-between items-center mb-8">

                    <button
                        onClick={handleResendOTP}
                        className={`${timer > 0 ? "btn-disabled" : ""} bg-transparent underline hover:text-primary`}
                        disabled={timer > 0}
                    >
                        Resend OTP
                    </button>
                    <span className="text-sm font-semibold text-base-50">
                        {timer > 0 && formatTimer(timer)}
                    </span>
                </div>
                <div className="flex flex-col gap-4 align-center">
                    <button
                        onClick={SubmitOTP}
                        className="btn border-none btn-block btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700"
                    >
                        Submit
                    </button>
                    <div className="mt-3 flex flex-col gap-3 text-sm">
                        <button onClick={() => { localStorage.removeItem("MFA_Login"); localStorage.removeItem("forgot_pass"); localStorage.removeItem(`otpTimestamp/${formObj.otpOrigin}`); otpSent(false) }} className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">
                            <span >Edit Email</span>
                        </button>
                        {
                            formObj.otpOrigin === "MFA_Login" ?
                                <button onClick={() => { localStorage.removeItem("MFA_Login"); localStorage.removeItem(`otpTimestamp/${formObj.otpOrigin}`); window.location.reload(true) }} className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">
                                    <Link to="/login">
                                        <span >Sign In</span>
                                    </Link>
                                </button> :
                                <div className='text-center text-primary'
                                    onClick={() => { localStorage.removeItem("forgot_pass"); localStorage.removeItem(`otpTimestamp/${formObj.otpOrigin}`) }}>
                                    <Link to="/login">
                                        <span className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 bg-base-200 inline-block hover:underline hover:cursor-pointer transition duration-200">Sign In</span>
                                    </Link>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPpage;
