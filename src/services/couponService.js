import axios from './axios';

const couponService = {
  validateCoupon: async (code, cartTotal) => {
    try {
      const response = await axios.post('/coupons/validate', { code, cartTotal });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Failed to validate coupon' };
    }
  },

  getAllCoupons: async () => {
    const response = await axios.get('/coupons');
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await axios.post('/coupons', couponData);
    return response.data;
  },

  updateCoupon: async (id, couponData) => {
    const response = await axios.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await axios.delete(`/coupons/${id}`);
    return response.data;
  }
};

export default couponService;
