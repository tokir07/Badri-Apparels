import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Heart, Settings, LogOut, ChevronRight, 
  MapPin, ShieldCheck, Home, Globe, Mail, Phone,
  ShoppingBag, Sparkles, X, Camera, Save, Calendar, UserCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const EditProfileOverlay = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    country: user?.country || 'India',
    state: user?.state || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    addressLine: user?.addressLine || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await onUpdate(formData);
      if (result.success) {
        toast.success("Profile synchronized with heritage archive");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-accent-gold/20 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] z-[101] rounded-[2.5rem] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-accent-gold/10 flex items-center justify-between bg-gradient-to-b from-accent-gold/5 to-transparent">
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">Curate Profile</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mt-2">Update your institutional records</p>
              </div>
              <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-accent-gold/10 rounded-full transition-all group">
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 no-scrollbar">
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-accent-gold/10 pb-2">
                  <UserCircle size={18} className="text-accent-gold" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Personal Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                    <input 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                    <input 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                    <input 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Date of Birth</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-accent-gold/10 pb-2">
                  <MapPin size={18} className="text-accent-gold" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shipping Logistics</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Address Line</label>
                    <input 
                      value={formData.addressLine}
                      onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
                      className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                      placeholder="Street, Landmark, Apartment"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                      <input 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">State</label>
                      <input 
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pincode</label>
                      <input 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full bg-accent-gold/5 border border-accent-gold/10 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-accent-gold/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-accent-gold/10 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-10 py-3.5 bg-accent-maroon text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-accent-maroon/20"
                >
                  {isSaving ? 'Synchronizing...' : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Profile = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const stats = [
    { label: 'Active Orders', value: user?.ordersCount || '0', icon: <Package size={20} /> },
    { label: 'Saved Pieces', value: user?.wishlistCount || '0', icon: <Heart size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-accent-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Patron Header */}
        <div className="relative mb-16">
           <div className="flex flex-col lg:flex-row items-center gap-10 p-10 md:p-16 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border border-accent-gold/10 rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              {/* Luxury Decoration */}
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent-gold/5 rounded-full blur-[100px] -mr-64 -mt-64 transition-all duration-1000 group-hover:bg-accent-gold/10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-maroon/[0.02] rounded-full blur-[80px] -ml-32 -mb-32" />
              
              <div className="relative">
                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-accent-maroon to-[#600000] flex items-center justify-center text-white text-5xl font-heading font-bold shadow-2xl shadow-accent-maroon/20 relative group/avatar overflow-hidden border-4 border-white/50">
                   {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Camera size={28} className="text-white" />
                   </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-accent-gold border-4 border-background rounded-2xl flex items-center justify-center text-accent-maroon shadow-xl">
                   <Sparkles size={24} />
                </div>
              </div>

              <div className="text-center lg:text-left flex-1 space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                       <span className="px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-[9px] font-bold uppercase tracking-[0.3em] rounded-full border border-accent-gold/10">Elite Patron</span>
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-7xl font-heading font-bold text-foreground tracking-tight leading-[1.1]"
                    >
                      {user?.firstName} <span className="italic font-light text-accent-gold">{user?.lastName}</span>
                    </motion.h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-6">
                       <span className="flex items-center gap-3 hover:text-accent-gold transition-colors cursor-pointer"><Mail size={16} className="text-accent-gold/60" /> {user?.email}</span>
                       <span className="flex items-center gap-3 hover:text-accent-gold transition-colors cursor-pointer"><Phone size={16} className="text-accent-gold/60" /> {user?.phoneNumber || 'Link Mobile'}</span>
                       <span className="flex items-center gap-3 text-accent-gold/60"><Calendar size={16} /> Joined {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-5 w-full sm:w-auto">
                 <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-10 py-5 bg-accent-maroon text-white rounded-2xl hover:brightness-110 transition-all font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-accent-maroon/20 group/btn"
                 >
                    <Settings size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" /> Curate Profile
                 </button>
                 <button onClick={logout} className="px-10 py-5 bg-white/50 dark:bg-white/[0.05] text-muted-foreground border border-accent-gold/20 rounded-2xl hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 backdrop-blur-sm">
                    <LogOut size={18} /> Logout
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Sidebar Stats */}
           <div className="lg:col-span-4 space-y-10">
              <div className="grid grid-cols-1 gap-6">
                 {stats.map((stat, i) => (
                   <motion.div
                     key={stat.label}
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.1 * i }}
                     className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border border-accent-gold/10 p-10 rounded-[2.5rem] flex items-center justify-between shadow-sm hover:border-accent-gold/40 hover:shadow-xl hover:shadow-accent-gold/5 transition-all group cursor-pointer"
                   >
                     <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-accent-gold/10 flex items-center justify-center text-accent-gold group-hover:bg-accent-maroon group-hover:text-white transition-all duration-700 shadow-inner">
                           {stat.icon}
                        </div>
                        <div>
                           <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold font-bold mb-2">{stat.label}</p>
                           <p className="text-4xl font-heading font-bold text-foreground">{stat.value}</p>
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full flex items-center justify-center border border-accent-gold/10 group-hover:bg-accent-gold/10 group-hover:translate-x-1 transition-all duration-500">
                        <ChevronRight size={18} className="text-accent-gold" />
                     </div>
                   </motion.div>
                 ))}
              </div>

              <div className="bg-accent-gold/[0.03] rounded-[2.5rem] p-10 border border-accent-gold/10 relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors" />
                 <Sparkles className="text-accent-gold mb-6" size={32} />
                 <h3 className="text-xl font-heading font-bold text-foreground uppercase tracking-tight mb-3">The Heritage Archive</h3>
                 <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                   Welcome to your personalized portal. Here, you can track your artisanal acquisitions and manage your unique style profile.
                 </p>
              </div>
           </div>

           {/* Main Content */}
           <div className="lg:col-span-8 space-y-10">
              <div className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border border-accent-gold/10 rounded-[3rem] p-10 md:p-16 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-16">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-heading font-bold text-foreground">Logistics Destination</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Institutional Fulfillment Archive</p>
                     </div>
                     <Link to="/profile/addresses" className="w-16 h-16 bg-accent-gold/5 text-accent-gold rounded-[1.5rem] hover:bg-accent-maroon hover:text-white transition-all flex items-center justify-center shadow-inner border border-accent-gold/10">
                        <MapPin size={28} />
                     </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                     <div className="space-y-10">
                        <div className="flex items-start gap-6">
                           <div className="w-14 h-14 bg-accent-gold/5 rounded-[1.2rem] flex items-center justify-center text-accent-gold shrink-0 border border-accent-gold/10"><Home size={26} /></div>
                           <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">Primary Residence</p>
                              <p className="text-base font-bold text-foreground leading-relaxed">
                                {user?.addressLine || 'No address synchronized'}
                              </p>
                              <p className="text-xs font-medium text-muted-foreground mt-3 tracking-wide">
                                {user?.city ? `${user.city}, ${user.state} ${user.pincode}` : 'Awaiting curation'}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start gap-6">
                           <div className="w-14 h-14 bg-accent-gold/5 rounded-[1.2rem] flex items-center justify-center text-accent-gold shrink-0 border border-accent-gold/10"><Globe size={26} /></div>
                           <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">Jurisdiction</p>
                              <p className="text-base font-bold text-foreground tracking-tight">{user?.country || 'Bharat (India)'}</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="bg-accent-maroon/[0.03] rounded-[2.5rem] p-10 flex flex-col justify-center border border-accent-gold/10 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-gold/10 transition-colors" />
                        <div className="absolute top-6 right-6 text-accent-gold/20 group-hover:text-accent-gold/40 group-hover:scale-110 transition-all duration-700">
                           <ShieldCheck size={48} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">Secure Fulfillment</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">Your shipping parameters are encrypted and synced for priority handling within our artisan network.</p>
                        <button className="mt-10 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold flex items-center gap-3 hover:gap-5 transition-all group/verify">
                           Verify Security <ChevronRight size={14} className="group-hover/verify:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
              </div>

              {/* Order History Preview */}
              <div className="space-y-10">
                  <div className="flex items-center justify-between px-8">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-accent-maroon/5 rounded-2xl flex items-center justify-center text-accent-maroon border border-accent-maroon/10">
                           <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold tracking-tight">Recent Acquisitions</h3>
                     </div>
                     <Link to="/profile/orders" className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:tracking-[0.4em] transition-all flex items-center gap-3 group/link">
                        Archive View <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                     </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                     {/* Empty state placeholder with more luxury style */}
                     <div className="py-24 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border border-dashed border-accent-gold/20 rounded-[3rem] flex flex-col items-center justify-center text-center px-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-24 h-24 bg-white dark:bg-black/40 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.05)] border border-accent-gold/10 relative z-10">
                           <ShoppingBag className="text-accent-gold/30 group-hover:text-accent-gold/60 transition-colors" size={40} />
                        </div>
                        <h4 className="text-2xl font-heading font-bold text-foreground mb-4 relative z-10">Your Archive is Waiting</h4>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-medium relative z-10">
                          Your collection of BadriBhai handcrafted originals will be displayed here once your first acquisition is confirmed.
                        </p>
                        <Link to="/collections" className="mt-10 px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:brightness-110 hover:shadow-2xl hover:shadow-accent-maroon/20 transition-all relative z-10">
                           Begin Collection
                        </Link>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Overlays */}
      <EditProfileOverlay 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user}
        onUpdate={updateProfile}
      />
    </div>
  );
};

export default Profile;
