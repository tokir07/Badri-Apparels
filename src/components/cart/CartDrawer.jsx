import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

const CartDrawer = () => {
  const { 
    items, isOpen, setIsOpen, removeFromCart, updateQuantity, 
    getSubtotal, getRawSubtotal, appliedCoupon, discountAmount, 
    applyCoupon, removeCoupon 
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalValue = getSubtotal() || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-[101] flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="space-y-1">
                <h2 className="text-xl font-heading font-bold flex items-center gap-2 text-foreground">
                  <ShoppingBag size={20} className="text-primary" />
                  Bag
                </h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'} Selected
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
  
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                      <ShoppingBag size={32} className="text-muted-foreground/30" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Your bag is empty</h3>
                    <p className="text-muted-foreground text-xs mb-8 max-w-[200px]">Browse our latest collections to find your perfect artisanal fit.</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="px-10 py-3.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-lg"
                    >
                      Start Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-4 bg-background rounded-2xl border border-border relative group hover:shadow-md transition-all"
                    >
                      <button 
                        onClick={() => removeFromCart(item.id, item.size, item.color || 'Default', item.cartItemId, isAuthenticated)}
                        className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        <img src={item.image || (item.images && item.images[0]?.url)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex flex-col flex-1 py-1">
                        <div className="mb-2">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-primary mb-1">{item.brand || 'Badri Bhai Collective'}</p>
                          <h3 className="font-bold text-foreground text-sm line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Size: {item.size}</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="font-bold text-sm text-foreground">₹{(item.price || 0).toLocaleString()}</p>
                            {item.originalPrice > item.price && (
                              <p className="text-[10px] text-muted-foreground line-through decoration-destructive/50">₹{(item.originalPrice || 0).toLocaleString()}</p>
                            )}
                          </div>

                          
                          <div className="flex items-center bg-muted rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.color || 'Default', -1, item.cartItemId, isAuthenticated)} 
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background hover:text-primary transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.color || 'Default', 1, item.cartItemId, isAuthenticated)} 
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background hover:text-primary transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
  
            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-card border-t border-border">
                {/* Coupon Section */}
                {isAuthenticated && (
                  <div className="mb-8">
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          id="coupon-input"
                          placeholder="ARTISANAL CODE" 
                          className="flex-1 bg-muted border-border border rounded-xl px-4 py-2 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button 
                          onClick={() => {
                            const code = document.getElementById('coupon-input').value;
                            if(code) applyCoupon(code);
                          }}
                          className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{appliedCoupon}</span>
                          <span className="text-[8px] font-medium text-primary/60">Applied</span>
                        </div>
                        <button 
                          onClick={removeCoupon}
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₹{(getRawSubtotal() || 0).toLocaleString()}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-primary text-[10px] font-bold uppercase tracking-widest">
                      <span>Artisanal Discount</span>
                      <span>- ₹{(discountAmount || 0).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-green-600">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-foreground pt-6 border-t border-border items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Payable</p>
                      <p className="text-3xl font-heading font-bold">₹{(subtotalValue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl gap-3 group"
                >
                  Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="text-[8px] text-center text-muted-foreground uppercase tracking-widest mt-6 font-bold opacity-50">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
