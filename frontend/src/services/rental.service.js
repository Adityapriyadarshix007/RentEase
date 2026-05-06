import api from './api';

const rentalService = {
  // Create new rental
  createRental: async (rentalData) => {
    const response = await api.post('/rentals', rentalData);
    return response.data;
  },

  // Get user's rentals
  getUserRentals: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/rentals/my-rentals?${queryParams}`);
    return response.data;
  },

  // Get rental by ID
  getRentalById: async (id) => {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  // Cancel rental
  cancelRental: async (id) => {
    const response = await api.put(`/rentals/${id}/cancel`);
    return response.data;
  },

  // Request extension
  requestExtension: async (id, extensionMonths) => {
    const response = await api.post(`/rentals/${id}/extend`, { extensionMonths });
    return response.data;
  },

  // Get all rentals (Admin)
  getAllRentals: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/rentals?${queryParams}`);
    return response.data;
  },

  // Update rental status (Admin)
  updateRentalStatus: async (id, status) => {
    const response = await api.put(`/rentals/${id}/status`, { status });
    return response.data;
  }
};

export default rentalService;