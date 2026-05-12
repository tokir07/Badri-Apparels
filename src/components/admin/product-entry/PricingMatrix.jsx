import React from 'react';
import { CreditCard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingMatrix = ({ register, watchFields, discount }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-[60px]" />
        <div className="flex items-center gap-3 text-accent-gold mb-6 relative z-10">
          <CreditCard size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Value Evaluation</span>
        </div>
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Original Price (MRP) (₹)</label>
            <input {...register('mrp')} type="number" placeholder="0" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl p-4 text-2xl font-heading font-bold text-text-primary focus:border-accent-maroon/40 transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Curated Price (₹)</label>
            <input {...register('sellingPrice')} type="number" placeholder="0" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl p-4 text-2xl font-heading font-bold text-text-primary focus:border-accent-maroon/40 transition-all" />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between px-2 relative z-10">
          <span className="text-[10px] text-text-secondary/60 font-bold uppercase tracking-widest">Calculated Heritage Discount</span>
          <span className="text-xl font-heading font-bold text-accent-gold">{discount}% OFF</span>
        </div>
      </div>

      <div className="p-8 bg-white border border-accent-gold/10 rounded-[2.5rem] flex flex-col justify-center">
        <div className="flex items-center gap-3 text-text-secondary mb-6">
          <TrendingUp size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Net Appreciation</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <p className="text-[10px] text-text-secondary/60 uppercase font-bold mb-2">Net Margin (82%)</p>
            <p className="text-3xl font-bold">₹{Math.round(watchFields.sellingPrice * 0.82 || 0)}</p>
          </div>
          <div className="w-[1px] h-12 bg-accent-gold/10 mx-4" />
          <div className="text-center flex-1">
            <p className="text-[10px] text-text-secondary/60 uppercase font-bold mb-2">Platform Fee</p>
            <p className="text-3xl font-bold text-red-500/80">18%</p>
          </div>
        </div>
        <div className="h-2 bg-accent-gold/10 rounded-full overflow-hidden">
          <motion.div animate={{ width: '82%' }} className="h-full bg-accent-gold shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default PricingMatrix;
