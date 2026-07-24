import { api } from "./api";

export const getDecorations = async (params = {}) => {
    try {
        const queryParams = { page: 0, limit: 1000, isActive: true, ...params };
        const response = await api.get("/decorations", { params: queryParams });
        return { status: true, response: response.data };
    } catch (error) {
        return { status: false, response: error.response?.data };
    }
};
