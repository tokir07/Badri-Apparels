import api from './axios';

export const shipmentService = {
  getTrackingByOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },
  
  // Simulated tracking updates for development
  getTimeline: (status) => {
    const states = [
      { id: 'PENDING', label: 'Order Placed', icon: 'ShoppingBag' },
      { id: 'CONFIRMED', label: 'Confirmed', icon: 'CheckCircle' },
      { id: 'PACKED', label: 'Artisanally Packed', icon: 'Box' },
      { id: 'SHIPPED', label: 'Shipped', icon: 'Truck' },
      { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'MapPin' },
      { id: 'DELIVERED', label: 'Delivered', icon: 'Home' }
    ];
    
    const currentIndex = states.findIndex(s => s.id === status);
    return states.map((s, i) => ({
      ...s,
      isCompleted: i <= currentIndex,
      isActive: i === currentIndex
    }));
  }
};
