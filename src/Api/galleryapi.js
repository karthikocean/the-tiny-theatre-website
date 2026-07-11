import { api } from "./api";
import ShowNotifications from "../helper/showNotification";

class GalleryApi {
    getGallery = async (params) => {
        try {
            const response = await api.get("/galleries", { params });
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

const galleryApi = new GalleryApi();
export default galleryApi;

export const { getGallery } = galleryApi;
