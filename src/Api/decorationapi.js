import { api } from "./api";

export const getDecorations = async () => {
    try {
        const response = await api.get("/decorations?page=1&limit=1000");
        return { status: true, response: response.data };
    } catch (error) {
        return { status: false, response: error.response?.data };
    }
};
