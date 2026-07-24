import apiClient from './api';

export const getSlots = async (screenId, date, extraParams = {}) => {
  try {
    const response = await apiClient.get('/slots', {
      params: {
        screen: screenId,
        date: date,
        page: 0,
        limit: 1000,
        isActive: true,
        ...extraParams
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};
