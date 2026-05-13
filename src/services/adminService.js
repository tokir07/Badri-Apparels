import axios from './axios';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/admin/dashboard/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch dashboard stats' };
    }
  },

  getDashboardSummary: async (params = {}) => {
    try {
      const response = await axios.get('/admin/dashboard/summary', { params });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch dashboard summary' };
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get('/admin/orders');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch orders' };
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(`/admin/orders/${orderId}/status?status=${status}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update order status' };
    }
  },
  
  getAllUsers: async () => {
    try {
      const response = await axios.get('/admin/users');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch patrons' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete patron' };
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await axios.put(`/admin/users/${userId}/status?isActive=${isActive}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update patron status' };
    }
  }
};
