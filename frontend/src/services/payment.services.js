import api from './api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (rentalId) => {
    try {
      const response = await api.post('/payments/create-intent', { rentalId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/confirm', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Process refund
  processRefund: async (rentalId, amount) => {
    try {
      const response = await api.post('/payments/refund', { rentalId, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    // This would typically come from an API
    return [
      { id: 'card', name: 'Credit/Debit Card', icon: '💳', enabled: true },
      { id: 'upi', name: 'UPI', icon: '📱', enabled: true },
      { id: 'netbanking', name: 'Net Banking', icon: '🏦', enabled: true },
      { id: 'cod', name: 'Cash on Delivery', icon: '💰', enabled: true },
    ];
  }
};