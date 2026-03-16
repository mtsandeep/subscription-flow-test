import api from './axios';

/**
 * Subscriptions API
 * Handles subscription-related API calls
 */
export const subscriptionsApi = {
  /**
   * Create a new subscription
   */
  subscribe: async (data) => {
    const response = await api.post('/subscriptions/subscribe', data);
    return response.data;
  },
};

export default subscriptionsApi;
