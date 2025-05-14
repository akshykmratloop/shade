import { toast } from "react-toastify";

/**
 * Safely updates a toast by ID
 */
// function updateToastify(toastId, message, type = "default", autoClose = 2000) {
//   if (!toast.isActive(toastId)) return; // prevent update if toast is gone

//   toast.update(toastId, {
//     render: message,
//     type,
//     isLoading: false,
//     autoClose,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     style: {
//       background: "#fff",
//       color: "#555",
//     },
//   });
// }

// export default updateToastify



// import {toast} from "react-toastify";

function updateToastify(toaster, message, type = "default", close) {

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
    hideProgressBar: true,
  });
}

export default updateToastify;
// "🎉"
