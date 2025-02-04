import OtpInput from "react-otp-input";


export const OtpInputField = ({
    label,
    inputClassName,
    labelClassName,
    onChange,
    value,
    inputContainerClassName,
    numInputs,
    renderSeparator,
  }) => {
    return (
      <div className={`flex flex-col w-[300px] ${inputContainerClassName}`}>
        <label
          htmlFor="phone-input"
          className={`mb-1 w-64 dark:text-stone-50 [font-family:'Mulish-Regular',Helvetica] font-normal text-[#3B3B3B] text-[16px] tracking-[0] leading-[24px]  ml-[6px] "${labelClassName}`}
        >
          {label}
        </label>
        <OtpInput
          value={value}
          onChange={onChange}
          numInputs={numInputs}
          renderSeparator={<span>{renderSeparator}</span>}
          skipDefaultStyles
          containerStyle="flex justify-between"
          inputStyle={`block w-[44px] h-[44px]  text-sm text-gray-900 bg-gray-50 rounded-lg border-s-0 ring-[1.2px] ring-[#D0D5DD]${inputClassName}`}
          renderInput={(props) => <input {...props} />}
        />
      </div>
    );
  };
  
  
  
  

//   <OtpInputField
//                     label="Enter 6 digit Otp sent to your email"
//                     value={page1Data.otp}
//                     onChange={(otpValue) =>
//                       setPage1Data((preData) => ({
//                         ...preData,
//                         otp: otpValue,
//                       }))
//                     }
//                     numInputs={6}
//                     inputContainerClassName="w-1/2 "
//                     inputClassName=" bg-white rounded-[8px] border border-solid border-transparent cursor-pointer shadow-custom flex justify-center items-center pl-[20px] text-lg"
//                     labelClassName=""
//                   />
  