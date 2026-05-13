import { create } from 'zustand';
import { wishlistService } from '../services/wishlistService';
import { toast } from 'sonner';

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,

  fetchWishlist: async () => {
    try {
      set({ loading: true });
      const res = await wishlistService.getWishlist();
      if (res.success) {
        set({ wishlist: res.data });
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (product) => {
    try {
      const res = await wishlistService.toggleWishlist(product.id);
      if (res.success) {
        if (res.action === 'ADDED') {
          set(state => ({ wishlist: [product, ...state.wishlist] }));
          toast.success(res.message);
        } else {
          set(state => ({ wishlist: state.wishlist.filter(item => item.id !== product.id) }));
          toast.error(res.message);
        }
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (error) {
      toast.error("Failed to update wishlist");
      return false;
    }
  },

  isInWishlist: (id) => {
    return get().wishlist.some(item => item.id === id);
  },

  clearWishlist: () => set({ wishlist: [] })
}));
