import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import PriceTag from './PriceTag';
import { cn } from '../../lib/utils';

const QuickView = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!isOpen) return null;

  // Robust Price Logic
  const sellingPrice = product.sellingPrice || product.discountPrice || product.mrp || product.price || 0;
  const mrp = product.mrp || product.price || 0;
  const name = product.name || product.title || 'Untitled Masterpiece';

  const handleAddToCart = () => {
    addItem({ ...product, price: sellingPrice, name, size: selectedSize }, isAuthenticated);
    onClose();
  };

  const inWishlist = isInWishlist(product.id);
  const gallery = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.image || 'https://via.placeholder.com/600x800?text=No+Image' }];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 lg:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] border border-border"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 bg-background/80 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm border border-border"
          >
            <X size={20} />
          </button>
  
          {/* Left: Product Images */}
          <div className="w-full lg:w-1/2 h-[45%] lg:h-full relative bg-muted shrink-0 border-b lg:border-b-0 lg:border-r border-border">
             <motion.img 
               key={gallery[activeImage].url}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               src={gallery[activeImage].url} 
               alt={name} 
               className="w-full h-full object-cover" 
             />
             <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {gallery.map((img, i) => (
                  <button 
                    key={`thumb-${i}`} 
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-16 h-20 rounded-xl border-2 overflow-hidden transition-all shadow-lg shrink-0",
                      activeImage === i ? "border-primary scale-110" : "border-white/50 grayscale hover:grayscale-0"
                    )}
                  >
                     <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
          </div>
  
          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 h-[55%] lg:h-full overflow-y-auto no-scrollbar bg-card">
            <div className="p-8 lg:p-12 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded">New Collection</span>
                   <div className="flex items-center gap-1">
                      <Star size={12} className="fill-accent text-accent" />
                      <span className="text-[10px] font-bold text-foreground">{product.rating || '4.9'}</span>
                   </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground leading-tight">{name}</h2>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-tighter">{product.fabric || 'Premium Jaipuri Cotton'}</p>
              </div>
  
              <PriceTag price={sellingPrice} mrp={mrp} className="py-6 border-y border-border" />
  
              <div className="space-y-6">
                {/* Size Selector */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Size</span>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-4">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                      <button
                        key={`size-${size}`}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all border-2",
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                            : 'bg-muted/50 border-transparent text-muted-foreground hover:border-primary/30'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
  
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl"
                >
                  <ShoppingBag size={18} /> Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center transition-all shrink-0 border-2 shadow-sm",
                    inWishlist 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'bg-muted/50 border-transparent text-muted-foreground hover:border-primary/30'
                  )}
                >
                  <Heart size={22} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              </div>
  
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                 {[
                   { icon: <Truck size={18} />, label: 'Swift Delivery' },
                   { icon: <RefreshCw size={18} />, label: 'Easy Exchange' },
                   { icon: <ShieldCheck size={18} />, label: 'Secure Pay' },
                 ].map((benefit, i) => (
                   <div key={`benefit-${i}`} className="flex flex-col items-center gap-2 text-center">
                      <div className="p-3 bg-muted rounded-xl text-primary">
                         {benefit.icon}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{benefit.label}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickView;
