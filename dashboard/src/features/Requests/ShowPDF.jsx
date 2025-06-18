import { Dialog } from '@headlessui/react'
import { useEffect, useRef } from 'react'
import { Img_url } from '../../routes/backend'

const ShowPdf = ({ pdf, onClose, open }) => {

    console.log(pdf)
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50 font-poppins">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[90vw] h-[90vh] bg-white rounded-md shadow-lg overflow-hidden relative">
                    {
                        !pdf ?
                            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border px-4 py-2 bg-white rounded text-gray-700">
                                No Document
                            </p>
                            :
                            <iframe
                                src={`${Img_url + pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full"
                                frameBorder="0"
                                title="PDF Viewer"
                            />
                    }
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-5 z-10 bg-white text-black px-2 py-1 rounded-full shadow-md hover:bg-gray-200"
                    >
                        ✕
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default ShowPdf