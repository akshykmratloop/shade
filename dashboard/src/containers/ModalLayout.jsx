import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
// import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import ResetPasswordModalBody from '../features/user/ResetPasswordModalBody'
import { ToastContainer } from 'react-toastify'
import { X } from 'lucide-react'


function ModalLayout() {


    const { isOpen, bodyType, size, extraObject, title } = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = () => {
        dispatch(closeModal())
    }



    return (
        <>
            {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
                <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''} relative px-14 pt-10 pb-14 shadow-lg rounded-md w-full max-w-lg`}>

                    <button className="bg-transparent text-[gray] border-none absolute right-4 top-4" onClick={close}>
                        <X size={24} />
                    </button>

                    <h3 className="font-semibold text-xl pb-6">{title}</h3>


                    {/* Loading modal body according to different modal type */}
                    {
                        {
                            [MODAL_BODY_TYPES.LEAD_ADD_NEW]: <ResetPasswordModalBody close={close} extraObject={extraObject} />,
                            [MODAL_BODY_TYPES.CONFIRMATION]: <ConfirmationModalBody extraObject={extraObject} closeModal={close} />,
                            [MODAL_BODY_TYPES.DEFAULT]: <div></div>
                        }[bodyType]
                    }
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default ModalLayout