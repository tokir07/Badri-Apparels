import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

const CoreIdentity = ({ register, watchFields, setValue, categories = [] }) => {
  return (
    <div className="p-8 bg-white border border-accent-gold/10 rounded-[2.5rem] space-y-6">
      <div className="flex items-center gap-3 text-accent-gold mb-2">
        <Tag size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Heritage Identity</span>
      </div>
      
      <div className="space-y-3">
        <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Masterpiece Title</label>
        <input {...register('name')} placeholder="e.g. Mughal Block Print Anarkali" className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-sm text-text-primary focus:border-accent-maroon/40 transition-all font-bold" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Master Category</label>
          <select {...register('categoryId')} className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-xs text-text-primary">
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Creation Type</label>
          <select {...register('type')} className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-xs text-text-primary">
            <option value="Kurti">Jaipuri Kurti</option>
            <option value="Anarkali">Anarkali Suit</option>
            <option value="Coord">Ethnic Co-ord Set</option>
            <option value="Dupatta">Handcrafted Dupatta</option>
            <option value="Dress">Ethnic Dress</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Artisanal Collection</label>
          <select {...register('collection')} className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-xs text-text-primary">
            <option value="BlockPrint">Block Print Archive</option>
            <option value="Festive">Festive Luminescence</option>
            <option value="DailyGrace">Daily Grace Collection</option>
            <option value="ArtisanEdit">Jaipur Artisan Edit</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Fabric Specification</label>
          <select {...register('fabric')} className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-xs text-text-primary">
            <option value="OrganicCotton">Organic Cotton</option>
            <option value="ChanderiSilk">Chanderi Silk</option>
            <option value="Mulmul">Premium Mulmul</option>
            <option value="Rayon">Luxe Rayon</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Craftsmanship / Print</label>
        <select {...register('printType')} className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-xs text-text-primary">
          <option value="HandBlock">Hand Block Print</option>
          <option value="Sanganeri">Sanganeri Print</option>
          <option value="Bagru">Bagru Print</option>
          <option value="Digital">High-Fidelity Digital</option>
          <option value="Embroidered">Hand Embroidered</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Occasion / Context</label>
        <div className="grid grid-cols-4 gap-2 bg-muted/50 p-1.5 rounded-2xl border border-accent-gold/10">
          {['Daily', 'Festive', 'Wedding', 'Office'].map(o => (
            <button key={o} type="button" onClick={() => setValue('occasion', o)} className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${watchFields.occasion === o ? 'bg-accent-maroon text-white shadow-md' : 'text-text-secondary/50'}`}>{o}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-1">Artisan Narrative</label>
        <textarea {...register('description')} rows="4" placeholder="Describe the handcrafted journey of this piece..." className="w-full bg-muted/50 border border-accent-gold/10 rounded-2xl p-4 text-sm text-text-primary focus:border-accent-maroon/40 transition-all resize-none leading-relaxed" />
      </div>
    </div>
  );
};

export default CoreIdentity;
