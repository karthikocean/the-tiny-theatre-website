import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class ScreenApi {
    getScreens = async (params = {}) => {
        try {
            const queryParams = { page: 0, limit: 1000, isActive: true, ...params };
            const response = await api.get("/screens", { params: queryParams });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch screens.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const screenApi = new ScreenApi();
export default screenApi;

export const { getScreens } = screenApi;
