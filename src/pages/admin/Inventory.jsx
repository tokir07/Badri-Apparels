import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, AlertTriangle, RefreshCw, Save, ArrowLeftRight } from 'lucide-react';
import { productService } from '../../services/productService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const Inventory = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updates, setUpdates] = useState({}); // { variantId: newStock }

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStockVariants();
      if (response.data) {
        setVariants(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error("Failed to sync inventory archive");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (variantId, value) => {
    setUpdates(prev => ({
      ...prev,
      [variantId]: parseInt(value) || 0
    }));
  };

  const saveStockUpdate = async (variantId) => {
    const newStock = updates[variantId];
    if (newStock === undefined) return;

    try {
      await productService.bulkUpdateStock([{ variantId, quantity: newStock }]);
      setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock: newStock } : v));
      setUpdates(prev => {
        const next = { ...prev };
        delete next[variantId];
        return next;
      });
      toast.success("Inventory recalibrated successfully");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const filteredVariants = variants.filter(v => 
    v.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.size?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.color?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Package size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Logistics Intelligence</span>
          </div>
          <h1 className="text-5xl font-heading font-bold tracking-tighter">Inventory <span className="italic font-light text-primary">Nexus.</span></h1>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
             <input 
               type="text" 
               placeholder="Search SKU / Size / Color..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-background border border-border rounded-xl py-3 pl-12 pr-6 text-xs focus:outline-none focus:border-primary/40 min-w-[300px] shadow-sm"
             />
           </div>
           <button onClick={fetchInventory} className="p-3 bg-background border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-sm">
             <RefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-background/60 backdrop-blur-md border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product Detail</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SKU Identity</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Stock</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Threshold</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Adjust Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredVariants.length > 0 ? filteredVariants.map((v) => {
              const isOut = v.stock === 0;
              const isLow = v.stock <= (v.lowStockThreshold || 5);
              
              return (
                <motion.tr 
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "group hover:bg-muted/10 transition-colors",
                    isOut ? "bg-red-50/30" : isLow ? "bg-amber-50/30" : ""
                  )}
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground mb-1">{v.productName || 'Heritage Piece'}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-muted rounded text-[9px] font-bold text-muted-foreground uppercase">{v.size}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.colorHex || '#ccc' }} />
                        <span className="text-[10px] text-muted-foreground">{v.color}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter">{v.sku || 'N/A'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-sm font-bold",
                      isOut ? "text-destructive" : isLow ? "text-amber-600" : "text-foreground"
                    )}>
                      {v.stock}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-muted-foreground opacity-60">{v.lowStockThreshold || 5}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {isOut ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full">
                          <AlertTriangle size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Depleted</span>
                        </div>
                      ) : isLow ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full">
                          <AlertTriangle size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Low Archive</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Stabilized</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden shadow-sm">
                         <input 
                           type="number" 
                           defaultValue={v.stock}
                           onChange={(e) => handleStockChange(v.id, e.target.value)}
                           className="w-16 px-3 py-2 text-xs font-bold text-center focus:outline-none bg-transparent"
                         />
                         <button 
                           onClick={() => saveStockUpdate(v.id)}
                           className="px-3 py-2 bg-primary text-white hover:brightness-110 transition-all border-l border-border"
                         >
                           <Save size={14} />
                         </button>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            }) : (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
                     <ArrowLeftRight size={48} strokeWidth={1} />
                     <p className="text-[11px] font-bold uppercase tracking-[0.4em]">Inventory Log Empty</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
