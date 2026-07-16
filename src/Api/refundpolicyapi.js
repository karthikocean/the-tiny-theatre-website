import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class RefundPolicyApi {
    getRefundPolicy = async (params) => {
        try {
            const response = await api.get("/contents/refundpolicy", { params });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch terms.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const refundPolicyApi = new RefundPolicyApi();
export default refundPolicyApi;

export const { getRefundPolicy } = refundPolicyApi;
