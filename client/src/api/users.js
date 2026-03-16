import api from './axios';

/**
 * Users API
 * Handles all user-related API calls
 */
export const usersApi = {
  /**
   * Get user by username
   * @param {string} username - Username to look up
   * @returns {Promise<{user: Object}>}
   */
  getByUsername: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  /**
   * Create or login as a new user
   * @param {Object} userData - User data
   * @param {string} userData.username - Username (required)
   * @param {string} userData.name - Full name (required)
   * @param {number} [userData.age] - Age (optional)
   * @param {number} [userData.weight] - Weight in kg (optional)
   * @param {number} [userData.height] - Height in cm (optional)
   * @returns {Promise<{success: boolean, user: Object}>}
   */
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

export default usersApi;
