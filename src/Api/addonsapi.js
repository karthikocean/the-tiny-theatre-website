import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class AddonsApi {
    getAddons = async (params) => {
        try {
            const response = await api.get("/addons", { params });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch addons.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const addonsApi = new AddonsApi();
export default addonsApi;

export const { getAddons } = addonsApi;
