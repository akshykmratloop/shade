import { useState, useEffect } from "react";
import { OtpInputField } from "../../../app/OTP";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ErrorText from "../../../components/Typography/ErrorText";
import xSign from "../../../assets/x-close.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../common/userSlice";
import { toast } from "react-toastify";
import { resendOTP } from "../../../app/fetch";

const OTP_TIMEOUT_SECONDS = 60;

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
        console.log(response)
    };

    const SubmitOTP = async () => {
        if (!otp.otp || otp.otp.length <= 5) {
            setErrorMessage("Please enter OTP first");
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
            document.cookie = `authToken=${response.token}; path=/; Secure`
            toast.success("Login Successful!");
            setTimeout(() => {
                navigate("/app/welcome");
            }, 1000);

        } else if (response.ok) {
            stateUpdater.setOtpVerified(true);
            stateUpdater.setLinkSent(false);
        }
    };

    return (
        <div className="w-[24rem]">
            <div className="text-center mt-8">
                <CheckCircleIcon className="inline-block w-32 text-success" />
            </div>
            <p className="my-4 text-xl font-bold ">OTP has been Sent</p>
            <p className="mt-4 mb-8 font-semibold ">Check your email and enter OTP</p>
            <div className="flex gap-2 flex-col justify-center items-center">
                <OtpInputField
                    label="Enter 6 digit Otp sent to your email"
                    value={otp.otp}
                    onChange={(otpValue) =>
                        setOtp((preData) => ({
                            ...preData,
                            otp: otpValue,
                        }))
                    }
                    numInputs={6}
                    inputContainerClassName="w-1/2"
                    inputClassName="bg-white rounded-[8px] border border-solid border-transparent cursor-pointer shadow-custom flex justify-center items-center pl-[20px] text-lg"
                    labelClassName=""
                />
                <ErrorText
                    styleClass={`${errorMessage ? "visible" : "invisible"
                        } flex mt-6 text-sm gap-1 justify-center`}
                >
                    <img src={xSign} alt="" className="h-3 translate-y-[4px]" />
                    {errorMessage}
                </ErrorText>
            </div>
            <div className="text-center mt-4">
                <button
                    onClick={SubmitOTP}
                    className="btn border-none btn-block btn-primary dark:bg-primary bg-stone-700 hover:bg-stone-700"
                >
                    Submit
                </button>
                <div className="mt-4">
                    <button
                        onClick={handleResendOTP}
                        className={`btn mt-2 ${timer > 0 ? "btn-disabled" : "btn-primary"
                            }`}
                        disabled={timer > 0}
                    >
                        {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPpage;
