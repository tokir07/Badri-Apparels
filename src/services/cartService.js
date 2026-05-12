import api from './axios';

export const cartService = {
  getCart: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return { success: false, message: 'No token' };

    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error("GET CART ERROR:", error.response?.data || error.message);
      throw error;
    }
  },

  addToCart: async (productId, variantId, quantity, size, color) => {
    const response = await api.post('/cart/add', {
      productId,
      variantId,
      quantity,
      size,
      color
    });
    return response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}?quantity=${quantity}`);
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  applyCoupon: async (code) => {
    const response = await api.post(`/cart/coupon/apply?code=${code}`);
    return response.data;
  },

  removeCoupon: async () => {
    const response = await api.post('/cart/coupon/remove');
    return response.data;
  }
};

