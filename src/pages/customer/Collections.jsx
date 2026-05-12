import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, SlidersHorizontal, X, ChevronDown, Grid, List, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ecommerce/ProductCard';
import { productService } from '../../services/productService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const styleParam = searchParams.get('style');
  const searchParam = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedStyle, setSelectedStyle] = useState(styleParam || 'All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ["All", "Jaipuri Kurties", "Festive Wear", "Ethnic Co-ords", "Dupattas", "Sarees"];
  const sorts = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedStyle, searchQuery, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        query: searchQuery || undefined,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        style: selectedStyle === 'All' ? undefined : selectedStyle,
      };
      const response = await productService.getAllProducts(params);
      if (response.success) {
        setProducts(response.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (styleParam) setSelectedStyle(styleParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, styleParam, searchParam]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-primary">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Artisanal Heritage</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tighter">
                Curated <span className="italic font-light text-primary">Collections.</span>
             </h1>
             <p className="text-sm text-muted-foreground max-w-md">
                An exquisite selection of authentic Jaipuri attire, handcrafted for the modern patron.
             </p>
          </div>
  
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:min-w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
             </div>
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-3 bg-muted border border-border rounded-xl text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
             >
               <SlidersHorizontal size={20} />
             </button>
          </div>
        </div>
  
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-10">
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Categories</h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "text-left px-4 py-2.5 rounded-xl text-sm transition-all border border-transparent",
                      selectedCategory === cat 
                        ? "bg-primary text-primary-foreground font-bold shadow-md" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
               <Sparkles size={20} className="text-primary" />
               <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Premium Craft</h4>
               <p className="text-[11px] text-muted-foreground leading-relaxed">Each piece is ethically sourced and verified for authentic Jaipuri origin.</p>
            </div>
          </aside>
  
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 pb-5 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-1.5 p-1 bg-muted rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-background shadow-md text-primary" : "text-muted-foreground")}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-background shadow-md text-primary" : "text-muted-foreground")}
                  >
                    <List size={16} />
                  </button>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Found <span className="text-foreground">{products.length}</span> Masterpieces
                </p>
              </div>
  
              <div className="relative group">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors">
                  Sort: {sortBy} <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 mt-3 w-48 bg-card border border-border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden py-1">
                  {sorts.map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={cn(
                        "w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors",
                        sortBy === sort ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Grid */}
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "grid gap-8",
                    viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                  )}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-8">
                    <Search size={32} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-3">No Masterpieces Found</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                    We couldn't find any items matching your current selection. Try broadening your criteria.
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-card z-[210] shadow-2xl p-8 border-l border-border"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-bold text-foreground">Filters</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Refine Your Search</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 bg-muted rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-10">
                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                          selectedCategory === cat 
                            ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                            : "bg-muted/50 border-transparent text-muted-foreground hover:border-primary/20"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                   <p className="text-[11px] text-muted-foreground leading-relaxed">
                     Tip: You can search for specific fabrics like "Cotton" or "Silk" in the search bar above.
                   </p>
                </div>

                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;
