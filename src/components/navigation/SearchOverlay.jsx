import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const trendingSearches = [
    'Handblock Kurties', 
    'Anarkali Collection', 
    'Cotton Co-ord Sets', 
    'Floral Block Prints', 
    'Festive Dupattas', 
    'Mughal Inspired'
  ];
  
  const recentHistory = [
    'Indigo Block Print', 
    'Silk Ethnic Wear', 
    'Summer Cotton 2026'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/collections?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-primary/95 backdrop-blur-3xl flex flex-col"
        >
          {/* Header */}
          <div className="container mx-auto px-6 md:px-12 h-32 flex items-center justify-between border-b border-accent-gold/10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-maroon rounded-2xl flex items-center justify-center rotate-12 shadow-xl shadow-accent-maroon/20">
                   <Search size={22} className="text-white -rotate-12" />
                </div>
                <h2 className="text-2xl font-heading font-bold tracking-tighter text-text-primary">Search <span className="italic font-light text-accent-maroon">Store</span></h2>
             </div>
             <button 
               onClick={onClose}
               className="p-4 hover:bg-accent-maroon/5 rounded-2xl transition-all group"
             >
               <X size={28} className="text-text-primary group-hover:rotate-90 transition-transform" />
             </button>
          </div>

          {/* Search Input Area */}
          <div className="container mx-auto px-6 md:px-12 pt-16">
             <form onSubmit={handleSearch} className="relative group max-w-6xl mx-auto">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Inquire about block prints, fabrics, or silhouettes..." 
                  className="w-full bg-transparent border-b-2 border-accent-gold/20 py-10 text-5xl md:text-7xl font-heading font-bold text-text-primary placeholder:text-accent-gold/10 focus:outline-none focus:border-accent-maroon transition-all duration-1000"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-accent-gold hover:text-accent-maroon transition-all group-hover:translate-x-3">
                   <ArrowRight size={56} strokeWidth={1} />
                </button>
             </form>
          </div>

          {/* Contextual Suggestions */}
          <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-6xl mx-auto w-full">
                {/* Trending */}
                <div className="space-y-10">
                   <div className="flex items-center gap-4 text-accent-maroon">
                      <TrendingUp size={20} />
                      <span className="text-xs font-bold uppercase tracking-[0.5em]">Trending Searches</span>
                   </div>
                   <div className="flex flex-wrap gap-4">
                      {trendingSearches.map(term => (
                        <button 
                          key={term} 
                          onClick={() => { setQuery(term); navigate(`/collections?search=${encodeURIComponent(term)}`); onClose(); }}
                          className="px-8 py-4 bg-white border border-accent-gold/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-accent-maroon hover:border-accent-maroon hover:shadow-2xl transition-all duration-500"
                        >
                           {term}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Recent / Featured */}
                <div className="space-y-10">
                   <div className="flex items-center gap-4 text-accent-gold">
                      <History size={20} />
                      <span className="text-xs font-bold uppercase tracking-[0.5em]">Recent Searches</span>
                   </div>
                   <div className="space-y-6">
                      {recentHistory.map(term => (
                        <button 
                          key={term}
                          onClick={() => { setQuery(term); navigate(`/collections?search=${encodeURIComponent(term)}`); onClose(); }}
                          className="flex items-center justify-between w-full p-6 hover:bg-accent-maroon/5 rounded-[2rem] group/item transition-all"
                        >
                           <span className="text-2xl font-heading font-bold text-text-secondary group-hover/item:text-text-primary transition-colors">{term}</span>
                           <ArrowRight size={22} className="text-accent-gold/20 group-hover/item:text-accent-maroon group-hover/item:translate-x-3 transition-all" />
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             
             {/* Featured Insight Card - Rebranded */}
             <div className="mt-24 max-w-6xl mx-auto w-full">
                <div className="bg-white/60 backdrop-blur-xl border border-accent-gold/20 p-10 rounded-[3.5rem] flex items-center justify-between group hover:shadow-2xl transition-all duration-1000 cursor-pointer overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                   <div className="flex items-center gap-10 relative z-10">
                      <div className="w-20 h-20 bg-accent-maroon rounded-[2rem] flex items-center justify-center rotate-12 shadow-2xl shadow-accent-maroon/20">
                         <Sparkles size={40} className="text-white -rotate-12" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-3xl font-heading font-bold text-text-primary">Discover Sanganeri Craft</h4>
                         <p className="text-text-secondary text-sm font-light italic">Explore the history of Jaipur's most iconic block printing technique.</p>
                      </div>
                   </div>
                   <div className="hidden lg:flex items-center gap-6 relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-maroon">Explore History</span>
                      <div className="w-16 h-16 rounded-full border border-accent-maroon flex items-center justify-center group-hover:bg-accent-maroon group-hover:text-white transition-all duration-500 shadow-xl">
                         <ArrowRight size={24} />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Footer Branding */}
          <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-center opacity-30 select-none">
             <h3 className="text-[10px] font-bold uppercase tracking-[1.5em] text-accent-gold">BADRIBHAI APPAREL STORE</h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
