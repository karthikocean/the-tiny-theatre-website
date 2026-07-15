import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatErrorMessage } from "./TextHelper";

class ShowNotifications {
  static showAlertNotification(message, isSuccess = true) {
    const formattedMessage = formatErrorMessage(message);
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#ffffff",
        color: "#4b5563",
        fontWeight: "500",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    };

    if (isSuccess) {
      toast.success(formattedMessage, options);
    } else {
      toast.error(formattedMessage, options);
    }
  }

  static showNotification(message, type = "info") {
    const formattedMessage = formatErrorMessage(message);
    const baseStyle = {
      background: "#ffffff",
      color: "#4b5563",
      fontWeight: "500",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };

    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#ffffff",
        color: "#4b5563",
        fontWeight: "500",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    };

    switch (type) {
      case "success":
        toast.success(formattedMessage, options);
        break;
      case "error":
        options.style.background = "#dc3545";
        toast.error(formattedMessage, options);
        break;
      case "warning":
        options.style.background = "#ffc107";
        options.style.color = "#000000";
        toast.warning(formattedMessage, options);
        break;
      case "info":
        options.style.background = "#0dcaf0";
        toast.info(formattedMessage, options);
        break;
      default:
        toast(formattedMessage, options);
    }
  }
}

export default ShowNotifications;
