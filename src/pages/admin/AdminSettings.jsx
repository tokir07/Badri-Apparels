import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, CreditCard, Bell, Shield, UserCircle,
  Globe, Save, X, Camera, ChevronRight,
  Settings, Key, Smartphone, Mail, Languages
} from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const navItems = [
    { id: 'general', label: 'Store Identity', icon: <Store size={18} /> },
    { id: 'billing', label: 'Payments & Billing', icon: <CreditCard size={18} /> },
    { id: 'team', label: 'Permissions', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'System Security', icon: <Key size={18} /> },
    { id: 'shipping', label: 'Global Logistics', icon: <Globe size={18} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const handleSave = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Synchronizing ecosystem parameters...',
      success: 'Institutional ecosystem synchronized successfully',
      error: 'Synchronization protocol failure'
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all institutional protocols to baseline configuration?")) {
      toast.success("Protocols reset to baseline heritage configuration");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">System Preferences</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
            Core <span className="italic font-light text-primary">Configuration.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Fine-tune your luxury platform's behavior, security, and global presence with artisanal precision.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-4 px-8 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest bg-background border border-border text-muted-foreground hover:text-primary transition-all shadow-sm"
          >
            Reset Protocols
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10 group"
          >
            <Save size={18} className="group-hover:scale-110 transition-transform" />
            Save Ecosystem
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* Settings Navigation Sidebar */}
        <motion.div variants={itemVariants} className="space-y-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-8 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-700 relative group
                  ${isActive
                    ? 'text-foreground bg-background border border-border shadow-lg shadow-primary/5'
                    : 'text-muted-foreground/40 hover:text-primary hover:bg-background/40 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-5">
                  <div className={`${isActive ? 'text-primary' : 'text-muted-foreground/20 group-hover:text-primary/40'} transition-colors duration-500`}>
                    {item.icon}
                  </div>
                  {item.label}
                </div>
                {isActive && <ChevronRight size={16} className="text-primary" />}
                {isActive && (
                  <motion.div
                    layoutId="tab-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(74,4,4,0.3)]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3 space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Panel: Store Profile */}
              <div className="bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <h2 className="text-4xl font-heading font-bold mb-10 text-foreground tracking-tight">Identity <span className="text-primary italic font-light">& Assets.</span></h2>

                <div className="space-y-12 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-12">
                    <div className="relative group/avatar">
                      <div className="w-32 h-32 bg-muted rounded-[2.5rem] border border-border flex items-center justify-center overflow-hidden group-hover/avatar:border-primary/20 transition-all duration-700">
                        <img src="https://ui-avatars.com/api/?name=Badri+Apparel&background=800000&color=fff&size=128" alt="Store Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      </div>
                      <button 
                        onClick={() => toast.info("Asset Replacement: Institutional gateway pending")}
                        className="absolute -bottom-2 -right-2 w-12 h-12 bg-background rounded-2xl flex items-center justify-center border-4 border-muted shadow-xl text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Camera size={20} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-widest">Brand Masterpiece Asset</h3>
                      <p className="text-[10px] text-muted-foreground mb-6 max-w-xs leading-relaxed uppercase tracking-widest font-bold opacity-60">High-fidelity PNG or SVG assets required for heritage preservation.</p>
                      <button 
                        onClick={() => toast.info("Asset Replacement: Gateway pending")}
                        className="px-8 py-3.5 bg-muted border border-border text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                      >
                        Replace Asset
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em] ml-1">Institutional Title</label>
                      <input type="text" defaultValue="BADRIBHAI APPAREL" className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold tracking-widest" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em] ml-1">Concierge Channel</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                        <input type="email" defaultValue="concierge@badribhai.com" className="w-full bg-muted/50 border border-border rounded-2xl p-5 pl-14 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em] ml-1">Platform Manifest</label>
                      <textarea rows="4" defaultValue="A high-performance luxury ecosystem specializing in limited edition Jaipuri handcrafted masterpieces and heritage fashion technology." className="w-full bg-muted/50 border border-border rounded-2xl p-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all leading-relaxed font-medium"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel: Regional Protocol */}
              <div className="bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-12 shadow-sm relative">
                <h2 className="text-4xl font-heading font-bold mb-3 text-foreground tracking-tight">Regional <span className="text-primary italic font-light">Localization.</span></h2>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-12 opacity-60">Configure market currency, temporal zones, and global measurement protocols.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em] ml-1">Market Currency</label>
                    <div className="relative group">
                      <Languages size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                      <select className="w-full bg-muted/50 border border-border rounded-2xl p-5 pl-14 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer font-bold">
                        <option value="INR">INR - Indian Rupee (₹)</option>
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30">
                        <ChevronRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em] ml-1">Temporal Alignment</label>
                    <div className="relative group">
                      <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                      <select className="w-full bg-muted/50 border border-border rounded-2xl p-5 pl-14 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer font-bold">
                        <option>(GMT+05:30) Mumbai, New Delhi</option>
                        <option>(GMT+00:00) London, UTC</option>
                        <option>(GMT-05:00) New York, EST</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30">
                        <ChevronRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Visual Spacer */}
      <div className="h-24" />
    </motion.div>
  );

};

export default AdminSettings;
