import { toast } from "react-toastify";

function updateToasify(toaster, message, type, close) {

    toast.update(toaster, {
        render: message,
        icon:false,
        type,
        style: type !== "info" ? {
            background: type === "success"? "#22C55E": "#EF4444", // Green
            color: "#fff",
        }:{},
        isLoading: false,
        autoClose: close,
    });
}

export default updateToasify
// "🎉"