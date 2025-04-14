import { X } from "lucide-react"

const CloseModalButton = ({onClickClose}) => {


    return (<button className="absolute z-40 right-4 top-4 bg-transparent hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full border-none p-2 py-2"
        onClick={onClickClose}>
        <X className="w-[20px] h-[20px]" />
    </button>)
}

export default CloseModalButton