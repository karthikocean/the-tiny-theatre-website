import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class BookingApi {
    getBooking = async (params) => {
        try {
            const response = await api.get("/bookings", { params });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch gallery.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    };

}

const bookingApi = new BookingApi();
export default bookingApi;

export const { getBooking } = bookingApi;
