import { toast } from "react-toastify";

function updateToasify(toaster, message, type, close) {

    toast.update(toaster, {
        render: message,
        type,
        isLoading: false,
        autoClose: close,
    });
}

export default updateToasify
// "Request unsuccessful! 🎉"