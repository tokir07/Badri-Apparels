import React from 'react';
import { Monitor, Image as ImageIcon } from 'lucide-react';

const LivePrototype = ({ watchFields, discount }) => {
  return (
    <div className="p-8 bg-[#0a0a0a] border border-accent-gold/20 rounded-[2.5rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-[100px]" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] text-accent-gold font-bold uppercase tracking-[0.3em]">Curated Preview</span>
        <Monitor size={16} className="text-white/20" />
      </div>
      <div className="flex gap-8 items-start relative z-10">
        <div className="w-32 h-44 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
          <ImageIcon size={32} className="text-white/5" />
        </div>
        <div className="flex-1 space-y-3 py-2">
          <p className="text-[9px] text-accent-gold font-bold uppercase tracking-[0.4em]">{watchFields.brand}</p>
          <h4 className="text-xl font-heading font-bold text-white truncate leading-tight">{watchFields.name || 'Untitled Masterpiece'}</h4>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-white">₹{watchFields.sellingPrice || '0'}</span>
            {discount > 0 && <span className="text-[10px] font-bold text-accent-gold uppercase tracking-tighter">{discount}% OFF</span>}
          </div>
          <div className="flex gap-2 pt-4">
            {watchFields.variants?.map((v, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: v.colorHex }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePrototype;
