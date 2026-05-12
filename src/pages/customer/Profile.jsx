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
            className="fixed inset-4 md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-card border border-border shadow-2xl z-[101] rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-primary/5">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground">Curate Profile</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Update your heritage records</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 no-scrollbar">
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <UserCircle size={18} className="text-primary" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Personal Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                    <input 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                    <input 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                    <input 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Date of Birth</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <MapPin size={18} className="text-primary" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shipping Logistics</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Address Line</label>
                    <input 
                      value={formData.addressLine}
                      onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="Street, Landmark, Apartment"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                      <input 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">State</label>
                      <input 
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pincode</label>
                      <input 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-border flex justify-end gap-4">
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
                  className="px-10 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
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
    <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Patron Header */}
        <div className="relative mb-12">
           <div className="flex flex-col lg:flex-row items-center gap-10 p-10 md:p-14 bg-card border border-border rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-primary/10" />
              
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground text-4xl font-heading font-bold shadow-xl shadow-primary/20 relative group/avatar overflow-hidden">
                   {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera size={24} className="text-white" />
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-maroon border-4 border-card rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Sparkles size={16} />
                </div>
              </div>

              <div className="text-center lg:text-left flex-1 space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                       <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-[0.2em] rounded-full">Elite Patron</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tight"
                    >
                      {user?.firstName} <span className="italic font-light text-primary">{user?.lastName}</span>
                    </motion.h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
                       <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Mail size={14} className="text-primary/60" /> {user?.email}</span>
                       <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Phone size={14} className="text-primary/60" /> {user?.phoneNumber || 'Link Mobile'}</span>
                       <span className="flex items-center gap-2 text-primary/60"><Calendar size={14} /> Joined {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto">
                 <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl hover:brightness-110 transition-all font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                 >
                    <Settings size={18} /> Curate Profile
                 </button>
                 <button onClick={logout} className="px-10 py-4 bg-muted/50 text-muted-foreground border border-border rounded-2xl hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                    <LogOut size={18} /> Logout
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Sidebar Stats */}
           <div className="lg:col-span-4 space-y-10">
              <div className="grid grid-cols-1 gap-5">
                 {stats.map((stat, i) => (
                   <motion.div
                     key={stat.label}
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.1 * i }}
                     className="bg-card border border-border p-8 rounded-[2rem] flex items-center justify-between shadow-sm hover:border-primary/50 transition-all group cursor-pointer"
                   >
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                           {stat.icon}
                        </div>
                        <div>
                           <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">{stat.label}</p>
                           <p className="text-3xl font-heading font-bold text-foreground">{stat.value}</p>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </motion.div>
                 ))}
              </div>

              <div className="bg-primary/[0.03] rounded-[2rem] p-10 border border-primary/10 relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                 <Sparkles className="text-primary mb-6" size={32} />
                 <h3 className="text-xl font-heading font-bold text-foreground uppercase tracking-tight mb-3">The Heritage Archive</h3>
                 <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                   Welcome to your personalized portal. Here, you can track your artisanal acquisitions and manage your unique style profile.
                 </p>
              </div>
           </div>

           {/* Main Content */}
           <div className="lg:col-span-8 space-y-10">
              <div className="bg-card border border-border rounded-[2.5rem] p-10 md:p-14 shadow-sm relative overflow-hidden">
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-heading font-bold text-foreground">Logistics Destination</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Priority Fulfillment Address</p>
                    </div>
                    <Link to="/profile/addresses" className="w-12 h-12 bg-muted text-foreground rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-sm">
                       <MapPin size={22} />
                    </Link>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0"><Home size={22} /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Primary Residence</p>
                             <p className="text-sm font-bold text-foreground leading-relaxed">
                               {user?.addressLine || 'No address synchronized'}
                             </p>
                             <p className="text-[11px] font-medium text-muted-foreground mt-2">
                               {user?.city ? `${user.city}, ${user.state} ${user.pincode}` : 'Awaiting curation'}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0"><Globe size={22} /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Jurisdiction</p>
                             <p className="text-sm font-bold text-foreground">{user?.country || 'Bharat (India)'}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-[2rem] p-8 flex flex-col justify-center border border-border/50 relative group">
                       <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                          <ShieldCheck size={40} />
                       </div>
                       <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Secure Fulfillment</span>
                       </div>
                       <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Your shipping parameters are encrypted and synced for artisanal priority handling.</p>
                       <button className="mt-6 text-[9px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
                          Verify Security <ChevronRight size={12} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Order History Preview */}
              <div className="space-y-8">
                 <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                       <ShoppingBag size={20} className="text-primary" />
                       <h3 className="text-xl font-heading font-bold">Recent Acquisitions</h3>
                    </div>
                    <Link to="/profile/orders" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all flex items-center gap-2">
                       Archive View <ChevronRight size={14} />
                    </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {/* Empty state placeholder with more style */}
                    <div className="py-20 bg-muted/20 border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center px-10">
                       <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                          <ShoppingBag className="text-muted-foreground/20" size={32} />
                       </div>
                       <h4 className="text-lg font-heading font-bold text-foreground mb-2">Your Archive is Waiting</h4>
                       <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Your collection of BadriBhai originals will be displayed here once your first acquisition is confirmed.</p>
                       <Link to="/collections" className="mt-8 px-10 py-4 bg-text-primary text-primary rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary hover:text-primary-foreground transition-all">
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
