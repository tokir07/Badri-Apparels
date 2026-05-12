import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit, 
  Trash, Eye, ChevronRight, Package, ArrowUpDown,
  Download, FilterX, Archive, Sparkles, TrendingUp,
  ShoppingBag, Layers, AlertCircle, MousePointer2, Star
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ProductEntryOverlay from '../../components/admin/ProductEntryOverlay';
import { productService } from '../../services/productService';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Masterpieces');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        query: searchQuery || undefined,
        size: 50, // Fetch more products to ensure new ones are visible
      };
      console.log("Fetching products with params:", params);
      const response = await productService.getAllProducts(params);
      
      // Handle various response formats safely
      const productList = response?.data?.content || response?.data || [];
      console.log("Fetched products:", productList);
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to synchronize heritage collection");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this masterpiece from the archive?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success("Masterpiece removed from heritage collection");
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Failed to remove masterpiece");
      }
    }
  };

  const handleAddProduct = async (newProduct, images) => {
    try {
      const response = await productService.createProduct(newProduct, images);
      console.log("Product created successfully:", response);
      toast.success('Masterpiece Archived Successfully', {
        description: `${newProduct.name} has been added to our heritage collection.`
      });
      // Immediately re-fetch and close overlay
      await fetchProducts();
      setIsOverlayOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to archive masterpiece");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  // Magnetic Button Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 15, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-32"
    >
       {/* Immersive Header & Smart Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <motion.div variants={itemVariants} className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Heritage Intelligence</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
              Artisanal <span className="italic font-light text-primary">Ecosystem.</span>
           </h1>
           <p className="text-muted-foreground text-sm max-w-md leading-relaxed font-medium opacity-80">Manage your premium Jaipuri handcrafted collection with cultural precision and real-time inventory synchronization.</p>
        </motion.div>
 
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-6">
           {[
             { label: 'Total Stock', value: products.reduce((acc, curr) => acc + (curr.stock || 0), 0).toString(), icon: <Package size={16} />, trend: '+12%' },
             { label: 'Active SKUs', value: products.length.toString(), icon: <Layers size={16} />, trend: 'Stable' },
             { label: 'Artisan Picks', value: '4', icon: <Star size={16} />, trend: '+1' },
           ].map((stat, i) => (
             <div key={i} className="p-6 bg-background/60 backdrop-blur-md border border-border rounded-[2rem] flex flex-col gap-3 min-w-[160px] shadow-sm hover:border-primary/20 transition-all group">
                <div className="flex items-center justify-between">
                   <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      {stat.icon}
                   </div>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{stat.trend}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">{stat.label}</p>
                <h4 className="text-2xl font-bold text-foreground font-heading">{stat.value}</h4>
             </div>
           ))}
        </motion.div>
      </div>
 
      {/* Advanced Control Bar */}
      <motion.div variants={itemVariants} className="bg-background/40 backdrop-blur-xl border border-border p-8 rounded-[3rem] flex flex-col lg:flex-row justify-between gap-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
          <div className="relative group flex-1 w-full max-w-md">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Query heritage catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
          <button 
            onClick={() => toast.info("Filter Protocol: Advanced Curation Interface Active")}
            className="px-8 py-4 bg-background border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all flex items-center gap-3 shadow-sm"
          >
             <Filter size={18} /> Filter Protocol
          </button>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {['All Masterpieces', 'Jaipuri Kurties', 'Festive Wear', 'Ethnic Co-ords'].map((t) => (
            <button 
              key={t} 
              onClick={() => setActiveCategory(t)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
                activeCategory === t ? 'bg-primary text-primary-foreground shadow-xl' : 'bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary'
              }`}
            >
               {t}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-accent-gold/20 border-t-accent-maroon rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold animate-pulse">Synchronizing Heritage Archive...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              key={product.id || `temp-${index}`}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative"
            >
                <div className="bg-background/60 backdrop-blur-md border border-border rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-700 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                   <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                       src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800?text=No+Image'} 
                       alt={product.title} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-6 left-6">
                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border backdrop-blur-md ${
                           product.stock > 10 ? 'bg-green-500/10 text-green-700 border-green-500/20' : 
                           product.stock > 0 ? 'bg-accent/10 text-accent border-accent/20' : 
                           'bg-destructive/10 text-destructive border-destructive/20'
                         }`}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                         </div>
                      </div>
 
                      <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                         <button 
                            onClick={() => toast.info("Artisanal Edit Interface: Pending institutional deployment", { description: "Please use the 'Add' interface for latest updates." })}
                            className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:brightness-110 transition-all shadow-xl"
                         >
                            <Edit size={16} />
                         </button>
                         <button 
                            onClick={() => handleDelete(product.id)}
                            className="w-10 h-10 bg-background/60 backdrop-blur-md text-primary rounded-xl flex items-center justify-center hover:text-destructive border border-border transition-colors"
                         >
                            <Trash size={16} />
                         </button>
                      </div>
                   </div>
 
                   <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div className="space-y-1">
                            <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em]">{product.categoryName || 'Heritage'}</p>
                            <h3 className="text-xl font-heading font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{product.title}</h3>
                         </div>
                         <div className="text-right">
                             <p className="text-xl font-bold text-foreground font-heading">₹{(product.sellingPrice || product.discountPrice || product.mrp || product.price || 0).toLocaleString()}</p>
                             <p className="text-[9px] text-muted-foreground opacity-40 font-bold uppercase tracking-widest">
                               {product.hasVariants ? `${product.variants?.length || 0} Variants` : `${product.stock} units`} in archive
                             </p>
                         </div>
                      </div>
                      
                      <div className="pt-6 border-t border-border flex items-center justify-between">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-accent/20" />
                            ))}
                            <div className="w-7 h-7 rounded-full border-2 border-background bg-primary/5 flex items-center justify-center text-[8px] font-bold text-primary">+4</div>
                         </div>
                         <button 
                            onClick={() => toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
                              loading: 'Extracting cultural context...',
                              success: 'Insight generated: High demand in Festive Cycles',
                              error: 'Insight failure'
                            })}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group/btn"
                          >
                             Artisan Insight <ArrowUpDown size={12} className="group-hover/btn:translate-y-[-2px] transition-transform" />
                          </button>
                      </div>
                   </div>
                </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-accent-gold/20 rounded-[3rem] bg-white/40">
            <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center text-accent-gold">
               <Archive size={32} />
            </div>
            <div className="text-center space-y-2">
               <h3 className="text-2xl font-heading font-bold text-text-primary uppercase tracking-tighter">Archive is Empty</h3>
               <p className="text-xs text-text-secondary max-w-xs mx-auto">Our heritage collection currently awaits its next artisanal addition. Begin the curation process below.</p>
            </div>
            <button 
               onClick={() => setIsOverlayOpen(true)}
               className="mt-4 px-8 py-4 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-gold transition-all shadow-xl"
            >
               Archive First Masterpiece
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-12 right-12 z-[90]">
         <motion.div
           style={{ x: springX, y: springY }}
           onMouseMove={handleMouseMove}
           onMouseLeave={handleMouseLeave}
           className="relative group"
         >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOverlayOpen(true)}
              className="w-20 h-20 bg-accent-maroon text-white rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500 relative z-10" />
               <div className="absolute inset-0 bg-accent-maroon/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </motion.button>
            <div className="absolute right-24 top-1/2 -translate-y-1/2 px-4 py-2 bg-text-primary text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl">
               <span className="text-[10px] font-bold uppercase tracking-widest">Archive New Masterpiece</span>
            </div>
         </motion.div>
      </div>

      <ProductEntryOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
        onAdd={handleAddProduct}
      />
    </motion.div>
  );
};

export default AdminProducts;
