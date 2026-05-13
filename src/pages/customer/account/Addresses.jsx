import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Edit2, Trash2, Home, Briefcase, 
  Check, X, Phone, User, Sparkles, ShieldCheck,
  ArrowRight, Loader2, MoreVertical, MapPinned
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { addressService } from '../../../services/addressService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Skeleton from '../../../components/ui/Skeleton';

const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other'], { required_error: 'Please select a label' }),
  recipientName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required'),
  line1: z.string().min(5, 'Address line 1 must be at least 5 characters'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  isDefault: z.boolean().default(false),
});

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Home',
      isDefault: false
    }
  });

  const selectedLabel = watch('label');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAddresses();
      if (res.success) {
        setAddresses(res.data);
      }
    } catch (error) {
      toast.error('Failed to load your heritage destinations');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      let res;
      if (editingAddress) {
        res = await addressService.updateAddress(editingAddress.id, data);
      } else {
        res = await addressService.addAddress(data);
      }

      if (res.success) {
        toast.success(editingAddress ? 'Destination updated' : 'New destination established');
        setShowModal(false);
        setEditingAddress(null);
        reset();
        fetchAddresses();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Logistics update failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setValue('label', addr.label);
    setValue('recipientName', addr.recipientName);
    setValue('phone', addr.phone);
    setValue('line1', addr.line1);
    setValue('line2', addr.line2 || '');
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('pincode', addr.pincode);
    setValue('isDefault', addr.isDefault);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this destination?')) return;
    
    try {
      const res = await addressService.deleteAddress(id);
      if (res.success) {
        toast.success('Destination removed from archive');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to remove destination');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await addressService.setDefaultAddress(id);
      if (res.success) {
        toast.success('Primary destination updated');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to update primary destination');
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      label: 'Home',
      recipientName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowModal(true);
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
        {addresses.length < 5 && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-3 px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-accent-maroon/20 hover:scale-105 active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Register New Destination
          </button>
        )}
      </div>

      {/* Address Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 space-y-8">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {addresses.map((addr, idx) => (
            <motion.div
              key={addr.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative bg-primary/5 border-2 rounded-[3.5rem] p-10 md:p-12 transition-all duration-700 group shadow-sm hover:shadow-2xl",
                addr.isDefault ? 'border-accent-gold shadow-accent-gold/5 bg-white' : 'border-transparent hover:border-accent-maroon/10 bg-white'
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
                    {addr.label === 'Home' ? <Home size={14} /> : addr.label === 'Work' ? <Briefcase size={14} /> : <MapPin size={14} />} {addr.label}
                 </div>
                 {addr.isDefault && (
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold">
                      <Check size={16} strokeWidth={3} /> Primary
                   </div>
                 )}
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="flex items-center gap-4 text-text-primary">
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60"><User size={20} /></div>
                    <span className="text-xl font-bold tracking-tight">{addr.recipientName}</span>
                 </div>
                 <div className="flex items-start gap-4 text-text-secondary">
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60 shrink-0"><MapPin size={20} /></div>
                    <p className="text-base font-medium leading-relaxed pt-1">
                      {addr.line1}, {addr.line2 && addr.line2 + ', '}<br />
                      {addr.city}, {addr.state} {addr.pincode}<br />
                      {addr.country}
                    </p>
                 </div>
                 <div className="flex items-center gap-4 text-text-secondary">
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold/60"><Phone size={20} /></div>
                    <span className="text-base font-bold tracking-widest">{addr.phone}</span>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-accent-gold/10 flex justify-between items-center relative z-10">
                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleEdit(addr)}
                      className="w-12 h-12 flex items-center justify-center bg-white text-text-secondary hover:text-accent-maroon border border-accent-gold/10 rounded-2xl transition-all shadow-sm"
                    >
                       <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      className="w-12 h-12 flex items-center justify-center bg-white text-text-secondary hover:text-red-500 border border-accent-gold/10 rounded-2xl transition-all shadow-sm"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
                 {!addr.isDefault && (
                   <button 
                     onClick={() => handleSetDefault(addr.id)}
                     className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-gold hover:text-accent-maroon transition-all flex items-center gap-2"
                   >
                      Set as Primary <ArrowRight size={14} />
                   </button>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center bg-primary/5 rounded-[4rem] border-2 border-dashed border-accent-gold/10">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
            <MapPinned size={48} className="text-accent-gold/20" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text-primary mb-2">No Destinations Found</h3>
          <p className="text-text-secondary max-w-xs mx-auto mb-10">You haven't established any delivery jurisdictions yet.</p>
          <button 
            onClick={openAddModal}
            className="px-12 py-5 bg-accent-maroon text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-accent-maroon/20"
          >
            Register First Destination
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 overflow-y-auto py-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowModal(false)}
              className="fixed inset-0 bg-primary/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] p-10 md:p-14 z-[101]"
            >
               <button 
                 onClick={() => !submitting && setShowModal(false)}
                 className="absolute top-10 right-10 p-3 bg-primary/5 hover:bg-accent-maroon hover:text-white rounded-2xl transition-all"
                 disabled={submitting}
               >
                  <X size={20} />
               </button>

               <div className="mb-12">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={18} className="text-accent-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">Secure Registration</span>
                 </div>
                 <h2 className="text-4xl font-heading font-bold text-text-primary tracking-tight">
                   {editingAddress ? 'Modify Jurisdiction' : 'New Jurisdiction'}
                 </h2>
                 <p className="text-text-secondary text-sm font-medium mt-2">Establish a prioritized delivery destination.</p>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Type Selector */}
                  <div className="flex items-center gap-4">
                    {['Home', 'Work', 'Other'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('label', type)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                          selectedLabel === type 
                            ? 'bg-accent-maroon text-white border-accent-maroon' 
                            : 'bg-primary/5 border-accent-gold/10 text-text-secondary hover:border-accent-gold'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Patron Name</label>
                        <input 
                          {...register('recipientName')}
                          className={cn(
                            "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                            errors.recipientName ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                          )} 
                          placeholder="Enter full name" 
                        />
                        {errors.recipientName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.recipientName.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Contact String</label>
                        <input 
                          {...register('phone')}
                          className={cn(
                            "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                            errors.phone ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                          )} 
                          placeholder="10-digit number" 
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</p>}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Residence Location / Street</label>
                     <input 
                       {...register('line1')}
                       className={cn(
                         "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                         errors.line1 ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                       )} 
                       placeholder="House number, street name, area" 
                     />
                     {errors.line1 && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.line1.message}</p>}
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Additional Details (Optional)</label>
                     <input 
                       {...register('line2')}
                       className="w-full bg-primary/5 border border-accent-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all" 
                       placeholder="Landmark, apartment suite" 
                     />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">City</label>
                        <input 
                          {...register('city')}
                          className={cn(
                            "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                            errors.city ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                          )} 
                        />
                        {errors.city && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.city.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">State</label>
                        <input 
                          {...register('state')}
                          className={cn(
                            "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                            errors.state ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                          )} 
                        />
                        {errors.state && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.state.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">Pincode</label>
                        <input 
                          {...register('pincode')}
                          className={cn(
                            "w-full bg-primary/5 border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all",
                            errors.pincode ? 'border-red-500' : 'border-accent-gold/10 focus:ring-2 focus:ring-accent-maroon/10'
                          )} 
                        />
                        {errors.pincode && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.pincode.message}</p>}
                     </div>
                  </div>

                  <div className="flex items-center gap-3 ml-1">
                    <input 
                      type="checkbox" 
                      id="isDefault" 
                      {...register('isDefault')}
                      className="w-4 h-4 rounded border-accent-gold/20 text-accent-maroon focus:ring-accent-maroon/20"
                    />
                    <label htmlFor="isDefault" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary cursor-pointer">Set as primary destination</label>
                  </div>

                  <div className="pt-8">
                     <button 
                       disabled={submitting}
                       className="w-full py-6 bg-accent-maroon text-white rounded-[2rem] font-bold uppercase tracking-[0.4em] text-[10px] hover:brightness-110 transition-all shadow-2xl shadow-accent-maroon/20 disabled:opacity-50 flex items-center justify-center gap-3"
                     >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        {editingAddress ? 'Update Jurisdiction' : 'Synchronize Destination'}
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
