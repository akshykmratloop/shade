import { X } from "lucide-react"

const CloseModalButton = ({onClickClose}) => {


    return (<button className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full border-none absolute right-4 top-4 p-2 py-2"
        onClick={onClickClose}>
        <X className="w-[20px] h-[20px]" />
    </button>)
}

export default CloseModalButton