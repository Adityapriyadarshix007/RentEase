import api from './api';

const maintenanceService = {
  // Create maintenance request
  createRequest: async (requestData) => {
    const response = await api.post('/maintenance', requestData);
    return response.data;
  },

  // Get user's requests
  getUserRequests: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/maintenance/my-requests?${queryParams}`);
    return response.data;
  },

  // Get request by ID
  getRequestById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  // Get all requests (Admin)
  getAllRequests: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/maintenance?${queryParams}`);
    return response.data;
  },

  // Update request status (Admin)
  updateRequestStatus: async (id, statusData) => {
    const response = await api.put(`/maintenance/${id}/status`, statusData);
    return response.data;
  },

  // Delete request (Admin)
  deleteRequest: async (id) => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  }
};

export default maintenanceService;