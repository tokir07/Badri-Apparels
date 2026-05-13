import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Globe, Camera, 
  ShieldCheck, Check, Edit2, Sparkles, Star, 
  MapPin, UserCircle, Save, X, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { uploadService } from '../../../services/uploadService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const ProfileInfo = () => {
  const { user, updateProfile, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const res = await uploadService.uploadAvatar(file, (progress) => {
        setUploadProgress(progress);
      });

      if (res.data.success) {
        const { avatarUrl } = res.data.data;
        updateUser({ profileImage: avatarUrl });
        toast.success("Portrait updated in the heritage archive");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload portrait");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    country: user?.country || 'India',
    state: user?.state || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    addressLine: user?.addressLine || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success("Heritage records synchronized successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update artisanal profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-[8px] font-bold uppercase tracking-[0.4em] rounded-full border border-accent-gold/20">Elite Patron Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
           </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
            Patron <span className="italic font-light text-accent-gold">Identity.</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
            Manage your curated profile details and shipping logistics within the BadriBhai heritage archive.
          </p>
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-3 px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-accent-maroon/20 hover:scale-105 active:scale-95 group"
          >
            <Edit2 size={16} className="group-hover:rotate-12 transition-transform" /> Curate Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Main Content Form/Display */}
        <div className="lg:col-span-8">
          
          {/* Portrait Section */}
          <div className="mb-16 flex flex-col md:flex-row items-center gap-10 bg-accent-gold/[0.03] p-10 rounded-[3rem] border border-accent-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors" />
            
            <div className="relative group/avatar">
              <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-accent-maroon to-[#600000] flex items-center justify-center text-white text-5xl font-heading font-bold shadow-2xl relative overflow-hidden border-4 border-white">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Patron" className="w-full h-full object-cover" />
                ) : (
                  <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <Loader2 size={24} className="text-white animate-spin" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">{uploadProgress}%</span>
                  </div>
                )}
                
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Camera size={24} className="text-white mb-2" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">Change Portrait</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent-gold border-4 border-white rounded-2xl flex items-center justify-center text-accent-maroon shadow-xl">
                <Sparkles size={20} />
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl font-heading font-bold text-text-primary uppercase tracking-tight">The Patron Portrait</h3>
              <p className="text-text-secondary text-xs font-medium max-w-xs leading-relaxed">
                Your visual identity across the BadriBhai ecosystem. High-resolution JPG or PNG recommended.
              </p>
              {uploading && (
                <div className="w-full h-1.5 bg-accent-gold/10 rounded-full mt-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${uploadProgress}%` }} 
                    className="h-full bg-accent-gold" 
                  />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-16">
            
            {/* Identity Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-l-4 border-accent-gold pl-6">
                <UserCircle size={24} className="text-accent-gold" />
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-text-primary">Personal Credentials</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 bg-white/40 dark:bg-white/[0.02] p-10 md:p-14 rounded-[3rem] border border-accent-gold/10 relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-gold/10 transition-colors" />
                
                {[
                  { label: 'First Name', name: 'firstName', icon: <User size={18} />, value: formData.firstName },
                  { label: 'Last Name', name: 'lastName', icon: <User size={18} />, value: formData.lastName },
                  { label: 'Email Address', name: 'email', icon: <Mail size={18} />, value: formData.email, disabled: true },
                  { label: 'Contact Number', name: 'phoneNumber', icon: <Phone size={18} />, value: formData.phoneNumber },
                  { label: 'Date of Birth', name: 'dateOfBirth', icon: <Calendar size={18} />, value: formData.dateOfBirth, type: 'date' },
                  { label: 'Gender', name: 'gender', icon: <User size={18} />, value: formData.gender, isSelect: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
                ].map((field) => (
                  <div key={field.name} className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-gold flex items-center gap-2 ml-1">
                      {field.label}
                    </label>
                    {isEditing && !field.disabled ? (
                      field.isSelect ? (
                        <select
                          value={field.value}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full bg-white/80 border border-accent-gold/20 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all appearance-none backdrop-blur-sm"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input 
                          type={field.type || "text"}
                          value={field.value}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full bg-white/80 border border-accent-gold/20 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all backdrop-blur-sm"
                          placeholder={`Enter ${field.label}`}
                        />
                      )
                    ) : (
                      <div className="flex items-center gap-5 pl-1">
                         <div className="w-12 h-12 rounded-2xl bg-accent-gold/5 flex items-center justify-center text-accent-gold border border-accent-gold/10">{field.icon}</div>
                         <p className={cn(
                           "text-text-primary font-bold text-xl tracking-tight",
                           field.disabled && "opacity-50"
                         )}>
                           {field.value || <span className="text-sm font-normal italic opacity-30">Awaiting curation</span>}
                         </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Section */}
            <div className="space-y-10 pt-6">
              <div className="flex items-center gap-4 border-l-4 border-accent-gold pl-6">
                <MapPin size={24} className="text-accent-gold" />
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-text-primary">Shipping Parameters</h3>
              </div>
              
              <div className="bg-white/40 dark:bg-white/[0.02] p-10 md:p-14 rounded-[3rem] border border-accent-gold/10 space-y-12 relative overflow-hidden group backdrop-blur-sm">
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-accent-gold/10 transition-colors" />
                 
                 <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-gold flex items-center gap-2 ml-1">
                       Primary Residence / Address Line
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formData.addressLine}
                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                        className="w-full bg-white/80 border border-accent-gold/20 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all backdrop-blur-sm"
                        placeholder="Street, Landmark, Apartment"
                      />
                    ) : (
                      <p className="text-text-primary font-bold text-2xl pl-1 tracking-tight leading-relaxed max-w-lg">
                        {formData.addressLine || <span className="text-sm font-normal italic opacity-30">No residence synchronized</span>}
                      </p>
                    )}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {[
                      { label: 'City', name: 'city', value: formData.city },
                      { label: 'State', name: 'state', value: formData.state },
                      { label: 'Pincode', name: 'pincode', value: formData.pincode },
                    ].map(field => (
                      <div key={field.name} className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-gold ml-1">{field.label}</label>
                        {isEditing ? (
                          <input 
                            type="text"
                            value={field.value}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            className="w-full bg-white/80 border border-accent-gold/20 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all backdrop-blur-sm"
                          />
                        ) : (
                          <p className="text-text-primary font-bold text-xl pl-1 tracking-tight">{field.value || '---'}</p>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Action Area */}
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="flex items-center justify-end gap-8 pt-10"
                >
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-accent-maroon transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-3 px-14 py-5 bg-accent-gold text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-accent-gold/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isUpdating ? 'Synchronizing...' : <><Save size={18} /> Update Archive</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right Sidebar - Status & Motivation */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-accent-maroon text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/30 to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              
              <div className="relative z-10 space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-inner">
                       <ShieldCheck size={32} className="text-accent-gold" />
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold block mb-2">Vault Security</span>
                       <div className="flex items-center justify-end gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Identity Verified</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-5">
                    <h4 className="text-4xl font-heading font-bold leading-tight">Artisanal Protection</h4>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">Your personal parameters and logistics data are secured within our encrypted heritage vault.</p>
                 </div>

                 <div className="pt-10 border-t border-white/10 space-y-8">
                    <div className="flex justify-between items-end">
                       <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Archive Status</p>
                          <p className="text-2xl font-heading font-bold">Patron Complete</p>
                       </div>
                       <p className="text-4xl font-heading font-bold text-accent-gold">98<span className="text-sm">%</span></p>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-accent-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white/40 dark:bg-white/[0.02] border border-accent-gold/10 p-12 rounded-[3.5rem] space-y-10 relative group overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 p-10 text-accent-gold/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Sparkles size={140} />
              </div>
              <div className="w-14 h-14 bg-accent-gold/5 rounded-2xl flex items-center justify-center text-accent-gold border border-accent-gold/10 shadow-inner">
                 <Star size={28} />
              </div>
              <div className="space-y-4">
                 <h4 className="text-2xl font-heading font-bold text-text-primary uppercase tracking-tight">The Curation Experience</h4>
                 <p className="text-text-secondary text-xs leading-relaxed font-medium">
                   Your profile curation allows us to tailor your BadriBhai journey, ensuring every artisanal piece finds its perfect match for your unique silhouette.
                 </p>
              </div>
              <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-maroon hover:gap-5 transition-all pt-6 group/link">
                 Learn about Heritage Privacy <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileInfo;
