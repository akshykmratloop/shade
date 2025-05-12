import {toast} from "react-toastify";

function updateToasify(toaster, message, type, close) {
  toast.update(toaster, {
    render: message,
    icon: true,
    type,
    style:
      type !== "info"
        ? {
            background: type === "success" ? "#fff" : "#fff", // Green
            color: "#808080",
          }
        : {},
    isLoading: false,
    autoClose: close,
    // hideProgressBar: true,
  });
}

export default updateToasify;
// "🎉"
