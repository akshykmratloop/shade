import { useEffect, useRef } from "react"
import { Img_url } from "../../routes/backend"

const ShowPdf = ({ pdf, onClose }) => {
    const modalRef = useRef(null)

    useEffect(() => {
        function handleOutSideClick(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose()
            }
        }

        window.addEventListener("click", handleOutSideClick)

        return () => window.removeEventListener('click', handleOutSideClick)
    }, [onClose])

    return (
        <div className="fixed z-[20] top-0 left-0 bg-black/60 flex items-center justify-center w-screen h-screen">
            <div className="h-[90vh] w-[80%] border" ref={modalRef}>
                <iframe src={Img_url + pdf} frameborder="0"></iframe>
            </div>
        </div>
    )
}

export default ShowPdf