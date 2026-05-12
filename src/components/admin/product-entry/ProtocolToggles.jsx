import React from 'react';
import { Sparkles, Heart, Star, ShieldCheck } from 'lucide-react';

const ProtocolToggles = ({ watchFields, setValue }) => {
  const toggles = [
    { name: 'isNewArrival', label: 'New Masterpiece', icon: <Sparkles size={14} /> },
    { name: 'isArtisanPick', label: 'Artisan Choice', icon: <Heart size={14} /> },
    { name: 'isLimited', label: 'Limited Edition', icon: <Star size={14} /> },
    { name: 'isSustainable', label: 'Eco-Handcrafted', icon: <ShieldCheck size={14} /> },
  ];

  return (
    <div className="p-8 bg-white border border-accent-gold/10 rounded-[2.5rem] space-y-6">
      <div className="flex items-center gap-3 text-accent-gold mb-2">
        <Star size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Artisanal Classifications</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {toggles.map(t => (
          <button 
            key={t.name} 
            type="button" 
            onClick={() => setValue(`features.${t.name}`, !watchFields.features[t.name])} 
            className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-500 ${watchFields.features[t.name] ? 'bg-accent-maroon/10 border-accent-maroon/30 text-accent-maroon' : 'bg-primary/5 border-accent-gold/10 text-text-secondary'}`}
          >
            <div className="flex items-center gap-3">
               {t.icon}
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
            </div>
            <div className={`w-3 h-3 rounded-full border ${watchFields.features[t.name] ? 'bg-accent-maroon border-accent-gold shadow-sm animate-pulse' : 'bg-white border-accent-gold/20'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProtocolToggles;
