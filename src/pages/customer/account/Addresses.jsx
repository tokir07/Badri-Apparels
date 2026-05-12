import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Edit2, Trash2, Home, Briefcase, 
  Check, X, Globe, Phone, User, Sparkles, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const Addresses = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Primary Residence',
      isDefault: true,
      name: `${user?.firstName || 'Patron'} ${user?.lastName || ''}`,
      phone: user?.phoneNumber || '+91 98765 43210',
      address: user?.addressLine || 'Hawa Mahal Rd, Badi Choupad',
      city: user?.city || 'Jaipur',
      state: user?.state || 'Rajasthan',
      zip: user?.pincode || '302002',
      country: user?.country || 'India'
    }
  ]);

  const toggleDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Logistics Concierge</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
            Shipping <span className="italic font-light text-accent-maroon">Jurisdictions.</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
            Manage your artisanal delivery locations for a prioritized fulfillment experience across the heritage map.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-accent-maroon/20 hover:scale-105 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Register New Destination
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {addresses.map((addr, idx) => (
          <motion.div
            key={addr.id}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative bg-primary/5 border-2 rounded-[3.5rem] p-10 md:p-12 transition-all duration-700 group shadow-sm hover:shadow-2xl",
              addr.isDefault ? 'border-accent-gold shadow-accent-gold/5' : 'border-transparent hover:border-accent-maroon/10 bg-white'
            )}
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-gold/10 transition-colors" />

            {/* Badge */}
            <div className="flex justify-between items-start mb-10 relative z-10">
               <div className={cn(
                 "flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                 addr.isDefault ? 'bg-accent-gold text-primary border-accent-gold/20' : 'bg-accent-maroon/5 text-accent-maroon border-accent-maroon/10'
               )}>
                  {addr.type === 'Home' || addr.type === 'Primary Residence' ? <Home size={14} /> : <Briefcase size={14} />} {addr.type}
               </div>
               {addr.isDefault && (
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold">
                    <Check size={16} strokeWidth={3} /> Default
                 </div>
               )}
            </div>

            <div className="space-y-8 relative z-10">
               <div className="flex items-center gap-4 text-text-primary">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60"><User size={20} /></div>
                  <span className="text-xl font-bold tracking-tight">{addr.name}</span>
               </div>
               <div className="flex items-start gap-4 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60 shrink-0"><MapPin size={20} /></div>
                  <p className="text-base font-medium leading-relaxed pt-1">
                    {addr.address}, {addr.city}, <br /> {addr.state} {addr.zip}, {addr.country}
                  </p>
               </div>
               <div className="flex items-center gap-4 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60"><Phone size={20} /></div>
                  <span className="text-base font-bold tracking-widest">{addr.phone}</span>
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-accent-gold/10 flex justify-between items-center relative z-10">
               <div className="flex gap-4">
                  <button className="w-12 h-12 flex items-center justify-center bg-white text-text-secondary hover:text-accent-maroon border border-accent-gold/10 rounded-2xl transition-all shadow-sm">
                     <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteAddress(addr.id)}
                    className="w-12 h-12 flex items-center justify-center bg-white text-text-secondary hover:text-red-500 border border-accent-gold/10 rounded-2xl transition-all shadow-sm"
                  >
                     <Trash2 size={18} />
                  </button>
               </div>
               {!addr.isDefault && (
                 <button 
                   onClick={() => toggleDefault(addr.id)}
                   className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-gold hover:text-accent-maroon transition-all flex items-center gap-2"
                 >
                    Set as Primary <ArrowRight size={14} />
                 </button>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] overflow-hidden p-10 md:p-14"
            >
               <button 
                 onClick={() => setShowModal(false)}
                 className="absolute top-10 right-10 p-3 bg-primary/5 hover:bg-accent-maroon hover:text-white rounded-2xl transition-all"
               >
                  <X size={20} />
               </button>

               <div className="mb-12">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={18} className="text-accent-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">Secure Registration</span>
                 </div>
                 <h2 className="text-4xl font-heading font-bold text-text-primary tracking-tight">New Jurisdiction</h2>
                 <p className="text-text-secondary text-sm font-medium mt-2">Establish a new prioritized delivery destination.</p>
               </div>

               <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Patron Name</label>
                        <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" placeholder="Enter full name" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Contact String</label>
                        <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" placeholder="+91" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Residence Location / Street</label>
                     <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" placeholder="House number, street name, area" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">City</label>
                        <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">State</label>
                        <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Pincode</label>
                        <input type="text" className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" />
                     </div>
                  </div>
                  <div className="pt-8">
                     <button className="w-full py-6 bg-accent-maroon text-white rounded-[2rem] font-bold uppercase tracking-[0.4em] text-[10px] hover:brightness-110 transition-all shadow-2xl shadow-accent-maroon/20">
                        Synchronize Destination
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Addresses;
