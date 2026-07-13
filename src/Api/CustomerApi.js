import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class CustomerApi {
    verifyCustomer = async (data) => {
        try {
            const response = await api.post("/customers/verify", data);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to verify customer.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const customerApi = new CustomerApi();
export default customerApi;

export const { verifyCustomer } = customerApi;
