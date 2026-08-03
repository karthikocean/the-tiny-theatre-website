import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class RefundPolicyApi {
    getRefundPolicy = async (params = {}) => {
        try {
            const queryParams = { page: 0, limit: 1000, isActive: true, ...params };
            const response = await api.get("/contents/refundpolicy", { params: queryParams });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch refund policy.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };
    bookingInfo = async (title = 'Booking Info') => {
        try {
            const response = await api.get(`/contents/title/${encodeURIComponent(title)}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to check refund eligibility.";
            // ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const refundPolicyApi = new RefundPolicyApi();
export default refundPolicyApi;

export const { getRefundPolicy ,bookingInfo} = refundPolicyApi;
