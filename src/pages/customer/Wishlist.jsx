import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCartStore } from '../../store/useCartStore';
import ProductCard from '../../components/ecommerce/ProductCard';
import { cn } from '../../lib/utils';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Curated Selection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
              Your <span className="italic font-light text-muted-foreground">Wishlist</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              A collection of your favorite artisanal pieces, saved for later.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-4 py-2 px-4 bg-muted rounded-full border border-border">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Wishlist Content */}
        <AnimatePresence mode="wait">
          {wishlist.length > 0 ? (
            <motion.div
              key="wishlist-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {wishlist.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-8">
                <Heart size={32} className="text-muted-foreground/40" />
              </div>

              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-xs text-sm mb-10">Discover something iconic. Save your favorite pieces and build your personal collection.</p>
              
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-lg gap-3"
              >
                Explore Collections <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        {wishlist.length > 0 && (
          <div className="mt-32 pt-20 border-t border-border">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">You May Also <span className="italic text-primary">Love</span></h2>
              <p className="text-sm text-muted-foreground">Artisanal suggestions based on your personal style.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
