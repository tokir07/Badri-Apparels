import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Plus, Sparkles, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { productService } from '../../services/productService';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const NewArrivals = () => {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({ pageSize: 10 });
      if (response.success) {
        const transformed = response.data.content.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category?.name || 'Jaipur Craft',
          price: p.discountPrice || p.price,
          originalPrice: p.price,
          image1: p.images?.[0]?.url || 'https://placehold.co/600x800?text=No+Image',
          image2: p.images?.[1]?.url || p.images?.[0]?.url || 'https://placehold.co/600x800?text=No+Image',
          badge: p.featured ? 'FEATURED' : (p.trending ? 'TRENDING' : 'NEW'),
          rating: p.rating || 4.9,
          reviews: p.reviewsCount || 0
        }));
        setProducts(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carouselRef.current && products.length > 0) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [products]);

  const filters = ['All', 'Jaipuri Kurties', 'Festive Wear', 'Ethnic Co-ords'];

  const handleAddToCart = (product) => {
    addItem({
      ...product,
      name: product.title,
      price: product.price,
      image: product.image1,
      quantity: 1,
      size: 'M'
    });
    toast.success(`${product.title} added to bag`);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-primary">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Season's Best</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tighter">
                New <span className="italic font-light text-primary">Arrivals.</span>
             </h2>
             <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
                Discover our latest handcrafted silhouettes, where Jaipur's heritage meets contemporary grace.
             </p>
          </div>
          
          {/* Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
 
        {/* Filter Chips */}
        <div className="flex flex-nowrap overflow-x-auto pb-4 gap-2.5 mt-10 no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "relative shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                activeFilter === filter 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                  : 'bg-muted/50 text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
 
      {/* Slider Container */}
      <div className="pl-4 md:pl-8 lg:pl-[max(2rem,calc((100%-80rem)/2))] pb-12 overflow-hidden">
        <motion.div 
          ref={carouselRef} 
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            className="flex gap-6 md:gap-8 w-max pr-8 md:pr-12"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="w-[280px] md:w-[350px] aspect-[3/4] bg-muted animate-pulse rounded-2xl" />
              ))
            ) : (
              products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-[280px] md:w-[350px] group relative"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-5">
                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                      <img 
                        src={product.image1} 
                        alt={product.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </Link>
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-background/80 backdrop-blur-md text-foreground text-[8px] font-bold uppercase tracking-widest rounded-lg border border-border shadow-sm">
                          {product.badge}
                        </span>
                      </div>
                    )}
   
                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-widest uppercase hover:brightness-110 transition-all rounded-xl shadow-xl flex items-center justify-center gap-2.5"
                      >
                        <Plus size={16} /> Quick Add
                      </button>
                    </div>
                  </div>
   
                  {/* Product Info */}
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-1 text-primary">
                        <Star size={10} className="fill-current" />
                        <span className="text-[10px] text-muted-foreground font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-base font-heading font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground">
                        ₹{(product.price || 0).toLocaleString()}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-[10px] text-muted-foreground line-through font-medium">
                          ₹{(product.originalPrice || 0).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* View All CTA */}
      <div className="mt-8 flex justify-center">
        <Link to="/products" className="group flex items-center gap-4 px-10 py-4 bg-muted text-foreground text-[10px] uppercase tracking-widest font-bold rounded-xl border border-border hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
           Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
};

export default NewArrivals;
