import api from './axios';

/**
 * Coupons API
 * Handles all coupon-related API calls
 */
export const couponsApi = {
  /**
   * Get all coupons
   */
  getAll: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },
  /**
   * Validate a coupon code
   */
  validate: async (data) => {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },
};

export default couponsApi;
