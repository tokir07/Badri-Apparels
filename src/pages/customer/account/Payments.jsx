import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Plus, Trash2, ShieldCheck, 
  ChevronRight, ArrowRight, Zap, Smartphone, Globe,
  Sparkles, Lock, Shield
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { cn } from '@/lib/utils';

const Payments = () => {
  const { user } = useAuthStore();
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Imperial Reserve',
      number: '•••• •••• •••• 8892',
      expiry: '05/28',
      holder: `${user?.firstName || 'Patron'} ${user?.lastName || ''}`,
      isDefault: true,
      color: 'from-accent-maroon via-primary to-accent-maroon'
    },
    {
      id: 2,
      type: 'Artisanal Gold',
      number: '•••• •••• •••• 4421',
      expiry: '12/27',
      holder: `${user?.firstName || 'Patron'} ${user?.lastName || ''}`,
      isDefault: false,
      color: 'from-accent-gold via-[#e6c200] to-accent-gold'
    }
  ]);

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Treasury Management</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
            Fiscal <span className="italic font-light text-accent-maroon">Instruments.</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
            Securely curate your collection of payment instruments and digital wallets within the BadriBhai fiscal vault.
          </p>
        </div>
        <button className="flex items-center gap-3 px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-accent-maroon/20 hover:scale-105 active:scale-95 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Register New Instrument
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left - Cards Grid */}
        <div className="lg:col-span-8 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={cn(
                    "relative h-64 rounded-[3.5rem] p-10 text-white overflow-hidden shadow-2xl group cursor-pointer bg-gradient-to-br",
                    card.color
                  )}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                     <CreditCard size={150} strokeWidth={0.5} />
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 block">BadriBhai Collective</span>
                          <span className="text-xl font-heading font-bold italic tracking-tighter">{card.type}</span>
                        </div>
                        {card.isDefault && (
                          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-widest">Primary</span>
                        )}
                     </div>

                     <div className="space-y-6">
                        <p className={cn(
                          "text-2xl font-mono tracking-[0.25em]",
                          card.id === 2 ? "text-primary" : "text-white"
                        )}>{card.number}</p>
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[9px] uppercase tracking-[0.3em] opacity-60">Instrument Holder</p>
                              <p className="text-xs font-bold uppercase tracking-[0.2em]">{card.holder}</p>
                           </div>
                           <div className="text-right space-y-1">
                              <p className="text-[9px] uppercase tracking-[0.3em] opacity-60">Valid Thru</p>
                              <p className="text-xs font-bold tracking-widest">{card.expiry}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-primary/80 backdrop-blur-md flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                     <button className="w-14 h-14 bg-white text-accent-maroon rounded-2xl hover:bg-accent-gold transition-colors flex items-center justify-center shadow-xl">
                        <Trash2 size={22} />
                     </button>
                     {!card.isDefault && (
                       <button className="px-8 py-5 bg-accent-gold text-primary rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
                          Set Primary
                       </button>
                     )}
                  </div>
                </motion.div>
              ))}
           </div>

           {/* Digital Vaults */}
           <div className="bg-primary/5 border border-accent-gold/10 rounded-[3.5rem] p-10 md:p-14 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-accent-gold/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <ShieldCheck size={180} strokeWidth={0.5} />
              </div>
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-text-primary mb-10 border-l-4 border-accent-gold pl-6">Digital Wallets & UPI</h3>
              <div className="space-y-6 relative z-10">
                 {[
                   { name: 'Heritage Apple Pay', icon: <Smartphone className="text-accent-maroon" />, info: 'Synchronized via **** 8892' },
                   { name: 'Artisanal Google Pay', icon: <Smartphone className="text-blue-500" />, info: 'badri.patron@okaxis' },
                   { name: 'Global PayPal Vault', icon: <Globe className="text-blue-600" />, info: 'patron.sterling@archive.com' },
                 ].map((wallet) => (
                   <div key={wallet.name} className="flex items-center justify-between p-6 bg-white border border-accent-gold/5 rounded-[2rem] group/wallet hover:border-accent-maroon/20 hover:shadow-xl transition-all duration-500 cursor-pointer">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover/wallet:bg-accent-maroon group-hover/wallet:text-white transition-all">
                            {wallet.icon}
                         </div>
                         <div>
                            <p className="text-lg font-bold text-text-primary tracking-tight">{wallet.name}</p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">{wallet.info}</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-accent-gold group-hover/wallet:translate-x-2 transition-transform" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right - Insights */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-accent-maroon text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/30 to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              
              <div className="relative z-10 space-y-10">
                 <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <Zap size={32} className="text-accent-gold" />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-heading font-bold leading-tight">Artisanal Checkout</h4>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                       Enable one-click heritage acquisition for a seamless artisanal experience. All fiscal data is secured within the Badri vault.
                    </p>
                 </div>
                 <button className="w-full py-5 bg-accent-gold text-primary rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-2xl shadow-accent-gold/20">
                    Enable One-Click
                 </button>
              </div>
           </div>

           <div className="bg-primary/5 border border-accent-gold/10 p-12 rounded-[3.5rem] shadow-sm space-y-8 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-accent-gold/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Lock size={120} strokeWidth={0.5} />
              </div>
              <div className="flex items-center gap-4">
                 <Shield size={24} className="text-accent-gold" />
                 <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.4em]">Vault Security</h4>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                 We utilize advanced encryption protocols to safeguard your treasury credentials. Your full fiscal identifiers are never stored on persistent media.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;
