export default function InputOTP({inputNumber}) {


    return (
        <input className="" maxLength="1" id={`otp-${inputNumber}`} type="number" 
        style={{width:"8vh", height:"8vh", border: "none", outline:"none", textAlign:"center"}}/>
    )
}