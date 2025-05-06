import { toast } from "react-toastify";

function updateToasify(toaster, message, type, close) {

    toast.update(toaster, {
        render: message,
        icon:true,
        type,
        style: type !== "info" ? {
            background: type === "success"? "#fff": "#EF4444", // Green
            color: "#808080",
        }:{},
        isLoading: false,
        autoClose: close,
    });
}

export default updateToasify
// "🎉"