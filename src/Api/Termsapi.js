import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class TermsApi {
    getTerms = async (params) => {
        try {
            const response = await api.get("/contents", { params });
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

const termsApi = new TermsApi();
export default termsApi;

export const { getTerms } = termsApi;
