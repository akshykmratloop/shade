import InputText from "../components/Input/InputText";
import Button from "../components/Button/Button";
import {X} from "lucide-react"

const ResetPass = ({display, close}) => {


    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 bg-base-200 bg-opacity-50 ${display}`}>
        <div className="relative p-24 shadow-lg rounded-md w-full max-w-lg bg-base-300">
            
            {/* Close Button */}
            <button 
                
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-700"
            >
                <X onClick={close} size={24} />
            </button>

            <h1 className="text-lg font-semibold mb-6 text-center">Reset Password</h1>

            <form>
                <InputText placeholder="Enter current password" />
                <InputText placeholder="Enter new password" />
                <InputText placeholder="Confirm new password" />
                <Button text="Reset" classes={"btn mt-4 w-full btn-stone hover:text-stone-50 hover:bg-stone-700 border-stone-700 bg-stone-50 text-stone-800"} />
            </form>
        </div>
    </div>

    )
}

export default ResetPass