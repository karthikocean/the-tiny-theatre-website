import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatErrorMessage } from "./TextHelper";

class ShowNotifications {
  static showAlertNotification(message, isSuccess = true) {
    const formattedMessage = formatErrorMessage(message);
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: "var(--bg-card, #13100d)",
        color: isSuccess ? "var(--success, #10b981)" : "var(--danger, #ef4444)",
        fontWeight: "500",
        borderRadius: "8px",
        border: "1px solid var(--border-color, #1e1712)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
      },
      progressStyle: {
        background: isSuccess ? "var(--success, #10b981)" : "var(--danger, #ef4444)",
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
      background: "var(--bg-card, #13100d)",
      color: "var(--text-primary, #eae3db)",
      fontWeight: "500",
      borderRadius: "8px",
      border: "1px solid var(--border-color, #1e1712)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
    };

    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: baseStyle,
      progressStyle: {
        background: "var(--gold, #cca751)",
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
