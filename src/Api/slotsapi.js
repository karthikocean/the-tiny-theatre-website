import apiClient from './api';

export const getSlots = async (screenId, date) => {
  try {
    const response = await apiClient.get('/slots', {
      params: {
        screen: screenId,
        date: date
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};
