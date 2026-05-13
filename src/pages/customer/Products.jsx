import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ecommerce/ProductCard';
import ProductCardSkeleton from '../../components/ui/ProductCardSkeleton';
import SearchAndFilter from '../../components/customer/SearchAndFilter';
import { cn } from '../../lib/utils';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  
  const filters = Object.fromEntries(searchParams.entries());
  const { data: response, isLoading: loading } = useProducts(filters);
  
  const products = response?.success ? response.data.content : [];
  const pagination = response?.success ? {
    totalElements: response.data.totalElements,
    totalPages: response.data.totalPages,
    size: response.data.size,
    number: response.data.number
  } : { totalElements: 0, totalPages: 0, size: 10, number: 0 };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Jaipur Heritage Archive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tighter">
            Our <span className="text-accent-maroon italic font-light">Collections.</span>
          </h1>
          
          <SearchAndFilter />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-accent-maroon" : "text-muted-foreground")}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background shadow-sm text-accent-maroon" : "text-muted-foreground")}
              >
                <List size={16} />
              </button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <span className="text-text-primary">{pagination.totalElements}</span> Masterpieces Found
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className={cn(
              "grid gap-10",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={cn(
              "grid gap-10",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center space-y-8 bg-primary/5 rounded-[4rem] border-2 border-dashed border-accent-gold/10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Search className="text-accent-gold/30" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-heading font-bold text-text-primary">No Masterpieces Found</h3>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">Our current curation doesn't match these specific artisanal criteria.</p>
              </div>
              <button 
                onClick={() => window.location.href = '/products'}
                className="px-10 py-4 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-accent-maroon/20"
              >
                Reset Archive
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-20 flex justify-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', i);
                  window.history.pushState({}, '', `?${params.toString()}`);
                  // Note: window.history.pushState doesn't trigger a re-render by default with useSearchParams
                  // In a real app, you'd use navigate() from react-router-dom
                  window.location.search = params.toString();
                }}
                className={cn(
                  "w-12 h-12 rounded-xl text-[10px] font-bold border transition-all",
                  pagination.number === i 
                    ? "bg-accent-maroon text-white border-accent-maroon shadow-lg" 
                    : "bg-white border-accent-gold/10 text-text-secondary hover:border-accent-maroon hover:text-accent-maroon"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
