import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class ContactApi {
    addContact = async (data) => {
        try {
            const response = await api.post("/inquiries", data);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to send inquiry.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const contactApi = new ContactApi();
export default contactApi;

export const { addContact } = contactApi;
