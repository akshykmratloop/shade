import { MoonLoader } from "react-spinners"

const FallBackLoader = () => {

    return (
        <div className="flex justify-center items-center h-full bg-black/10 w-full fixed top-0 left-0">
            <MoonLoader size={60} color="#29469c" className="" />
        </div>
    )
}

export default FallBackLoader