import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Grid, List, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ecommerce/ProductCard';
import SearchAndFilter from '../../components/customer/SearchAndFilter';
import { productService } from '../../services/productService';
import { cn } from '../../lib/utils';

const JaipuriKurties = () => {
   const [searchParams] = useSearchParams();
   const styleParam = searchParams.get('style');

   const [products, setProducts] = useState([]);
   const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0, size: 10, number: 0 });
   const [loading, setLoading] = useState(true);
   const [viewMode, setViewMode] = useState('grid');
   const [selectedStyle, setSelectedStyle] = useState(styleParam || 'All');

   const styles = ["All", "Anarkali", "Straight", "Short Kurtis", "Festive"];

   useEffect(() => {
      if (styleParam) setSelectedStyle(styleParam);
   }, [styleParam]);

   useEffect(() => {
      fetchKurties();
   }, [searchParams, selectedStyle]);

   const fetchKurties = async () => {
      try {
         setLoading(true);
         const queryParams = Object.fromEntries(searchParams.entries());
         const params = {
            ...queryParams,
            search: queryParams.search || (selectedStyle !== 'All' ? selectedStyle : undefined),
            // We assume "Jaipuri Kurties" is a category name or handled by search
            // If we have its ID, we should use categoryId
         };
         
         const response = await productService.getAllProducts(params);
         if (response.success) {
            setProducts(response.data.content);
            setPagination({
               totalElements: response.data.totalElements,
               totalPages: response.data.totalPages,
               size: response.data.size,
               number: response.data.number
            });
         }
      } catch (error) {
         console.error("Failed to fetch kurties:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-background min-h-screen">
         
         {/* HERO SECTION - ARTISANAL GLORY */}
         <section className="relative h-[60vh] flex items-center overflow-hidden pt-20">
            <div className="absolute inset-0 z-0">
               <img 
                  src="/src/assets/WhatsApp Image 2026-05-11 at 1.34.14 AM (1).jpeg" 
                  alt="Jaipuri Kurti Anthology" 
                  className="w-full h-full object-cover grayscale-[0.3] scale-105"
               />
               <div className="absolute inset-0 bg-black/50" />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 px-6 md:px-12 text-center">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-4xl mx-auto space-y-6"
               >
                  <div className="flex items-center justify-center gap-3">
                     <div className="w-8 h-[1px] bg-accent-gold" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-accent-gold">Heritage Anthology</span>
                     <div className="w-8 h-[1px] bg-accent-gold" />
                  </div>

                  <h1 className="text-5xl md:text-8xl font-heading font-bold text-white tracking-tighter leading-none">
                     Jaipuri <span className="italic font-light text-accent-gold/80">Kurties.</span>
                  </h1>

                  <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                     A curated collective of hand-blocked masterpieces, where the royal heritage of Jaipur meets the modern patron's silhouette.
                  </p>
               </motion.div>
            </div>
         </section>

         {/* STYLE SELECTOR */}
         <section className="py-12 border-b border-border sticky top-[64px] z-50 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 space-y-8">
               <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {styles.map((style) => (
                     <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={cn(
                           "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border shrink-0",
                           selectedStyle === style 
                              ? "bg-accent-maroon text-white border-accent-maroon shadow-lg" 
                              : "text-muted-foreground border-accent-gold/10 hover:border-accent-maroon hover:text-accent-maroon bg-white"
                        )}
                     >
                        {style}
                     </button>
                  ))}
               </div>
               
               <SearchAndFilter />
            </div>
         </section>

         {/* PRODUCT GRID */}
         <section className="py-20 container mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
                     <button 
                        onClick={() => setViewMode('grid')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-background shadow-md text-accent-maroon" : "text-muted-foreground")}
                     >
                        <Grid size={16} />
                     </button>
                     <button 
                        onClick={() => setViewMode('list')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-background shadow-md text-accent-maroon" : "text-muted-foreground")}
                     >
                        <List size={16} />
                     </button>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                     Showing <span className="text-text-primary">{pagination.totalElements}</span> Masterpieces
                  </p>
               </div>
            </div>

            <AnimatePresence mode="wait">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-40 gap-4">
                     <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Scanning Anthology...</p>
                  </div>
               ) : products.length > 0 ? (
                  <motion.div 
                     key={selectedStyle + JSON.stringify(Object.fromEntries(searchParams))}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.5 }}
                     className={cn(
                        "grid gap-10",
                        viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                     )}
                  >
                     {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </motion.div>
               ) : (
                  <div className="py-24 text-center space-y-6 bg-primary/5 rounded-[4rem] border-2 border-dashed border-accent-gold/10">
                     <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl">
                        <Sparkles size={32} className="text-accent-gold/30" />
                     </div>
                     <h3 className="text-2xl font-heading font-bold text-text-primary">No Silhouettes Found</h3>
                     <p className="text-text-secondary max-w-sm mx-auto text-sm">Our artisans are working on new pieces. Please explore other criteria in our heritage anthology.</p>
                  </div>
               )}
            </AnimatePresence>
         </section>

         {/* CRAFTSMANSHIP BANNER */}
         <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-[100px]" />
            <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
               <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-accent-gold">Ethical Luxury</span>
                  <h2 className="text-4xl md:text-6xl font-heading font-bold">Handcrafted with <span className="italic font-light">Soul.</span></h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                  {[
                     { icon: <Leaf size={24} />, title: 'Pure Cotton', desc: 'Sourced from the heart of Rajasthan' },
                     { icon: <ShieldCheck size={24} />, title: 'Authentic GI', desc: 'Certified artisanal techniques' },
                     { icon: <Star size={24} />, title: 'Master Craft', desc: 'Passed through 7 master artisans' },
                  ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-accent-gold">
                           {item.icon}
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

      </div>
   );
};

export default JaipuriKurties;
