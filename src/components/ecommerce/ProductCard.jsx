import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Plus } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlist } from '../../context/WishlistContext';
import PriceTag from './PriceTag';
import QuickView from './QuickView';
import { cn } from '../../lib/utils';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const sellingPrice = product.sellingPrice || product.discountPrice || product.mrp || product.price || 0;
  const mrp = product.mrp || product.price || 0;
  const name = product.name || product.title || 'Untitled Masterpiece';
  const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  const mainImage = product.images?.[0]?.url || 'https://via.placeholder.com/600x800?text=No+Image';
  const hoverImage = product.images?.[1]?.url || mainImage;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({ ...product, price: sellingPrice, name }, isAuthenticated);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-card rounded-xl overflow-hidden transition-all duration-300 border border-border hover:shadow-xl hover:-translate-y-1"
      >
        {/* MEDIA SECTION */}
        <div className="aspect-[3/4] overflow-hidden relative bg-muted">
          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            className={cn(
              "absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
              inWishlist 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2} />
          </button>
  
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-20">
               <span className="px-2 py-1 bg-accent text-accent-foreground text-[8px] font-bold uppercase tracking-widest rounded shadow-sm">
                  {discount}% OFF
               </span>
            </div>
          )}
  
          {/* Product Images */}
          <div className="w-full h-full relative cursor-pointer" onClick={() => setIsQuickViewOpen(true)}>
            <img
              src={mainImage}
              alt={name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700 ease-out",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
            {hoverImage !== mainImage && (
              <img
                src={hoverImage}
                alt={name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
  
          {/* Quick Add Action */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "absolute bottom-3 left-3 right-3 py-3 bg-foreground text-background rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all z-20 transform",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <Plus size={12} /> Add to Cart
          </button>
        </div>
  
        {/* INFO SECTION */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
             <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">{product.brand || 'Badri Bhai Collective'}</p>
             <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
               {name}
             </h3>
          </div>
  
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{product.fabric || 'Premium Cotton'}</span>
             <div className="w-1 h-1 rounded-full bg-border" />
             <span className="text-[9px] font-medium text-muted-foreground">{product.printType || 'Handblock'}</span>
          </div>
  
          <div className="pt-1 flex items-center justify-between">
            <PriceTag price={sellingPrice} mrp={mrp} className="scale-95 origin-left" />
            <div className="flex items-center gap-1">
               <Star size={10} className="fill-accent text-accent" />
               <span className="text-[10px] font-bold text-foreground">{product.rating || '4.9'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickView 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
