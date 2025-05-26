import FallbackLoader from "../components/fallbackLoader/FallbackLoader"

function SuspenseContent() {
    return (
        <div className="w-full h-screen text-gray-300 dark:text-gray-200 bg-base-100">
            <FallbackLoader />
        </div>
    )
}

export default SuspenseContent