import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, X, ChevronDown, 
  ArrowUpDown, SlidersHorizontal, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import { cn } from '../../lib/utils';

const SearchAndFilter = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Local state for immediate UI feedback before debounce
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(localSearch, 400);

  // Filter options
  const fabricOptions = ['Kota Doria', 'Chanderi', 'Georgette', 'Cotton', 'Rayon', 'Silk', 'Organza'];
  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await productService.getCategories();
      if (res.success) setCategories(res.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    updateQueryParams({ search: debouncedSearch });
  }, [debouncedSearch]);

  const updateQueryParams = (newParams) => {
    const params = Object.fromEntries(searchParams.entries());
    const merged = { ...params, ...newParams };
    
    // Clean empty values
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([_, v]) => v != null && v !== '')
    );
    
    setSearchParams(cleaned);
    if (onFilterChange) onFilterChange(cleaned);
  };

  const handleClear = () => {
    setLocalSearch('');
    setSearchParams({});
    if (onFilterChange) onFilterChange({});
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== 'page').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold group-focus-within:text-accent-maroon transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search our masterpiece collection..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all"
          />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent-maroon"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border shrink-0",
              showFilters || activeFiltersCount > 0
                ? 'bg-accent-maroon text-white border-accent-maroon'
                : 'bg-white border-accent-gold/10 text-text-secondary hover:border-accent-maroon'
            )}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <select 
            value={searchParams.get('sort') || 'newest'}
            onChange={(e) => updateQueryParams({ sort: e.target.value })}
            className="px-6 py-4 bg-white border border-accent-gold/10 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-accent-maroon transition-all appearance-none cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {activeFiltersCount > 0 && (
            <button 
              onClick={handleClear}
              className="text-[9px] font-bold uppercase tracking-widest text-accent-maroon hover:underline ml-2 shrink-0"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/5 rounded-3xl p-8 border border-accent-gold/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Heritage Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateQueryParams({ categoryId: searchParams.get('categoryId') == cat.id ? '' : cat.id })}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter border transition-all",
                        searchParams.get('categoryId') == cat.id
                          ? 'bg-accent-maroon text-white border-accent-maroon'
                          : 'bg-white border-accent-gold/10 text-text-secondary hover:border-accent-maroon'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Valuation Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent-gold">₹</span>
                      <input 
                        type="number"
                        placeholder="Min"
                        value={searchParams.get('minPrice') || ''}
                        onChange={(e) => updateQueryParams({ minPrice: e.target.value })}
                        className="w-full bg-white border border-accent-gold/10 rounded-xl pl-6 pr-3 py-3 text-[10px] font-bold focus:outline-none focus:border-accent-maroon transition-all"
                      />
                    </div>
                    <span className="text-accent-gold/40">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent-gold">₹</span>
                      <input 
                        type="number"
                        placeholder="Max"
                        value={searchParams.get('maxPrice') || ''}
                        onChange={(e) => updateQueryParams({ maxPrice: e.target.value })}
                        className="w-full bg-white border border-accent-gold/10 rounded-xl pl-6 pr-3 py-3 text-[10px] font-bold focus:outline-none focus:border-accent-maroon transition-all"
                      />
                    </div>
                  </div>
                  
                  {/* Quick price pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Under 1k', min: 0, max: 1000 },
                      { label: '1k - 3k', min: 1000, max: 3000 },
                      { label: 'Above 3k', min: 3000, max: '' }
                    ].map(range => (
                      <button
                        key={range.label}
                        onClick={() => updateQueryParams({ minPrice: range.min, maxPrice: range.max })}
                        className="px-3 py-1.5 bg-white border border-accent-gold/5 rounded-lg text-[8px] font-bold uppercase tracking-widest text-text-secondary hover:border-accent-maroon hover:text-accent-maroon transition-all"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fabric */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Artisanal Fabric</h4>
                <div className="grid grid-cols-2 gap-2">
                  {fabricOptions.map(fabric => (
                    <button
                      key={fabric}
                      onClick={() => updateQueryParams({ fabric: searchParams.get('fabric') === fabric ? '' : fabric })}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-tighter border transition-all",
                        searchParams.get('fabric') === fabric
                          ? 'bg-accent-maroon text-white border-accent-maroon'
                          : 'bg-white border-accent-gold/10 text-text-secondary hover:border-accent-maroon'
                      )}
                    >
                      {fabric}
                      {searchParams.get('fabric') === fabric && <Check size={10} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applied Pills Preview */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (key === 'page' || key === 'sort' || !value) return null;
                    return (
                      <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-accent-maroon/10 text-accent-maroon rounded-lg text-[8px] font-bold uppercase tracking-widest border border-accent-maroon/20">
                        {key}: {value}
                        <button onClick={() => updateQueryParams({ [key]: '' })}><X size={10} /></button>
                      </div>
                    );
                  })}
                  {activeFiltersCount === 0 && <p className="text-[9px] italic text-muted-foreground opacity-60">No active filters</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilter;
