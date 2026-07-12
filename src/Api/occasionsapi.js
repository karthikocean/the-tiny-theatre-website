import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class OccasionsApi {
    getOccasions = async () => {
        try {
            const response = await api.get("/occasions");
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch occasions.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };
}

const occasionsApi = new OccasionsApi();
export default occasionsApi;

export const { getOccasions } = occasionsApi;
