import { useEffect, useRef, useState } from "react"
import { TruncateText } from "../../app/capitalizeword"
import { FiEye } from "react-icons/fi"



const Commnets = ({ comment }) => {
    const [commentOn, setCommentOn] = useState(false)
    const commentRef = useRef(null)


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setCommentOn(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    return (
        <div className="flex items-center gap-1">

            {TruncateText(comment, 20) || "N/A"}
            {comment !== "No Comments" && (
                <div className="relative" ref={commentRef}
                >
                    <span
                        onClick={() => setCommentOn(prev => !prev)}
                    >
                        <FiEye />
                    </span>
                    {
                        commentOn &&
                        <div className="absolute right-[0%] bottom-[100%] z-[30]">
                            <div className="comment-bubble w-[25vw] h-[25vh] overflow-y-scroll rm-scroll">
                                <div className="comment-bubble-arrow"></div>
                                <h3>Comments:</h3>
                                <p className={`${comment ? "text-stone-900 dark:text-stone-200" : "text-stone-300"}`}>{comment || "No comments"}</p>
                            </div>
                        </div>
                    }
                </div>
            )}
        </div>
    )
}

export default Commnets