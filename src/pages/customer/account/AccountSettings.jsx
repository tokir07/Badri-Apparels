import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Key, UserX, Smartphone, Eye, 
  Lock, Bell, Languages, Palette, ChevronRight,
  LogOut, AlertCircle, Sparkles, ShieldCheck,
  Fingerprint, Globe, Trash2
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { cn } from '@/lib/utils';

const AccountSettings = () => {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState('Light');

  const settingsGroups = [
    {
      title: 'Heritage Protocols',
      items: [
        { label: 'Vault Access Key', icon: <Key size={20} />, info: 'Update your portal credentials' },
        { label: 'Two-Factor Validation', icon: <ShieldCheck size={20} />, info: 'Secure biometric synchronization', active: true },
        { label: 'Session Log', icon: <Smartphone size={20} />, info: 'Active heritage connections' },
      ]
    },
    {
      title: 'Curated Preferences',
      items: [
        { label: 'Communication Hub', icon: <Bell size={20} />, info: 'Archive & alert notifications' },
        { label: 'Dialect & Region', icon: <Globe size={20} />, info: 'Indian / English (IN)' },
        { label: 'Visual Palette', icon: <Palette size={20} />, info: theme, action: () => setTheme(theme === 'Light' ? 'Dark' : 'Light') },
      ]
    }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Account Parameters</span>
         </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
          System <span className="italic font-light text-accent-maroon">Protocols.</span>
        </h1>
        <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
          Fine-tune your BadriBhai portal experience and manage the security of your heritage archive.
        </p>
      </div>

      <div className="max-w-5xl space-y-16">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-accent-gold pl-6">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-text-primary">{group.title}</h3>
            </div>
            
            <div className="bg-primary/5 border border-accent-gold/10 rounded-[3rem] overflow-hidden shadow-sm">
               {group.items.map((item, idx) => (
                 <div 
                   key={item.label}
                   onClick={item.action}
                   className={cn(
                     "flex flex-col sm:flex-row sm:items-center justify-between p-8 md:p-10 transition-all duration-500 cursor-pointer group hover:bg-white",
                     idx !== group.items.length - 1 ? 'border-b border-accent-gold/5' : ''
                   )}
                 >
                    <div className="flex items-center gap-8">
                       <div className="w-14 h-14 bg-white border border-accent-gold/10 rounded-2xl flex items-center justify-center text-accent-gold group-hover:bg-accent-maroon group-hover:text-white transition-all shadow-sm">
                          {item.icon}
                       </div>
                       <div>
                          <p className="text-lg font-bold text-text-primary tracking-tight">{item.label}</p>
                          <p className="text-xs text-text-secondary font-medium mt-1">{item.info}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6 sm:mt-0">
                       {item.active && (
                         <span className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full text-[9px] font-bold uppercase tracking-widest">Active Status</span>
                       )}
                       <ChevronRight size={20} className="text-accent-gold group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 border-l-4 border-red-500 pl-6">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-red-500">Jurisdiction Termination</h3>
           </div>
           
           <div className="bg-red-50/20 border border-red-100 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-red-500/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <AlertCircle size={150} />
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                 <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-white border border-red-100 rounded-3xl text-red-500 flex items-center justify-center shadow-xl shrink-0">
                       <Trash2 size={28} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-2xl font-heading font-bold text-text-primary">Dissolve Heritage Identity</h4>
                       <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-lg">
                          Terminating your account will permanently purge your acquisition archive and heritage preferences. This action is irreversible.
                       </p>
                    </div>
                 </div>
                 <button className="px-12 py-5 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl shadow-red-500/5 whitespace-nowrap">
                    Deactivate Account
                 </button>
              </div>
           </div>
        </div>

        {/* Support & Global Logout */}
        <div className="pt-12 border-t border-accent-gold/10 flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-4 text-text-secondary bg-primary/5 px-8 py-4 rounded-2xl border border-accent-gold/5">
              <AlertCircle size={20} className="text-accent-gold" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Concierge Support: <span className="text-text-primary">heritage@badribhai.com</span></p>
           </div>
           <button 
             onClick={logout}
             className="flex items-center gap-3 px-10 py-5 bg-text-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-accent-maroon transition-all shadow-2xl"
           >
              <LogOut size={18} /> Global Disconnection
           </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
