import axios from './axios';

export const orderService = {
  getUserOrders: async () => {
    try {
      const response = await axios.get('/orders/my-orders');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch orders' };
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axios.get(`/orders/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Order not found' };
    }
  },

  updateShipment: async (orderId, shipmentData) => {
    try {
      const response = await axios.patch(`/admin/orders/${orderId}/shipment`, shipmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update shipment' };
    }
  },

  getOrderTracking: async (orderId) => {
    try {
      const response = await axios.get(`/orders/${orderId}/tracking`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Tracking info not found' };
    }
  },

  downloadInvoice: (orderId) => axios.get(`/orders/${orderId}/invoice`, { responseType: 'blob' })
};
