import api from './axios';

export const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch wishlist' };
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const response = await api.post(`/wishlist/${productId}`);
      return { success: true, action: response.data.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update wishlist' };
    }
  },

  checkStatus: async (productId) => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      return { success: true, isInWishlist: response.data.data };
    } catch (error) {
      return { success: false, isInWishlist: false };
    }
  }
};
