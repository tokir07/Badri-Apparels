import api from './axios';

export const addressService = {
  getAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch addresses' };
    }
  },

  addAddress: async (data) => {
    try {
      const response = await api.post('/users/addresses', data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add address' };
    }
  },

  updateAddress: async (id, data) => {
    try {
      const response = await api.put(`/users/addresses/${id}`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update address' };
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/users/addresses/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete address' };
    }
  },

  setDefaultAddress: async (id) => {
    try {
      const response = await api.patch(`/users/addresses/${id}/default`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update default address' };
    }
  }
};
