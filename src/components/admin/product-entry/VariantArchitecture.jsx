import React from 'react';
import { Layers, Plus, Trash2, Zap, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const VariantArchitecture = ({ fields, append, remove, register, watchFields, setValue }) => {
  const applyBulkPrice = () => {
    const mrp = prompt("Enter Bulk MRP (e.g. 2499):");
    const price = prompt("Enter Bulk Selling Price (e.g. 1999):");
    
    if (mrp || price) {
      fields.forEach((_, idx) => {
        if (mrp) setValue(`variants.${idx}.mrp`, mrp);
        if (price) setValue(`variants.${idx}.price`, price);
      });
    }
  };

  return (
    <div className="p-8 bg-white border border-accent-gold/10 rounded-[2.5rem] flex-1">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-text-secondary">
          <Layers size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">SKU Inventory Matrix</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={applyBulkPrice}
            className="text-[10px] font-bold uppercase text-accent hover:text-primary flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-xl border border-accent/10 transition-all"
          >
            <Zap size={14} /> Bulk Fill Price
          </button>
          <button 
            type="button" 
            onClick={() => append({ 
              size: 'M', 
              color: 'Maroon', 
              colorHex: '#800000', 
              mrp: '', 
              price: '', 
              stock: 0, 
              active: true 
            })} 
            className="text-[10px] font-bold uppercase text-accent-maroon hover:text-text-primary flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 transition-all"
          >
            <Plus size={16} /> Add Variant SKU
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden border border-border rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Size</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Color / Hex</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">MRP (₹)</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Price (₹)</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Stock</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((field, idx) => (
              <tr key={field.id} className="group hover:bg-primary/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <select 
                    {...register(`variants.${idx}.size`)} 
                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div 
                        className="w-6 h-6 rounded-lg border border-border shadow-inner" 
                        style={{ backgroundColor: watchFields.variants?.[idx]?.colorHex || '#ccc' }} 
                      />
                      <input type="color" {...register(`variants.${idx}.colorHex`)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <input 
                      {...register(`variants.${idx}.color`)} 
                      placeholder="Color Name"
                      className="bg-transparent border-none text-[11px] font-medium text-text-primary w-20 focus:outline-none placeholder:opacity-30" 
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    {...register(`variants.${idx}.mrp`)} 
                    placeholder="0"
                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none" 
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    {...register(`variants.${idx}.price`)} 
                    placeholder="0"
                    className="w-full bg-transparent text-[11px] font-bold text-primary focus:outline-none" 
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    {...register(`variants.${idx}.stock`)} 
                    placeholder="0"
                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none" 
                  />
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register(`variants.${idx}.active`)} className="sr-only peer" />
                    <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </td>
                <td className="px-4 py-3 text-center">
                  <button type="button" onClick={() => remove(idx)} className="p-2 text-muted-foreground/30 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center">
                   <div className="flex flex-col items-center gap-2 text-muted-foreground/20">
                     <AlertCircle size={24} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">No variants defined</span>
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

export default VariantArchitecture;
