import { useEffect, useRef, useState } from "react";
import ErrorText from "../../components/Typography/ErrorText";
import xSign from "../../assets/x-close.png"

const RejectPopup = ({ setClose, display, submitfunction }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const popupRef = useRef(null)

  const closeThisPopup = () => {
    setClose(false)
  }

  const onTypeInput = (e) => {
    setErrorMessage("")
    setRejectReason(e.target.value)
  }

  const submitRejection = async (e) => {
    e.preventDefault()
    if (rejectReason.trim() === "") { return setErrorMessage("Please Provide a message") }
    if (rejectReason.split(" ").length < 10) { return setErrorMessage("The reason must have at least 10 words") }

    await submitfunction(rejectReason)
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeThisPopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ display: display ? "flex" : "none" }}
      className="fixed top-0 left-0 w-full h-screen bg-black/40 items-center justify-center"
    >
      
      <div ref={popupRef} className="w-[40%] bg-white dark:bg-[#242933] flex flex-col items-center justify-center gap-5 p-6 px-20 rounded-lg shadow-lg relative">
        {/* <h3 className="">
          You are rejecting the request.
        </h3> */}
        <form action="" onSubmit={submitRejection} className="flex flex-col gap-4 w-full">
          <label htmlFor="" className="flex flex-col gap-2 relative">
            <p>Are you sure you want to reject this request?</p>
            Please enter a reason to reject.
            <textarea name="" id="" className="border rounded-md min-h-20 p-2 text-sm"
              onChange={onTypeInput}
            ></textarea>
            <ErrorText
              styleClass={`absolute ${"text-[.7rem] top-[100%] left-[1px] gap-1"} ${errorMessage ? "flex" : "hidden"
                }`}
            >
              <img src={xSign} alt="" className="h-3 translate-y-[2px]" />
              {errorMessage}
            </ErrorText>
          </label>
          <div className="flex justify-end gap-2">
            <button className="px-4 text-sm py-2 bg-[#FF0000] text-white rounded-md" onClick={(e) => { e.preventDefault(); closeThisPopup() }}>Cancel</button>
            <button className="px-4 text-sm py-2 bg-[#29469c] text-white rounded-md">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default RejectPopup;
