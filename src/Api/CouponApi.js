import { api } from './api';

export const getActiveCoupons = async () => {
    try {
        const response = await api.get(`/coupons/active`);
        return { status: true, response: response.data };
    } catch (error) {
        return { status: false, response: error.response?.data || error.message };
    }
};
