import api from './axios';

export const reviewService = {
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch reviews' };
    }
  },

  submitReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to submit review' };
    }
  }
};
