import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";


const ToasterUI = ({ type = "SUCCESS", message }) => {
    const ToasterState = {
        "ERROR": { icon: <MdErrorOutline />, color: "text-red-500" },
        "SUCCESS": { icon: <FaRegCheckCircle />, color: "text-green-500" },
        "LOAD": { icon: <AiOutlineLoading />, color: "text-gray-500" }
    }

    const error = type !== "SUCCESS" && type !== "LOAD" && type !== "ERROR"
    const loader = type === "LOAD"

    if (error) return null
    return (
        <div className={`min-w-[20vw] max-w-[30vw] flex gap bg-white rounded-lg flex gap-4 p-4 animation-move-left`}>
            <span className={`${ToasterState[type].color} text-[24px] ${loader && "animate-rotate"}`}>
                {ToasterState[type].icon}
            </span>
            <p>
                {message}
            </p>
        </div>
    )
}

export default ToasterUI