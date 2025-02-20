import { useState, useEffect } from "react";
import { OtpInputField } from "../../../app/OTP";
import ErrorText from "../../../components/Typography/ErrorText";
import xSign from "../../../assets/x-close.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../common/userSlice";
import { toast } from "react-toastify";
import { resendOTP } from "../../../app/fetch";

const OTP_TIMEOUT_SECONDS = 60; // timeout for resending the otp

const OTPpage = ({ loginObj, request, stateUpdater }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState({ otp: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        // Load remaining time from localStorage
        const storedTimestamp = localStorage.getItem("otpTimestamp");
        if (storedTimestamp) {
            const elapsedTime = Math.floor((Date.now() - storedTimestamp) / 1000);
            if (elapsedTime < OTP_TIMEOUT_SECONDS) {
                setTimer(OTP_TIMEOUT_SECONDS - elapsedTime);
            }
        }
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
        localStorage.setItem("otpTimestamp", Date.now());
        setTimer(OTP_TIMEOUT_SECONDS);
        toast.info("A new OTP has been sent!");
        const response = await resendOTP({
            email: loginObj.email,
            otpOrigin: loginObj.otpOrigin,
            deviceId: loginObj.deviceId,
        });
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
            email: loginObj.email,
            otpOrigin: loginObj.otpOrigin,
            deviceId: loginObj.deviceId,
            otp: otp.otp,
        };

        const response = await request(payload);
        if (response.user && response.token) {
            dispatch(updateUser(response.user));
            localStorage.setItem("user", JSON.stringify(response.user))
            localStorage.setItem("token", response.token);
            localStorage.removeItem(loginObj.otpOrigin)
            document.cookie = `authToken=${response.token}; path=/; Secure`
            toast.success("Login Successful!");
            setTimeout(() => {
                navigate("/app/welcome");
            }, 1000);
            return
        } else if (response.ok) {
            toast.success("Verification complete!");
            setTimeout(() => {
                stateUpdater.setOtpVerified(true);
                stateUpdater.setLinkSent(false);
            }, 1000);
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
                    <span className="text-sm font-semibold text-gray-700">
                        {timer > 0 && formatTimer(timer)}
                    </span>
                </div>
                <button
                    onClick={SubmitOTP}
                    className="btn border-none btn-block btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OTPpage;
