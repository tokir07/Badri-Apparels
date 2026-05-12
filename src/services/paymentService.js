import api from './axios';

export const paymentService = {
  createOrder: async () => {
    const response = await api.post('/payments/create-order');
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  }
};
