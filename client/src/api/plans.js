import api from './axios';

/**
 * Plans API
 * Handles all plan-related API calls
 */
export const plansApi = {
  /**
   * Get all available plans
   * @returns {Promise<{plans: Array}>}
   */
  getAll: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  /**
   * Get a specific plan by ID
   * @param {number|string} id - Plan ID
   * @returns {Promise<{plan: Object}>}
   */
  getById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },
};

export default plansApi;
