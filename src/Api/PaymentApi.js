import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class PaymentApi {
    getRazorpayKey = async () => {
        try {
            const response = await api.get("/payments/key");
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch Razorpay key.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

    createRazorpayOrder = async (data) => {
        try {
            const response = await api.post("/payments/create-order", data);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to create payment order.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

    verifyRazorpayPayment = async (data) => {
        try {
            const response = await api.post("/payments/verify", data);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to verify payment.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };
}

const paymentApi = new PaymentApi();
export default paymentApi;

export const { getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } = paymentApi;
