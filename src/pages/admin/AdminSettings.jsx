import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, CreditCard, Bell, Shield, UserCircle,
  Globe, Save, X, Camera, ChevronRight,
  Settings, Key, Smartphone, Mail, Languages, Loader2,
  Trash2, Plus, UserPlus, ShieldCheck, Truck, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { settingsService } from '../../services/settingsService';
import { cn } from '../../lib/utils';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAllSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error("Institutional archive synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'general', label: 'Store Identity', icon: <Store size={18} /> },
    { id: 'billing', label: 'Payments & Billing', icon: <CreditCard size={18} /> },
    { id: 'team', label: 'Permissions', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'System Security', icon: <Key size={18} /> },
    { id: 'shipping', label: 'Global Logistics', icon: <Globe size={18} /> },
  ];

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await settingsService.updateSettingsBulk(settings);
      if (response.success) {
        toast.success('Institutional ecosystem synchronized successfully');
      } else {
        toast.error(response.message || "Synchronization protocol failure");
      }
    } catch (error) {
      toast.error("Critical synchronization failure");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-accent-gold animate-spin opacity-20" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold animate-pulse">Synchronizing Protocols...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Institutional Control</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
            Core <span className="italic font-light text-accent-maroon">Configuration.</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-4 bg-accent-maroon text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-accent-maroon/20 group disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
            {isSaving ? 'Synchronizing...' : 'Save Ecosystem'}
          </button>
        </div>
      </div>

      {/* Horizontal Sub-Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-accent-gold/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 relative group shrink-0",
              activeTab === item.id
                ? "text-accent-maroon bg-accent-maroon/5"
                : "text-muted-foreground/60 hover:text-accent-maroon hover:bg-accent-gold/5"
            )}
          >
            {item.icon}
            {item.label}
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-6 right-6 h-0.5 bg-accent-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Dynamic Content Panel */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* STORE IDENTITY */}
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 relative overflow-hidden shadow-sm">
                    <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-4">
                       <Store className="text-accent-gold" size={24} /> Brand Manifest
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Store Nomenclature</label>
                        <input
                          value={settings['store_name'] || ''}
                          onChange={(e) => handleInputChange('store_name', e.target.value)}
                          className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all font-bold"
                          placeholder="e.g., BadriBhai Apparels"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Concierge Email</label>
                        <input
                          value={settings['store_email'] || ''}
                          onChange={(e) => handleInputChange('store_email', e.target.value)}
                          className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                          placeholder="contact@badribhai.com"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Institutional Description</label>
                        <textarea
                          rows={4}
                          value={settings['store_description'] || ''}
                          onChange={(e) => handleInputChange('store_description', e.target.value)}
                          className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                          placeholder="Define the artisanal heritage..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
                     <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-4">
                        <Globe className="text-accent-gold" size={24} /> Business Credentials
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">GST/VAT Number</label>
                           <input
                             value={settings['store_gst'] || ''}
                             onChange={(e) => handleInputChange('store_gst', e.target.value)}
                             className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all font-mono"
                             placeholder="22AAAAA0000A1Z5"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Contact Nexus</label>
                           <input
                             value={settings['store_phone'] || ''}
                             onChange={(e) => handleInputChange('store_phone', e.target.value)}
                             className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                             placeholder="+91 98XXX XXXXX"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Operational Currency</label>
                           <select
                             value={settings['currency'] || 'INR'}
                             onChange={(e) => handleInputChange('currency', e.target.value)}
                             className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all appearance-none font-bold"
                           >
                              <option value="INR">INR - Indian Rupee (₹)</option>
                              <option value="USD">USD - US Dollar ($)</option>
                              <option value="EUR">EUR - Euro (€)</option>
                           </select>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* PAYMENTS & BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 text-accent-gold/5 opacity-40">
                       <Zap size={120} strokeWidth={0.5} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-4">
                       <CreditCard className="text-accent-gold" size={24} /> Razorpay Synchronization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Gateway API Key</label>
                        <input
                          type="password"
                          value={settings['razorpay_key'] || ''}
                          onChange={(e) => handleInputChange('razorpay_key', e.target.value)}
                          className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                          placeholder="rzp_live_XXXXXXXXXXXXXX"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Gateway Secret Vault</label>
                        <input
                          type="password"
                          value={settings['razorpay_secret'] || ''}
                          onChange={(e) => handleInputChange('razorpay_secret', e.target.value)}
                          className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                          placeholder="••••••••••••••••••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
                     <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-4">
                        <Store className="text-accent-gold" size={24} /> Settlement Account
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Beneficiary Name</label>
                           <input
                             value={settings['bank_beneficiary'] || ''}
                             onChange={(e) => handleInputChange('bank_beneficiary', e.target.value)}
                             className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all font-bold"
                             placeholder="BadriBhai Enterprise"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Bank Account / UPI ID</label>
                           <input
                             value={settings['bank_account'] || ''}
                             onChange={(e) => handleInputChange('bank_account', e.target.value)}
                             className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-accent-maroon/20 transition-all"
                             placeholder="badribhai@upi"
                           />
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* PERMISSIONS (TEAM) */}
              {activeTab === 'team' && (
                <div className="space-y-8">
                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-heading font-bold flex items-center gap-4">
                        <ShieldCheck className="text-accent-gold" size={24} /> Institutional Staff
                      </h3>
                      <button className="flex items-center gap-3 px-8 py-4 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-accent-maroon/10">
                        <UserPlus size={16} /> Invite Artisan
                      </button>
                    </div>

                    <div className="space-y-6">
                       {/* Mock Staff Members for UI reference, will be dynamic in final version */}
                       {[
                         { name: 'Badri Admin', role: 'Super Admin', email: 'admin@badribhai.com', status: 'Active' },
                         { name: 'Jaipuri Curator', role: 'Manager', email: 'curator@badribhai.com', status: 'Active' },
                       ].map((staff, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-accent-gold/5 border border-accent-gold/10 rounded-3xl group hover:border-accent-maroon/20 transition-all">
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 bg-accent-maroon text-white rounded-2xl flex items-center justify-center font-bold">{staff.name.charAt(0)}</div>
                               <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary">{staff.name}</h4>
                                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{staff.email}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-10">
                               <span className="px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-[8px] font-bold uppercase tracking-[0.2em] rounded-full">{staff.role}</span>
                               <button className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm space-y-12">
                  <h3 className="text-2xl font-heading font-bold flex items-center gap-4">
                     <Bell className="text-accent-gold" size={24} /> Alert Protocols
                  </h3>
                  <div className="space-y-8">
                    {[
                      { key: 'notif_orders', label: 'Order Acquisitions', desc: 'Real-time alerts for new artisanal purchases' },
                      { key: 'notif_payments', label: 'Settlement Alerts', desc: 'Notification upon successful payment synchronization' },
                      { key: 'notif_stock', label: 'Low Inventory Vault', desc: 'Critical alerts when silhouette stock falls below threshold' },
                      { key: 'notif_system', label: 'Security Protocols', desc: 'Alerts for system logins and institutional updates' },
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-8 bg-accent-gold/5 rounded-[2.5rem] border border-accent-gold/10">
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary">{notif.label}</h4>
                          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings[notif.key] === 'true'} 
                            onChange={(e) => handleInputChange(notif.key, e.target.checked ? 'true' : 'false')}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-8 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent-maroon"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
                    <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-4">
                       <Shield className="text-accent-gold" size={24} /> Institutional Integrity
                    </h3>
                    <div className="space-y-10">
                       <div className="p-8 bg-accent-maroon/5 rounded-3xl border border-accent-maroon/10 flex items-center justify-between">
                          <div className="space-y-2">
                             <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent-maroon">Two-Factor Authentication</h4>
                             <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Enhanced security layer for Master Curators</p>
                          </div>
                          <button className="px-8 py-3 bg-accent-maroon text-white rounded-xl text-[9px] font-bold uppercase tracking-widest">Configure</button>
                       </div>
                       
                       <div className="space-y-6">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold ml-1">Active Institutional Sessions</h4>
                          <div className="space-y-4">
                             <div className="flex items-center justify-between p-6 bg-accent-gold/5 rounded-2xl border border-accent-gold/10">
                                <div className="flex items-center gap-4">
                                   <Smartphone size={20} className="text-accent-gold" />
                                   <div>
                                      <p className="text-[10px] font-bold uppercase tracking-widest">Chrome on MacOS (Primary)</p>
                                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest">New Delhi, Bharat · Online Now</p>
                                   </div>
                                </div>
                                <button className="text-[9px] font-bold text-accent-maroon uppercase tracking-widest hover:underline">Revoke</button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GLOBAL LOGISTICS */}
              {activeTab === 'shipping' && (
                 <div className="space-y-8">
                    <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
                       <div className="flex justify-between items-center mb-10">
                          <h3 className="text-2xl font-heading font-bold flex items-center gap-4">
                             <Truck className="text-accent-gold" size={24} /> Fulfillment Corridors
                          </h3>
                          <button className="p-3 bg-accent-gold/10 text-accent-gold rounded-xl hover:bg-accent-gold hover:text-white transition-all"><Plus size={20} /></button>
                       </div>
                       <div className="space-y-6">
                          {[
                            { zone: 'Bharat (Domestic)', partners: 'Delhivery, BlueDart', cost: '₹0 (Standard)' },
                            { zone: 'International (Zone A)', partners: 'DHL, FedEx', cost: '₹2500' },
                          ].map((zone, i) => (
                            <div key={i} className="flex items-center justify-between p-8 bg-accent-gold/5 rounded-[2.5rem] border border-accent-gold/10 group hover:border-accent-maroon/20 transition-all">
                               <div className="space-y-2">
                                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary">{zone.zone}</h4>
                                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Partners: {zone.partners}</p>
                               </div>
                               <div className="text-right space-y-2">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">{zone.cost}</p>
                                  <button className="text-[9px] font-bold text-muted-foreground hover:text-accent-maroon uppercase tracking-widest">Edit Metrics</button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
