import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import { toast } from 'sonner';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      loading: false,
      appliedCoupon: null,
      discountAmount: 0,
      finalPrice: 0,
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      fetchCart: async () => {
        try {
          set({ loading: true });
          const response = await cartService.getCart();
          if (response.success) {
            const backendItems = response.data.items.map(item => ({
              cartItemId: item.id,
              id: item.productId,
              name: item.productName,
              price: item.price,
              originalPrice: item.originalPrice,
              image: item.productImage,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            }));
            set({ 
              items: backendItems,
              appliedCoupon: response.data.appliedCoupon,
              discountAmount: response.data.discountAmount,
              finalPrice: response.data.finalPrice
            });
          }
        } catch (error) {
          console.error("Failed to sync cart:", error);
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (product, isAuthenticated = false) => {
        if (isAuthenticated) {
          try {
            const response = await cartService.addToCart(
              product.id, 
              product.variantId || null,
              product.quantity || 1, 
              product.size || 'M', 
              product.color || 'Default'
            );
            if (response.success) {
              get().fetchCart();
              toast.success(`Added ${product.name || product.title} to your cart`);
            }
          } catch (error) {
            if (error.response?.status === 401) {
              toast.error("Session expired. Please login to sync your cart.");
            } else {
              toast.error("Failed to add to cart");
            }
          }
        } else {
          set((state) => {
            const existingItem = state.items.find(item => 
              item.id === product.id && 
              item.variantId === product.variantId &&
              item.size === product.size && 
              item.color === product.color
            );
            
            if (existingItem) {
              toast.success(`Updated ${product.name || product.title} quantity`);
              return {
                items: state.items.map(item => 
                  item === existingItem ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
                )
              };
            }
            
            toast.success(`Added ${product.name || product.title} to your cart`);
            return { items: [...state.items, { ...product, quantity: product.quantity || 1 }] };
          });
        }
        set({ isOpen: true });
      },

      removeFromCart: async (id, size, color, cartItemId, isAuthenticated) => {
        if (isAuthenticated && cartItemId) {
          try {
            const response = await cartService.removeFromCart(cartItemId);
            if (response.success) {
              set((state) => ({
                items: state.items.filter(item => item.cartItemId !== cartItemId)
              }));
              toast.error('Item removed from cart');
            }
          } catch (error) {
            toast.error("Failed to remove item");
          }
        } else {
          set((state) => ({
            items: state.items.filter(item => !(item.id === id && item.size === size && item.color === color))
          }));
          toast.error('Item removed from cart');
        }
      },

      updateQuantity: async (id, size, color, change, cartItemId, isAuthenticated) => {
        const item = get().items.find(i => i.id === id && i.size === size && i.color === color);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + change);

        if (isAuthenticated && cartItemId) {
          try {
            const response = await cartService.updateQuantity(cartItemId, newQuantity);
            if (response.success) {
              set((state) => ({
                items: state.items.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i)
              }));
            }
          } catch (error) {
            toast.error("Failed to update quantity");
          }
        } else {
          set((state) => ({
            items: state.items.map(item => {
              if (item.id === id && item.size === size && item.color === color) {
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
          }));
        }
      },

      clearCart: async (isAuthenticated) => {
        if (isAuthenticated) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error("Failed to clear backend cart");
          }
        }
        set({ items: [], appliedCoupon: null, discountAmount: 0, finalPrice: 0 });
      },

      applyCoupon: async (code) => {
        try {
          set({ loading: true });
          const response = await cartService.applyCoupon(code);
          if (response.success) {
            const backendItems = response.data.items.map(item => ({
              cartItemId: item.id,
              id: item.productId,
              name: item.productName,
              price: item.price,
              originalPrice: item.originalPrice,
              image: item.productImage,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            }));
            set({ 
              items: backendItems,
              appliedCoupon: response.data.appliedCoupon,
              discountAmount: response.data.discountAmount,
              finalPrice: response.data.finalPrice
            });
            toast.success("Coupon applied successfully!");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Invalid coupon code");
        } finally {
          set({ loading: false });
        }
      },

      removeCoupon: async () => {
        try {
          set({ loading: true });
          const response = await cartService.removeCoupon();
          if (response.success) {
            const backendItems = response.data.items.map(item => ({
              cartItemId: item.id,
              id: item.productId,
              name: item.productName,
              price: item.price,
              originalPrice: item.originalPrice,
              image: item.productImage,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            }));
            set({ 
              items: backendItems,
              appliedCoupon: null,
              discountAmount: 0,
              finalPrice: response.data.finalPrice
            });
            toast.info("Coupon removed");
          }
        } catch (error) {
          toast.error("Failed to remove coupon");
        } finally {
          set({ loading: false });
        }
      },

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getSubtotal: () => {
        const { finalPrice, items } = get();
        if (finalPrice > 0) return finalPrice;
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      getRawSubtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'badri-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
